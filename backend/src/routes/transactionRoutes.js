import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  getCompanyTransactions,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTransaction);
router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransactionById);
router.patch('/:id/status', protect, updateTransactionStatus);
router.get('/company/:companyId', protect, getCompanyTransactions);

export default router;
