import express from 'express';
import {
  getCompanyById,
  updateCompany,
  getCompanyMaterials,
  getCompanyTransactions,
  getCompanyStats,
} from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', getCompanyById);
router.put('/:id', protect, updateCompany);
router.get('/:id/materials', getCompanyMaterials);
router.get('/:id/transactions', protect, getCompanyTransactions);
router.get('/:id/stats', getCompanyStats);

export default router;
