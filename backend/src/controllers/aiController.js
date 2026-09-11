import { aiService } from '../services/aiService.js';
import { geminiService } from '../services/geminiService.js';

/**
 * Controller for CIRCULA AI Intelligence Endpoints
 */

// GET /api/ai/status
export const getAiStatus = async (req, res) => {
  try {
    const isConfigured = geminiService.isConfigured();
    const model = geminiService.getModelName();

    res.status(200).json({
      success: true,
      data: {
        configured: isConfigured,
        model,
        mode: isConfigured ? 'gemini_cloud_connected' : 'deterministic_fallback_ready',
        version: 'CIRCULA AI v2.4',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// POST /api/ai/listing-assist
export const listingAssist = async (req, res) => {
  try {
    const { text, currentValues } = req.body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide material text description in the "text" field.',
      });
    }

    const result = await aiService.generateListingAssist({
      text: text.trim(),
      currentValues: currentValues || {},
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('[AI Controller] listingAssist error:', err);
    res.status(500).json({
      success: false,
      error: 'Listing assistant error: ' + err.message,
    });
  }
};

// POST /api/ai/search
export const naturalLanguageSearch = async (req, res) => {
  try {
    const { query, userLocation } = req.body || {};

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required in the "query" field.',
      });
    }

    const result = await aiService.interpretNaturalLanguageSearch({
      query: query.trim(),
      userLocation: userLocation || null,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('[AI Controller] search error:', err);
    res.status(500).json({
      success: false,
      error: 'Natural language search interpretation error: ' + err.message,
    });
  }
};

// POST /api/ai/advisor
export const circularAdvisor = async (req, res) => {
  try {
    const { query, context } = req.body || {};

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Question or query is required in the "query" field.',
      });
    }

    const user = req.user || null;

    const result = await aiService.askCircularAdvisor({
      query: query.trim(),
      context: context || {},
      user,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('[AI Controller] advisor error:', err);
    res.status(500).json({
      success: false,
      error: 'Circular AI advisor error: ' + err.message,
    });
  }
};

// POST /api/ai/match-explanation
export const matchExplanation = async (req, res) => {
  try {
    const { match } = req.body || {};

    if (!match) {
      return res.status(400).json({
        success: false,
        error: 'Match payload is required in the "match" field.',
      });
    }

    const result = await aiService.explainMatch({ match });
    res.status(200).json(result);
  } catch (err) {
    console.error('[AI Controller] matchExplanation error:', err);
    res.status(500).json({
      success: false,
      error: 'Match explanation error: ' + err.message,
    });
  }
};

// POST /api/ai/opportunity-analysis
export const opportunityAnalysis = async (req, res) => {
  try {
    const { material, company } = req.body || {};

    if (!material) {
      return res.status(400).json({
        success: false,
        error: 'Material payload is required in the "material" field.',
      });
    }

    const result = await aiService.analyzeOpportunity({
      material,
      company: company || req.user?.company || null,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('[AI Controller] opportunityAnalysis error:', err);
    res.status(500).json({
      success: false,
      error: 'Opportunity analysis error: ' + err.message,
    });
  }
};
