/**
 * Material Business Logic & Impact Calculations Service
 */

// Lifecycle emissions factor per kg displaced virgin material (kg CO2e / kg)
const EMISSION_FACTORS = {
  cardboard: 0.94,
  plastic: 1.65,
  pallet: 0.62,
  paper: 0.88,
  glass: 0.35,
  metal: 8.20,
  other: 0.75,
};

// Typical virgin packaging displacement efficiency ratio
const VIRGIN_DISPLACEMENT_RATIO = 0.85;

export const materialService = {
  /**
   * Calculate environmental impact metrics for a material quantity
   */
  calculateImpact(category, quantityKg) {
    const cleanCategory = (category || 'other').toLowerCase();
    const factor = EMISSION_FACTORS[cleanCategory] || EMISSION_FACTORS.other;
    const qty = Math.max(0, Number(quantityKg) || 0);

    const estimatedVirginMaterialAvoided = Number((qty * VIRGIN_DISPLACEMENT_RATIO).toFixed(1));
    const estimatedWasteDiverted = Number(qty.toFixed(1));
    const estimatedCarbonAvoided = Number((estimatedVirginMaterialAvoided * factor).toFixed(2));

    return {
      estimatedCarbonAvoided,
      estimatedWasteDiverted,
      estimatedVirginMaterialAvoided,
    };
  },

  /**
   * Build MongoDB query filter based on request query parameters
   */
  buildFilter(queryParams) {
    const filter = {};

    if (queryParams.status) {
      filter.status = queryParams.status;
    } else {
      // Default to active materials if not specified
      filter.status = 'active';
    }

    if (queryParams.category && queryParams.category !== 'all') {
      const cat = queryParams.category.toLowerCase();
      if (cat === 'pallets' || cat === 'pallet') {
        filter.category = { $in: ['pallet', 'pallets'] };
      } else {
        filter.category = cat;
      }
    }

    if (queryParams.condition && queryParams.condition !== 'all') {
      filter.condition = queryParams.condition.toLowerCase();
    }

    if (queryParams.transactionType && queryParams.transactionType !== 'all') {
      const rawType = queryParams.transactionType.toLowerCase();
      if (rawType === 'purchase' || rawType === 'buy') {
        filter.transactionType = 'sell';
      } else if (rawType === 'free claim' || rawType === 'free_claim') {
        filter.transactionType = 'free_claim';
      } else {
        filter.transactionType = rawType;
      }
    }

    if (queryParams.city) {
      filter['location.city'] = { $regex: queryParams.city, $options: 'i' };
    }

    // Price range filters
    if (queryParams.minPrice !== undefined || queryParams.maxPrice !== undefined) {
      filter.price = {};
      if (queryParams.minPrice !== undefined && queryParams.minPrice !== '') {
        filter.price.$gte = Number(queryParams.minPrice);
      }
      if (queryParams.maxPrice !== undefined && queryParams.maxPrice !== '') {
        filter.price.$lte = Number(queryParams.maxPrice);
      }
    }

    // Quantity range filters
    if (queryParams.minQuantity !== undefined || queryParams.maxQuantity !== undefined) {
      filter.quantity = {};
      if (queryParams.minQuantity !== undefined && queryParams.minQuantity !== '') {
        filter.quantity.$gte = Number(queryParams.minQuantity);
      }
      if (queryParams.maxQuantity !== undefined && queryParams.maxQuantity !== '') {
        filter.quantity.$lte = Number(queryParams.maxQuantity);
      }
    }

    // Keyword search
    if (queryParams.search) {
      const searchRegex = new RegExp(queryParams.search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { 'location.city': searchRegex },
      ];
    }

    return filter;
  },

  /**
   * Determine sort options for Mongoose query
   */
  buildSort(sortOption) {
    switch (sortOption) {
      case 'price_low':
        return { price: 1, createdAt: -1 };
      case 'price_high':
        return { price: -1, createdAt: -1 };
      case 'quantity_high':
      case 'volume':
        return { quantity: -1 };
      case 'carbon_saving':
        return { estimatedCarbonAvoided: -1 };
      case 'oldest':
        return { createdAt: 1 };
      case 'newest':
      default:
        return { createdAt: -1 };
    }
  },
};
