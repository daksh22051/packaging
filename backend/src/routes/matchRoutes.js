import express from 'express';
import { getMatches } from '../controllers/matchController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/matches - Retrieve matches using query parameters
router.get('/', optionalProtect, getMatches);

// POST /api/matches - Retrieve matches using complex JSON body payload
router.post('/', optionalProtect, getMatches);

export default router;
