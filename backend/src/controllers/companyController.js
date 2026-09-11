import Company from '../models/Company.js';
import Material from '../models/Material.js';
import Transaction from '../models/Transaction.js';

/**
 * @desc    Get company details by ID
 * @route   GET /api/companies/:id
 * @access  Public
 */
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update company profile
 * @route   PUT /api/companies/:id
 * @access  Private (Company Admin or Platform Admin)
 */
export const updateCompany = async (req, res, next) => {
  try {
    const companyId = req.params.id;

    // Check authorization: User must belong to this company and be admin, or be global admin
    const userCompanyId = req.user.company?._id?.toString() || req.user.company?.toString();
    const isAuthorized =
      req.user.role === 'admin' ||
      (userCompanyId === companyId && ['company_admin', 'admin'].includes(req.user.role));

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this company profile',
      });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    const allowedFields = [
      'name',
      'description',
      'industry',
      'businessType',
      'email',
      'phone',
      'website',
      'logo',
      'location',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    });

    const updatedCompany = await company.save();

    return res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all materials listed by a company
 * @route   GET /api/companies/:id/materials
 * @access  Public
 */
export const getCompanyMaterials = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { company: req.params.id };

    if (status) {
      filter.status = status;
    }

    const materials = await Material.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all transactions where company is buyer or seller
 * @route   GET /api/companies/:id/transactions
 * @access  Private (Company members or Platform Admin)
 */
export const getCompanyTransactions = async (req, res, next) => {
  try {
    const companyId = req.params.id;

    // Check authorization
    const userCompanyId = req.user.company?._id?.toString() || req.user.company?.toString();
    if (req.user.role !== 'admin' && userCompanyId !== companyId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view transactions for another company',
      });
    }

    const transactions = await Transaction.find({
      $or: [{ buyerCompany: companyId }, { sellerCompany: companyId }],
    })
      .populate('material', 'name category unit price condition')
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

/**
 * @desc    Get aggregated statistical metrics for a company
 * @route   GET /api/companies/:id/stats
 * @access  Public
 */
export const getCompanyStats = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    // Aggregate materials listed
    const materials = await Material.find({ company: companyId });
    const activeMaterials = materials.filter((m) => m.status === 'active');
    const totalVolumeListed = materials.reduce((acc, m) => acc + (m.quantity || 0), 0);

    // Aggregate transactions
    const transactions = await Transaction.find({
      $or: [{ buyerCompany: companyId }, { sellerCompany: companyId }],
    });

    const completedTx = transactions.filter((t) =>
      ['delivered', 'verified'].includes(t.status)
    );

    const dynamicWasteDiverted = completedTx.reduce(
      (acc, t) => acc + (t.quantity || 0),
      0
    );
    const dynamicCarbonAvoided = completedTx.reduce(
      (acc, t) => acc + (t.estimatedTotalCarbonAvoided || 0),
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        companyId: company._id,
        name: company.name,
        circularityScore: company.circularityScore,
        verificationStatus: company.verificationStatus,
        rating: company.rating,
        materials: {
          total: materials.length,
          active: activeMaterials.length,
          totalVolumeListedKg: totalVolumeListed,
        },
        transactions: {
          total: transactions.length,
          completed: completedTx.length,
          pending: transactions.filter((t) => t.status === 'pending').length,
        },
        impact: {
          totalWasteDivertedKg: Math.max(company.totalWasteDiverted, dynamicWasteDiverted),
          totalCarbonAvoidedTonnes: Number(
            Math.max(company.totalCarbonAvoided, dynamicCarbonAvoided / 1000).toFixed(2)
          ),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
