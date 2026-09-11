import User from '../models/User.js';
import Company from '../models/Company.js';
import { generateToken } from '../utils/generateToken.js';

/**
 * @desc    Register a new user & create their company
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      companyName,
      industry,
      businessType,
      location,
      role,
    } = req.body;

    // Input validation
    if (!name || !email || !password || !companyName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and company name',
        errors: [
          !name && { field: 'name', message: 'Name is required' },
          !email && { field: 'email', message: 'Email is required' },
          !password && { field: 'password', message: 'Password is required' },
          !companyName && { field: 'companyName', message: 'Company name is required' },
        ].filter(Boolean),
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Step 1: Create Company
    const company = await Company.create({
      name: companyName.trim(),
      industry: industry || 'Packaging & Manufacturing',
      businessType: businessType || 'Manufacturer',
      email: email.toLowerCase(),
      phone: phone || '',
      location: location || {
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
        latitude: 23.0225,
        longitude: 72.5714,
      },
      verificationStatus: 'pending',
      circularityScore: 75,
    });

    // Step 2: Create User linked to the newly created Company
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: role || 'company_admin',
      company: company._id,
      isVerified: false,
    });

    // Generate JWT
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Account and Company created.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        company: {
          id: company._id,
          name: company.name,
          industry: company.industry,
          businessType: company.businessType,
          location: company.location,
          circularityScore: company.circularityScore,
          verificationStatus: company.verificationStatus,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user with password selected explicitly
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('company');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
        company: user.company || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user & company profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('company');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
        company: user.company,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user / clear token on client side
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};
