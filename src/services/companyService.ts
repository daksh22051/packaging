import { Company, Material, Transaction } from '../types';
import { MOCK_COMPANIES, CURRENT_USER_COMPANY } from '../data/mockData';
import { apiClient } from './apiClient';
import { mapBackendMaterialToFrontend } from './materialService';
import { mapBackendTransactionToFrontend } from './transactionService';

export function mapBackendCompanyToFrontend(item: any): Company {
  if (!item) return CURRENT_USER_COMPANY;

  const city = item.location?.city || 'Ahmedabad';
  const state = item.location?.state || 'Gujarat';

  return {
    id: item._id || item.id || 'comp-seed',
    name: item.name || 'Enterprise Partner',
    type: (item.businessType as any) || 'Manufacturer',
    industry: item.industry || 'Packaging & Circular Logistics',
    location: item.location?.address ? `${item.location.address}, ${city}` : `${city}, ${state}`,
    city,
    state,
    rating: item.rating || 4.8,
    reviewCount: 28,
    verifiedLevel:
      item.verificationStatus === 'trusted'
        ? 'Trusted Circular Partner'
        : item.verificationStatus === 'verified'
        ? 'Verified'
        : 'Basic',
    verified: item.verificationStatus === 'verified' || item.verificationStatus === 'trusted',
    circularityScore: item.circularityScore || 85,
    materialsExchangedTonnes: Number(((item.totalWasteDiverted || 42000) / 1000).toFixed(1)),
    co2eAvoidedTonnes: Number((item.totalCarbonAvoided || 38.5).toFixed(1)),
    wasteDivertedTonnes: Number(((item.totalWasteDiverted || 42000) / 1000).toFixed(1)),
    transactionsCount: item.totalTransactions || 14,
    activeListingsCount: 4,
    memberSince: item.createdAt ? new Date(item.createdAt).getFullYear().toString() : '2024',
    contactEmail: item.email || 'partner@circula.exchange',
    phone: item.phone || '+91 98000 00000',
    avatarUrl: item.logo,
    bio: item.description,
  };
}

let inMemoryCompanies: Company[] = [...MOCK_COMPANIES];

export const companyService = {
  /**
   * Fetch company details by ID
   */
  async getById(id: string): Promise<Company | undefined> {
    try {
      const res = await apiClient.get<{ data: any }>(`/companies/${id}`);
      if (res && res.success && res.data) {
        return mapBackendCompanyToFrontend(res.data);
      }
    } catch {
      // Fallback
    }
    return inMemoryCompanies.find((c) => c.id === id) || CURRENT_USER_COMPANY;
  },

  /**
   * Update company details
   */
  async update(id: string, data: Partial<Company>): Promise<Company> {
    try {
      const payload: any = {
        name: data.name,
        description: data.bio,
        industry: data.industry,
        email: data.contactEmail,
        phone: data.phone,
        location: {
          city: data.city,
          state: data.state,
        },
      };

      const res = await apiClient.put<{ data: any }>(`/companies/${id}`, payload);
      if (res && res.success && res.data) {
        const mapped = mapBackendCompanyToFrontend(res.data);
        const idx = inMemoryCompanies.findIndex((c) => c.id === id);
        if (idx >= 0) inMemoryCompanies[idx] = mapped;
        return mapped;
      }
    } catch (err) {
      console.warn('Could not update company on REST API, updating locally:', err);
    }

    const idx = inMemoryCompanies.findIndex((c) => c.id === id);
    if (idx >= 0) {
      inMemoryCompanies[idx] = { ...inMemoryCompanies[idx], ...data };
      return inMemoryCompanies[idx];
    }
    return { ...CURRENT_USER_COMPANY, ...data };
  },

  /**
   * Fetch materials listed by a company
   */
  async getMaterials(companyId: string, status?: string): Promise<Material[]> {
    try {
      const qs = status ? `?status=${status}` : '';
      const res = await apiClient.get<{ data: any[] }>(`/companies/${companyId}/materials${qs}`);
      if (res && res.success && Array.isArray(res.data)) {
        return res.data.map(mapBackendMaterialToFrontend);
      }
    } catch {
      // Fallback
    }
    return [];
  },

  /**
   * Fetch company transactions
   */
  async getTransactions(companyId: string): Promise<Transaction[]> {
    try {
      const res = await apiClient.get<{ data: any[] }>(`/companies/${companyId}/transactions`);
      if (res && res.success && Array.isArray(res.data)) {
        return res.data.map(mapBackendTransactionToFrontend);
      }
    } catch {
      // Fallback
    }
    return [];
  },

  /**
   * Get circular stats for company
   */
  async getStats(companyId: string): Promise<any> {
    try {
      const res = await apiClient.get<{ data: any }>(`/companies/${companyId}/stats`);
      if (res && res.success && res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },
};
