import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getCompanyUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.get('/company/:companyId', protect, getCompanyUsers);

export default router;
