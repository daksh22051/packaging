/**
 * CIRCULA Smart Circular Matching Engine
 * Deterministic, multi-factor compatibility evaluation service
 * Calculates explainable match scores between buyer requirements and candidate materials
 */

// Lifecycle emission factors (kg CO2e per kg displaced virgin material)
const EMISSION_FACTORS = {
  cardboard: 0.94,
  plastic: 1.65,
  pallet: 0.62,
  pallets: 0.62,
  paper: 0.88,
  glass: 0.35,
  metal: 8.20,
  other: 0.75,
};

// Known coordinates for industrial hubs (fallback when coordinates are omitted)
const CITY_COORDINATES = {
  ahmedabad: { lat: 23.0225, lon: 72.5714 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  pune: { lat: 18.5204, lon: 73.8567 },
  surat: { lat: 21.1702, lon: 72.8311 },
  vadodara: { lat: 22.3072, lon: 73.1812 },
  delhi: { lat: 28.6139, lon: 77.209 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  hyderabad: { lat: 17.385, lon: 78.4867 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
};

/**
 * Calculate Great-Circle distance using Haversine formula
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined ||
    lon1 === undefined ||
    lat2 === undefined ||
    lon2 === undefined ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return 45; // Default sensible regional distance fallback
  }

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(1, Math.round(R * c));
}

/**
 * Normalize quantity into standard kg
 */
export function normalizeQuantityToKg(quantity, unit) {
  const qty = Math.max(0, Number(quantity) || 0);
  const cleanUnit = (unit || 'kg').toLowerCase().trim();

  if (cleanUnit === 'tonne' || cleanUnit === 'tonnes' || cleanUnit === 't' || cleanUnit === 'tons') {
    return qty * 1000;
  }
  if (cleanUnit === 'g' || cleanUnit === 'grams') {
    return qty / 1000;
  }
  return qty;
}

export const matchingService = {
  /**
   * 1. Material Category Compatibility (Weight: 30%)
   */
  scoreMaterialCompatibility(reqCategory, candCategory, candName = '') {
    if (!reqCategory || reqCategory.toLowerCase() === 'all') {
      return { score: 90, factor: 0.9 };
    }

    const req = reqCategory.toLowerCase().trim();
    const cand = (candCategory || '').toLowerCase().trim();
    const name = candName.toLowerCase();

    // Exact match
    if (req === cand) {
      return { score: 100, factor: 1.0 };
    }

    // Equivalent pluralizations
    if (
      (req === 'pallet' && cand === 'pallets') ||
      (req === 'pallets' && cand === 'pallet')
    ) {
      return { score: 100, factor: 1.0 };
    }

    // Fiber / Paper / Cardboard relationship
    if (
      (req === 'cardboard' && cand === 'paper') ||
      (req === 'paper' && cand === 'cardboard')
    ) {
      return { score: 70, factor: 0.7 };
    }

    // Check name keyword overlap
    if (name.includes(req) || req.includes(cand)) {
      return { score: 75, factor: 0.75 };
    }

    // Mismatch
    return { score: 10, factor: 0.1 };
  },

  /**
   * 2. Quantity Compatibility (Weight: 20%)
   */
  scoreQuantityCompatibility(reqQty, reqUnit, candQty, candUnit) {
    const requiredKg = normalizeQuantityToKg(reqQty, reqUnit);
    const availableKg = normalizeQuantityToKg(candQty, candUnit);

    if (availableKg <= 0) {
      return { score: 0, factor: 0, ratio: 0 };
    }

    if (!requiredKg || requiredKg <= 0) {
      return { score: 95, factor: 0.95, ratio: 1.0 };
    }

    const ratio = availableKg / requiredKg;

    if (ratio >= 1.0) {
      if (ratio <= 1.5) {
        // Ideal batch size
        return { score: 100, factor: 1.0, ratio };
      } else if (ratio <= 3.0) {
        // Ample surplus, easy fulfillment
        return { score: 95, factor: 0.95, ratio };
      } else {
        // Very large surplus
        return { score: 85, factor: 0.85, ratio };
      }
    } else {
      // Partial availability
      if (ratio >= 0.75) {
        return { score: 80, factor: 0.8, ratio };
      } else if (ratio >= 0.5) {
        return { score: 60, factor: 0.6, ratio };
      } else if (ratio >= 0.25) {
        return { score: 40, factor: 0.4, ratio };
      } else {
        return { score: 20, factor: 0.2, ratio };
      }
    }
  },

  /**
   * 3. Geographic Proximity (Weight: 15%)
   */
  scoreGeographicProximity(buyerLocation, candLocation) {
    let bLat = buyerLocation?.latitude;
    let bLon = buyerLocation?.longitude;
    let cLat = candLocation?.latitude;
    let cLon = candLocation?.longitude;

    // City fallback if coordinates not provided
    if ((!bLat || !bLon) && buyerLocation?.city) {
      const cityKey = buyerLocation.city.toLowerCase().trim();
      if (CITY_COORDINATES[cityKey]) {
        bLat = CITY_COORDINATES[cityKey].lat;
        bLon = CITY_COORDINATES[cityKey].lon;
      }
    }

    if ((!cLat || !cLon) && candLocation?.city) {
      const cityKey = candLocation.city.toLowerCase().trim();
      if (CITY_COORDINATES[cityKey]) {
        cLat = CITY_COORDINATES[cityKey].lat;
        cLon = CITY_COORDINATES[cityKey].lon;
      }
    }

    // Default to Ahmedabad industrial center if still missing
    if (!bLat || !bLon) {
      bLat = 23.0225;
      bLon = 72.5714;
    }
    if (!cLat || !cLon) {
      cLat = 23.0225;
      cLon = 72.5714;
    }

    const distanceKm = calculateHaversineDistance(bLat, bLon, cLat, cLon);

    let score = 50;
    if (distanceKm <= 25) {
      score = Math.round(95 + ((25 - distanceKm) / 25) * 5);
    } else if (distanceKm <= 100) {
      score = Math.round(85 + ((100 - distanceKm) / 75) * 10);
    } else if (distanceKm <= 300) {
      score = Math.round(70 + ((300 - distanceKm) / 200) * 15);
    } else if (distanceKm <= 700) {
      score = Math.round(45 + ((700 - distanceKm) / 400) * 25);
    } else {
      score = Math.max(10, Math.round(45 - (distanceKm - 700) / 50));
    }

    score = Math.min(100, Math.max(10, score));
    return { score, factor: score / 100, distanceKm };
  },

  /**
   * 4. Condition Compatibility (Weight: 10%)
   */
  scoreConditionCompatibility(reqCondition, candCondition) {
    if (!reqCondition || reqCondition.toLowerCase() === 'all') {
      return { score: 100, factor: 1.0 };
    }

    const req = reqCondition.toLowerCase().trim();
    const cand = (candCondition || 'good').toLowerCase().trim();

    if (req === cand) {
      return { score: 100, factor: 1.0 };
    }

    // Buyer requested 'good' or 'used', candidate is 'new' -> exceeds expectations
    if ((req === 'good' || req === 'used') && cand === 'new') {
      return { score: 100, factor: 1.0 };
    }

    if (req === 'used' && cand === 'good') {
      return { score: 100, factor: 1.0 };
    }

    if (req === 'new' && cand === 'good') {
      return { score: 70, factor: 0.7 };
    }

    if (req === 'new' && cand === 'used') {
      return { score: 35, factor: 0.35 };
    }

    if (cand === 'recyclable') {
      return req === 'recyclable' ? { score: 100, factor: 1.0 } : { score: 80, factor: 0.8 };
    }

    return { score: 30, factor: 0.3 };
  },

  /**
   * 5. Transaction Compatibility (Weight: 10%)
   */
  scoreTransactionCompatibility(reqType, candType) {
    if (!reqType || reqType.toLowerCase() === 'all') {
      return { score: 100, factor: 1.0 };
    }

    const req = reqType.toLowerCase().trim();
    const cand = (candType || 'sell').toLowerCase().trim();

    // Normalizations
    const normReq = req === 'purchase' || req === 'buy' ? 'sell' : req === 'free claim' ? 'free_claim' : req;
    const normCand = cand === 'purchase' || cand === 'buy' ? 'sell' : cand === 'free claim' ? 'free_claim' : cand;

    if (normReq === normCand) {
      return { score: 100, factor: 1.0 };
    }

    // Free claim is advantageous if buyer was willing to pay/sell
    if (normReq === 'sell' && normCand === 'free_claim') {
      return { score: 100, factor: 1.0 };
    }

    if (normReq === 'exchange' && normCand === 'sell') {
      return { score: 55, factor: 0.55 };
    }

    if (normReq === 'free_claim' && normCand === 'sell') {
      return { score: 20, factor: 0.2 };
    }

    return { score: 40, factor: 0.4 };
  },

  /**
   * 6. Price Compatibility (Weight: 5%)
   */
  scorePriceCompatibility(maxPrice, candPrice, candTransactionType) {
    const isFree =
      candTransactionType === 'free_claim' ||
      candTransactionType === 'Free Claim' ||
      Number(candPrice) === 0;

    if (isFree) {
      return { score: 100, factor: 1.0, isFree: true };
    }

    const budget = Number(maxPrice);
    if (!budget || budget <= 0 || isNaN(budget)) {
      // No budget restriction provided, do not penalize candidate
      return { score: 100, factor: 1.0, isFree: false };
    }

    const price = Number(candPrice) || 0;

    if (price <= budget) {
      if (price <= budget * 0.8) {
        return { score: 100, factor: 1.0, isFree: false }; // Excellent savings
      }
      return { score: 90, factor: 0.9, isFree: false }; // Within budget
    } else {
      const overRatio = price / budget;
      if (overRatio <= 1.2) {
        return { score: 50, factor: 0.5, isFree: false }; // Slightly over budget
      } else if (overRatio <= 1.5) {
        return { score: 25, factor: 0.25, isFree: false };
      } else {
        return { score: 10, factor: 0.1, isFree: false };
      }
    }
  },

  /**
   * 7. Carbon Benefit Compatibility (Weight: 10%)
   */
  scoreCarbonBenefit(candMaterial) {
    let co2Tonnes =
      candMaterial.estimatedCarbonAvoided ||
      candMaterial.impact?.co2eAvoidedTonnes ||
      0;

    // If not precomputed on candidate, estimate from emission factors and quantity
    if (!co2Tonnes || co2Tonnes <= 0) {
      const cat = (candMaterial.category || 'other').toLowerCase();
      const factor = EMISSION_FACTORS[cat] || EMISSION_FACTORS.other;
      const qtyKg = normalizeQuantityToKg(candMaterial.quantity, candMaterial.unit);
      co2Tonnes = Number(((qtyKg * 0.85 * factor) / 1000).toFixed(2));
    }

    let score = 50;
    if (co2Tonnes >= 2.0) {
      score = 100;
    } else if (co2Tonnes >= 1.0) {
      score = Math.round(85 + ((co2Tonnes - 1.0) / 1.0) * 15);
    } else if (co2Tonnes >= 0.5) {
      score = Math.round(70 + ((co2Tonnes - 0.5) / 0.5) * 15);
    } else if (co2Tonnes >= 0.1) {
      score = Math.round(50 + ((co2Tonnes - 0.1) / 0.4) * 20);
    } else {
      score = 30;
    }

    score = Math.min(100, Math.max(10, score));
    return { score, factor: score / 100, co2Tonnes };
  },

  /**
   * Generate explainable, factual match reasons based on evaluation factors
   */
  generateMatchReasons(factors, req, cand) {
    const reasons = [];

    // 1. Material
    if (factors.material.score === 100) {
      reasons.push(
        `Material category exact match: ${cand.category.toUpperCase()} matches your ${req.category?.toUpperCase() || cand.category.toUpperCase()} requirement.`
      );
    } else if (factors.material.score >= 70) {
      reasons.push(
        `Close material stream compatibility: ${cand.category} is an approved circular substitute for ${req.category}.`
      );
    }

    // 2. Quantity
    const reqQtyStr = `${Number(req.quantity || cand.quantity).toLocaleString()} ${req.unit || cand.unit || 'kg'}`;
    const candQtyStr = `${Number(cand.quantity).toLocaleString()} ${cand.unit || 'kg'}`;
    if (factors.quantity.score === 100) {
      reasons.push(
        `Ideal lot size: Available batch of ${candQtyStr} fulfills your ${reqQtyStr} demand.`
      );
    } else if (factors.quantity.score >= 85) {
      reasons.push(
        `Sufficient inventory: Supplier has ${candQtyStr} available to cover your ${reqQtyStr} order.`
      );
    } else if (factors.quantity.score >= 50) {
      reasons.push(
        `Partial fulfillment: Supplier can immediately supply ${candQtyStr} towards your requirement.`
      );
    }

    // 3. Proximity
    const dist = factors.distance.distanceKm;
    const city = cand.location?.city || cand.city || 'Regional Hub';
    if (dist <= 45) {
      reasons.push(
        `Hyperlocal proximity: Located only ${dist} km away in ${city}, minimizing freight cost and transit delays.`
      );
    } else if (dist <= 150) {
      reasons.push(
        `Regional corridor: Supplier is ${dist} km away in ${city}, within direct same-day transport radius.`
      );
    } else {
      reasons.push(
        `Freight reachable: ${dist} km transit distance via national logistics corridors.`
      );
    }

    // 4. Condition
    const cond = cand.condition || 'Good';
    if (factors.condition.score === 100) {
      reasons.push(
        `Condition compliance: Certified '${cond}' quality meets or exceeds your specification.`
      );
    } else if (factors.condition.score >= 70) {
      reasons.push(
        `Acceptable secondary grade: Listed in '${cond}' condition, viable for circular remanufacturing.`
      );
    }

    // 5. Transaction
    const txType = cand.transactionType === 'sell' ? 'Purchase' : cand.transactionType === 'free_claim' ? 'Free Claim' : 'Exchange';
    if (factors.transaction.score === 100) {
      reasons.push(
        `Transaction alignment: Counterparty offers ${txType} terms matching your preference.`
      );
    }

    // 6. Price & Financials
    if (factors.price.isFree) {
      reasons.push(
        `Zero acquisition cost: Available as a verified free claim donation.`
      );
    } else if (req.maxPrice && cand.price && cand.price <= req.maxPrice) {
      const savingPercent = Math.round(((req.maxPrice - cand.price) / req.maxPrice) * 100);
      reasons.push(
        `Commercial advantage: ₹${cand.price}/${cand.unit || 'kg'} is within budget${savingPercent > 0 ? ` (${savingPercent}% below ceiling)` : ''}.`
      );
    }

    // 7. Carbon
    const co2 = factors.carbon.co2Tonnes;
    if (co2 > 0) {
      reasons.push(
        `Circularity benefit: This exchange displaces virgin raw materials, avoiding an estimated ${co2} tonnes of CO₂e.`
      );
    }

    return reasons;
  },

  /**
   * Synthesize natural narrative for "whyThisMatch"
   */
  generateWhyThisMatchNarrative(factors, req, cand) {
    const dist = factors.distance.distanceKm;
    const co2 = factors.carbon.co2Tonnes;
    const cat = cand.category || 'circular material';
    const city = cand.location?.city || cand.city || 'local cluster';

    return `This listing is an algorithmic match with ${factors.material.score}% material compatibility and a proximity radius of ${dist} km in ${city}. The available batch fulfills ${Math.round((factors.quantity.ratio || 1) * 100)}% of your requirement, generating an estimated carbon abatement of ${co2} t CO₂e under certified Scope 3 circular allocation.`;
  },

  /**
   * Generate key decision drivers
   */
  generateKeyDrivers(factors, req, cand) {
    const drivers = [];
    if (factors.material.score >= 90) {
      drivers.push(`Grade & polymer specification alignment (${cand.category})`);
    }
    if (factors.quantity.score >= 90) {
      drivers.push(`Batch fulfillment: ${cand.quantity} ${cand.unit || 'kg'} ready for dispatch`);
    }
    if (factors.distance.score >= 80) {
      drivers.push(`Short transit radius: ${factors.distance.distanceKm} km transit route`);
    }
    if (factors.carbon.co2Tonnes >= 1.0) {
      drivers.push(`High carbon displacement: ${factors.carbon.co2Tonnes} t CO₂e avoided`);
    }
    if (factors.price.score >= 90) {
      drivers.push(factors.price.isFree ? 'Zero cost material reclamation' : `Within commercial budget threshold`);
    }
    if (drivers.length < 3) {
      drivers.push('Verified B2B circular counterparty');
    }
    return drivers.slice(0, 4);
  },

  /**
   * Compute complete multi-factor match score between requirement and candidate
   * @param {Object} req - Buyer requirement
   * @param {Object} cand - Candidate material
   * @returns {Object} Full match evaluation result
   */
  evaluateMatch(req, cand) {
    // 1. Material Compatibility (30%)
    const materialRes = this.scoreMaterialCompatibility(
      req.category,
      cand.category,
      cand.name || cand.title
    );

    // 2. Quantity Compatibility (20%)
    const quantityRes = this.scoreQuantityCompatibility(
      req.quantity,
      req.unit,
      cand.quantity,
      cand.unit
    );

    // 3. Geographic Proximity (15%)
    const distanceRes = this.scoreGeographicProximity(
      req.location || { latitude: req.latitude, longitude: req.longitude, city: req.city },
      cand.location || { latitude: cand.latitude, longitude: cand.longitude, city: cand.city }
    );

    // 4. Condition Compatibility (10%)
    const conditionRes = this.scoreConditionCompatibility(
      req.condition,
      cand.condition
    );

    // 5. Transaction Compatibility (10%)
    const transactionRes = this.scoreTransactionCompatibility(
      req.transactionType,
      cand.transactionType
    );

    // 6. Price Compatibility (5%)
    const priceRes = this.scorePriceCompatibility(
      req.maxPrice,
      cand.price !== undefined ? cand.price : cand.pricePerUnit,
      cand.transactionType
    );

    // 7. Carbon Benefit (10%)
    const carbonRes = this.scoreCarbonBenefit(cand);

    // Weighted Score Calculation
    // Total = 30 + 20 + 15 + 10 + 10 + 5 + 10 = 100
    const rawScore =
      materialRes.factor * 30 +
      quantityRes.factor * 20 +
      distanceRes.factor * 15 +
      conditionRes.factor * 10 +
      transactionRes.factor * 10 +
      priceRes.factor * 5 +
      carbonRes.factor * 10;

    const matchScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    const factors = {
      material: materialRes,
      quantity: quantityRes,
      distance: distanceRes,
      condition: conditionRes,
      transaction: transactionRes,
      price: priceRes,
      carbon: carbonRes,
    };

    const matchReasons = this.generateMatchReasons(factors, req, cand);
    const whyThisMatch = this.generateWhyThisMatchNarrative(factors, req, cand);
    const keyDrivers = this.generateKeyDrivers(factors, req, cand);

    // Potential savings calculation (comparing against virgin benchmark rate)
    const unitPrice = Number(cand.price !== undefined ? cand.price : cand.pricePerUnit) || 0;
    const virginBenchmarkPrice = unitPrice * 1.4 + 5;
    const potentialSavingsInr = Math.max(
      1500,
      Math.round((virginBenchmarkPrice - unitPrice) * Math.min(Number(cand.quantity) || 1000, Number(req.quantity) || 1000))
    );

    let matchQuality = 'Potential Match';
    if (matchScore >= 88) {
      matchQuality = 'Excellent Match';
    } else if (matchScore >= 75) {
      matchQuality = 'Strong Match';
    }

    return {
      material: cand,
      company: cand.company || cand.supplierCompany || cand.supplier,
      matchScore,
      matchQuality,
      distanceKm: distanceRes.distanceKm,
      potentialSavingsInr,
      estimatedCo2AvoidedTonnes: carbonRes.co2Tonnes,
      matchReasons,
      whyThisMatch,
      keyDrivers,
      scoreBreakdown: {
        materialCompatibility: Number((materialRes.factor * 30).toFixed(1)),
        quantityCompatibility: Number((quantityRes.factor * 20).toFixed(1)),
        proximity: Number((distanceRes.factor * 15).toFixed(1)),
        condition: Number((conditionRes.factor * 10).toFixed(1)),
        transaction: Number((transactionRes.factor * 10).toFixed(1)),
        price: Number((priceRes.factor * 5).toFixed(1)),
        carbonBenefit: Number((carbonRes.factor * 10).toFixed(1)),
      },
      compatibility: {
        material: materialRes.score,
        quantity: quantityRes.score,
        distance: distanceRes.score,
        condition: conditionRes.score,
        transaction: transactionRes.score,
        price: priceRes.score,
        carbon: carbonRes.score,
      },
    };
  },

  /**
   * Filter, rank and match candidate materials against buyer requirements
   * @param {Object} req - Buyer requirement
   * @param {Array} candidates - Candidate material models
   * @param {Object} options - Sorting & filtering options
   * @returns {Array} Sorted smart matches
   */
  findMatches(req, candidates = [], options = {}) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return [];
    }

    const minScore = options.minScore || 0;
    const limit = options.limit || 50;

    const evaluated = candidates
      .filter((cand) => {
        // Exclude completely inactive or empty items
        if (cand.status && cand.status !== 'active' && cand.status !== 'Available') {
          return false;
        }
        if (cand.quantity <= 0) {
          return false;
        }
        return true;
      })
      .map((cand) => this.evaluateMatch(req, cand))
      .filter((match) => match.matchScore >= minScore)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    return evaluated;
  },
};

export default matchingService;
