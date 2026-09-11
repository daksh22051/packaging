/**
 * Test Suite for CIRCULA Smart Circular Matching Engine
 * Verifies multi-factor scoring logic, edge cases and relative assertions
 */

import assert from 'node:assert';
import { matchingService } from '../src/services/matchingService.js';

console.log('🧪 Starting CIRCULA Matching Engine Test Suite...\n');

let testsPassed = 0;
let testsFailed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    testsFailed++;
  }
}

// Baseline Candidate: 5000 kg Cardboard in Ahmedabad, Good condition, Sell mode, ₹10/kg, 2.5 t CO2
const baseCandidate = {
  _id: 'cand-001',
  id: 'cand-001',
  title: 'Corrugated Cardboard Boxes',
  category: 'cardboard',
  quantity: 5000,
  unit: 'kg',
  condition: 'good',
  transactionType: 'sell',
  price: 10,
  estimatedCarbonAvoided: 2.5,
  location: {
    city: 'Ahmedabad',
    latitude: 23.0225,
    longitude: 72.5714,
  },
};

// Baseline Requirement: 5000 kg Cardboard in Ahmedabad, Good condition, Sell mode, ₹15 budget
const baseRequirement = {
  category: 'cardboard',
  quantity: 5000,
  unit: 'kg',
  condition: 'good',
  transactionType: 'sell',
  maxPrice: 15,
  location: {
    city: 'Ahmedabad',
    latitude: 23.0225,
    longitude: 72.5714,
  },
};

// Test 1: Exact material + nearby supplier
runTest('1. Exact material + nearby supplier produces high match score (>= 88%)', () => {
  const result = matchingService.evaluateMatch(baseRequirement, baseCandidate);
  assert.ok(result.matchScore >= 88, `Expected score >= 88, got ${result.matchScore}`);
  assert.strictEqual(result.compatibility.material, 100);
  assert.ok(result.distanceKm <= 5);
  assert.ok(result.matchReasons.length >= 4);
});

// Test 2: Wrong material category
runTest('2. Wrong material category significantly penalizes score', () => {
  const req = { ...baseRequirement, category: 'plastic' };
  const result = matchingService.evaluateMatch(req, baseCandidate);
  const baseResult = matchingService.evaluateMatch(baseRequirement, baseCandidate);
  assert.ok(result.compatibility.material <= 20, `Expected low material compatibility, got ${result.compatibility.material}`);
  assert.ok(baseResult.matchScore > result.matchScore + 20, `Base score (${baseResult.matchScore}) should be > wrong category score (${result.matchScore}) by at least 20`);
});

// Test 3: Insufficient quantity
runTest('3. Insufficient quantity lowers quantity score proportionally', () => {
  const candLowQty = { ...baseCandidate, quantity: 1000 }; // only 20% of 5000 kg
  const result = matchingService.evaluateMatch(baseRequirement, candLowQty);
  const baseResult = matchingService.evaluateMatch(baseRequirement, baseCandidate);
  assert.ok(result.compatibility.quantity < baseResult.compatibility.quantity);
  assert.ok(result.compatibility.quantity <= 40, `Expected low qty score, got ${result.compatibility.quantity}`);
  assert.ok(baseResult.matchScore > result.matchScore);
});

// Test 4: Very distant supplier
runTest('4. Very distant supplier reduces proximity factor', () => {
  const candDistant = {
    ...baseCandidate,
    location: {
      city: 'Kolkata',
      latitude: 22.5726,
      longitude: 88.3639, // ~1600 km away
    },
  };
  const result = matchingService.evaluateMatch(baseRequirement, candDistant);
  const baseResult = matchingService.evaluateMatch(baseRequirement, baseCandidate);
  assert.ok(result.distanceKm > 1000, `Expected distance > 1000 km, got ${result.distanceKm}`);
  assert.ok(result.compatibility.distance < 40, `Expected distant score < 40, got ${result.compatibility.distance}`);
  assert.ok(baseResult.matchScore > result.matchScore);
});

// Test 5: Condition mismatch
runTest('5. Condition mismatch (buyer needs New, candidate is Used) reduces score', () => {
  const candUsed = { ...baseCandidate, condition: 'used' };
  const reqNew = { ...baseRequirement, condition: 'new' };
  const result = matchingService.evaluateMatch(reqNew, candUsed);
  const resultGood = matchingService.evaluateMatch(baseRequirement, baseCandidate);
  assert.ok(result.compatibility.condition <= 35, `Expected condition compatibility <= 35, got ${result.compatibility.condition}`);
  assert.ok(resultGood.matchScore > result.matchScore);
});

// Test 6: Transaction mismatch
runTest('6. Transaction mismatch (buyer wants Free Claim, candidate is Sell) lowers transaction score', () => {
  const reqFree = { ...baseRequirement, transactionType: 'free_claim' };
  const result = matchingService.evaluateMatch(reqFree, baseCandidate);
  assert.ok(result.compatibility.transaction <= 25, `Expected low transaction score, got ${result.compatibility.transaction}`);
});

// Test 7: Budget mismatch
runTest('7. Budget mismatch (candidate price well above buyer budget) penalizes price score', () => {
  const reqLowBudget = { ...baseRequirement, maxPrice: 5 }; // price is ₹10
  const result = matchingService.evaluateMatch(reqLowBudget, baseCandidate);
  assert.ok(result.compatibility.price <= 25, `Expected price score <= 25, got ${result.compatibility.price}`);
  assert.ok(result.scoreBreakdown.price < 2.0);
});

// Test 8: High carbon benefit
runTest('8. High carbon benefit improves score compared to negligible carbon impact', () => {
  const candHighCarbon = { ...baseCandidate, estimatedCarbonAvoided: 5.0 };
  const candLowCarbon = { ...baseCandidate, estimatedCarbonAvoided: 0.05 };
  const resHigh = matchingService.evaluateMatch(baseRequirement, candHighCarbon);
  const resLow = matchingService.evaluateMatch(baseRequirement, candLowCarbon);
  assert.strictEqual(resHigh.compatibility.carbon, 100);
  assert.ok(resLow.compatibility.carbon <= 35);
  assert.ok(resHigh.matchScore > resLow.matchScore);
});

// Test 9: Missing location
runTest('9. Missing location falls back gracefully without crashing', () => {
  const reqNoLoc = { ...baseRequirement, location: undefined };
  const candNoLoc = { ...baseCandidate, location: undefined };
  const result = matchingService.evaluateMatch(reqNoLoc, candNoLoc);
  assert.ok(result.matchScore > 0, `Expected valid score, got ${result.matchScore}`);
  assert.ok(result.distanceKm > 0);
  assert.ok(Array.isArray(result.matchReasons) && result.matchReasons.length > 0);
});

// Test 10: Missing budget
runTest('10. Missing budget does not penalize candidate price compatibility', () => {
  const reqNoBudget = { ...baseRequirement, maxPrice: undefined };
  const result = matchingService.evaluateMatch(reqNoBudget, baseCandidate);
  assert.strictEqual(result.compatibility.price, 100);
  assert.strictEqual(result.scoreBreakdown.price, 5);
});

// Test 11: Comparative validation
runTest('11. Comparative validation: (Exact + nearby + sufficient) > (Exact + distant + insufficient)', () => {
  const perfectCandidate = {
    ...baseCandidate,
    quantity: 5000,
    location: { city: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
  };
  const distantInsufficientCand = {
    ...baseCandidate,
    quantity: 500, // 10%
    location: { city: 'Chennai', latitude: 13.0827, longitude: 80.2707 }, // ~1400 km
  };
  const scorePerfect = matchingService.evaluateMatch(baseRequirement, perfectCandidate).matchScore;
  const scorePoor = matchingService.evaluateMatch(baseRequirement, distantInsufficientCand).matchScore;
  assert.ok(
    scorePerfect > scorePoor + 25,
    `Expected perfect (${scorePerfect}) to greatly exceed poor (${scorePoor})`
  );
});

console.log(`\n========================================`);
console.log(`Tests Passed: ${testsPassed}/${testsPassed + testsFailed}`);
console.log(`Tests Failed: ${testsFailed}/${testsPassed + testsFailed}`);
console.log(`========================================\n`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All matching engine scoring tests passed successfully!\n');
}
