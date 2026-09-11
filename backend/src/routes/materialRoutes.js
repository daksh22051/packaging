import express from 'express';
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  updateMaterialStatus,
  getMaterialsByCompany,
} from '../controllers/materialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMaterials);
router.get('/:id', getMaterialById);
router.post('/', protect, createMaterial);
router.put('/:id', protect, updateMaterial);
router.delete('/:id', protect, deleteMaterial);
router.patch('/:id/status', protect, updateMaterialStatus);
router.get('/company/:companyId', getMaterialsByCompany);

export default router;
