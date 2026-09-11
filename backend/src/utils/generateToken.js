import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token for user authentication
 * @param {string} id - The MongoDB user ObjectId
 * @returns {string} Signed JWT token
 */
export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'circula_default_jwt_secret_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: '7d',
  });
};
