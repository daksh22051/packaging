import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Company,
  Material,
  SmartMatch,
  Transaction,
  TrackingEvent,
  LogisticsPlan,
  NotificationItem,
  UserStats,
  MaterialCategory,
  MaterialQueryParams,
  TransactionStatus,
  BuyerRequirement,
} from '../types';
import {
  CURRENT_USER_COMPANY,
  MOCK_COMPANIES,
  INITIAL_MATERIALS,
  INITIAL_MATCHES,
  INITIAL_TRANSACTIONS,
  DEMO_LOGISTICS_PLAN,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER_STATS,
} from '../data/mockData';
import { materialService } from '../services/materialService';
import { transactionService } from '../services/transactionService';
import { matchService } from '../services/matchService';

export type BackendMode = 'connected' | 'preview';

interface AppContextType {
  currentUser: Company;
  setCurrentUser: (company: Company) => void;
  availableCompanies: Company[];
  userStats: UserStats;
  materials: Material[];
  savedMaterialIds: string[];
  matches: SmartMatch[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  logisticsPlan: LogisticsPlan;
  unreadNotificationsCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: MaterialCategory | 'All';
  setSelectedCategory: (cat: MaterialCategory | 'All') => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  backendMode: BackendMode;
  isLoadingMaterials: boolean;
  materialsError: string | null;
  isLoadingMatches: boolean;
  activeRequirement: BuyerRequirement;
  setActiveRequirement: (req: BuyerRequirement) => void;
  findSmartMatches: (req?: BuyerRequirement) => Promise<SmartMatch[]>;
  refreshMatches: () => Promise<void>;
  refreshMaterials: (params?: MaterialQueryParams) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  toggleSaveMaterial: (id: string) => void;
  addMaterial: (material: any) => Promise<Material>;
  requestMaterial: (
    materialOrId: Material | string,
    quantity: number,
    notes?: string
  ) => Promise<Transaction>;
  updateTransactionStatus: (id: string, status: TransactionStatus) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  triggerToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  activeToast: { title: string; message: string; type: 'success' | 'info' | 'warning' } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Company>(CURRENT_USER_COMPANY);
  const [availableCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [savedMaterialIds, setSavedMaterialIds] = useState<string[]>(['mat-001']);
  const [matches, setMatches] = useState<SmartMatch[]>(INITIAL_MATCHES);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [activeRequirement, setActiveRequirement] = useState<BuyerRequirement>({
    category: 'Cardboard',
    quantity: 5000,
    unit: 'kg',
    condition: 'Good',
    transactionType: 'Purchase',
    maxPrice: 25,
    city: 'Ahmedabad',
    latitude: 23.0225,
    longitude: 72.5714,
  });
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [logisticsPlan, setLogisticsPlan] = useState<LogisticsPlan>(DEMO_LOGISTICS_PLAN);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'All'>('All');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [backendMode, setBackendMode] = useState<BackendMode>('preview');
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [materialsError, setMaterialsError] = useState<string | null>(null);

  /**
   * Find smart circular matches using multi-factor deterministic scoring engine
   */
  const findSmartMatches = useCallback(
    async (req?: BuyerRequirement): Promise<SmartMatch[]> => {
      setIsLoadingMatches(true);
      const targetReq = req || activeRequirement;
      if (req) {
        setActiveRequirement(req);
      }
      try {
        const res = await matchService.getMatches(targetReq, materials);
        setMatches(res.matches);
        return res.matches;
      } catch (err) {
        console.error('Error finding smart matches:', err);
        return matches;
      } finally {
        setIsLoadingMatches(false);
      }
    },
    [activeRequirement, materials, matches]
  );

  const refreshMatches = useCallback(async () => {
    await findSmartMatches(activeRequirement);
  }, [findSmartMatches, activeRequirement]);

  useEffect(() => {
    findSmartMatches();
  }, [materials]);

  const [activeToast, setActiveToast] = useState<{
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const triggerToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' = 'success'
  ) => {
    setActiveToast({ title, message, type });
    setTimeout(() => {
      setActiveToast((prev) => (prev?.title === title ? null : prev));
    }, 4500);
  };

  /**
   * Refresh materials from REST API /materials
   */
  const refreshMaterials = useCallback(async (params?: MaterialQueryParams) => {
    setIsLoadingMaterials(true);
    setMaterialsError(null);
    try {
      const res = await materialService.getAll(params);
      setMaterials(res.materials);
      setBackendMode(res.source);
    } catch (err: any) {
      setMaterialsError(err.message || 'Failed to load materials');
      setBackendMode('preview');
    } finally {
      setIsLoadingMaterials(false);
    }
  }, []);

  /**
   * Refresh transactions from REST API /transactions
   */
  const refreshTransactions = useCallback(async () => {
    try {
      const txs = await transactionService.getAll();
      if (txs && txs.length > 0) {
        setTransactions(txs);
      }
    } catch (err) {
      console.warn('Could not load transactions from REST API:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshMaterials();
    refreshTransactions();
  }, [refreshMaterials, refreshTransactions]);

  const toggleSaveMaterial = (id: string) => {
    setSavedMaterialIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      triggerToast(
        exists ? 'Removed from Saved' : 'Material Saved',
        exists ? 'Listing removed from your saved items.' : 'Saved to your circular watch list.',
        'info'
      );
      return next;
    });
  };

  /**
   * Add a new material listing (calls materialService.create)
   */
  const addMaterial = async (
    materialData: any
  ): Promise<Material> => {
    const formattedTitle = materialData.title || `${materialData.condition || 'Good'} ${materialData.category} Surplus`;

    const { material: newMaterial, source } = await materialService.create({
      title: formattedTitle,
      category: materialData.category,
      description: materialData.description || '',
      quantity: materialData.quantity || 1000,
      unit: materialData.unit || 'kg',
      pricePerUnit: materialData.pricePerUnit || 0,
      condition: materialData.condition || 'Good',
      transactionType: materialData.transactionType || 'Purchase',
      city: materialData.city || materialData.location?.city || currentUser.city,
      state: materialData.state || materialData.location?.state || currentUser.state,
      location: materialData.location,
      grade: materialData.specifications?.grade || materialData.grade,
      dimensions: materialData.specifications?.dimensions || materialData.dimensions,
      weight: materialData.specifications?.weight || materialData.weight,
      recyclability: materialData.specifications?.recyclabilityRate
        ? parseInt(materialData.specifications.recyclabilityRate)
        : 100,
      images: materialData.images,
      tags: materialData.tags,
    });

    setMaterials((prev) => [newMaterial, ...prev.filter((m) => m.id !== newMaterial.id)]);
    if (source === 'backend') setBackendMode('backend');

    // Update user stats
    setUserStats((prev) => ({
      ...prev,
      materialsListedKg: prev.materialsListedKg + (newMaterial.quantity || 1000),
      circularityScore: Math.min(100, prev.circularityScore + 1),
    }));

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Material Published',
      message: `${newMaterial.title} (${newMaterial.quantity} ${newMaterial.unit}) is now live on the marketplace.`,
      timestamp: 'Just now',
      read: false,
      type: 'offer',
      link: `/marketplace/${newMaterial.id}`,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerToast(
      'Material Published Successfully',
      `Your listing for ${newMaterial.quantity} ${newMaterial.unit} of ${newMaterial.category} is active.`
    );

    return newMaterial;
  };

  /**
   * Request / Buy / Claim a material (calls transactionService.create)
   */
  const requestMaterial = async (
    materialOrId: Material | string,
    quantity: number,
    notes?: string
  ): Promise<Transaction> => {
    let targetMaterial: Material | undefined;

    if (typeof materialOrId === 'string') {
      targetMaterial = materials.find((m) => m.id === materialOrId);
      if (!targetMaterial) {
        const fetched = await materialService.getById(materialOrId);
        targetMaterial = fetched.material || undefined;
      }
    } else {
      targetMaterial = materialOrId;
    }

    const material = targetMaterial || materials[0];
    const qty = quantity || material.quantity || 1000;

    // Create via transactionService
    const createdTx = await transactionService.create({
      materialId: material.id,
      quantity: qty,
      pickupLocation: {
        city: material.city || 'Origin Plant',
        state: material.state || 'Gujarat',
      },
      destinationLocation: {
        city: currentUser.city || 'Buyer Plant',
        state: currentUser.state || 'Maharashtra',
      },
      customTransportCost: 4650,
    });

    setTransactions((prev) => [createdTx, ...prev.filter((t) => t.id !== createdTx.id)]);

    // Update material remaining quantity locally
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === material.id) {
          const newQty = Math.max(0, m.quantity - qty);
          return {
            ...m,
            quantity: newQty,
            status: newQty === 0 ? 'Completed' : 'Available',
          };
        }
        return m;
      })
    );

    // Update user stats
    setUserStats((prev) => ({
      ...prev,
      materialsPurchasedKg: prev.materialsPurchasedKg + qty,
      wasteDivertedTonnes: Number((prev.wasteDivertedTonnes + qty / 1000).toFixed(1)),
      co2eAvoidedTonnes: Number(
        (prev.co2eAvoidedTonnes + (material.impact?.co2eAvoidedTonnes || 1.8)).toFixed(1)
      ),
      moneySavedInr: prev.moneySavedInr + 14500 + 750,
      circularityScore: Math.min(100, prev.circularityScore + 2),
    }));

    // Update logistics plan with new transaction
    setLogisticsPlan((prev) => ({
      ...prev,
      transactionId: createdTx.id,
      orderNumber: createdTx.orderNumber,
      origin: `${material.supplier?.name || 'Supplier'} (${material.location})`,
      destination: `${currentUser?.name || 'Buyer'} (${currentUser?.location || 'Your Plant'})`,
      materialQuantityKg: qty,
      status: createdTx.status,
    }));

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Order Confirmed: ${createdTx.orderNumber}`,
      message: `Requested ${qty} ${material.unit} of ${material.title}. Optimized transport active.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
      link: '/transactions',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerToast(
      'Order Confirmed!',
      `Order ${createdTx.orderNumber} placed. Optimized logistics route and carbon ledger updated.`
    );

    return createdTx;
  };

  /**
   * Update transaction status
   */
  const updateTransactionStatus = async (id: string, status: TransactionStatus) => {
    const updated = await transactionService.updateStatus(id, status);
    if (updated) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } else {
      setTransactions((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const updatedEvents = t.trackingEvents.map((evt) =>
              evt.status === status ? { ...evt, completed: true } : evt
            );
            return { ...t, status, trackingEvents: updatedEvents };
          }
          return t;
        })
      );
    }

    if (logisticsPlan.transactionId === id) {
      setLogisticsPlan((prev) => ({ ...prev, status }));
    }

    triggerToast('Shipment Status Updated', `Shipment status changed to ${status}.`, 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast('Notifications Cleared', 'All notifications marked as read.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableCompanies,
        userStats,
        materials,
        savedMaterialIds,
        matches,
        transactions,
        notifications,
        logisticsPlan,
        unreadNotificationsCount,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        backendMode,
        isLoadingMaterials,
        materialsError,
        isLoadingMatches,
        activeRequirement,
        setActiveRequirement,
        findSmartMatches,
        refreshMatches,
        refreshMaterials,
        refreshTransactions,
        toggleSaveMaterial,
        addMaterial,
        requestMaterial,
        updateTransactionStatus,
        markNotificationRead,
        markAllNotificationsRead,
        triggerToast,
        activeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
