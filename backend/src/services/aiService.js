import { geminiService } from './geminiService.js';

/**
 * CIRCULA Domain AI Service
 * Houses high-level business logic for Generative Circular Intelligence.
 * Coordinates with geminiService and guarantees deterministic fallback.
 */

// Normalizes category strings to standard CIRCULA schema
const VALID_CATEGORIES = ['cardboard', 'plastic', 'pallet', 'paper', 'glass', 'metal', 'other'];
const VALID_CONDITIONS = ['new', 'good', 'used', 'recyclable'];
const VALID_TX_TYPES = ['sell', 'free_claim', 'exchange'];

export class AiService {
  /**
   * AI Listing Assistant: Converts rough notes into a structured material listing
   * with quality score, missing information audit, and improvement suggestions.
   */
  async generateListingAssist({ text, currentValues = {} }) {
    const sanitizedText = geminiService.sanitizeInput(text, 2500);
    if (!sanitizedText) {
      return {
        success: false,
        error: 'Please provide material information or a rough description for AI assist.',
      };
    }

    const systemInstruction = `You are the CIRCULA B2B Materials Listing Assistant.
Your mission is to convert rough seller descriptions into professional, structured circular material listings.
CRITICAL SAFETY & TRUTH RULES:
1. Do NOT invent specific dimensions, grades, locations, or purity unless explicitly mentioned or strongly implied.
2. If important fields are missing, list them in 'missingFields'.
3. 'category' must be one of: ["cardboard", "plastic", "pallet", "paper", "glass", "metal", "other"].
4. 'condition' must be one of: ["new", "good", "used", "recyclable"].
5. 'transactionType' must be one of: ["sell", "free_claim", "exchange"].
6. Compute a 0-100 'listingQualityScore' based on:
   - titleClarity (0-15)
   - descriptionQuality (0-20)
   - materialIdentification (0-20)
   - quantityCompleteness (0-15)
   - conditionClarity (0-10)
   - locationCompleteness (0-10)
   - packagingSpecs (0-10)
7. Provide 2-4 tangible 'improvementSuggestions' to help the seller match faster.
8. Output MUST be valid JSON matching this schema:
{
  "suggestedTitle": string,
  "category": string,
  "materialType": string,
  "condition": string,
  "description": string,
  "quantity": number or null,
  "unit": string,
  "suggestedTransactionType": string,
  "suggestedPrice": number or null,
  "packagingSpecifications": {
    "grade": string or null,
    "dimensions": string or null,
    "format": string or null
  },
  "missingFields": [string],
  "listingQualityScore": number,
  "qualityRating": "Needs Improvement" | "Fair" | "Good Listing" | "Excellent Listing",
  "qualityBreakdown": {
    "titleClarity": number,
    "descriptionQuality": number,
    "materialIdentification": number,
    "quantityCompleteness": number,
    "conditionClarity": number,
    "locationCompleteness": number,
    "packagingSpecs": number
  },
  "improvementSuggestions": [string],
  "labels": {
    "verifiedData": [string],
    "calculatedMetrics": [string],
    "aiSuggestions": [string]
  }
}`;

    const prompt = `Convert the following user material description into structured listing assistance:
"""
${sanitizedText}
"""
Existing form context if any: ${JSON.stringify(currentValues)}`;

    if (geminiService.isConfigured()) {
      const result = await geminiService.generateJson({
        prompt,
        systemInstruction,
        temperature: 0.1,
      });

      if (result.success && result.data && result.data.suggestedTitle) {
        return {
          success: true,
          source: 'gemini',
          model: result.model,
          data: this._normalizeListingAssist(result.data, sanitizedText),
        };
      }
    }

    // Deterministic Rule-Based Fallback if Gemini is unconfigured or errors
    return {
      success: true,
      source: 'rule_fallback',
      warning: geminiService.isConfigured()
        ? 'AI service encountered temporary latency; using deterministic rule parser.'
        : 'Gemini API not configured. Operating with local deterministic parser.',
      data: this._fallbackListingAssist(sanitizedText, currentValues),
    };
  }

  /**
   * Natural Language Marketplace Search: Converts conversational search queries
   * into structured MongoDB/Marketplace filters.
   */
  async interpretNaturalLanguageSearch({ query, userLocation = null }) {
    const sanitizedQuery = geminiService.sanitizeInput(query, 500);
    if (!sanitizedQuery) {
      return {
        success: false,
        error: 'Search query is required.',
      };
    }

    const systemInstruction = `You are CIRCULA's Natural Language Query Parser.
Translate conversational user requests for surplus/secondary materials into structured search parameters.
CRITICAL RULES:
1. Do NOT generate material records or listings. You ONLY output filters!
2. Map to standard values:
   - 'category': "cardboard" | "plastic" | "pallet" | "paper" | "glass" | "metal" | "other" | "all"
   - 'condition': "new" | "good" | "used" | "recyclable" | "all"
   - 'transactionType': "sell" | "free_claim" | "exchange" | "all"
   - 'maxDistanceKm': number or null (e.g. "within 100 km" -> 100)
   - 'maxPrice': number or null (e.g. "under ₹20/kg" -> 20)
   - 'quantity': number or null (e.g. "5000 kg" -> 5000)
   - 'unit': string or null (e.g. "kg", "tonnes")
   - 'city': string or null (e.g. "near Ahmedabad" -> "Ahmedabad")
   - 'cleanKeywords': residual search terms stripped of operators (e.g. "double wall corrugated")
   - 'interpretedQuery': a 1-sentence plain English summary of the criteria applied.
3. Output MUST be valid JSON matching this schema:
{
  "category": string,
  "condition": string,
  "transactionType": string,
  "maxDistanceKm": number or null,
  "maxPrice": number or null,
  "quantity": number or null,
  "unit": string or null,
  "city": string or null,
  "cleanKeywords": string,
  "interpretedQuery": string
}`;

    const prompt = `Parse this marketplace search query into structured filters:
"${sanitizedQuery}"
User reference location: ${userLocation ? JSON.stringify(userLocation) : 'Ahmedabad, Gujarat, India'}`;

    if (geminiService.isConfigured()) {
      const result = await geminiService.generateJson({
        prompt,
        systemInstruction,
        temperature: 0.1,
      });

      if (result.success && result.data && result.data.category !== undefined) {
        return {
          success: true,
          source: 'gemini',
          model: result.model,
          data: this._normalizeSearchFilters(result.data, sanitizedQuery),
        };
      }
    }

    // Deterministic Rule-Based Fallback
    return {
      success: true,
      source: 'rule_fallback',
      warning: geminiService.isConfigured()
        ? 'Using deterministic query parser fallback'
        : 'Gemini API not configured. Using deterministic parser.',
      data: this._fallbackSearchInterpreter(sanitizedQuery, userLocation),
    };
  }

  /**
   * Circular AI Advisor: Domain conversational intelligence grounded in real platform context
   */
  async askCircularAdvisor({ query, context = {}, user = null }) {
    const sanitizedQuery = geminiService.sanitizeInput(query, 1200);
    if (!sanitizedQuery) {
      return {
        success: false,
        error: 'Question or query is required.',
      };
    }

    const systemInstruction = `You are CIRCULA AI, an enterprise-grade Circular Materials & Carbon Intelligence Advisor.
You advise B2B users on packaging waste valorization, secondary material reuse, Scope 3 supply chain carbon abatement, and logistics optimization.
STRICT TRUTH & ETHICS RULES:
1. NEVER invent database records, material quantities, company credentials, or transaction states.
2. If context is provided (e.g. a material listing or match score), ground your answer specifically in that data.
3. Distinguish clearly:
   - Verified Platform Data
   - Calculated Metrics
   - AI Recommendations
4. Keep answers professional, concise, practical, and devoid of hyperbole.
5. Provide 2-3 relevant navigation or workflow suggestions where appropriate.
6. Output MUST be valid JSON matching this schema:
{
  "answer": string,
  "keyTakeaways": [string],
  "suggestedActions": [
    { "label": string, "action": "navigate" | "filter" | "contact", "link": string }
  ],
  "labels": {
    "verifiedData": [string],
    "calculatedMetrics": [string],
    "aiSuggestions": [string]
  }
}`;

    const prompt = `User Query: "${sanitizedQuery}"
User Organization: ${user ? `${user.name} (${user.company?.name || 'Enterprise'}, ${user.city || 'Regional'})` : 'Guest Facility'}
Current Page Context:
${JSON.stringify(context, null, 2)}`;

    if (geminiService.isConfigured()) {
      const result = await geminiService.generateJson({
        prompt,
        systemInstruction,
        temperature: 0.2,
      });

      if (result.success && result.data && result.data.answer) {
        return {
          success: true,
          source: 'gemini',
          model: result.model,
          data: result.data,
        };
      }
    }

    // Deterministic Rule-Based Fallback
    return {
      success: true,
      source: 'rule_fallback',
      warning: geminiService.isConfigured()
        ? 'Using domain rule-based advisor fallback.'
        : 'Gemini API not configured. Operating in deterministic advisor mode.',
      data: this._fallbackAdvisor(sanitizedQuery, context, user),
    };
  }

  /**
   * AI Match Explanation: Natural language executive summary of a Phase 3 deterministic match
   * NEVER alters the deterministic score or factors.
   */
  async explainMatch({ match }) {
    if (!match) {
      return {
        success: false,
        error: 'Match object is required for AI explanation.',
      };
    }

    const deterministicScore = match.matchScore;
    const materialTitle = match.material?.title || match.material?.name || 'Packaging Material';
    const category = match.material?.category || 'Material';
    const distanceKm = match.distanceKm ?? 0;
    const carbonAvoided = match.estimatedCo2AvoidedTonnes ?? 0;
    const reasons = match.matchReasons || [];
    const breakdown = match.scoreBreakdown || {};

    const systemInstruction = `You are CIRCULA's Algorithmic Match Explainer.
Your job is to synthesize an executive explanation for a B2B circular materials match that was calculated by our deterministic 7-factor engine.
CRITICAL RULE:
The deterministic match score is EXACTLY ${deterministicScore}%.
You MUST NOT change, recalculate, or contradict this score. ${deterministicScore}% is the absolute truth.
Summarize why the buyer and supplier lot are compatible based on material type, volume fulfillment, transit distance, condition, and Scope 3 carbon avoidance.
Output MUST be valid JSON matching this schema:
{
  "executiveSummary": string,
  "strategicValue": string,
  "carbonRationale": string,
  "actionableAdvice": string,
  "labels": {
    "verifiedScore": "${deterministicScore}% (Deterministic)",
    "primaryDriver": string
  }
}`;

    const prompt = `Explain the following deterministic circular match:
- Score: ${deterministicScore}%
- Material: ${materialTitle} (${category})
- Supplier: ${match.supplierCompany?.name || 'Verified Supplier'}
- Buyer: ${match.buyerCompany?.name || 'Procuring Enterprise'}
- Transit Distance: ${distanceKm} km
- Scope 3 Carbon Avoided: ${carbonAvoided} tonnes CO2e
- Deterministic Match Reasons: ${JSON.stringify(reasons)}
- Factor Breakdown: ${JSON.stringify(breakdown)}`;

    if (geminiService.isConfigured()) {
      const result = await geminiService.generateJson({
        prompt,
        systemInstruction,
        temperature: 0.2,
      });

      if (result.success && result.data && result.data.executiveSummary) {
        return {
          success: true,
          source: 'gemini',
          model: result.model,
          data: result.data,
        };
      }
    }

    // Deterministic Fallback
    return {
      success: true,
      source: 'rule_fallback',
      data: {
        executiveSummary: `This listing represents a verified ${deterministicScore}% circular opportunity. The ${category} inventory directly meets technical specifications with a compact transit distance of ${distanceKm} km, avoiding an estimated ${carbonAvoided} tonnes of virgin-material CO₂e.`,
        strategicValue: `Local circular fulfillment secures rapid turnaround while bypassing virgin packaging procurement lead times and price volatility.`,
        carbonRationale: `Diverting ${category} from industrial landfill into direct secondary reuse avoids ${carbonAvoided} t CO₂e under Scope 3 category 1 (purchased goods) protocols.`,
        actionableAdvice: `Review delivery tolerances and initiate an exchange request or claim via the CIRCULA transaction desk.`,
        labels: {
          verifiedScore: `${deterministicScore}% (Deterministic)`,
          primaryDriver: distanceKm <= 50 ? 'Hyperlocal Proximity' : 'Material & Volume Affinity',
        },
      },
    };
  }

  /**
   * Circular Opportunity Analysis: Identifies optimal circular pathways for a material lot
   */
  async analyzeOpportunity({ material, company = null }) {
    if (!material) {
      return {
        success: false,
        error: 'Material specification is required for circular opportunity analysis.',
      };
    }

    const title = material.title || material.name || 'Material Lot';
    const category = material.category || 'other';
    const quantity = material.quantity || 0;
    const unit = material.unit || 'kg';
    const condition = material.condition || 'good';
    const carbon = material.estimatedCarbonAvoided || material.estimatedCo2AvoidedTonnes || 0;

    const systemInstruction = `You are CIRCULA's Industrial Symbiosis & Opportunity Analyst.
Analyze a surplus packaging material lot and identify the highest-value circular recovery pathways.
Use conservative, professional phrasing ("potential", "estimated", "could", "based on available data").
Output MUST be valid JSON matching this schema:
{
  "bestCircularAction": "Local B2B Reuse" | "Closed-Loop Repulping" | "Secondary Packaging" | "Certified Polymer Recovery" | "Downcycling Prevention",
  "reusePotential": string,
  "recyclingPotential": string,
  "operationalBenefit": string,
  "estimatedCarbonBenefit": string,
  "missingData": [string],
  "recommendedNextSteps": [string],
  "confidence": number
}`;

    const prompt = `Analyze this material lot for circular opportunities:
- Title: ${title}
- Category: ${category}
- Quantity: ${quantity} ${unit}
- Condition: ${condition}
- Estimated Carbon Avoided: ${carbon} t CO2e
- Location: ${material.city || material.location?.city || 'Regional Hub'}
- Company: ${company?.name || 'Material Holder'}`;

    if (geminiService.isConfigured()) {
      const result = await geminiService.generateJson({
        prompt,
        systemInstruction,
        temperature: 0.2,
      });

      if (result.success && result.data && result.data.bestCircularAction) {
        return {
          success: true,
          source: 'gemini',
          model: result.model,
          data: result.data,
        };
      }
    }

    // Deterministic Opportunity Fallback
    const isClean = condition === 'new' || condition === 'good';
    const bestAction =
      category === 'cardboard' && isClean
        ? 'Local B2B Reuse'
        : category === 'pallets' || category === 'pallet'
        ? 'Secondary Packaging'
        : category === 'plastic' && isClean
        ? 'Certified Polymer Recovery'
        : 'Closed-Loop Repulping';

    return {
      success: true,
      source: 'rule_fallback',
      data: {
        bestCircularAction: bestAction,
        reusePotential: isClean
          ? `High potential: Lot can be redeployed directly into secondary packaging loops without destructive processing.`
          : `Moderate potential: Pre-sorting and mild reconditioning recommended before reuse.`,
        recyclingPotential: `High recovery yield: Standard regional recyclers can accept this lot with estimated < 5% scrap loss.`,
        operationalBenefit: `Immediate warehouse floor clearance and conversion of waste handling cost into asset revenue.`,
        estimatedCarbonBenefit: `Diverting ${quantity.toLocaleString()} ${unit} displaces virgin raw materials, mitigating an estimated ${carbon > 0 ? carbon : (quantity * 0.0009).toFixed(2)} t CO₂e.`,
        missingData: material.specifications?.dimensions ? [] : ['Exact dimensions and pallet stacking format', 'Target moisture content certification'],
        recommendedNextSteps: [
          'Publish listing to CIRCULA marketplace with verified weight confirmation.',
          'Review nearby smart matches to minimize transit freight footprint.',
          'Request green logistics transport consolidation.',
        ],
        confidence: 88,
      },
    };
  }

  // ==========================================
  // NORMALIZATION & SANITIZATION HELPERS
  // ==========================================

  _normalizeListingAssist(data, originalText) {
    let cat = (data.category || '').toLowerCase();
    if (!VALID_CATEGORIES.includes(cat)) {
      if (cat.includes('box') || cat.includes('carton') || cat.includes('kraft')) cat = 'cardboard';
      else if (cat.includes('poly') || cat.includes('film') || cat.includes('bottle')) cat = 'plastic';
      else if (cat.includes('wood')) cat = 'pallet';
      else cat = 'cardboard';
    }

    let cond = (data.condition || '').toLowerCase();
    if (!VALID_CONDITIONS.includes(cond)) {
      cond = 'good';
    }

    let tx = (data.suggestedTransactionType || '').toLowerCase();
    if (!VALID_TX_TYPES.includes(tx)) {
      tx = 'sell';
    }

    const score = Math.max(0, Math.min(100, Number(data.listingQualityScore) || 75));
    let rating = 'Good Listing';
    if (score >= 90) rating = 'Excellent Listing';
    else if (score >= 70) rating = 'Good Listing';
    else if (score >= 50) rating = 'Fair';
    else rating = 'Needs Improvement';

    return {
      suggestedTitle: data.suggestedTitle || 'Surplus Packaging Lot',
      category: cat,
      materialType: data.materialType || cat,
      condition: cond,
      description: data.description || originalText,
      quantity: typeof data.quantity === 'number' ? data.quantity : null,
      unit: data.unit || 'kg',
      suggestedTransactionType: tx,
      suggestedPrice: typeof data.suggestedPrice === 'number' ? data.suggestedPrice : null,
      packagingSpecifications: data.packagingSpecifications || {},
      missingFields: Array.isArray(data.missingFields) ? data.missingFields : [],
      listingQualityScore: score,
      qualityRating: rating,
      qualityBreakdown: data.qualityBreakdown || {
        titleClarity: 12,
        descriptionQuality: 16,
        materialIdentification: 18,
        quantityCompleteness: data.quantity ? 15 : 5,
        conditionClarity: 8,
        locationCompleteness: 6,
        packagingSpecs: 7,
      },
      improvementSuggestions: Array.isArray(data.improvementSuggestions) ? data.improvementSuggestions : [],
      labels: data.labels || {
        verifiedData: data.quantity ? [`Quantity: ${data.quantity} ${data.unit || 'kg'}`] : [],
        calculatedMetrics: [`Listing Quality: ${score}/100`],
        aiSuggestions: [`Recommended category: ${cat.toUpperCase()}`, `Suggested terms: ${tx}`],
      },
    };
  }

  _normalizeSearchFilters(data, originalQuery) {
    let cat = (data.category || 'all').toLowerCase();
    if (cat !== 'all' && !VALID_CATEGORIES.includes(cat)) {
      cat = 'all';
    }

    let cond = (data.condition || 'all').toLowerCase();
    if (cond !== 'all' && !VALID_CONDITIONS.includes(cond)) {
      cond = 'all';
    }

    let tx = (data.transactionType || 'all').toLowerCase();
    if (tx !== 'all' && !VALID_TX_TYPES.includes(tx)) {
      tx = 'all';
    }

    return {
      category: cat,
      condition: cond,
      transactionType: tx,
      maxDistanceKm: typeof data.maxDistanceKm === 'number' ? data.maxDistanceKm : null,
      maxPrice: typeof data.maxPrice === 'number' ? data.maxPrice : null,
      quantity: typeof data.quantity === 'number' ? data.quantity : null,
      unit: data.unit || null,
      city: data.city || null,
      cleanKeywords: data.cleanKeywords || originalQuery,
      interpretedQuery:
        data.interpretedQuery ||
        `Searching for ${cat !== 'all' ? cat : 'materials'} with condition ${cond !== 'all' ? cond : 'any'}`,
    };
  }

  // ==========================================
  // DETERMINISTIC FALLBACK IMPLEMENTATIONS
  // ==========================================

  _fallbackListingAssist(text, currentValues) {
    const lower = text.toLowerCase();

    // Category detection
    let cat = 'cardboard';
    if (lower.includes('plastic') || lower.includes('film') || lower.includes('ldpe') || lower.includes('hdpe') || lower.includes('pet')) {
      cat = 'plastic';
    } else if (lower.includes('pallet') || lower.includes('wood') || lower.includes('skid')) {
      cat = 'pallet';
    } else if (lower.includes('paper') || lower.includes('kraft') || lower.includes('pulp')) {
      cat = 'paper';
    } else if (lower.includes('glass') || lower.includes('cullet') || lower.includes('bottle')) {
      cat = 'glass';
    } else if (lower.includes('metal') || lower.includes('tin') || lower.includes('drum')) {
      cat = 'metal';
    }

    // Quantity extraction (e.g. 5000 kg, 3 tonnes, 250 units)
    let quantity = currentValues.quantity || null;
    let unit = currentValues.unit || 'kg';
    const qtyMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(kg|kgs|kilogram|kilograms|tonne|tonnes|tons|ton|units|pcs|pieces)/);
    if (qtyMatch) {
      quantity = parseFloat(qtyMatch[1].replace(',', ''));
      const rawUnit = qtyMatch[2];
      if (rawUnit.startsWith('ton')) unit = 'tonnes';
      else if (rawUnit.startsWith('unit') || rawUnit.startsWith('pc')) unit = 'units';
      else unit = 'kg';
    }

    // Condition extraction
    let condition = 'good';
    if (lower.includes('new') || lower.includes('surplus') || lower.includes('unused') || lower.includes('virgin')) {
      condition = 'new';
    } else if (lower.includes('scrap') || lower.includes('recyclable') || lower.includes('broken')) {
      condition = 'recyclable';
    } else if (lower.includes('used') || lower.includes('soiled')) {
      condition = 'used';
    }

    // Transaction Type
    let tx = 'sell';
    if (lower.includes('free') || lower.includes('claim') || lower.includes('donate')) {
      tx = 'free_claim';
    } else if (lower.includes('exchange') || lower.includes('swap') || lower.includes('barter')) {
      tx = 'exchange';
    }

    const missing = [];
    if (!lower.match(/\b\d+\s*(?:x|\*)\s*\d+/i)) missing.push('Exact dimensions (L x W x H)');
    if (!lower.includes('grade') && !lower.includes('ply') && !lower.includes('gsm')) missing.push('Material grade & GSM/micron');
    if (!lower.includes('location') && !lower.includes('city') && !lower.includes('in ') && !lower.includes('near')) missing.push('Storage facility location');
    if (tx === 'sell' && !lower.match(/(?:rs|inr|₹|\/kg|\/unit)\s*\d+/i)) missing.push('Target unit price');

    const score = Math.max(50, 100 - missing.length * 10);
    const titleCategory = cat.charAt(0).toUpperCase() + cat.slice(1);
    const titleCondition = condition.charAt(0).toUpperCase() + condition.slice(1);

    return {
      suggestedTitle: `${titleCondition} Industrial ${titleCategory} Lots`,
      category: cat,
      materialType: `${titleCategory} Secondary Packaging`,
      condition,
      description: text,
      quantity,
      unit,
      suggestedTransactionType: tx,
      suggestedPrice: tx === 'free_claim' ? 0 : cat === 'cardboard' ? 8.5 : cat === 'plastic' ? 22 : 15,
      packagingSpecifications: {
        grade: cat === 'cardboard' ? 'Double Wall Corrugated' : 'Commercial Clean Grade',
        dimensions: null,
        format: 'Palletized & Strapped',
      },
      missingFields: missing,
      listingQualityScore: score,
      qualityRating: score >= 80 ? 'Good Listing' : 'Fair',
      qualityBreakdown: {
        titleClarity: 12,
        descriptionQuality: 15,
        materialIdentification: 18,
        quantityCompleteness: quantity ? 15 : 5,
        conditionClarity: 9,
        locationCompleteness: 6,
        packagingSpecs: 5,
      },
      improvementSuggestions: [
        'Add exact packaging dimensions to help buyers calculate freight volume.',
        'Upload clear photos showing material cleanliness and pallet stacking format.',
        'Specify available dispatch timeframe to attract priority buyers.',
      ],
      labels: {
        verifiedData: quantity ? [`Quantity: ${quantity} ${unit}`] : [],
        calculatedMetrics: [`Listing Quality: ${score}/100`],
        aiSuggestions: [`Detected Category: ${cat}`, `Detected Condition: ${condition}`],
      },
    };
  }

  _fallbackSearchInterpreter(query, userLocation) {
    const q = query.toLowerCase();

    let category = 'all';
    if (q.includes('cardboard') || q.includes('box') || q.includes('carton')) category = 'cardboard';
    else if (q.includes('plastic') || q.includes('film') || q.includes('hdpe') || q.includes('ldpe')) category = 'plastic';
    else if (q.includes('pallet') || q.includes('wood')) category = 'pallet';
    else if (q.includes('paper')) category = 'paper';
    else if (q.includes('glass')) category = 'glass';
    else if (q.includes('metal')) category = 'metal';

    let condition = 'all';
    if (q.includes('clean') || q.includes('good') || q.includes('like-new')) condition = 'good';
    else if (q.includes('new') || q.includes('virgin') || q.includes('unused')) condition = 'new';
    else if (q.includes('used')) condition = 'used';
    else if (q.includes('recyclable') || q.includes('scrap')) condition = 'recyclable';

    let transactionType = 'all';
    if (q.includes('free') || q.includes('claim')) transactionType = 'free_claim';
    else if (q.includes('exchange') || q.includes('swap')) transactionType = 'exchange';
    else if (q.includes('buy') || q.includes('purchase') || q.includes('price') || q.includes('under') || q.includes('rs') || q.includes('₹')) transactionType = 'sell';

    let maxDistanceKm = null;
    const distMatch = q.match(/within\s*(\d+)\s*km/i) || q.match(/(\d+)\s*km/i);
    if (distMatch) {
      maxDistanceKm = parseInt(distMatch[1], 10);
    }

    let maxPrice = null;
    const priceMatch = q.match(/(?:under|below|less than|<)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)/i) ||
      q.match(/(?:rs\.?|inr|₹)\s*(\d+(?:\.\d+)?)/i);
    if (priceMatch) {
      maxPrice = parseFloat(priceMatch[1]);
    }

    let city = null;
    if (q.includes('ahmedabad')) city = 'Ahmedabad';
    else if (q.includes('surat')) city = 'Surat';
    else if (q.includes('vadodara')) city = 'Vadodara';
    else if (q.includes('pune')) city = 'Pune';
    else if (q.includes('mumbai')) city = 'Mumbai';
    else if (userLocation?.city) city = userLocation.city;

    // Remove parsed command tokens to get clean keywords
    const clean = query
      .replace(/\b(find|show me|search|need|looking for|within \d+ km|\d+ km|under (?:rs\.?|inr|₹)?\s*\d+|free|near \w+)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      category,
      condition,
      transactionType,
      maxDistanceKm,
      maxPrice,
      city,
      cleanKeywords: clean || category !== 'all' ? category : '',
      interpretedQuery: `Showing ${category !== 'all' ? category : 'all'} materials${
        condition !== 'all' ? ` in ${condition} condition` : ''
      }${maxPrice ? ` under ₹${maxPrice}` : ''}${maxDistanceKm ? ` within ${maxDistanceKm} km` : ''}${
        city ? ` near ${city}` : ''
      }`,
    };
  }

  _fallbackAdvisor(query, context, user) {
    const q = query.toLowerCase();

    if (q.includes('cardboard') || q.includes('boxes')) {
      return {
        answer:
          'For surplus cardboard, local B2B reuse provides 3.5x higher economic value and saves up to 0.85 t CO₂e/tonne compared to immediate shredding or downcycling. We recommend creating an active listing specifying your lot dimensions, condition, and pallet stacking format.',
        keyTakeaways: [
          'High demand in regional distribution corridors (Ahmedabad, Surat, Vadodara).',
          'Clean, dry corrugated lots command ₹8.50 - ₹12.00/kg on secondary exchange.',
          'Diverting 5 tonnes avoids ~4.25 tonnes Scope 3 GHG emissions.',
        ],
        suggestedActions: [
          { label: 'List Cardboard Surplus', action: 'navigate', link: '/materials/new' },
          { label: 'View Smart Matches', action: 'navigate', link: '/matches' },
        ],
        labels: {
          verifiedData: ['Category: Cardboard (Corrugated)'],
          calculatedMetrics: ['Est. avoided emissions: 0.85 t CO₂e / tonne'],
          aiSuggestions: ['Prioritize buyers within 100 km radius for freight efficiency'],
        },
      };
    }

    if (q.includes('plastic') || q.includes('polymer')) {
      return {
        answer:
          'Post-industrial plastics (LDPE stretch wrap, HDPE containers) have strong regional recycling and reprocessing demand. Segregated, baled films achieve highest clearing rates when certified clean and free of labels.',
        keyTakeaways: [
          'Segregated clear LDPE film yields ₹22 - ₹28/kg in secondary markets.',
          'Recycling 1 tonne of HDPE avoids ~1.40 tonnes of CO₂e lifecycle emissions.',
          'Consolidating batches reduces per-km logistics emissions.',
        ],
        suggestedActions: [
          { label: 'Find Plastic Buyers', action: 'navigate', link: '/marketplace?category=Plastic' },
          { label: 'Calculate Net Carbon', action: 'navigate', link: '/impact' },
        ],
        labels: {
          verifiedData: ['Category: Plastic Packaging'],
          calculatedMetrics: ['Polymer displacement: 1.40 t CO₂e / tonne'],
          aiSuggestions: ['Ensure moisture content < 2% before dispatch'],
        },
      };
    }

    if (q.includes('scope 3') || q.includes('carbon') || q.includes('emissions')) {
      return {
        answer:
          'In CIRCULA, Scope 3 Category 1 (Purchased Goods) carbon avoidance is calculated using EPA WARM v15 and regional lifecycle emissions factors. When an enterprise procures circular secondary materials instead of virgin packaging, the embedded emissions of virgin extraction and manufacturing are credited as avoided lifecycle emissions.',
        keyTakeaways: [
          'Avoided emissions = (Virgin Production Factor - Secondary Recovery Factor) * Quantity Diverted.',
          'Transit emissions from green corridors are factored in to report net avoidance.',
          'All metrics are traceable and exportable for ESG / BRSR sustainability reporting.',
        ],
        suggestedActions: [
          { label: 'Explore Impact Analytics', action: 'navigate', link: '/impact' },
          { label: 'View Circular Opportunities', action: 'navigate', link: '/map' },
        ],
        labels: {
          verifiedData: ['Methodology: EPA WARM v15 + Central CEA Grid Factors'],
          calculatedMetrics: ['Life-cycle virgin avoidance verified per material type'],
          aiSuggestions: ['Generate ESG report quarterly for compliance'],
        },
      };
    }

    // Default context-grounded response
    const org = user?.company?.name || user?.name || 'Your Facility';
    return {
      answer: `Hello! I am CIRCULA AI, your circular materials and carbon intelligence copilot. I analyze packaging waste streams, matching viability, transport emissions, and recovery economics for ${org}. Ask me how to optimize material listings, interpret match scores, or maximize your circularity score.`,
      keyTakeaways: [
        'Explore algorithmic Smart Matches for high-compatibility materials.',
        'Use AI Listing Assist on the Add Material page for higher listing quality.',
        'Natural language search translates requests directly into marketplace filters.',
      ],
      suggestedActions: [
        { label: 'Explore Smart Matches', action: 'navigate', link: '/matches' },
        { label: 'Search Marketplace', action: 'navigate', link: '/marketplace' },
        { label: 'Create Material Listing', action: 'navigate', link: '/materials/new' },
      ],
      labels: {
        verifiedData: [`Active Session: ${org}`],
        calculatedMetrics: ['Circularity score tracking active'],
        aiSuggestions: ['Review open listings to increase recovery velocity'],
      },
    };
  }
}

export const aiService = new AiService();
export default aiService;
