import User from '../models/User.js';

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('company', 'name industry businessType location circularityScore verificationStatus');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/:id
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    // Only allow self or admin to edit
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update another user’s profile',
      });
    }

    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users belonging to a company
 * @route   GET /api/users/company/:companyId
 * @access  Private
 */
export const getCompanyUsers = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const users = await User.find({ company: companyId });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
