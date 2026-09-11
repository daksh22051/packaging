import { SmartMatch, BuyerRequirement, Material, Company } from '../types';
import { apiClient } from './apiClient';
import { INITIAL_MATCHES, INITIAL_MATERIALS, CURRENT_USER_COMPANY, MOCK_COMPANIES } from '../data/mockData';

// Reusable local calculations in case backend is unavailable in preview
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  ahmedabad: { lat: 23.0225, lon: 72.5714 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  pune: { lat: 18.5204, lon: 73.8567 },
  surat: { lat: 21.1702, lon: 72.8311 },
  vadodara: { lat: 22.3072, lon: 73.1812 },
  delhi: { lat: 28.6139, lon: 77.209 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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

function evaluateLocalMatch(req: BuyerRequirement, mat: Material): SmartMatch {
  const reqCat = (req.category || '').toLowerCase().trim();
  const candCat = (mat.category || '').toLowerCase().trim();

  // 1. Material Compatibility (30%)
  let matScore = 10;
  let matFactor = 0.1;
  if (!reqCat || reqCat === 'all' || reqCat === candCat) {
    matScore = 100;
    matFactor = 1.0;
  } else if (
    (reqCat === 'cardboard' && candCat === 'paper') ||
    (reqCat === 'paper' && candCat === 'cardboard') ||
    (reqCat === 'pallet' && candCat === 'pallets') ||
    (reqCat === 'pallets' && candCat === 'pallet')
  ) {
    matScore = 75;
    matFactor = 0.75;
  }

  // 2. Quantity Compatibility (20%)
  const reqQty = req.quantity || 1000;
  const availQty = mat.quantity || 1000;
  let qtyScore = 50;
  let qtyFactor = 0.5;
  const qtyRatio = availQty / reqQty;
  if (qtyRatio >= 1.0) {
    if (qtyRatio <= 1.5) {
      qtyScore = 100;
      qtyFactor = 1.0;
    } else if (qtyRatio <= 3.0) {
      qtyScore = 95;
      qtyFactor = 0.95;
    } else {
      qtyScore = 85;
      qtyFactor = 0.85;
    }
  } else {
    qtyScore = Math.max(20, Math.round(qtyRatio * 85));
    qtyFactor = qtyScore / 100;
  }

  // 3. Proximity (15%)
  const bCity = (req.city || 'Ahmedabad').toLowerCase();
  const cCity = (mat.city || mat.location || 'Ahmedabad').toLowerCase();
  const bCoords = CITY_COORDINATES[bCity] || CITY_COORDINATES.ahmedabad;
  const cCoords = CITY_COORDINATES[cCity] || { lat: 23.0225, lon: 72.5714 };
  const distanceKm = calculateDistance(bCoords.lat, bCoords.lon, cCoords.lat, cCoords.lon);

  let distScore = 50;
  if (distanceKm <= 25) distScore = Math.round(95 + ((25 - distanceKm) / 25) * 5);
  else if (distanceKm <= 100) distScore = Math.round(85 + ((100 - distanceKm) / 75) * 10);
  else if (distanceKm <= 300) distScore = Math.round(70 + ((300 - distanceKm) / 200) * 15);
  else if (distanceKm <= 700) distScore = Math.round(45 + ((700 - distanceKm) / 400) * 25);
  else distScore = Math.max(10, Math.round(45 - (distanceKm - 700) / 50));
  const distFactor = distScore / 100;

  // 4. Condition (10%)
  let condScore = 100;
  if (req.condition && req.condition !== 'All') {
    const rc = req.condition.toLowerCase();
    const mc = (mat.condition || 'good').toLowerCase();
    if (rc === mc || ((rc === 'good' || rc === 'used') && mc === 'new')) condScore = 100;
    else if (rc === 'new' && mc === 'good') condScore = 70;
    else if (rc === 'new' && mc === 'used') condScore = 35;
    else condScore = 60;
  }
  const condFactor = condScore / 100;

  // 5. Transaction (10%)
  let txScore = 100;
  if (req.transactionType && req.transactionType !== 'All') {
    const rt = req.transactionType.toLowerCase();
    const mt = (mat.transactionType || 'sell').toLowerCase();
    if (rt === mt || (rt === 'purchase' && mt === 'sell') || (rt === 'sell' && mt === 'purchase')) txScore = 100;
    else if ((rt === 'purchase' || rt === 'sell') && (mt === 'free_claim' || mt === 'free claim')) txScore = 100;
    else if ((rt === 'free_claim' || rt === 'free claim') && mt === 'purchase') txScore = 20;
    else txScore = 55;
  }
  const txFactor = txScore / 100;

  // 6. Price (5%)
  let priceScore = 100;
  const isFree = mat.transactionType === 'Free Claim' || mat.pricePerUnit === 0;
  if (isFree) {
    priceScore = 100;
  } else if (req.maxPrice && req.maxPrice > 0) {
    if (mat.pricePerUnit <= req.maxPrice * 0.8) priceScore = 100;
    else if (mat.pricePerUnit <= req.maxPrice) priceScore = 90;
    else if (mat.pricePerUnit <= req.maxPrice * 1.2) priceScore = 50;
    else priceScore = 20;
  }
  const priceFactor = priceScore / 100;

  // 7. Carbon Benefit (10%)
  const co2Tonnes = mat.impact?.co2eAvoidedTonnes || 1.8;
  let carbonScore = 50;
  if (co2Tonnes >= 2.0) carbonScore = 100;
  else if (co2Tonnes >= 1.0) carbonScore = Math.round(85 + ((co2Tonnes - 1.0) / 1.0) * 15);
  else if (co2Tonnes >= 0.5) carbonScore = Math.round(70 + ((co2Tonnes - 0.5) / 0.5) * 15);
  else carbonScore = 40;
  const carbonFactor = carbonScore / 100;

  // Weighted total: 30 + 20 + 15 + 10 + 10 + 5 + 10 = 100
  const rawScore =
    matFactor * 30 +
    qtyFactor * 20 +
    distFactor * 15 +
    condFactor * 10 +
    txFactor * 10 +
    priceFactor * 5 +
    carbonFactor * 10;

  const matchScore = Math.min(100, Math.max(10, Math.round(rawScore)));

  // Dynamic explainable reasons
  const matchReasons: string[] = [];
  if (matScore === 100) {
    matchReasons.push(`Material category match: ${mat.category} exactly satisfies your requirement.`);
  } else if (matScore >= 70) {
    matchReasons.push(`Material compatibility: ${mat.category} is an approved circular substitute.`);
  }

  if (qtyScore === 100) {
    matchReasons.push(`Volume match: Available batch of ${mat.quantity.toLocaleString()} ${mat.unit} meets your ${reqQty.toLocaleString()} ${mat.unit} demand.`);
  } else {
    matchReasons.push(`Inventory: ${mat.quantity.toLocaleString()} ${mat.unit} available for immediate dispatch.`);
  }

  matchReasons.push(`Geographic proximity: Supplier is located ${distanceKm} km away in ${mat.city || mat.location}.`);

  if (condScore >= 70) {
    matchReasons.push(`Quality grade: '${mat.condition}' condition meets circular manufacturing threshold.`);
  }

  if (isFree) {
    matchReasons.push(`Zero cost: Available as verified free claim material donation.`);
  } else if (req.maxPrice && mat.pricePerUnit <= req.maxPrice) {
    matchReasons.push(`Budget aligned: ₹${mat.pricePerUnit}/${mat.unit} is within your budget limit of ₹${req.maxPrice}/${mat.unit}.`);
  }

  matchReasons.push(`Lifecycle carbon benefit: Diverting this consignment avoids an estimated ${co2Tonnes} t CO₂e.`);

  const keyDrivers = [
    `Grade & specification alignment (${mat.category})`,
    `${mat.quantity.toLocaleString()} ${mat.unit} available for immediate dispatch`,
    `${distanceKm} km transit radius to ${mat.city || 'hub'}`,
    `${co2Tonnes} t CO₂e lifecycle carbon reduction`,
  ];

  const scoreBreakdown = {
    materialCompatibility: Number((matFactor * 30).toFixed(1)),
    quantityCompatibility: Number((qtyFactor * 20).toFixed(1)),
    proximity: Number((distFactor * 15).toFixed(1)),
    condition: Number((condFactor * 10).toFixed(1)),
    transaction: Number((txFactor * 10).toFixed(1)),
    price: Number((priceFactor * 5).toFixed(1)),
    carbonBenefit: Number((carbonFactor * 10).toFixed(1)),
  };

  let matchQuality = 'Potential Match';
  if (matchScore >= 88) matchQuality = 'Excellent Match';
  else if (matchScore >= 75) matchQuality = 'Strong Match';

  return {
    id: `match-${mat.id}`,
    materialId: mat.id,
    material: mat,
    buyerCompanyId: CURRENT_USER_COMPANY.id,
    buyerCompany: CURRENT_USER_COMPANY,
    supplierCompany: mat.supplier || MOCK_COMPANIES[1],
    matchScore,
    matchQuality,
    compatibility: {
      material: matScore,
      quantity: qtyScore,
      distance: distScore,
      condition: condScore,
      transaction: txScore,
      price: priceScore,
      carbon: carbonScore,
    },
    scoreBreakdown,
    matchReasons,
    distanceKm,
    potentialSavingsInr: Math.round((mat.pricePerUnit * 0.4 + 4) * Math.min(availQty, reqQty)),
    estimatedCo2AvoidedTonnes: co2Tonnes,
    whyThisMatch: `Algorithm match index ${matchScore}% evaluated on multi-factor analysis: material category (${matScore}%), volume fulfillment (${qtyScore}%), and logistics distance (${distanceKm} km in ${mat.city || 'Ahmedabad'}), avoiding ${co2Tonnes} t CO₂e.`,
    keyDrivers,
    suggestedAction: 'Initiate purchase or schedule batch inspection',
  };
}

function mapBackendMatchToFrontend(raw: any): SmartMatch {
  const backendMat = raw.material || {};
  const backendComp = raw.company || backendMat.company || {};

  const frontendMaterial: Material = {
    id: backendMat._id || backendMat.id || 'mat-unknown',
    title: backendMat.name || backendMat.title || 'Surplus Material Batch',
    category: (backendMat.category ? backendMat.category.charAt(0).toUpperCase() + backendMat.category.slice(1) : 'Cardboard') as any,
    quantity: backendMat.quantity || 1000,
    unit: backendMat.unit || 'kg',
    pricePerUnit: backendMat.price !== undefined ? backendMat.price : 10,
    totalEstimatedValue: (backendMat.price || 10) * (backendMat.quantity || 1000),
    condition: (backendMat.condition ? backendMat.condition.charAt(0).toUpperCase() + backendMat.condition.slice(1) : 'Good') as any,
    transactionType: backendMat.transactionType === 'sell' ? 'Purchase' : backendMat.transactionType === 'free_claim' ? 'Free Claim' : 'Exchange',
    supplierId: backendComp._id || backendComp.id || 'supplier-id',
    supplier: {
      id: backendComp._id || backendComp.id || 'supplier-id',
      name: backendComp.name || 'Verified Supplier Co.',
      type: (backendComp.businessType as any) || 'Packaging Supplier',
      industry: backendComp.industry || 'Industrial Packaging & Circular Logistics',
      location: backendComp.location?.city ? `${backendComp.location.city}, ${backendComp.location.state || 'Gujarat'}` : 'Ahmedabad, Gujarat',
      city: backendComp.location?.city || 'Ahmedabad',
      state: backendComp.location?.state || 'Gujarat',
      rating: backendComp.rating || 4.8,
      reviewCount: backendComp.reviewCount || 24,
      verifiedLevel: 'Verified',
      verified: backendComp.verificationStatus === 'verified' || backendComp.verificationStatus === 'trusted',
      circularityScore: backendComp.circularityScore || 85,
      materialsExchangedTonnes: backendComp.materialsExchangedTonnes || 42,
      co2eAvoidedTonnes: backendComp.co2eAvoidedTonnes || 18.5,
      wasteDivertedTonnes: backendComp.wasteDivertedTonnes || 35.2,
      transactionsCount: backendComp.totalTransactions || 18,
      activeListingsCount: backendComp.activeListingsCount || 4,
      memberSince: backendComp.memberSince || '2023',
      contactEmail: backendComp.contactEmail || 'supplier@circula.exchange',
      phone: backendComp.phone || '+91 98765 43210',
      avatarUrl: backendComp.logo || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=300&q=80',
    },
    location: backendMat.location?.city ? `${backendMat.location.city}, ${backendMat.location.state || 'Gujarat'}` : 'Ahmedabad, Gujarat',
    city: backendMat.location?.city || 'Ahmedabad',
    state: backendMat.location?.state || 'Gujarat',
    distanceKm: raw.distanceKm || 35,
    images: Array.isArray(backendMat.images) && backendMat.images.length > 0 ? backendMat.images : ['https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'],
    specs: {
      grade: backendMat.grade || 'Commercial Grade A',
      dimensions: backendMat.dimensions || 'Standard palletized bulk',
      weightPerUnitKg: backendMat.weight || 1.2,
      recyclabilityRate: `${backendMat.recyclability || 100}% Circular`,
    },
    impact: {
      virginMaterialReplacedKg: backendMat.estimatedVirginMaterialAvoided || Math.round((backendMat.quantity || 1000) * 0.85),
      landfillWasteAvoidedKg: backendMat.estimatedWasteDiverted || backendMat.quantity || 1000,
      co2eAvoidedTonnes: backendMat.estimatedCarbonAvoided || raw.estimatedCo2AvoidedTonnes || 1.8,
      waterSavedLiters: backendMat.estimatedWaterSaved || Math.round((backendMat.quantity || 1000) * 2.4),
    },
    availability: 'Immediate',
    availableDate: backendMat.availableDate || new Date().toISOString().split('T')[0],
    description: backendMat.description || 'Verified industrial surplus material available for direct circular reuse.',
    tags: backendMat.tags || ['Circular', 'Surplus'],
    isVerified: true,
    createdAt: backendMat.createdAt ? new Date(backendMat.createdAt).toLocaleDateString() : 'Recently listed',
    status: 'Available',
  };

  const supplierCompany: Company = frontendMaterial.supplier!;

  return {
    id: `match-${backendMat._id || backendMat.id || Math.random()}`,
    materialId: frontendMaterial.id,
    material: frontendMaterial,
    buyerCompanyId: CURRENT_USER_COMPANY.id,
    buyerCompany: CURRENT_USER_COMPANY,
    supplierCompany,
    matchScore: raw.matchScore || 85,
    matchQuality: raw.matchQuality || (raw.matchScore >= 88 ? 'Excellent Match' : raw.matchScore >= 75 ? 'Strong Match' : 'Potential Match'),
    compatibility: {
      material: raw.compatibility?.material || 90,
      quantity: raw.compatibility?.quantity || 90,
      distance: raw.compatibility?.distance || 85,
      condition: raw.compatibility?.condition || 90,
      transaction: raw.compatibility?.transaction || 90,
      price: raw.compatibility?.price || 90,
      carbon: raw.compatibility?.carbon || 90,
    },
    scoreBreakdown: raw.scoreBreakdown || {
      materialCompatibility: 27,
      quantityCompatibility: 18,
      proximity: 13,
      condition: 10,
      transaction: 10,
      price: 5,
      carbonBenefit: 9,
    },
    matchReasons: raw.matchReasons || [
      'High affinity material category specification',
      'Batch size fulfills requirements',
      'Short transit radius minimizing freight emissions',
      'Verified counterparty with high circularity score',
    ],
    distanceKm: raw.distanceKm || 35,
    potentialSavingsInr: raw.potentialSavingsInr || 14500,
    estimatedCo2AvoidedTonnes: raw.estimatedCo2AvoidedTonnes || 1.8,
    whyThisMatch: raw.whyThisMatch || 'Algorithmically validated circular match based on grade compatibility, short transport distance and carbon reduction.',
    keyDrivers: raw.keyDrivers || [
      'Direct specification alignment',
      'Immediate readiness for dispatch',
      'Certified Scope 3 avoidance credits',
    ],
    suggestedAction: 'Initiate purchase or inspect sample before batch dispatch',
  };
}

export const matchService = {
  /**
   * Find circular matches for buyer requirements
   */
  async getMatches(
    req?: BuyerRequirement,
    localMaterials: Material[] = INITIAL_MATERIALS
  ): Promise<{ matches: SmartMatch[]; source: 'backend' | 'preview' }> {
    const payload = req || {
      category: 'Cardboard',
      quantity: 5000,
      unit: 'kg',
      condition: 'Good',
      transactionType: 'Purchase',
      maxPrice: 25,
      city: 'Ahmedabad',
      latitude: 23.0225,
      longitude: 72.5714,
    };

    try {
      const res = await apiClient.post<any>('/matches', payload);
      if (res && res.success && res.data && Array.isArray(res.data.matches) && res.data.matches.length > 0) {
        const mapped = res.data.matches.map(mapBackendMatchToFrontend);
        return { matches: mapped, source: 'backend' };
      }
    } catch (err) {
      console.warn('Backend match endpoint unavailable, calculating locally via deterministic engine:', err);
    }

    // Fallback: Compute deterministically locally on available materials
    const evaluated = localMaterials
      .map((mat) => evaluateLocalMatch(payload, mat))
      .sort((a, b) => b.matchScore - a.matchScore);

    return { matches: evaluated, source: 'preview' };
  },

  async getAll(): Promise<SmartMatch[]> {
    const res = await this.getMatches();
    return res.matches;
  },

  async getById(id: string): Promise<SmartMatch | undefined> {
    const { matches } = await this.getMatches();
    return matches.find((m) => m.id === id || m.materialId === id);
  },
};
