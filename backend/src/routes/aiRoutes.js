import express from 'express';
import {
  getAiStatus,
  listingAssist,
  naturalLanguageSearch,
  circularAdvisor,
  matchExplanation,
  opportunityAnalysis,
} from '../controllers/aiController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply optional authentication so user context is attached when available
router.use(optionalProtect);

// AI Health & Configuration status
router.get('/status', getAiStatus);

// AI Listing Assistant
router.post('/listing-assist', listingAssist);

// Natural Language Marketplace Search -> Structured Filters
router.post('/search', naturalLanguageSearch);

// Circular AI Advisor Copilot
router.post('/advisor', circularAdvisor);

// Deterministic Match Natural Language Explanation
router.post('/match-explanation', matchExplanation);

// Material Lot Circular Opportunity Analysis
router.post('/opportunity-analysis', opportunityAnalysis);

export default router;
