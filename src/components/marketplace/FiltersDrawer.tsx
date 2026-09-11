import React from 'react';
import { MaterialCategory, MaterialCondition, TransactionType } from '../../types';
import { Button } from '../common/Button';
import { X, RotateCcw, Filter } from 'lucide-react';

interface FiltersState {
  category: MaterialCategory | 'All';
  condition: MaterialCondition | 'All';
  transactionType: TransactionType | 'All';
  maxDistanceKm: number;
  maxPrice: number;
  verifiedOnly: boolean;
}

interface FiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FiltersSidebar: React.FC<FiltersProps> = ({
  filters,
  onChange,
  onReset,
  isOpenMobile,
  onCloseMobile
}) => {
  const categories: (MaterialCategory | 'All')[] = [
    'All',
    'Cardboard',
    'Plastic',
    'Pallets',
    'Paper',
    'Glass',
    'Metal',
    'Other'
  ];

  const conditions: (MaterialCondition | 'All')[] = [
    'All',
    'New',
    'Good',
    'Used',
    'Recyclable'
  ];

  const transactionTypes: (TransactionType | 'All')[] = [
    'All',
    'Purchase',
    'Free Claim',
    'Exchange'
  ];

  const content = (
    <div className="space-y-6 text-xs sm:text-sm">
      {/* Header for desktop / mobile */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EEF3F0]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#16382C]" />
          <h3 className="font-bold text-sm text-[#182620]">Filter Materials</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-[#5D6F65] hover:text-[#16382C] flex items-center gap-1 font-medium hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Material Type */}
      <div>
        <label className="block text-xs font-bold text-[#324239] uppercase tracking-wider mb-2.5">
          Material Category
        </label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <label
              key={cat}
              className={`flex items-center justify-between px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                filters.category === cat
                  ? 'bg-[#EBF2EC] text-[#16382C] font-semibold'
                  : 'hover:bg-[#F3F7F4] text-[#425248]'
              }`}
            >
              <span className="text-xs">{cat}</span>
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => onChange({ ...filters, category: cat })}
                className="accent-[#16382C] w-3.5 h-3.5"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-bold text-[#324239] uppercase tracking-wider mb-2.5">
          Condition
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {conditions.map((cond) => (
            <button
              key={cond}
              type="button"
              onClick={() => onChange({ ...filters, condition: cond })}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                filters.condition === cond
                  ? 'bg-[#16382C] text-white border-[#16382C]'
                  : 'bg-white text-[#4A5A50] border-[#DCE4DE] hover:bg-[#F3F7F4]'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Type */}
      <div>
        <label className="block text-xs font-bold text-[#324239] uppercase tracking-wider mb-2.5">
          Transaction Type
        </label>
        <div className="space-y-1">
          {transactionTypes.map((type) => (
            <label
              key={type}
              className={`flex items-center justify-between px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                filters.transactionType === type
                  ? 'bg-[#EBF2EC] text-[#16382C] font-semibold'
                  : 'hover:bg-[#F3F7F4] text-[#425248]'
              }`}
            >
              <span className="text-xs">{type}</span>
              <input
                type="radio"
                name="transactionType"
                checked={filters.transactionType === type}
                onChange={() => onChange({ ...filters, transactionType: type })}
                className="accent-[#16382C] w-3.5 h-3.5"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Distance Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <label className="font-bold text-[#324239] uppercase tracking-wider">
            Radius (Distance)
          </label>
          <span className="font-mono font-semibold text-[#16382C]">
            Up to {filters.maxDistanceKm} km
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="300"
          step="10"
          value={filters.maxDistanceKm}
          onChange={(e) =>
            onChange({ ...filters, maxDistanceKm: Number(e.target.value) })
          }
          className="w-full accent-[#16382C] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#7A8C82] mt-1 font-mono">
          <span>10 km</span>
          <span>150 km</span>
          <span>300 km</span>
        </div>
      </div>

      {/* Verified suppliers toggle */}
      <div className="pt-2 border-t border-[#EEF3F0]">
        <label className="flex items-center justify-between cursor-pointer py-1">
          <div>
            <span className="text-xs font-bold text-[#2A3931] block">
              Verified Partners Only
            </span>
            <span className="text-[11px] text-[#697B71]">
              Filter for audited circular suppliers
            </span>
          </div>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) =>
              onChange({ ...filters, verifiedOnly: e.target.checked })
            }
            className="w-4 h-4 accent-[#16382C] rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );

  // Responsive Drawer on Mobile, static panel on Desktop
  return (
    <>
      {/* Desktop Panel */}
      <div className="hidden lg:block w-64 bg-white p-5 rounded-2xl border border-[#E3ECE6] shadow-2xs shrink-0 self-start sticky top-20">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onCloseMobile}
          />
          <div className="relative w-80 max-w-[90vw] h-full bg-white z-10 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EEF3F0]">
                <h3 className="font-bold text-base text-[#182620]">Filters</h3>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-[#65766D] hover:bg-[#EEF4F0]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>
            <div className="pt-6 border-t border-[#EEF3F0] mt-6">
              <Button
                variant="primary"
                className="w-full"
                onClick={onCloseMobile}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
