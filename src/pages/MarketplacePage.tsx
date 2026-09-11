import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MaterialCard } from '../components/marketplace/MaterialCard';
import { FiltersSidebar } from '../components/marketplace/FiltersDrawer';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { MaterialCategory, MaterialCondition, TransactionType } from '../types';

export const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    materials,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    backendMode,
    isLoadingMaterials,
    materialsError,
    refreshMaterials,
  } = useApp();

  const [searchParams] = useSearchParams();

  // Filters State
  const [filters, setFilters] = useState({
    category: (selectedCategory || searchParams.get('category') || 'All') as
      | MaterialCategory
      | 'All',
    condition: 'All' as MaterialCondition | 'All',
    transactionType: 'All' as TransactionType | 'All',
    maxDistanceKm: 250,
    maxPrice: 1000,
    verifiedOnly: false,
  });

  const [sortBy, setSortBy] = useState<
    'match' | 'nearest' | 'price_low' | 'price_high' | 'carbon_saving' | 'newest'
  >('match');

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync selectedCategory from context if changed
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'All') {
      setFilters((prev) => ({ ...prev, category: selectedCategory as any }));
    }
  }, [selectedCategory]);

  // Debounced query to backend/service
  useEffect(() => {
    const handler = setTimeout(() => {
      refreshMaterials({
        search: searchQuery.trim() || undefined,
        category: filters.category !== 'All' ? filters.category : undefined,
        condition: filters.condition !== 'All' ? filters.condition : undefined,
        transactionType: filters.transactionType !== 'All' ? filters.transactionType : undefined,
        maxPrice: filters.maxPrice < 1000 ? filters.maxPrice : undefined,
        sort:
          sortBy === 'price_low'
            ? 'price_low'
            : sortBy === 'price_high'
            ? 'price_high'
            : sortBy === 'carbon_saving'
            ? 'carbon_saving'
            : sortBy === 'newest'
            ? 'newest'
            : undefined,
      });
    }, 200);

    return () => clearTimeout(handler);
  }, [filters.category, filters.condition, filters.transactionType, filters.maxPrice, searchQuery, sortBy, refreshMaterials]);

  const resetFilters = () => {
    setFilters({
      category: 'All',
      condition: 'All',
      transactionType: 'All',
      maxDistanceKm: 250,
      maxPrice: 1000,
      verifiedOnly: false,
    });
    setSelectedCategory('All');
    setSearchQuery('');
    refreshMaterials();
  };

  // Filtered & Sorted Materials
  const filteredMaterials = useMemo(() => {
    return materials
      .filter((mat) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = mat.title.toLowerCase().includes(q);
          const matchDesc = mat.description.toLowerCase().includes(q);
          const matchCat = mat.category.toLowerCase().includes(q);
          const matchCity = mat.city?.toLowerCase().includes(q) || mat.location?.toLowerCase().includes(q);
          const matchTags = Array.isArray(mat.tags) && mat.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCat && !matchCity && !matchTags) {
            return false;
          }
        }

        // Category
        if (filters.category !== 'All' && mat.category !== filters.category) {
          return false;
        }

        // Condition
        if (filters.condition !== 'All' && mat.condition !== filters.condition) {
          return false;
        }

        // Transaction Type
        if (
          filters.transactionType !== 'All' &&
          mat.transactionType !== filters.transactionType
        ) {
          return false;
        }

        // Distance
        if (mat.distanceKm > filters.maxDistanceKm) {
          return false;
        }

        // Verified
        if (filters.verifiedOnly && !mat.supplier?.verified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest') {
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        }
        if (sortBy === 'price_low') {
          return a.pricePerUnit - b.pricePerUnit;
        }
        if (sortBy === 'price_high') {
          return b.pricePerUnit - a.pricePerUnit;
        }
        if (sortBy === 'carbon_saving') {
          return (b.impact?.co2eAvoidedTonnes || 0) - (a.impact?.co2eAvoidedTonnes || 0);
        }
        // default match / newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [materials, searchQuery, filters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'All') count++;
    if (filters.condition !== 'All') count++;
    if (filters.transactionType !== 'All') count++;
    if (filters.maxDistanceKm < 250) count++;
    if (filters.verifiedOnly) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [filters, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
              Circular Materials Marketplace
            </h1>
            {/* Subtle Backend Mode Pill */}
            {backendMode === 'connected' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                MongoDB Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EEF3F0] text-[#3D5245] border border-[#D5E2D9]">
                <Database className="w-3 h-3 text-[#5A7062]" />
                Preview Mode (Fallback Active)
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#54675B] mt-0.5">
            Discover verified surplus packaging inventory, recyclable polymer scrap, and industrial skids.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#7A8E82] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search material, city, polymer grade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#D8E3DC] rounded-xl text-xs sm:text-sm text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-md text-[#889B90] hover:text-[#16382C] absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        {['All', 'Cardboard', 'Plastic', 'Pallets', 'Paper', 'Glass', 'Metal'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilters({ ...filters, category: cat as any });
                setSelectedCategory(cat as any);
              }}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                filters.category === cat
                  ? 'bg-[#16382C] text-white shadow-xs'
                  : 'bg-white border border-[#DCE5DE] text-[#44554B] hover:bg-[#F3F7F4]'
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Smart Circular Matching Callout */}
      <div className="bg-[#F2F7F4] border border-[#D5E5DA] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#16382C] text-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#162720]">
              Seeking Structured Batch Matching?
            </h4>
            <p className="text-xs text-[#52665B]">
              Use our deterministic 7-factor engine to rank supplier lots by distance, grade affinity, batch volume & Scope 3 carbon avoided.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/matches')}
          icon={<Sparkles className="w-3.5 h-3.5 text-emerald-300" />}
          className="shrink-0"
        >
          Find Circular Matches
        </Button>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Desktop Sidebar / Mobile Drawer */}
        <FiltersSidebar
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          isOpenMobile={isMobileFiltersOpen}
          onCloseMobile={() => setIsMobileFiltersOpen(false)}
        />

        {/* Content Column */}
        <div className="flex-1 w-full space-y-4">
          {/* Subheader: Results count, active filters, sort dropdown, mobile filter button */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E3ECE6] shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D7E2DB] bg-[#F7FAF8] text-xs font-bold text-[#16382C]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              <span className="text-xs sm:text-sm font-bold text-[#182620]">
                Showing {filteredMaterials.length} materials
              </span>

              {isLoadingMaterials && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#55695D] bg-[#F1F6F3] px-2 py-0.5 rounded-md">
                  <RefreshCw className="w-3 h-3 animate-spin text-[#16382C]" />
                  Syncing...
                </span>
              )}

              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="hidden sm:inline-flex text-xs text-[#5E7166] hover:text-[#16382C] font-semibold items-center gap-1 ml-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear filters</span>
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#64766C] font-medium hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-3 bg-[#F6FAF7] border border-[#DAE4DC] rounded-xl text-xs font-semibold text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20 cursor-pointer"
              >
                <option value="match">Best Match (Algorithm)</option>
                <option value="nearest">Nearest First (Distance)</option>
                <option value="carbon_saving">Highest Carbon Avoided</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest Listings</option>
              </select>
            </div>
          </div>

          {/* Active filter badges */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {filters.category !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EBF2EC] text-[#16382C] text-xs font-medium">
                  <span>Category: {filters.category}</span>
                  <button onClick={() => setFilters({ ...filters, category: 'All' })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.condition !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EBF2EC] text-[#16382C] text-xs font-medium">
                  <span>Condition: {filters.condition}</span>
                  <button onClick={() => setFilters({ ...filters, condition: 'All' })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.transactionType !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EBF2EC] text-[#16382C] text-xs font-medium">
                  <span>Type: {filters.transactionType}</span>
                  <button onClick={() => setFilters({ ...filters, transactionType: 'All' })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.verifiedOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-medium">
                  <span>Verified Suppliers Only</span>
                  <button onClick={() => setFilters({ ...filters, verifiedOnly: false })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Materials Grid */}
          {filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No materials matched your filter criteria"
              description="Try broadening your search radius, selecting a different material category, or resetting all active filters."
              actionLabel="Reset All Filters"
              onAction={resetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
};
