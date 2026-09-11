import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import { matchingService } from '../src/services/matchingService.js';

console.log('🧪 CIRCULA PHASE 3 - SENIOR QA INTEGRATION & VERIFICATION SUITE\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failures.push({ name, error: err.message });
    failedTests++;
  }
}

async function runAll() {
  const BASE_URL = 'http://localhost:3000';

  console.log('--- SECTION A: 7-FACTOR DETERMINISTIC SCORING ENGINE TESTS ---');

  // Test 1: Exact material + nearby supplier + sufficient quantity
  await test('TEST 1: Exact material + nearby supplier + sufficient quantity -> High score (>= 88%)', () => {
    const req = {
      category: 'cardboard',
      quantity: 5000,
      unit: 'kg',
      condition: 'good',
      transactionType: 'sell',
      maxPrice: 20,
      location: { city: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
    };
    const cand = {
      category: 'cardboard',
      quantity: 5000,
      unit: 'kg',
      condition: 'good',
      transactionType: 'sell',
      price: 10,
      estimatedCarbonAvoided: 3.5,
      location: { city: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
    };
    const res = matchingService.evaluateMatch(req, cand);
    assert.ok(res.matchScore >= 88, `Expected score >= 88, got ${res.matchScore}`);
    assert.strictEqual(res.compatibility.material, 100);
    assert.strictEqual(res.compatibility.quantity, 100);
    assert.strictEqual(res.compatibility.condition, 100);
    assert.strictEqual(res.compatibility.transaction, 100);
    assert.strictEqual(res.compatibility.price, 100);
    assert.strictEqual(res.compatibility.carbon, 100);
    assert.strictEqual(res.matchQuality, 'Excellent Match');
  });

  // Test 2: Wrong material category
  await test('TEST 2: Wrong material category -> Significantly lower score & material penalty', () => {
    const req = { category: 'plastic', quantity: 1000 };
    const cand = { category: 'metal', quantity: 1000, price: 10 };
    const res = matchingService.evaluateMatch(req, cand);
    assert.ok(res.compatibility.material <= 10, `Expected material score <= 10, got ${res.compatibility.material}`);
    assert.ok(res.scoreBreakdown.materialCompatibility <= 3.0);
  });

  // Test 3: Insufficient quantity
  await test('TEST 3: Insufficient quantity -> Proportional quantity score reduction', () => {
    const req = { quantity: 10000, unit: 'kg' };
    const candLow = { quantity: 1000, unit: 'kg' }; // 10%
    const candFull = { quantity: 10000, unit: 'kg' };
    const resLow = matchingService.evaluateMatch(req, candLow);
    const resFull = matchingService.evaluateMatch(req, candFull);
    assert.ok(resLow.compatibility.quantity < resFull.compatibility.quantity, 'Low qty should score lower than full qty');
    assert.ok(resLow.compatibility.quantity <= 30, `Expected <= 30, got ${resLow.compatibility.quantity}`);
  });

  // Test 4: Very distant supplier
  await test('TEST 4: Very distant supplier -> Proximity decay factor (< 40)', () => {
    const req = { location: { city: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 } };
    const candDistant = { location: { city: 'Kolkata', latitude: 22.5726, longitude: 88.3639 } }; // ~1615 km
    const res = matchingService.evaluateMatch(req, candDistant);
    assert.ok(res.distanceKm > 1000, `Expected > 1000km, got ${res.distanceKm}`);
    assert.ok(res.compatibility.distance < 40, `Expected distance compatibility < 40, got ${res.compatibility.distance}`);
  });

  // Test 5: Condition mismatch
  await test('TEST 5: Condition mismatch (Buyer requires New, candidate is Used) -> Score reduced', () => {
    const req = { condition: 'new' };
    const candUsed = { condition: 'used' };
    const candNew = { condition: 'new' };
    const resUsed = matchingService.evaluateMatch(req, candUsed);
    const resNew = matchingService.evaluateMatch(req, candNew);
    assert.ok(resUsed.compatibility.condition <= 35, `Expected <= 35, got ${resUsed.compatibility.condition}`);
    assert.ok(resNew.matchScore > resUsed.matchScore);
  });

  // Test 6: Transaction mismatch
  await test('TEST 6: Transaction mismatch (Buyer wants Free Claim, candidate is Sell) -> Transaction penalty', () => {
    const req = { transactionType: 'free_claim' };
    const candSell = { transactionType: 'sell', price: 50 };
    const res = matchingService.evaluateMatch(req, candSell);
    assert.ok(res.compatibility.transaction <= 25, `Expected <= 25, got ${res.compatibility.transaction}`);
  });

  // Test 7: Budget exceeded
  await test('TEST 7: Budget exceeded (Candidate price significantly above maxPrice) -> Price penalty', () => {
    const req = { maxPrice: 10 };
    const candExpensive = { price: 25 }; // 2.5x maxPrice
    const res = matchingService.evaluateMatch(req, candExpensive);
    assert.ok(res.compatibility.price <= 20, `Expected <= 20, got ${res.compatibility.price}`);
    assert.ok(res.scoreBreakdown.price <= 1.0);
  });

  // Test 8: High carbon benefit
  await test('TEST 8: High carbon benefit -> Higher carbon contribution (10/10 points)', () => {
    const candHighCarbon = { estimatedCarbonAvoided: 4.5 };
    const candLowCarbon = { estimatedCarbonAvoided: 0.05 };
    const resHigh = matchingService.evaluateMatch({}, candHighCarbon);
    const resLow = matchingService.evaluateMatch({}, candLowCarbon);
    assert.strictEqual(resHigh.compatibility.carbon, 100);
    assert.strictEqual(resHigh.scoreBreakdown.carbonBenefit, 10);
    assert.ok(resLow.compatibility.carbon < 50);
  });

  // Test 9: Missing buyer location fallback
  await test('TEST 9: Missing buyer location -> Graceful city/regional fallback without throwing', () => {
    const res = matchingService.evaluateMatch({ location: null }, { location: null });
    assert.ok(res.matchScore > 0);
    assert.ok(res.distanceKm > 0);
    assert.ok(typeof res.whyThisMatch === 'string');
    assert.ok(Array.isArray(res.matchReasons) && res.matchReasons.length > 0);
  });

  // Test 10: Missing budget
  await test('TEST 10: Missing budget -> No penalty on price compatibility (100% price score)', () => {
    const res = matchingService.evaluateMatch({ maxPrice: undefined }, { price: 100 });
    assert.strictEqual(res.compatibility.price, 100);
    assert.strictEqual(res.scoreBreakdown.price, 5);
  });

  // Test 11: Two similar suppliers differentiated by proximity
  await test('TEST 11: Comparative proximity ranking: Closer supplier ranks higher than distant supplier', () => {
    const req = {
      category: 'cardboard',
      quantity: 5000,
      location: { city: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
    };
    const candNearby = {
      title: 'Nearby Box Co',
      category: 'cardboard',
      quantity: 5000,
      price: 10,
      location: { city: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
    };
    const candFar = {
      title: 'Far Box Co',
      category: 'cardboard',
      quantity: 5000,
      price: 10,
      location: { city: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
    };
    const matches = matchingService.findMatches(req, [candFar, candNearby]);
    assert.strictEqual(matches[0].material.title, 'Nearby Box Co');
    assert.ok(matches[0].matchScore > matches[1].matchScore);
    assert.ok(matches[0].distanceKm < matches[1].distanceKm);
  });

  console.log('\n--- SECTION B: EXPLAINABILITY & BREAKDOWN VERIFICATION ---');

  await test('TEST 12: Explainability contract: matchScore, matchReasons, scoreBreakdown, whyThisMatch, keyDrivers', () => {
    const req = { category: 'cardboard', quantity: 2000, unit: 'kg', maxPrice: 20, city: 'Ahmedabad' };
    const cand = {
      category: 'cardboard',
      quantity: 2000,
      unit: 'kg',
      price: 12,
      condition: 'good',
      transactionType: 'sell',
      location: { city: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
      estimatedCarbonAvoided: 2.1,
    };
    const res = matchingService.evaluateMatch(req, cand);
    assert.ok(typeof res.matchScore === 'number');
    assert.ok(res.matchScore >= 0 && res.matchScore <= 100);
    assert.ok(Array.isArray(res.matchReasons) && res.matchReasons.length > 0);
    assert.ok(Array.isArray(res.keyDrivers) && res.keyDrivers.length > 0);
    assert.ok(typeof res.whyThisMatch === 'string' && res.whyThisMatch.length > 20);

    // Verify 7-factor breakdown components
    const b = res.scoreBreakdown;
    assert.ok(b.materialCompatibility !== undefined);
    assert.ok(b.quantityCompatibility !== undefined);
    assert.ok(b.proximity !== undefined);
    assert.ok(b.condition !== undefined);
    assert.ok(b.transaction !== undefined);
    assert.ok(b.price !== undefined);
    assert.ok(b.carbonBenefit !== undefined);

    const sum =
      b.materialCompatibility +
      b.quantityCompatibility +
      b.proximity +
      b.condition +
      b.transaction +
      b.price +
      b.carbonBenefit;
    assert.ok(Math.abs(sum - res.matchScore) <= 1.0, `Sum ${sum} should be close to matchScore ${res.matchScore}`);

    // Verify dynamic factual reason mentions
    const reasonText = res.matchReasons.join(' ');
    assert.ok(reasonText.includes('CARDBOARD') || reasonText.includes('cardboard'));
    assert.ok(reasonText.includes('Ahmedabad'));
  });

  console.log('\n--- SECTION C: API ENDPOINT LIVE VERIFICATION ---');

  await test('TEST 13: GET /api/health responds with HTTP 200 and healthy payload', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.message.includes('CIRCULA API'));
  });

  await test('TEST 14: POST /api/matches with realistic buyer requirement returns status 200, count, and sorted matches', async () => {
    const payload = {
      category: 'cardboard',
      quantity: 5000,
      unit: 'kg',
      condition: 'good',
      transactionType: 'sell',
      maxPrice: 25,
      city: 'Ahmedabad',
      latitude: 23.0225,
      longitude: 72.5714,
    };
    const res = await fetch(`${BASE_URL}/api/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data.matches));
    assert.ok(json.data.matches.length > 0);

    // Verify descending sort order
    const matches = json.data.matches;
    for (let i = 0; i < matches.length - 1; i++) {
      assert.ok(
        matches[i].matchScore >= matches[i + 1].matchScore,
        `Sort violation: Index ${i} (${matches[i].matchScore}) < Index ${i + 1} (${matches[i + 1].matchScore})`
      );
    }
  });

  await test('TEST 15: GET /api/matches via query parameters produces equivalent compliant response', async () => {
    const url = `${BASE_URL}/api/matches?category=cardboard&quantity=3000&city=Ahmedabad`;
    const res = await fetch(url);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data.matches));
  });

  console.log('\n--- SECTION D: AUTHENTICATION HANDLING TESTS ---');

  await test('TEST 16: Authentication Case A: No token -> Public optional access allowed (HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/api/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'cardboard' }),
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
  });

  await test('TEST 17: Authentication Case B: Invalid / Malformed token -> Gracefully handled without crash (HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/api/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid_malformed_token_xyz',
      },
      body: JSON.stringify({ category: 'cardboard' }),
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
  });

  await test('TEST 18: Authentication Case C: Valid JWT token -> Successfully accepted (HTTP 200)', async () => {
    const secret = process.env.JWT_SECRET || 'circula_default_jwt_secret_key_2026';
    const token = jwt.sign({ id: '650000000000000000000001' }, secret, { expiresIn: '1h' });
    const res = await fetch(`${BASE_URL}/api/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category: 'cardboard' }),
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
  });

  console.log('\n--- SECTION E: EDGE CASES & RESILIENCE ---');

  await test('TEST 19: Edge Case: Invalid / unknown category -> Evaluates with category mismatch score', () => {
    const res = matchingService.evaluateMatch({ category: 'unobtanium_123' }, { category: 'cardboard' });
    assert.ok(res.compatibility.material <= 10);
    assert.ok(res.matchScore >= 0);
  });

  await test('TEST 20: Edge Case: Zero and negative requested quantity -> Handled gracefully without NaN', () => {
    const resZero = matchingService.evaluateMatch({ quantity: 0 }, { quantity: 1000 });
    const resNeg = matchingService.evaluateMatch({ quantity: -500 }, { quantity: 1000 });
    assert.ok(!isNaN(resZero.matchScore) && resZero.matchScore >= 0);
    assert.ok(!isNaN(resNeg.matchScore) && resNeg.matchScore >= 0);
  });

  await test('TEST 21: Edge Case: Candidate with 0 inventory -> Filtered out by findMatches', () => {
    const cZero = { title: 'Depleted Stock', quantity: 0, status: 'active' };
    const cActive = { title: 'Available Stock', quantity: 500, status: 'active' };
    const matches = matchingService.findMatches({ quantity: 100 }, [cZero, cActive]);
    assert.strictEqual(matches.length, 1);
    assert.strictEqual(matches[0].material.title, 'Available Stock');
  });

  await test('TEST 22: Edge Case: Inactive or completed material status -> Filtered out by findMatches', () => {
    const cInactive = { title: 'Archived Listing', quantity: 1000, status: 'inactive' };
    const cCompleted = { title: 'Sold Out Listing', quantity: 1000, status: 'completed' };
    const cActive = { title: 'Active Listing', quantity: 1000, status: 'active' };
    const matches = matchingService.findMatches({}, [cInactive, cCompleted, cActive]);
    assert.strictEqual(matches.length, 1);
    assert.strictEqual(matches[0].material.title, 'Active Listing');
  });

  await test('TEST 23: Edge Case: Missing condition & transactionType in candidate -> Defaults to standard values', () => {
    const res = matchingService.evaluateMatch({}, { quantity: 1000, price: 10 });
    assert.ok(res.compatibility.condition > 0);
    assert.ok(res.compatibility.transaction > 0);
  });

  await test('TEST 24: Edge Case: Extremely large quantity request (1,000,000 kg) -> Proper fractional scaling', () => {
    const res = matchingService.evaluateMatch({ quantity: 1000000, unit: 'kg' }, { quantity: 5000, unit: 'kg' });
    assert.ok(res.compatibility.quantity <= 25);
    assert.ok(res.matchScore >= 0);
  });

  console.log(`\n========================================================`);
  console.log(`QA VERIFICATION SUMMARY:`);
  console.log(`Total Tests Run: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`========================================================\n`);

  if (failedTests > 0) {
    console.error('Failed Test Details:');
    failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f.name} => ${f.error}`));
    process.exit(1);
  }
}

runAll().catch((e) => {
  console.error('Fatal test execution error:', e);
  process.exit(1);
});
