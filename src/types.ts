export type MaterialCategory =
  | 'Cardboard'
  | 'Plastic'
  | 'Pallets'
  | 'Paper'
  | 'Glass'
  | 'Metal'
  | 'Other';

export type MaterialCondition = 'New' | 'Good' | 'Used' | 'Recyclable';

export type TransactionType = 'Purchase' | 'Free Claim' | 'Exchange';

export type VerificationLevel = 'Basic' | 'Verified' | 'Trusted Circular Partner';

export interface Company {
  id: string;
  name: string;
  type: 'Manufacturer' | 'Retailer' | 'Recycler' | 'Logistics' | 'Packaging Supplier';
  industry: string;
  location: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  verifiedLevel: VerificationLevel;
  verified?: boolean;
  circularityScore: number;
  materialsExchangedTonnes: number;
  co2eAvoidedTonnes: number;
  wasteDivertedTonnes: number;
  transactionsCount: number;
  activeListingsCount: number;
  memberSince: string;
  contactEmail: string;
  phone: string;
  avatarUrl?: string;
  operatingRadiusKm?: number;
  bio?: string;
}

export interface MaterialSpecification {
  grade?: string;
  dimensions?: string;
  weightPerUnitKg?: number;
  moistureContent?: string;
  recyclabilityRate?: string;
  packagingFormat?: string;
  palletization?: string;
  contaminants?: string;
  pickupRequirements?: string;
}

export interface EnvironmentalImpact {
  virginMaterialReplacedKg: number;
  landfillWasteAvoidedKg: number;
  co2eAvoidedTonnes: number;
  waterSavedLiters: number;
  energySavedKwh?: number;
  calculationAssumptions?: string;
}

export interface Material {
  id: string;
  title: string;
  category: MaterialCategory;
  quantity: number;
  unit: 'kg' | 'tonnes' | 'units' | 'pallets' | 'bales';
  pricePerUnit: number;
  totalEstimatedValue: number;
  condition: MaterialCondition;
  transactionType: TransactionType;
  supplierId: string;
  supplier: Company;
  location: string;
  city: string;
  state: string;
  distanceKm: number;
  images: string[];
  specs: MaterialSpecification;
  impact: EnvironmentalImpact;
  availability: 'Immediate' | 'Within 3 Days' | 'Scheduled Recurring';
  availableDate: string;
  description: string;
  tags: string[];
  isVerified: boolean;
  createdAt: string;
  status: 'Available' | 'Reserved' | 'Completed';
}

export interface MatchCompatibility {
  material: number;
  quantity: number;
  distance: number;
  price: number;
  carbon: number;
  condition?: number;
  transaction?: number;
}

export interface MatchScoreBreakdown {
  materialCompatibility: number;
  quantityCompatibility: number;
  proximity: number;
  condition: number;
  transaction: number;
  price: number;
  carbonBenefit: number;
}

export interface BuyerRequirement {
  category?: MaterialCategory | string;
  quantity?: number;
  unit?: string;
  condition?: MaterialCondition | string;
  transactionType?: TransactionType | string;
  maxPrice?: number;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface SmartMatch {
  id: string;
  materialId: string;
  material: Material;
  buyerCompanyId: string;
  buyerCompany: Company;
  supplierCompany: Company;
  matchScore: number; // 0-100
  matchQuality?: string;
  compatibility: MatchCompatibility;
  scoreBreakdown?: MatchScoreBreakdown;
  matchReasons?: string[];
  distanceKm: number;
  potentialSavingsInr: number;
  estimatedCo2AvoidedTonnes: number;
  whyThisMatch: string;
  keyDrivers: string[];
  suggestedAction: string;
}

export type TransactionStatus =
  | 'Order Confirmed'
  | 'Pickup Scheduled'
  | 'In Transit'
  | 'Delivered'
  | 'Verified';

export interface TrackingEvent {
  status: TransactionStatus;
  date: string;
  time: string;
  location: string;
  description: string;
  completed: boolean;
}

export interface Transaction {
  id: string;
  orderNumber: string;
  materialId: string;
  materialTitle: string;
  materialCategory: MaterialCategory;
  quantity: number;
  unit: string;
  supplier: Company;
  buyer: Company;
  supplierCompany?: Company;
  buyerCompany?: Company;
  materialCostInr: number;
  transportCostInr: number;
  totalInr: number;
  totalAmountInr?: number;
  status: TransactionStatus;
  type: 'Purchase' | 'Sale' | 'Exchange';
  date: string;
  createdAt?: string;
  estimatedCo2AvoidedTonnes: number;
  co2SavedTonnes?: number;
  wasteDivertedTonnes: number;
  trackingEvents: TrackingEvent[];
  logistics?: {
    events: TrackingEvent[];
  };
  optimizedRouteSavingsInr: number;
  carbonAvoidedTransportKg: number;
}

export interface RouteMetrics {
  distanceKm: number;
  costInr: number;
  co2Kg: number;
  durationHours: number;
}

export interface LogisticsPlan {
  id: string;
  transactionId: string;
  orderNumber: string;
  origin: string;
  destination: string;
  materialQuantityKg: number;
  vehicleType: 'EV Small Truck' | 'CNG Medium Hauler' | 'Standard Heavy Diesel' | 'Light Commercial Vehicle';
  standardRoute: RouteMetrics;
  optimizedRoute: RouteMetrics;
  savingsInr: number;
  emissionsAvoidedKg: number;
  emissionsReductionPercent: number;
  status: TransactionStatus;
  waypoints: { name: string; type: 'origin' | 'hub' | 'destination'; lat: number; lng: number }[];
}

export interface EcosystemNode {
  id: string;
  name: string;
  type: 'Supplier' | 'Buyer' | 'Recycler' | 'Logistics Hub';
  location: string;
  city: string;
  xPercent: number; // For interactive visual map
  yPercent: number;
  materials: string[];
  demandOrSupply: string;
  circularityScore: number;
  distanceKm: number;
  potentialCo2Tonnes: number;
  potentialSavingsInr: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'match' | 'offer' | 'order' | 'logistics' | 'impact' | 'verification';
  link?: string;
}

export interface AiDetectionResult {
  detectedMaterial: string;
  confidence: number;
  estimatedCondition: MaterialCondition;
  suggestedCategory: MaterialCategory;
  suggestedDescription: string;
  suggestedPriceRange: string;
  suggestedTags: string[];
}

export interface UserStats {
  materialsPurchasedKg: number;
  materialsListedKg: number;
  wasteDivertedTonnes: number;
  co2eAvoidedTonnes: number;
  moneySavedInr: number;
  circularityScore: number;
  scoreBreakdown: {
    materialReuse: number;
    recycledInputs: number;
    wasteDiversion: number;
    localSourcing: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: string | Company;
  phone?: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface MaterialFilters {
  category?: MaterialCategory | 'All';
  condition?: MaterialCondition | 'All';
  transactionType?: TransactionType | 'All';
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  maxDistanceKm?: number;
  verifiedOnly?: boolean;
  search?: string;
  city?: string;
  status?: string;
}

export interface MaterialQueryParams {
  category?: string;
  condition?: string;
  transactionType?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  search?: string;
  city?: string;
  sort?: string;
  page?: number;
  limit?: number;
  status?: string;
}

export interface TransactionCreatePayload {
  materialId: string;
  quantity: number;
  pickupLocation?: {
    city?: string;
    state?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  destinationLocation?: {
    city?: string;
    state?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  customTransportCost?: number;
}
