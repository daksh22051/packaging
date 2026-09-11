import { SmartMatch, Transaction, LogisticsPlan, TransactionStatus } from '../types';
import {
  INITIAL_MATCHES,
  INITIAL_TRANSACTIONS,
  DEMO_LOGISTICS_PLAN,
} from '../data/mockData';
import { apiClient } from './apiClient';
import { transactionService } from './transactionService';

export { transactionService };

let matches: SmartMatch[] = [...INITIAL_MATCHES];
let inMemoryTransactions: Transaction[] = [...INITIAL_TRANSACTIONS];
let logisticsPlan: LogisticsPlan = { ...DEMO_LOGISTICS_PLAN };

function mapBackendStatusToFrontend(status: string): TransactionStatus {
  switch (status) {
    case 'pickup_scheduled':
      return 'Pickup Scheduled';
    case 'in_transit':
      return 'In Transit';
    case 'delivered':
      return 'Delivered';
    case 'verified':
      return 'Verified';
    case 'pending':
    case 'confirmed':
    default:
      return 'Order Confirmed';
  }
}

function mapFrontendStatusToBackend(status: TransactionStatus): string {
  switch (status) {
    case 'Pickup Scheduled':
      return 'pickup_scheduled';
    case 'In Transit':
      return 'in_transit';
    case 'Delivered':
      return 'delivered';
    case 'Verified':
      return 'verified';
    case 'Order Confirmed':
    default:
      return 'confirmed';
  }
}

function mapBackendTransactionToFrontend(tx: any): Transaction {
  const status = mapBackendStatusToFrontend(tx.status);
  const materialObj = tx.material && typeof tx.material === 'object' ? tx.material : null;
  const buyerCompany = tx.buyerCompany && typeof tx.buyerCompany === 'object' ? tx.buyerCompany : null;
  const sellerCompany = tx.sellerCompany && typeof tx.sellerCompany === 'object' ? tx.sellerCompany : null;

  return {
    id: tx._id || tx.id || `tx-${Date.now()}`,
    orderNumber: tx.orderNumber || 'CM-2048',
    materialId: materialObj?._id || tx.material || 'mat-default',
    materialTitle: materialObj?.name || tx.materialTitle || 'Industrial Material Batch',
    materialCategory: (materialObj?.category ? (materialObj.category.charAt(0).toUpperCase() + materialObj.category.slice(1)) : 'Cardboard') as any,
    quantity: tx.quantity || 1000,
    unit: materialObj?.unit || tx.unit || 'kg',
    supplier: {
      id: sellerCompany?._id || 'comp-seller',
      name: sellerCompany?.name || 'Seller Packaging Corp',
      type: 'Manufacturer',
      industry: 'Packaging',
      location: sellerCompany?.location?.city || 'Sanand, Gujarat',
      city: sellerCompany?.location?.city || 'Sanand',
      state: sellerCompany?.location?.state || 'Gujarat',
      rating: 4.8,
      reviewCount: 32,
      verifiedLevel: 'Verified',
      circularityScore: sellerCompany?.circularityScore || 88,
      materialsExchangedTonnes: 120,
      co2eAvoidedTonnes: 45,
      wasteDivertedTonnes: 120,
      transactionsCount: 18,
      activeListingsCount: 4,
      memberSince: '2023',
      contactEmail: sellerCompany?.email || 'dispatch@seller.com',
      phone: sellerCompany?.phone || '+91 98000 00000',
    },
    buyer: {
      id: buyerCompany?._id || 'comp-buyer',
      name: buyerCompany?.name || 'Buyer Enterprise',
      type: 'Retailer',
      industry: 'Logistics & Retail',
      location: buyerCompany?.location?.city || 'Mumbai, Maharashtra',
      city: buyerCompany?.location?.city || 'Mumbai',
      state: buyerCompany?.location?.state || 'Maharashtra',
      rating: 4.7,
      reviewCount: 16,
      verifiedLevel: 'Verified',
      circularityScore: buyerCompany?.circularityScore || 85,
      materialsExchangedTonnes: 85,
      co2eAvoidedTonnes: 28,
      wasteDivertedTonnes: 85,
      transactionsCount: 12,
      activeListingsCount: 2,
      memberSince: '2024',
      contactEmail: buyerCompany?.email || 'procurement@buyer.com',
      phone: buyerCompany?.phone || '+91 98000 00000',
    },
    materialCostInr: tx.materialCost || tx.materialCostInr || 0,
    transportCostInr: tx.transportCost || tx.transportCostInr || 0,
    totalInr: tx.totalCost || tx.totalInr || (tx.materialCost || 0) + (tx.transportCost || 0),
    totalAmountInr: tx.totalCost || tx.totalAmountInr || 0,
    status,
    type: 'Purchase',
    date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent',
    estimatedCo2AvoidedTonnes: tx.estimatedTotalCarbonAvoided || tx.estimatedCo2AvoidedTonnes || 1.5,
    co2SavedTonnes: tx.estimatedTotalCarbonAvoided || tx.co2SavedTonnes || 1.5,
    wasteDivertedTonnes: Number(((tx.quantity || 1000) / 1000).toFixed(2)),
    trackingEvents: [
      {
        status: 'Order Confirmed',
        date: 'Today',
        time: '09:00 AM',
        location: sellerCompany?.location?.city || 'Pickup Site',
        description: 'Order matched and confirmed via CIRCULA exchange',
        completed: true,
      },
      {
        status: 'Pickup Scheduled',
        date: 'Today',
        time: '02:00 PM',
        location: sellerCompany?.location?.city || 'Loading Bay',
        description: 'Assigned to CNG green hauler for backhaul collection',
        completed: ['Pickup Scheduled', 'In Transit', 'Delivered', 'Verified'].includes(status),
      },
      {
        status: 'In Transit',
        date: 'Tomorrow',
        time: '10:00 AM',
        location: 'Transit Corridor',
        description: 'Material in transit with certified emissions tracking',
        completed: ['In Transit', 'Delivered', 'Verified'].includes(status),
      },
      {
        status: 'Delivered',
        date: 'Day 3',
        time: '04:00 PM',
        location: buyerCompany?.location?.city || 'Destination Receiving Dock',
        description: 'Consignment received at destination warehouse',
        completed: ['Delivered', 'Verified'].includes(status),
      },
      {
        status: 'Verified',
        date: 'Day 3',
        time: '05:30 PM',
        location: buyerCompany?.location?.city || 'Verification Station',
        description: 'Quality verified; Circularity and carbon credits minted',
        completed: status === 'Verified',
      },
    ],
    optimizedRouteSavingsInr: 1200,
    carbonAvoidedTransportKg: 42,
  };
}

export { matchService } from './matchService';

export const logisticsService = {
  async getPlan(): Promise<LogisticsPlan> {
    return { ...logisticsPlan };
  },
  async updatePlan(updates: Partial<LogisticsPlan>): Promise<LogisticsPlan> {
    logisticsPlan = { ...logisticsPlan, ...updates };
    return logisticsPlan;
  },
};

export const impactService = {
  calculateCustomImpact(params: {
    material: string;
    quantityKg: number;
    virginReplacementPct: number;
    distanceKm: number;
    transportMode: 'Electric LCV' | 'CNG Medium' | 'Standard Diesel';
  }) {
    const { quantityKg, virginReplacementPct, distanceKm, transportMode } = params;

    // Emission factors (kg CO2e per kg virgin material displaced)
    const factorMap: Record<string, number> = {
      Cardboard: 0.94,
      Plastic: 1.65,
      Pallets: 0.62,
      Paper: 0.88,
      Glass: 0.35,
      Metal: 8.2,
    };
    const factor = factorMap[params.material] || 0.94;

    const virginReplacedKg = Math.round(quantityKg * (virginReplacementPct / 100));
    const grossCo2AvoidedKg = virginReplacedKg * factor;

    // Transport emissions factor per km-tonne
    const transportFactors = {
      'Electric LCV': 0.045, // kg CO2e / tonne-km
      'CNG Medium': 0.082,
      'Standard Diesel': 0.128,
    };
    const transportCo2Kg = Math.round(
      (quantityKg / 1000) * distanceKm * transportFactors[transportMode]
    );

    const netCo2AvoidedTonnes = Math.max(
      0.01,
      Number(((grossCo2AvoidedKg - transportCo2Kg) / 1000).toFixed(2))
    );

    const waterSavedLiters = Math.round(virginReplacedKg * 6.5);
    const wasteDivertedKg = quantityKg;

    return {
      virginReplacedKg,
      wasteDivertedKg,
      grossCo2AvoidedKg: Math.round(grossCo2AvoidedKg),
      transportCo2Kg,
      netCo2AvoidedTonnes,
      waterSavedLiters,
      estimatedSavingsInr: Math.round(quantityKg * 5.8),
    };
  },
};
