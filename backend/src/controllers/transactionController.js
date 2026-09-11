import Transaction from '../models/Transaction.js';
import Material from '../models/Material.js';
import Company from '../models/Company.js';
import { transactionService } from '../services/transactionService.js';
import { materialService } from '../services/materialService.js';

/**
 * @desc    Create a new transaction (order/exchange)
 * @route   POST /api/transactions
 * @access  Private (Authenticated Buyers/Companies)
 */
export const createTransaction = async (req, res, next) => {
  try {
    const {
      materialId,
      quantity,
      pickupLocation,
      destinationLocation,
      customTransportCost,
    } = req.body;

    // Validate inputs
    if (!materialId || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid material ID and positive quantity are required',
      });
    }

    const material = await Material.findById(materialId).populate('company');
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material listing not found',
      });
    }

    if (material.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Material is currently '${material.status}' and cannot be ordered`,
      });
    }

    const requestedQty = Number(quantity);
    if (requestedQty > material.quantity) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${requestedQty} ${material.unit}) exceeds available stock (${material.quantity} ${material.unit})`,
      });
    }

    const buyerCompanyId = req.user.company?._id || req.user.company;
    if (!buyerCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'You must belong to a registered company to initiate a transaction',
      });
    }

    // Prevent ordering from own company
    const sellerCompanyId = material.company?._id?.toString() || material.company?.toString();
    if (sellerCompanyId && sellerCompanyId === buyerCompanyId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot place an order for materials listed by your own company',
      });
    }

    // Determine locations & transit distance
    const origin = pickupLocation || material.location;
    const dest = destinationLocation || req.user.company.location || {
      city: 'Ahmedabad',
      latitude: 23.0225,
      longitude: 72.5714,
    };

    const distance = transactionService.calculateDistance(
      origin.latitude,
      origin.longitude,
      dest.latitude,
      dest.longitude
    );

    // Calculate Costs
    const materialCost = Number((material.price * requestedQty).toFixed(2));
    const transportCost =
      customTransportCost !== undefined
        ? Number(customTransportCost)
        : Number(Math.max(500, distance * 22).toFixed(2));
    const totalCost = Number((materialCost + transportCost).toFixed(2));

    // Calculate Environmental Metrics
    const transportCarbonKg = transactionService.calculateTransportCarbon(requestedQty, distance);
    const materialImpact = materialService.calculateImpact(material.category, requestedQty);
    const estimatedTotalCarbonAvoided = Number(
      Math.max(0.01, (materialImpact.estimatedCarbonAvoided * 1000 - transportCarbonKg) / 1000).toFixed(2)
    );

    // Generate readable order number
    const orderNumber = await transactionService.generateOrderNumber();

    // Create Transaction
    const transaction = await Transaction.create({
      orderNumber,
      buyer: req.user._id,
      buyerCompany: buyerCompanyId,
      seller: material.supplier,
      sellerCompany: material.company._id,
      material: material._id,
      quantity: requestedQty,
      materialCost,
      transportCost,
      totalCost,
      currency: material.currency || 'INR',
      status: 'pending',
      pickupLocation: origin,
      destinationLocation: dest,
      distance,
      estimatedTransportCarbon: transportCarbonKg,
      estimatedTotalCarbonAvoided,
    });

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('material', 'name category unit price condition images')
      .populate('buyerCompany', 'name location email phone')
      .populate('sellerCompany', 'name location email phone')
      .populate('buyer', 'name email')
      .populate('seller', 'name email');

    return res.status(201).json({
      success: true,
      message: `Transaction ${orderNumber} created successfully`,
      data: populatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all transactions (filtered by caller's company context or admin)
 * @route   GET /api/transactions
 * @access  Private
 */
export const getTransactions = async (req, res, next) => {
  try {
    const filter = {};

    // If not global admin, restrict to caller's company
    if (req.user.role !== 'admin') {
      const userCompanyId = req.user.company?._id || req.user.company;
      filter.$or = [{ buyerCompany: userCompanyId }, { sellerCompany: userCompanyId }];
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const skip = (page - 1) * limit;

    const [transactions, totalCount] = await Promise.all([
      Transaction.find(filter)
        .populate('material', 'name category unit price condition images')
        .populate('buyerCompany', 'name location circularityScore')
        .populate('sellerCompany', 'name location circularityScore')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get transaction by ID
 * @route   GET /api/transactions/:id
 * @access  Private
 */
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('material')
      .populate('buyerCompany')
      .populate('sellerCompany')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Verify caller is party to this transaction or admin
    const userCompanyId = (req.user.company?._id || req.user.company)?.toString();
    const isParty =
      req.user.role === 'admin' ||
      transaction.buyerCompany._id.toString() === userCompanyId ||
      transaction.sellerCompany._id.toString() === userCompanyId;

    if (!isParty) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this transaction',
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update transaction status (e.g., confirmed, in_transit, delivered, cancelled)
 * @route   PATCH /api/transactions/:id/status
 * @access  Private
 */
export const updateTransactionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      'pending',
      'confirmed',
      'pickup_scheduled',
      'in_transit',
      'delivered',
      'verified',
      'cancelled',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Verify caller permission
    const userCompanyId = (req.user.company?._id || req.user.company)?.toString();
    const isParty =
      req.user.role === 'admin' ||
      transaction.buyerCompany.toString() === userCompanyId ||
      transaction.sellerCompany.toString() === userCompanyId;

    if (!isParty) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this transaction',
      });
    }

    // Apply state transitions and inventory updates
    const updatedTx = await transactionService.handleStatusTransition(transaction, status);

    const populatedTx = await Transaction.findById(updatedTx._id)
      .populate('material', 'name category unit price condition')
      .populate('buyerCompany', 'name location')
      .populate('sellerCompany', 'name location');

    return res.status(200).json({
      success: true,
      message: `Transaction ${transaction.orderNumber} status updated to '${status}'`,
      data: populatedTx,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get transactions for a specific company
 * @route   GET /api/transactions/company/:companyId
 * @access  Private
 */
export const getCompanyTransactions = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const transactions = await Transaction.find({
      $or: [{ buyerCompany: companyId }, { sellerCompany: companyId }],
    })
      .populate('material', 'name category unit price condition images')
      .populate('buyerCompany', 'name location')
      .populate('sellerCompany', 'name location')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};
