import Material from '../models/Material.js';
import { materialService } from '../services/materialService.js';

/**
 * @desc    Get all materials with filtering, search & sorting
 * @route   GET /api/materials
 * @access  Public
 */
export const getMaterials = async (req, res, next) => {
  try {
    const filter = materialService.buildFilter(req.query);
    const sort = materialService.buildSort(req.query.sort);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const [materials, totalCount] = await Promise.all([
      Material.find(filter)
        .populate('company', 'name location circularityScore verificationStatus rating logo')
        .populate('supplier', 'name email phone')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Material.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: materials.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single material by ID
 * @route   GET /api/materials/:id
 * @access  Public
 */
export const getMaterialById = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('company', 'name location email phone circularityScore verificationStatus rating logo')
      .populate('supplier', 'name email phone avatar');

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new material listing
 * @route   POST /api/materials
 * @access  Private (Authenticated Users)
 */
export const createMaterial = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      quantity,
      unit,
      price,
      currency,
      condition,
      grade,
      dimensions,
      weight,
      recyclability,
      transactionType,
      location,
      images,
      tags,
    } = req.body;

    // Validate required fields
    if (!name || !category || quantity === undefined || !condition || !transactionType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, category, quantity, condition, transactionType',
      });
    }

    const companyId = req.user.company?._id || req.user.company;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'User must belong to a registered company to list materials',
      });
    }

    // Normalize transactionType and category to match schema enums
    let normalizedType = (transactionType || 'sell').toLowerCase().trim().replace(/\s+/g, '_');
    if (normalizedType === 'purchase' || normalizedType === 'buy') normalizedType = 'sell';

    let normalizedCategory = (category || 'other').toLowerCase().trim();
    if (normalizedCategory === 'pallets') normalizedCategory = 'pallet';

    // Auto calculate environmental impact metrics
    const impact = materialService.calculateImpact(normalizedCategory, quantity);

    // Create material object with server-enforced identity
    const material = await Material.create({
      supplier: req.user._id,
      company: companyId,
      name: name.trim(),
      category: normalizedCategory,
      description: description || '',
      quantity: Number(quantity),
      unit: unit || 'kg',
      price: Number(price || 0),
      currency: currency || 'INR',
      condition: condition.toLowerCase(),
      grade: grade || 'Commercial Grade A',
      dimensions: dimensions || '',
      weight: weight ? Number(weight) : 0,
      recyclability: recyclability !== undefined ? Number(recyclability) : 100,
      transactionType: normalizedType,
      location: location || req.user.company?.location || {
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
        latitude: 23.0225,
        longitude: 72.5714,
      },
      images: Array.isArray(images) ? images : [],
      tags: Array.isArray(tags) ? tags : [],
      status: 'active',
      estimatedCarbonAvoided: impact.estimatedCarbonAvoided,
      estimatedWasteDiverted: impact.estimatedWasteDiverted,
      estimatedVirginMaterialAvoided: impact.estimatedVirginMaterialAvoided,
    });

    const populatedMaterial = await Material.findById(material._id)
      .populate('company', 'name location circularityScore verificationStatus')
      .populate('supplier', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Material listed successfully',
      data: populatedMaterial,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update material listing
 * @route   PUT /api/materials/:id
 * @access  Private (Owner Company or Platform Admin)
 */
export const updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    // Verify ownership
    const userCompanyId = req.user.company?._id?.toString() || req.user.company?.toString();
    const isOwner =
      req.user.role === 'admin' ||
      material.supplier.toString() === req.user._id.toString() ||
      material.company.toString() === userCompanyId;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this material',
      });
    }

    const updatableFields = [
      'name',
      'category',
      'description',
      'quantity',
      'unit',
      'price',
      'currency',
      'condition',
      'grade',
      'dimensions',
      'weight',
      'recyclability',
      'transactionType',
      'location',
      'images',
      'tags',
      'status',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        material[field] = req.body[field];
      }
    });

    // Recalculate impact if quantity or category updated
    if (req.body.quantity !== undefined || req.body.category !== undefined) {
      const impact = materialService.calculateImpact(material.category, material.quantity);
      material.estimatedCarbonAvoided = impact.estimatedCarbonAvoided;
      material.estimatedWasteDiverted = impact.estimatedWasteDiverted;
      material.estimatedVirginMaterialAvoided = impact.estimatedVirginMaterialAvoided;
    }

    const updatedMaterial = await material.save();

    return res.status(200).json({
      success: true,
      message: 'Material updated successfully',
      data: updatedMaterial,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete material listing
 * @route   DELETE /api/materials/:id
 * @access  Private (Owner Company or Platform Admin)
 */
export const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    // Verify ownership
    const userCompanyId = req.user.company?._id?.toString() || req.user.company?.toString();
    const isOwner =
      req.user.role === 'admin' ||
      material.supplier.toString() === req.user._id.toString() ||
      material.company.toString() === userCompanyId;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this material',
      });
    }

    await Material.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick status change (active, reserved, sold, expired, draft)
 * @route   PATCH /api/materials/:id/status
 * @access  Private
 */
export const updateMaterialStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['active', 'reserved', 'sold', 'expired', 'draft'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    // Ownership check
    const userCompanyId = req.user.company?._id?.toString() || req.user.company?.toString();
    const isOwner =
      req.user.role === 'admin' || material.company.toString() === userCompanyId;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change status for this material',
      });
    }

    material.status = status;
    await material.save();

    return res.status(200).json({
      success: true,
      message: `Material status updated to ${status}`,
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get materials for a company
 * @route   GET /api/materials/company/:companyId
 * @access  Public
 */
export const getMaterialsByCompany = async (req, res, next) => {
  try {
    const materials = await Material.find({ company: req.params.companyId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};
