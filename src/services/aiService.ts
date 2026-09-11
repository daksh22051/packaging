import { AiDetectionResult, Material, SmartMatch } from '../types';

export const aiService = {
  /**
   * Simulates AI Material Recognition from image uploads.
   * Ready to be connected to Gemini Multimodal or vision API.
   */
  async detectMaterialFromPhoto(
    _fileOrUrl?: string | File
  ): Promise<AiDetectionResult> {
    // Simulate brief scanning latency for authentic feel
    await new Promise((resolve) => setTimeout(resolve, 1400));

    return {
      detectedMaterial: 'Corrugated Cardboard',
      confidence: 96,
      estimatedCondition: 'Good',
      suggestedCategory: 'Cardboard',
      suggestedDescription:
        'Used corrugated cardboard sheets and clean master cartons suitable for secondary packaging and industrial repulping. Low moisture, uniformly stacked.',
      suggestedPriceRange: '₹7.50 – ₹9.50 / kg',
      suggestedTags: [
        'Reusable',
        'Recyclable',
        'Secondary Packaging',
        'Nearby Exchange',
        'Double Wall'
      ]
    };
  },

  /**
   * Simulates AI Listing Assistant parsing a natural language command.
   * e.g. "Create a listing for 3 tonnes of good-quality cardboard boxes"
   */
  async generateListingFromPrompt(prompt: string): Promise<{
    title: string;
    category: 'Cardboard' | 'Plastic' | 'Pallets' | 'Paper' | 'Glass' | 'Metal';
    quantity: number;
    unit: 'kg' | 'tonnes';
    condition: 'New' | 'Good' | 'Used' | 'Recyclable';
    pricePerUnit: number;
    description: string;
    tags: string[];
    suggestedBuyers: string[];
  }> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const lower = prompt.toLowerCase();
    if (lower.includes('pallet')) {
      return {
        title: 'Inspected Heavy-Duty Wooden Pallets',
        category: 'Pallets',
        quantity: 250,
        unit: 'kg',
        condition: 'Good',
        pricePerUnit: 280,
        description:
          'Standard industrial wooden pallets inspected for structural integrity. Free from oil contamination and stored under dry cover.',
        tags: ['Pallets', 'Timber', 'Reusable', 'Heavy Load'],
        suggestedBuyers: ['CircularBox Manufacturing', 'ReLoop Logistics']
      };
    }

    if (lower.includes('plastic') || lower.includes('film')) {
      return {
        title: 'Post-Industrial LLDPE Packaging Film',
        category: 'Plastic',
        quantity: 1500,
        unit: 'kg',
        condition: 'Recyclable',
        pricePerUnit: 22,
        description:
          'Clean transparent stretch wrap segregated at warehousing unloading bays. Free from excessive stickers, baled for easy transport.',
        tags: ['Plastic', 'LLDPE', 'Clear Film', 'Baled'],
        suggestedBuyers: ['EcoCycle Materials', 'GreenPack Industries']
      };
    }

    // Default to cardboard
    return {
      title: 'Surplus Double-Wall Corrugated Packaging Boxes',
      category: 'Cardboard',
      quantity: 3000,
      unit: 'kg',
      condition: 'Good',
      pricePerUnit: 8.5,
      description:
        'Uniform surplus corrugated master shipping boxes from finished manufacturing lot. Clean, unsoiled, and flat-stacked on pallets ready for immediate recovery.',
      tags: ['Cardboard', '5-Ply', 'Surplus', 'Recyclable', 'Industrial Grade'],
      suggestedBuyers: ['ABC Manufacturing', 'Urban Retail Solutions']
    };
  },

  /**
   * Generates AI explanation for a match.
   */
  async explainMatch(match: SmartMatch): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return `This match scores ${match.matchScore}% because ${match.supplierCompany.name} provides ${match.material.title} within ${match.distanceKm} km of your facility. The material specifications match your manufacturing tolerances, and consolidating transport via an optimized green corridor saves an estimated ₹${match.potentialSavingsInr.toLocaleString()} while avoiding ${match.estimatedCo2AvoidedTonnes} tonnes of carbon emissions.`;
  },

  /**
   * Circular AI conversational assistant with platform context.
   */
  async askCircularAi(
    query: string
  ): Promise<{
    answer: string;
    suggestedActions?: { label: string; action: string; link?: string }[];
  }> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const q = query.toLowerCase();

    if (q.includes('plastic') && q.includes('ahmedabad')) {
      return {
        answer:
          'I found 6 potential circular matches within your 120 km preferred radius around Ahmedabad. The strongest match is EcoCycle Materials in Vadodara (94% match), which processes approximately 25 tonnes/month of compatible industrial polymers and offers scheduled pickup.',
        suggestedActions: [
          { label: 'View Matches', action: 'navigate', link: '/matches' },
          { label: 'Optimize Logistics', action: 'navigate', link: '/logistics' },
          { label: 'Calculate Impact', action: 'navigate', link: '/impact' }
        ]
      };
    }

    if (q.includes('cardboard') || q.includes('buyers')) {
      return {
        answer:
          'There are 4 high-affinity buyers for corrugated cardboard near you: ABC Manufacturing (Needs 2,000–3,000 kg), Urban Retail Logistics (Needs 1,500 kg), and EcoCycle Fiber Recovery. Average current market clearing price is ₹8.50/kg.',
        suggestedActions: [
          { label: 'Explore Smart Matches', action: 'navigate', link: '/matches' },
          { label: 'List Your Materials', action: 'navigate', link: '/materials/new' }
        ]
      };
    }

    if (q.includes('save') || q.includes('money')) {
      return {
        answer:
          'Top savings opportunity: The Corrugated Cardboard listing from ABC Packaging saves you ₹14,500 compared to virgin board procurement, plus an additional ₹750 in transport costs when selecting the Green LCV optimized route.',
        suggestedActions: [
          { label: 'View Match Details', action: 'navigate', link: '/matches/match-001' },
          { label: 'Open Logistics Route', action: 'navigate', link: '/logistics' }
        ]
      };
    }

    if (q.includes('co2') || q.includes('carbon')) {
      return {
        answer:
          'By replacing 2,500 kg of virgin cardboard with recovered material, this transaction avoids approximately 1.8 tonnes of lifecycle CO₂e. Furthermore, the optimized 112 km transport route reduces transit emissions by 19.5% (18 kg CO₂e).',
        suggestedActions: [
          { label: 'Open Carbon Calculator', action: 'navigate', link: '/impact' }
        ]
      };
    }

    if (q.includes('logistics') || q.includes('deliver') || q.includes('route')) {
      return {
        answer:
          'For your active order CIR-2026-8901, the optimized green route via Sardar Patel Ring Road reduces transit distance from 138 km to 112 km, saving ₹750 in fuel surcharges and avoiding 18 kg of vehicle emissions.',
        suggestedActions: [
          { label: 'View Logistics Route', action: 'navigate', link: '/logistics' }
        ]
      };
    }

    // Generic helpful response
    return {
      answer:
        `I analyzed your current circular footprint. You have 3 active high-compatibility smart matches and 1 shipment in progress. Your circularity score is currently 82/100, driven by a 91% waste diversion rate across verified partners.`,
      suggestedActions: [
        { label: 'View Smart Matches', action: 'navigate', link: '/matches' },
        { label: 'View Marketplace', action: 'navigate', link: '/marketplace' },
        { label: 'View Impact', action: 'navigate', link: '/impact' }
      ]
    };
  }
};
