import {
  Material,
  MaterialCategory,
  MaterialCondition,
  TransactionType,
  Company,
  MaterialQueryParams,
} from '../types';
import { INITIAL_MATERIALS } from '../data/mockData';
import { apiClient } from './apiClient';

// Helper: map backend Material document to frontend Material interface
export function mapBackendMaterialToFrontend(item: any): Material {
  if (!item) return item;

  // Capitalize category
  const categoryMap: Record<string, MaterialCategory> = {
    cardboard: 'Cardboard',
    plastic: 'Plastic',
    pallet: 'Pallets',
    pallets: 'Pallets',
    paper: 'Paper',
    glass: 'Glass',
    metal: 'Metal',
    other: 'Other',
  };

  const conditionMap: Record<string, MaterialCondition> = {
    new: 'New',
    good: 'Good',
    used: 'Used',
    recyclable: 'Recyclable',
  };

  const typeMap: Record<string, TransactionType> = {
    sell: 'Purchase',
    purchase: 'Purchase',
    free_claim: 'Free Claim',
    exchange: 'Exchange',
  };

  const category: MaterialCategory =
    categoryMap[item.category?.toLowerCase()] || (item.category as MaterialCategory) || 'Cardboard';

  const condition: MaterialCondition =
    conditionMap[item.condition?.toLowerCase()] || (item.condition as MaterialCondition) || 'Good';

  const transactionType: TransactionType =
    typeMap[item.transactionType?.toLowerCase()] ||
    (item.transactionType as TransactionType) ||
    'Purchase';

  // Fallback company mapping
  const supplierCompany: Company =
    item.company && typeof item.company === 'object'
      ? {
          id: item.company._id || item.company.id || 'comp-seed',
          name: item.company.name || 'Industrial Packaging Partner',
          type: (item.company.businessType as any) || 'Manufacturer',
          industry: item.company.industry || 'Packaging',
          location: `${item.company.location?.city || item.location?.city || 'Ahmedabad'}, ${item.company.location?.state || 'Gujarat'}`,
          city: item.company.location?.city || item.location?.city || 'Ahmedabad',
          state: item.company.location?.state || item.location?.state || 'Gujarat',
          rating: item.company.rating || 4.8,
          reviewCount: 24,
          verifiedLevel:
            item.company.verificationStatus === 'trusted'
              ? 'Trusted Circular Partner'
              : item.company.verificationStatus === 'verified'
              ? 'Verified'
              : 'Basic',
          verified: item.company.verificationStatus === 'verified' || item.company.verificationStatus === 'trusted',
          circularityScore: item.company.circularityScore || 85,
          materialsExchangedTonnes: Number(((item.company.totalWasteDiverted || 42000) / 1000).toFixed(1)),
          co2eAvoidedTonnes: Number((item.company.totalCarbonAvoided || 38.5).toFixed(1)),
          wasteDivertedTonnes: Number(((item.company.totalWasteDiverted || 42000) / 1000).toFixed(1)),
          transactionsCount: item.company.totalTransactions || 12,
          activeListingsCount: 3,
          memberSince: '2024',
          contactEmail: item.company.email || 'partner@circula.exchange',
          phone: item.company.phone || '+91 98000 00000',
          avatarUrl: item.company.logo,
        }
      : INITIAL_MATERIALS[0].supplier;

  const pricePerUnit = Number(item.price ?? item.pricePerUnit ?? 0);
  const quantity = Number(item.quantity ?? 0);

  return {
    id: item._id || item.id || `mat-${Date.now().toString().slice(-4)}`,
    title: item.name || item.title || 'Circular Material',
    category,
    quantity,
    unit: item.unit || 'kg',
    pricePerUnit,
    totalEstimatedValue: pricePerUnit * quantity,
    condition,
    transactionType,
    supplierId: supplierCompany.id,
    supplier: supplierCompany,
    location: item.location?.address
      ? `${item.location.address}, ${item.location.city}`
      : `${item.location?.city || 'Ahmedabad'}, ${item.location?.state || 'Gujarat'}`,
    city: item.location?.city || 'Ahmedabad',
    state: item.location?.state || 'Gujarat',
    distanceKm: item.distanceKm || 28,
    images: Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : ['https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'],
    specs: {
      grade: item.grade || item.specs?.grade || 'Commercial Grade A',
      dimensions: item.dimensions || item.specs?.dimensions || 'Standard',
      weightPerUnitKg: item.weight || item.specs?.weightPerUnitKg || 1,
      recyclabilityRate: `${item.recyclability ?? 100}%`,
    },
    impact: {
      virginMaterialReplacedKg: item.estimatedVirginMaterialAvoided || Math.round(quantity * 0.85),
      landfillWasteAvoidedKg: item.estimatedWasteDiverted || quantity,
      co2eAvoidedTonnes: item.estimatedCarbonAvoided || Number(((quantity * 0.94) / 1000).toFixed(2)),
      waterSavedLiters: Math.round(quantity * 6.5),
    },
    availability: 'Immediate',
    availableDate: 'Ready for Dispatch',
    description: item.description || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    isVerified: item.status === 'active',
    createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent',
    status: item.status === 'active' ? 'Available' : item.status === 'reserved' ? 'Reserved' : 'Completed',
  };
}

// In-memory fallback array for offline preview session
let inMemoryMaterials: Material[] = [...INITIAL_MATERIALS];

export interface MaterialsFetchResult {
  materials: Material[];
  totalCount: number;
  page: number;
  totalPages: number;
  source: 'backend' | 'preview';
}

export const materialService = {
  /**
   * Fetch materials with filtering and sorting from backend with fallback
   */
  async getAll(params?: MaterialQueryParams): Promise<MaterialsFetchResult> {
    const queryParts: string[] = [];

    if (params?.category && params.category !== 'All') {
      const cat = params.category.toLowerCase();
      queryParts.push(`category=${encodeURIComponent(cat === 'pallets' ? 'pallet' : cat)}`);
    }

    if (params?.condition && params.condition !== 'All') {
      queryParts.push(`condition=${encodeURIComponent(params.condition.toLowerCase())}`);
    }

    if (params?.transactionType && params.transactionType !== 'All') {
      const raw = params.transactionType.toLowerCase();
      const mapped = raw === 'purchase' ? 'sell' : raw === 'free claim' ? 'free_claim' : raw;
      queryParts.push(`transactionType=${encodeURIComponent(mapped)}`);
    }

    if (params?.minPrice !== undefined && params.minPrice !== null && !isNaN(params.minPrice)) {
      queryParts.push(`minPrice=${params.minPrice}`);
    }

    if (params?.maxPrice !== undefined && params.maxPrice !== null && !isNaN(params.maxPrice)) {
      queryParts.push(`maxPrice=${params.maxPrice}`);
    }

    if (params?.minQuantity !== undefined && params.minQuantity !== null && !isNaN(params.minQuantity)) {
      queryParts.push(`minQuantity=${params.minQuantity}`);
    }

    if (params?.maxQuantity !== undefined && params.maxQuantity !== null && !isNaN(params.maxQuantity)) {
      queryParts.push(`maxQuantity=${params.maxQuantity}`);
    }

    if (params?.search && params.search.trim()) {
      queryParts.push(`search=${encodeURIComponent(params.search.trim())}`);
    }

    if (params?.city && params.city.trim()) {
      queryParts.push(`city=${encodeURIComponent(params.city.trim())}`);
    }

    if (params?.sort) {
      queryParts.push(`sort=${encodeURIComponent(params.sort)}`);
    }

    if (params?.page) {
      queryParts.push(`page=${params.page}`);
    }

    if (params?.limit) {
      queryParts.push(`limit=${params.limit}`);
    }

    if (params?.status) {
      queryParts.push(`status=${encodeURIComponent(params.status)}`);
    }

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

    try {
      const res = await apiClient.get<{
        data: any[];
        totalCount?: number;
        page?: number;
        totalPages?: number;
      }>(`/materials${queryString}`);

      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return {
          materials: res.data.map(mapBackendMaterialToFrontend),
          totalCount: res.totalCount ?? res.data.length,
          page: res.page ?? 1,
          totalPages: res.totalPages ?? 1,
          source: 'backend',
        };
      }
    } catch (err) {
      // Backend not running or unreachable: use in-memory state gracefully
      console.warn('Backend REST API /materials unavailable or DB disconnected, using local simulation:', err);
    }

    // In-memory fallback with identical filtering and sorting logic
    let result = [...inMemoryMaterials];

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params?.category && params.category !== 'All') {
      result = result.filter((m) => m.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.condition && params.condition !== 'All') {
      result = result.filter((m) => m.condition.toLowerCase() === params.condition!.toLowerCase());
    }

    if (params?.transactionType && params.transactionType !== 'All') {
      result = result.filter((m) => m.transactionType.toLowerCase() === params.transactionType!.toLowerCase());
    }

    if (params?.minPrice !== undefined) {
      result = result.filter((m) => m.pricePerUnit >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      result = result.filter((m) => m.pricePerUnit <= params.maxPrice!);
    }

    if (params?.minQuantity !== undefined) {
      result = result.filter((m) => m.quantity >= params.minQuantity!);
    }

    if (params?.maxQuantity !== undefined) {
      result = result.filter((m) => m.quantity <= params.maxQuantity!);
    }

    // Sort in-memory
    if (params?.sort === 'price_low') {
      result.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    } else if (params?.sort === 'price_high') {
      result.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    } else if (params?.sort === 'volume' || params?.sort === 'quantity_high') {
      result.sort((a, b) => b.quantity - a.quantity);
    } else if (params?.sort === 'carbon_saving') {
      result.sort((a, b) => (b.impact?.co2eAvoidedTonnes || 0) - (a.impact?.co2eAvoidedTonnes || 0));
    } else if (params?.sort === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      // newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return {
      materials: result,
      totalCount: result.length,
      page: 1,
      totalPages: 1,
      source: 'preview',
    };
  },

  /**
   * Fetch material by ID via REST API with fallback
   */
  async getById(id: string): Promise<{ material: Material | null; source: 'backend' | 'preview' }> {
    try {
      const res = await apiClient.get<{ data: any }>(`/materials/${id}`);
      if (res && res.success && res.data) {
        return {
          material: mapBackendMaterialToFrontend(res.data),
          source: 'backend',
        };
      }
    } catch {
      // Fallback
    }

    const localFound = inMemoryMaterials.find((m) => m.id === id) || null;
    return {
      material: localFound,
      source: 'preview',
    };
  },

  /**
   * Filter materials by category
   */
  async getByCategory(category: MaterialCategory): Promise<Material[]> {
    const res = await this.getAll({ category });
    return res.materials;
  },

  /**
   * Get materials by company
   */
  async getByCompany(companyId: string): Promise<Material[]> {
    try {
      const res = await apiClient.get<{ data: any[] }>(`/materials/company/${companyId}`);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(mapBackendMaterialToFrontend);
      }
    } catch {
      // Fallback
    }
    return inMemoryMaterials.filter((m) => m.supplierId === companyId || m.supplier?.id === companyId);
  },

  /**
   * Create a new material listing via REST API with fallback
   */
  async create(newMat: {
    title: string;
    category: MaterialCategory;
    description: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    condition: MaterialCondition;
    transactionType: TransactionType;
    city?: string;
    state?: string;
    location?: any;
    grade?: string;
    dimensions?: string;
    weight?: number;
    recyclability?: number;
    images?: string[];
    tags?: string[];
  }): Promise<{ material: Material; source: 'backend' | 'preview' }> {
    const typeReverseMap: Record<string, string> = {
      Purchase: 'sell',
      'Free Claim': 'free_claim',
      Exchange: 'exchange',
    };

    const categoryNormalizer: Record<string, string> = {
      Pallets: 'pallet',
      Cardboard: 'cardboard',
      Plastic: 'plastic',
      Paper: 'paper',
      Glass: 'glass',
      Metal: 'metal',
      Other: 'other',
    };

    const payload = {
      name: newMat.title,
      category: categoryNormalizer[newMat.category] || newMat.category.toLowerCase(),
      description: newMat.description,
      quantity: Number(newMat.quantity),
      unit: newMat.unit || 'kg',
      price: Number(newMat.pricePerUnit || 0),
      condition: newMat.condition.toLowerCase(),
      transactionType: typeReverseMap[newMat.transactionType] || 'sell',
      grade: newMat.grade || 'Commercial Grade A',
      dimensions: newMat.dimensions || '',
      weight: newMat.weight || 0,
      recyclability: newMat.recyclability ?? 100,
      location: newMat.location || {
        city: newMat.city || 'Ahmedabad',
        state: newMat.state || 'Gujarat',
      },
      images: newMat.images || [],
      tags: newMat.tags || [],
    };

    try {
      const res = await apiClient.post<{ data: any }>('/materials', payload);
      if (res && res.success && res.data) {
        const mapped = mapBackendMaterialToFrontend(res.data);
        inMemoryMaterials = [mapped, ...inMemoryMaterials];
        return { material: mapped, source: 'backend' };
      }
    } catch (err) {
      console.warn('Could not post material to REST API, recording in local preview store:', err);
    }

    // Local fallback creation
    const created: Material = {
      id: `mat-${Date.now().toString().slice(-4)}`,
      title: newMat.title,
      category: newMat.category,
      quantity: newMat.quantity,
      unit: newMat.unit as any,
      pricePerUnit: newMat.pricePerUnit,
      totalEstimatedValue: newMat.pricePerUnit * newMat.quantity,
      condition: newMat.condition,
      transactionType: newMat.transactionType,
      supplierId: INITIAL_MATERIALS[0].supplierId,
      supplier: INITIAL_MATERIALS[0].supplier,
      location: `${newMat.city || 'Ahmedabad'}, ${newMat.state || 'Gujarat'}`,
      city: newMat.city || 'Ahmedabad',
      state: newMat.state || 'Gujarat',
      distanceKm: 22,
      images: newMat.images && newMat.images.length > 0 ? newMat.images : INITIAL_MATERIALS[0].images,
      specs: {
        grade: newMat.grade || 'Commercial Grade A',
        dimensions: newMat.dimensions || 'Standard',
        weightPerUnitKg: newMat.weight || 1,
        recyclabilityRate: `${newMat.recyclability || 100}%`,
      },
      impact: {
        virginMaterialReplacedKg: Math.round(newMat.quantity * 0.8),
        landfillWasteAvoidedKg: newMat.quantity,
        co2eAvoidedTonnes: Number(((newMat.quantity * 0.94) / 1000).toFixed(2)),
        waterSavedLiters: Math.round(newMat.quantity * 6.5),
      },
      availability: 'Immediate',
      availableDate: 'Ready for Dispatch',
      description: newMat.description,
      tags: newMat.tags || [],
      isVerified: true,
      createdAt: 'Just now',
      status: 'Available',
    };

    inMemoryMaterials = [created, ...inMemoryMaterials];
    return { material: created, source: 'preview' };
  },

  /**
   * Update material listing
   */
  async update(id: string, updates: Partial<Material>): Promise<Material | null> {
    try {
      const res = await apiClient.put<{ data: any }>(`/materials/${id}`, updates);
      if (res && res.success && res.data) {
        const mapped = mapBackendMaterialToFrontend(res.data);
        const idx = inMemoryMaterials.findIndex((m) => m.id === id);
        if (idx >= 0) inMemoryMaterials[idx] = mapped;
        return mapped;
      }
    } catch {
      // Fallback
    }

    const idx = inMemoryMaterials.findIndex((m) => m.id === id);
    if (idx >= 0) {
      inMemoryMaterials[idx] = { ...inMemoryMaterials[idx], ...updates };
      return inMemoryMaterials[idx];
    }
    return null;
  },

  /**
   * Delete material listing
   */
  async delete(id: string): Promise<boolean> {
    try {
      const res = await apiClient.delete<{ success: boolean }>(`/materials/${id}`);
      if (res && res.success) {
        inMemoryMaterials = inMemoryMaterials.filter((m) => m.id !== id);
        return true;
      }
    } catch {
      // Fallback
    }
    inMemoryMaterials = inMemoryMaterials.filter((m) => m.id !== id);
    return true;
  },
};
