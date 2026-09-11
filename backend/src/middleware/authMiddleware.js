import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - Verifies JWT from Authorization Bearer header
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'circula_default_jwt_secret_key_2026';
      const decoded = jwt.verify(token, secret);

      // Fetch user and populate company details (excluding password)
      const user = await User.findById(decoded.id).populate('company');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token verification failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }
};

/**
 * Grant access to specific roles
 * @param  {...string} roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this route`,
      });
    }
    next();
  };
};

/**
 * Ensure user belongs to the company or is platform admin
 */
export const requireCompanyMember = (req, res, next) => {
  const companyId = req.params.companyId || req.body.companyId;

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role === 'admin') {
    return next();
  }

  if (!req.user.company || req.user.company._id.toString() !== companyId?.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to perform actions for this company',
    });
  }

  next();
};

/**
 * Optional Protect - Populates req.user if valid token provided, but doesn't block if absent
 */
export const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'circula_default_jwt_secret_key_2026';
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.id).populate('company');
      if (user) {
        req.user = user;
      }
    } catch {
      // Ignore token verification errors for optional protect
    }
  }
  next();
};
