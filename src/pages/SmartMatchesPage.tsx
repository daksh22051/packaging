import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Filter,
  SlidersHorizontal,
  MapPin,
  HelpCircle,
  ArrowRight,
  Search,
  RotateCcw,
  Scale,
  DollarSign,
  Building2,
  CheckCircle2,
  Calculator,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MatchCard } from '../components/matches/MatchCard';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { BuyerRequirement } from '../types';

export const SmartMatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    matches,
    isLoadingMatches,
    findSmartMatches,
    activeRequirement,
    backendMode,
  } = useApp();

  // Buyer Requirement Form State
  const [requirement, setRequirement] = useState<BuyerRequirement>({
    category: activeRequirement?.category || 'Cardboard',
    quantity: activeRequirement?.quantity || 5000,
    unit: activeRequirement?.unit || 'kg',
    condition: activeRequirement?.condition || 'Good',
    transactionType: activeRequirement?.transactionType || 'Purchase',
    maxPrice: activeRequirement?.maxPrice || 25,
    city: activeRequirement?.city || 'Ahmedabad',
  });

  const [minScore, setMinScore] = useState<number>(60);
  const [isRequirementOpen, setIsRequirementOpen] = useState(true);

  const handleFindMatches = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await findSmartMatches(requirement);
  };

  const handleResetRequirement = () => {
    const defaultReq: BuyerRequirement = {
      category: 'All',
      quantity: 2500,
      unit: 'kg',
      condition: 'All',
      transactionType: 'All',
      maxPrice: 30,
      city: 'Ahmedabad',
    };
    setRequirement(defaultReq);
    findSmartMatches(defaultReq);
  };

  const filteredMatches = matches.filter((m) => m.matchScore >= minScore);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E3ECE6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#16382C] text-emerald-300 text-xs font-bold font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              Circular Matching Engine v3.0
            </span>
            <span className="text-xs text-[#62756A] font-medium">
              Multi-Factor Weighted Deterministic Scoring
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
            Smart Circular Matching
          </h1>
          <p className="text-xs sm:text-sm text-[#54675B] mt-0.5 max-w-3xl">
            Input your exact procurement requirements. Our algorithmic engine evaluates material grade, batch volume, transit distance, commercial terms, and certified Scope 3 carbon avoided.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/marketplace')}
          >
            All Marketplace Materials
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/opportunity-map')}
            icon={<MapPin className="w-3.5 h-3.5" />}
          >
            Ecosystem Map
          </Button>
        </div>
      </div>

      {/* Interactive "Find Circular Matches" Requirement Panel */}
      <div className="bg-white rounded-2xl border border-[#D7E4DC] shadow-xs overflow-hidden">
        <div className="px-5 py-4 bg-[#F5F9F6] border-b border-[#E2ECE5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#16382C] text-emerald-300 flex items-center justify-center font-bold text-sm">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-[#152720]">
                Buyer Requirement Parameters
              </h2>
              <p className="text-xs text-[#566B60]">
                Tune the matching weights by specifying category, lot volume, location, and budget
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRequirementOpen(!isRequirementOpen)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 px-2.5 py-1 rounded-lg hover:bg-[#E8F2EC] transition-colors"
            >
              {isRequirementOpen ? 'Hide Input Panel' : 'Edit Requirements'}
            </button>
            <button
              onClick={handleResetRequirement}
              className="text-xs text-[#5F7368] hover:text-[#182620] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#E8F2EC] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {isRequirementOpen && (
          <form onSubmit={handleFindMatches} className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Category */}
              <div className="space-y-1.5 lg:col-span-1">
                <label className="text-xs font-bold text-[#35483E] uppercase tracking-wider block">
                  Material Stream
                </label>
                <select
                  value={requirement.category || 'All'}
                  onChange={(e) =>
                    setRequirement((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-[#F9FCFA] border border-[#D5E3DA] rounded-xl text-xs sm:text-sm text-[#162720] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  <option value="All">All Streams (Broad)</option>
                  <option value="Cardboard">Cardboard</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Pallets">Pallets</option>
                  <option value="Paper">Paper</option>
                  <option value="Glass">Glass</option>
                  <option value="Metal">Metal</option>
                  <option value="Other">Other Industrial</option>
                </select>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5 lg:col-span-1">
                <label className="text-xs font-bold text-[#35483E] uppercase tracking-wider block">
                  Required Volume
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={requirement.quantity || 1000}
                    onChange={(e) =>
                      setRequirement((prev) => ({
                        ...prev,
                        quantity: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#F9FCFA] border border-[#D5E3DA] rounded-xl text-xs sm:text-sm text-[#162720] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                  <select
                    value={requirement.unit || 'kg'}
                    onChange={(e) =>
                      setRequirement((prev) => ({ ...prev, unit: e.target.value }))
                    }
                    className="px-2 py-2 bg-[#F9FCFA] border border-[#D5E3DA] rounded-xl text-xs font-semibold text-[#162720] focus:outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="tonnes">tonnes</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-1.5 lg:col-span-1">
                <label className="text-xs font-bold text-[#35483E] uppercase tracking-wider block">
                  Min Condition
                </label>
                <select
                  value={requirement.condition || 'All'}
                  onChange={(e) =>
                    setRequirement((prev) => ({ ...prev, condition: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-[#F9FCFA] border border-[#D5E3DA] rounded-xl text-xs sm:text-sm text-[#162720] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  <option value="All">Any Condition</option>
                  <option value="New">New / Surplus Only</option>
                  <option value="Good">Good Condition</option>
                  <option value="Used">Used / Reusable</option>
                  <option value="Recyclable">Recyclable Grade</option>
                </select>
              </div>

              {/* Transaction Mode */}
              <div className="space-y-1.5 lg:col-span-1">
                <label className="text-xs font-bold text-[#35483E] uppercase tracking-wider block">
                  Commercial Mode
                </label>
                <select
                  value={requirement.transactionType || 'All'}
                  onChange={(e) =>
                    setRequirement((prev) => ({
                      ...prev,
                      transactionType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#F9FCFA] border border-[#D5E3DA] rounded-xl text-xs sm:text-sm text-[#162720] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  <option value="All">All Modes</option>
                  <option value="Purchase">Purchase (B2B)</option>
                  <option value="Free Claim">Free Claim (Zero Cost)</option>
                  <option value="Exchange">Material Exchange</option>
                </select>
              </div>

              {/* Max Budget */}
              <div className="space-y-1.5 lg:col-span-1">
                <label className="text-xs font-bold text-[#35483E] uppercase tracking-wider block">
                  Budget (₹/unit)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="e.g. 25"
                    value={requirement.maxPrice ?? ''}
                    onChange={(e) =>
                      setRequirement((prev) => ({
                        ...prev,
                        maxPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#F9FCFA] border border-[#D5E3DA] rounded-xl text-xs sm:text-sm text-[#162720] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#7A8E83]">
                    ₹ max
                  </span>
                </div>
              </div>

              {/* Buyer Location */}
              <div className="space-y-1.5 lg:col-span-1">
                <label className="text-xs font-bold text-[#35483E] uppercase tracking-wider block">
                  Facility Hub
                </label>
                <select
                  value={requirement.city || 'Ahmedabad'}
                  onChange={(e) =>
                    setRequirement((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-[#F9FCFA] border border-[#D5E3DA] rounded-xl text-xs sm:text-sm text-[#162720] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  <option value="Ahmedabad">Ahmedabad, GJ</option>
                  <option value="Surat">Surat, GJ</option>
                  <option value="Vadodara">Vadodara, GJ</option>
                  <option value="Mumbai">Mumbai, MH</option>
                  <option value="Pune">Pune, MH</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru, KA</option>
                  <option value="Chennai">Chennai, TN</option>
                </select>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EEF3F0]">
              <div className="flex items-center gap-2 text-xs text-[#5D7166]">
                <span className="font-semibold text-[#182620]">Active Criteria:</span>
                <span>
                  {requirement.quantity?.toLocaleString()} {requirement.unit || 'kg'} of{' '}
                  <strong>{requirement.category || 'All Categories'}</strong> in{' '}
                  <strong>{requirement.city}</strong>
                  {requirement.maxPrice ? ` • ≤ ₹${requirement.maxPrice}/unit` : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isLoadingMatches}
                  icon={
                    isLoadingMatches ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                    )
                  }
                >
                  {isLoadingMatches ? 'Evaluating Candidates...' : 'Find Matches'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Threshold filter and result counter */}
      <div className="bg-white p-4 rounded-2xl border border-[#E3ECE6] shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#34463C] uppercase tracking-wider text-[11px]">
            Match Score Tier:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'All Matches', score: 0 },
              { label: '60%+ Potential', score: 60 },
              { label: '75%+ Strong', score: 75 },
              { label: '88%+ Excellent', score: 88 },
            ].map((tier) => (
              <button
                key={tier.score}
                onClick={() => setMinScore(tier.score)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  minScore === tier.score
                    ? 'bg-[#16382C] text-white shadow-xs'
                    : 'bg-[#F4F8F5] text-[#45574C] hover:bg-[#EEF4F0] border border-[#E0ECE3]'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#485B51]">
          <span>
            Displaying <strong>{filteredMatches.length}</strong> matching circular candidates
          </span>
          {backendMode === 'connected' && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md font-mono text-[10px]">
              REST API Online
            </span>
          )}
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Candidates Met This Compatibility Threshold"
          description="Try reducing the minimum match score threshold or broadening your volume, condition, or budget criteria."
          actionLabel="Reset Requirement Criteria"
          onAction={handleResetRequirement}
        />
      )}

      {/* Engine Architecture & Methodology Footer */}
      <div className="p-6 rounded-3xl bg-[#F6FAF7] border border-[#DEEAE0] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#16382C] text-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#162720]">
              CIRCULA Deterministic Scoring Methodology
            </h4>
            <p className="text-xs text-[#52655A] mt-0.5">
              Every candidate is ranked using 7 transparent mathematical factors: Material (30%), Quantity (20%), Proximity (15%), Condition (10%), Transaction (10%), Price (5%), and Carbon Avoidance (10%).
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/marketplace')}
          className="shrink-0"
        >
          Browse All Materials
        </Button>
      </div>
    </div>
  );
};
