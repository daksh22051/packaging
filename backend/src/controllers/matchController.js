import Material from '../models/Material.js';
import Company from '../models/Company.js';
import { matchingService } from '../services/matchingService.js';
import { isDbConnected } from '../config/db.js';

const SAMPLE_CANDIDATES = [
  {
    _id: 'mat-001',
    id: 'mat-001',
    title: 'Surplus Double-Wall Corrugated Boxes',
    category: 'cardboard',
    quantity: 4800,
    unit: 'kg',
    pricePerUnit: 8.5,
    condition: 'good',
    transactionType: 'sell',
    status: 'active',
    location: { city: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
    company: {
      name: 'ABC Packaging Pvt Ltd',
      location: { city: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
      circularityScore: 94,
      verificationStatus: 'verified',
      rating: 4.9,
      businessType: 'Manufacturer',
    },
    estimatedCarbonAvoided: 3.84,
  },
  {
    _id: 'mat-002',
    id: 'mat-002',
    title: 'Post-Industrial LDPE Stretch Film Scrap',
    category: 'plastic',
    quantity: 3200,
    unit: 'kg',
    pricePerUnit: 22,
    condition: 'used',
    transactionType: 'sell',
    status: 'active',
    location: { city: 'Vadodara', state: 'Gujarat', latitude: 22.3072, longitude: 73.1812 },
    company: {
      name: 'EcoCycle Materials',
      location: { city: 'Vadodara', state: 'Gujarat', latitude: 22.3072, longitude: 73.1812 },
      circularityScore: 94,
      verificationStatus: 'verified',
      rating: 4.9,
      businessType: 'Recycler',
    },
    estimatedCarbonAvoided: 4.48,
  },
  {
    _id: 'mat-003',
    id: 'mat-003',
    title: 'Pine Wooden Pallets (Four-Way Entry)',
    category: 'pallets',
    quantity: 850,
    unit: 'units',
    pricePerUnit: 140,
    condition: 'good',
    transactionType: 'sell',
    status: 'active',
    location: { city: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
    company: {
      name: 'Urban Retail Solutions',
      location: { city: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
      circularityScore: 88,
      verificationStatus: 'verified',
      rating: 4.7,
      businessType: 'Retailer',
    },
    estimatedCarbonAvoided: 13.1,
  },
  {
    _id: 'mat-004',
    id: 'mat-004',
    title: 'Virgin-Grade Bleached Kraft Trimmings',
    category: 'cardboard',
    quantity: 5500,
    unit: 'kg',
    pricePerUnit: 12,
    condition: 'new',
    transactionType: 'sell',
    status: 'active',
    location: { city: 'Surat', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311 },
    company: {
      name: 'CircularBox Manufacturing',
      location: { city: 'Surat', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311 },
      circularityScore: 89,
      verificationStatus: 'verified',
      rating: 4.8,
      businessType: 'Manufacturer',
    },
    estimatedCarbonAvoided: 4.4,
  },
  {
    _id: 'mat-005',
    id: 'mat-005',
    title: 'Pre-Washed Food-Grade HDPE Drums (200L)',
    category: 'plastic',
    quantity: 180,
    unit: 'units',
    pricePerUnit: 0,
    condition: 'good',
    transactionType: 'free',
    status: 'active',
    location: { city: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
    company: {
      name: 'Gujarat Chemicals Consortium',
      location: { city: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
      circularityScore: 91,
      verificationStatus: 'verified',
      rating: 4.7,
      businessType: 'Distributor',
    },
    estimatedCarbonAvoided: 3.2,
  },
  {
    _id: 'mat-006',
    id: 'mat-006',
    title: 'Sorted Clear Beverage Glass Cullet',
    category: 'glass',
    quantity: 12000,
    unit: 'kg',
    pricePerUnit: 3.2,
    condition: 'recyclable',
    transactionType: 'sell',
    status: 'active',
    location: { city: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567 },
    company: {
      name: 'Maharashtra Glass Reclaimers',
      location: { city: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567 },
      circularityScore: 86,
      verificationStatus: 'verified',
      rating: 4.6,
      businessType: 'Recycler',
    },
    estimatedCarbonAvoided: 3.57,
  },
];

/**
 * Helper to normalize incoming requirement payload from POST body or GET query
 */
function parseRequirement(req) {
  const source = req.method === 'POST' ? req.body : req.query;

  const category = source.category || source.materialType || undefined;
  const quantity = source.quantity ? Number(source.quantity) : undefined;
  const unit = source.unit || 'kg';
  const condition = source.condition || undefined;
  const transactionType = source.transactionType || undefined;
  const maxPrice = source.maxPrice !== undefined ? Number(source.maxPrice) : undefined;

  let latitude = source.latitude !== undefined ? Number(source.latitude) : undefined;
  let longitude = source.longitude !== undefined ? Number(source.longitude) : undefined;
  let city = source.city || (source.location && source.location.city) || undefined;

  // Personalized matching: If user/company is authenticated, enrich missing location
  if ((!latitude || !longitude || !city) && req.user && req.user.company) {
    const comp = req.user.company;
    if (!city && comp.location?.city) city = comp.location.city;
    if (!latitude && comp.location?.latitude) latitude = comp.location.latitude;
    if (!longitude && comp.location?.longitude) longitude = comp.location.longitude;
  }

  return {
    category,
    quantity,
    unit,
    condition,
    transactionType,
    maxPrice,
    city: city || 'Ahmedabad',
    latitude: latitude !== undefined ? latitude : 23.0225,
    longitude: longitude !== undefined ? longitude : 72.5714,
    location: {
      city: city || 'Ahmedabad',
      latitude: latitude !== undefined ? latitude : 23.0225,
      longitude: longitude !== undefined ? longitude : 72.5714,
    },
  };
}

/**
 * @desc    Get smart circular matches for a buyer requirement
 * @route   GET /api/matches
 * @route   POST /api/matches
 * @access  Public (Optional Auth for personalization)
 */
export const getMatches = async (req, res, next) => {
  try {
    const requirement = parseRequirement(req);
    const minScore = req.query.minScore ? Number(req.query.minScore) : 0;
    const limit = req.query.limit ? Number(req.query.limit) : 25;

    // Build database candidate query
    const filter = {
      status: 'active',
      quantity: { $gt: 0 },
    };

    // If a specific category was requested and caller did not request 'all'
    if (requirement.category && requirement.category.toLowerCase() !== 'all') {
      const cat = requirement.category.toLowerCase();
      // Allow exact and related categories in candidate retrieval
      if (cat === 'cardboard' || cat === 'paper') {
        filter.category = { $in: ['cardboard', 'paper'] };
      } else if (cat === 'pallet' || cat === 'pallets') {
        filter.category = { $in: ['pallet', 'pallets'] };
      } else {
        filter.category = cat;
      }
    }

    // Retrieve candidates from MongoDB if connected, or fallback to sample candidates
    let candidates = [];
    if (isDbConnected()) {
      try {
        candidates = await Material.find(filter)
          .populate('company', 'name location circularityScore verificationStatus rating logo businessType')
          .populate('supplier', 'name email phone')
          .lean();

        // If specific category filter yielded too few candidates (< 2) and requirement was specified,
        // broaden query to all active materials so user still receives best alternative circular options
        if (candidates.length < 2 && filter.category) {
          delete filter.category;
          candidates = await Material.find(filter)
            .populate('company', 'name location circularityScore verificationStatus rating logo businessType')
            .populate('supplier', 'name email phone')
            .lean();
        }
      } catch (dbErr) {
        console.warn('MongoDB query failed, falling back to sample candidates:', dbErr.message);
        candidates = SAMPLE_CANDIDATES;
      }
    } else {
      candidates = SAMPLE_CANDIDATES;
    }

    // Evaluate compatibility scores deterministically
    const matches = matchingService.findMatches(requirement, candidates, {
      minScore,
      limit,
    });

    return res.status(200).json({
      success: true,
      count: matches.length,
      requirement,
      data: {
        matches,
      },
    });
  } catch (error) {
    next(error);
  }
};
