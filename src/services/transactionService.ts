import { Transaction, TransactionStatus, TransactionCreatePayload } from '../types';
import { INITIAL_TRANSACTIONS } from '../data/mockData';
import { apiClient } from './apiClient';

let inMemoryTransactions: Transaction[] = [...INITIAL_TRANSACTIONS];

export function mapBackendStatusToFrontend(status: string): TransactionStatus {
  switch (status?.toLowerCase()) {
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

export function mapFrontendStatusToBackend(status: TransactionStatus): string {
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

export function mapBackendTransactionToFrontend(tx: any): Transaction {
  const status = mapBackendStatusToFrontend(tx.status);
  const materialObj = tx.material && typeof tx.material === 'object' ? tx.material : null;
  const buyerCompany = tx.buyerCompany && typeof tx.buyerCompany === 'object' ? tx.buyerCompany : null;
  const sellerCompany = tx.sellerCompany && typeof tx.sellerCompany === 'object' ? tx.sellerCompany : null;

  return {
    id: tx._id || tx.id || `tx-${Date.now()}`,
    orderNumber: tx.orderNumber || `CIR-${Date.now().toString().slice(-4)}`,
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
    createdAt: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent',
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

export const transactionService = {
  /**
   * Get all transactions for caller
   */
  async getAll(params?: { status?: string; page?: number; limit?: number }): Promise<Transaction[]> {
    try {
      const queryParts: string[] = [];
      if (params?.status) queryParts.push(`status=${encodeURIComponent(params.status)}`);
      if (params?.page) queryParts.push(`page=${params.page}`);
      if (params?.limit) queryParts.push(`limit=${params.limit}`);
      const qs = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

      const res = await apiClient.get<{ data: any[] }>(`/transactions${qs}`);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(mapBackendTransactionToFrontend);
      }
    } catch (err) {
      console.warn('Backend transactions API unavailable, using in-memory state:', err);
    }
    return [...inMemoryTransactions];
  },

  /**
   * Get transaction details by ID
   */
  async getById(id: string): Promise<Transaction | undefined> {
    try {
      const res = await apiClient.get<{ data: any }>(`/transactions/${id}`);
      if (res && res.success && res.data) {
        return mapBackendTransactionToFrontend(res.data);
      }
    } catch {
      // Fallback
    }
    return inMemoryTransactions.find((t) => t.id === id);
  },

  /**
   * Get transactions for a specific company
   */
  async getByCompany(companyId: string): Promise<Transaction[]> {
    try {
      const res = await apiClient.get<{ data: any[] }>(`/transactions/company/${companyId}`);
      if (res && res.success && Array.isArray(res.data)) {
        return res.data.map(mapBackendTransactionToFrontend);
      }
    } catch {
      // Fallback
    }
    return inMemoryTransactions.filter(
      (t) => t.buyer?.id === companyId || t.supplier?.id === companyId
    );
  },

  /**
   * Create a new transaction (BUY / CLAIM / EXCHANGE)
   */
  async create(payload: TransactionCreatePayload): Promise<Transaction> {
    try {
      const res = await apiClient.post<{ data: any }>('/transactions', payload);
      if (res && res.success && res.data) {
        const mapped = mapBackendTransactionToFrontend(res.data);
        inMemoryTransactions = [mapped, ...inMemoryTransactions];
        return mapped;
      }
    } catch (err) {
      console.warn('POST /transactions failed or backend disconnected, using local simulation:', err);
    }

    // Fallback simulation
    const fallbackTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      orderNumber: `CIR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      materialId: payload.materialId,
      materialTitle: 'Surplus Material Batch',
      materialCategory: 'Cardboard',
      quantity: payload.quantity,
      unit: 'kg',
      supplier: inMemoryTransactions[0]?.supplier || ({} as any),
      buyer: inMemoryTransactions[0]?.buyer || ({} as any),
      materialCostInr: payload.quantity * 8.5,
      transportCostInr: payload.customTransportCost || 1200,
      totalInr: (payload.quantity * 8.5) + (payload.customTransportCost || 1200),
      status: 'Order Confirmed',
      type: 'Purchase',
      date: 'Today',
      createdAt: 'Today',
      estimatedCo2AvoidedTonnes: Number(((payload.quantity * 0.94) / 1000).toFixed(2)),
      wasteDivertedTonnes: Number((payload.quantity / 1000).toFixed(2)),
      optimizedRouteSavingsInr: 750,
      carbonAvoidedTransportKg: 24,
      trackingEvents: [
        {
          status: 'Order Confirmed',
          date: 'Today',
          time: 'Just now',
          location: payload.pickupLocation?.city || 'Origin Plant',
          description: 'Trade agreement initialized. Digital custody chain active.',
          completed: true,
        },
        {
          status: 'Pickup Scheduled',
          date: 'Tomorrow',
          time: '10:00 AM',
          location: payload.pickupLocation?.city || 'Origin Bay',
          description: 'Green hauler dispatched for backhaul collection.',
          completed: false,
        },
        {
          status: 'In Transit',
          date: 'Tomorrow',
          time: '02:00 PM',
          location: 'Transit Green Corridor',
          description: 'GPS telematics active.',
          completed: false,
        },
        {
          status: 'Delivered',
          date: 'Day 3',
          time: '04:30 PM',
          location: payload.destinationLocation?.city || 'Destination Hub',
          description: 'Weighbridge check-in and receiver sign-off.',
          completed: false,
        },
        {
          status: 'Verified',
          date: 'Day 3',
          time: '06:00 PM',
          location: 'CIRCULA Registry',
          description: 'Carbon reduction certified.',
          completed: false,
        },
      ],
    };

    inMemoryTransactions = [fallbackTx, ...inMemoryTransactions];
    return fallbackTx;
  },

  /**
   * Update transaction status
   */
  async updateStatus(id: string, status: TransactionStatus): Promise<Transaction | null> {
    try {
      const backendStatus = mapFrontendStatusToBackend(status);
      const res = await apiClient.patch<{ data: any }>(`/transactions/${id}/status`, {
        status: backendStatus,
      });
      if (res && res.success && res.data) {
        const mapped = mapBackendTransactionToFrontend(res.data);
        const idx = inMemoryTransactions.findIndex((t) => t.id === id);
        if (idx >= 0) inMemoryTransactions[idx] = mapped;
        return mapped;
      }
    } catch (err) {
      console.warn('Could not update status via REST API, updating locally:', err);
    }

    const idx = inMemoryTransactions.findIndex((t) => t.id === id);
    if (idx >= 0) {
      inMemoryTransactions[idx] = {
        ...inMemoryTransactions[idx],
        status,
        trackingEvents: inMemoryTransactions[idx].trackingEvents.map((evt) =>
          evt.status === status ? { ...evt, completed: true } : evt
        ),
      };
      return inMemoryTransactions[idx];
    }
    return null;
  },
};
