import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Leaf,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Check,
  Building2,
  Tag,
  Scale,
} from 'lucide-react';
import { SmartMatch } from '../../types';
import { Button } from '../common/Button';
import { WhyThisMatchModal } from './WhyThisMatchModal';

export const MatchCard: React.FC<{ match: SmartMatch }> = ({ match }) => {
  const [showWhyModal, setShowWhyModal] = useState(false);
  const navigate = useNavigate();

  const mat = match.material;
  const supplier = match.supplierCompany || mat.supplier;

  // Visual styling tier based on match score
  let scoreBadgeBg = 'bg-[#16382C] text-white';
  let qualityBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
  let qualityLabel = match.matchQuality || 'Potential Match';

  if (match.matchScore >= 88) {
    qualityLabel = 'Excellent Match';
    scoreBadgeBg = 'bg-[#123829] text-white shadow-sm';
    qualityBadge = 'bg-emerald-100/80 text-emerald-900 border-emerald-300 font-bold';
  } else if (match.matchScore >= 75) {
    qualityLabel = 'Strong Match';
    scoreBadgeBg = 'bg-[#1B4D3E] text-white';
    qualityBadge = 'bg-teal-50 text-teal-800 border-teal-200';
  } else {
    qualityLabel = 'Potential Match';
    scoreBadgeBg = 'bg-[#31483D] text-white';
    qualityBadge = 'bg-slate-100 text-slate-800 border-slate-200';
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E3ECE6] hover:border-[#BED0C3] hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Header row: Match score badge, quality tier, and distance */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 ${scoreBadgeBg}`}>
                <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span className="font-mono font-extrabold text-xs sm:text-sm tracking-wide">
                  {match.matchScore}% MATCH
                </span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${qualityBadge}`}>
                {qualityLabel}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-[#596B61] bg-[#F7FAF8] px-2.5 py-1 rounded-full border border-[#E5EFE8]">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-semibold text-[#182620]">
                {match.distanceKm} km away
              </span>
              <span className="text-[#687C71]">({mat?.city || supplier?.city || 'Regional Hub'})</span>
            </div>
          </div>

          {/* Supplier and Material information */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#EEF3F0]">
            <div className="flex gap-3.5">
              <img
                src={
                  mat?.images?.[0] ||
                  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
                }
                alt={mat?.title || 'Material'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#E0E7E2] shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#52655A] mb-0.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-semibold text-[#1D2E25]">
                    {supplier?.name || 'Verified Industrial Supplier'}
                  </span>
                  {supplier?.verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <h4
                  onClick={() => navigate(`/marketplace/${mat.id}`)}
                  className="font-bold text-base sm:text-lg text-[#162720] hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  {mat?.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#5E7066] mt-1">
                  <span className="inline-flex items-center gap-1 bg-[#EEF5F0] text-[#16382C] px-2 py-0.5 rounded-md font-medium">
                    <Scale className="w-3 h-3" />
                    {mat?.quantity?.toLocaleString()} {mat?.unit}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#F6FAF7] text-[#2F4439] px-2 py-0.5 rounded-md font-medium">
                    <Tag className="w-3 h-3" />
                    {mat?.pricePerUnit === 0 ? 'Free Claim' : `₹${mat?.pricePerUnit}/${mat?.unit}`}
                  </span>
                  <span className="text-[#6F8278]">
                    Grade: <strong>{mat?.condition}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Financial and Carbon highlights */}
            <div className="grid grid-cols-2 sm:flex sm:flex-col sm:items-end gap-2 shrink-0 bg-[#F7FAF8] sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-[#63756C] block">
                  Potential Savings
                </span>
                <span className="font-mono font-extrabold text-sm sm:text-base text-emerald-800">
                  ₹{match.potentialSavingsInr.toLocaleString()}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-[#63756C] block">
                  Carbon Avoidance
                </span>
                <span className="font-mono font-extrabold text-sm sm:text-base text-[#16382C]">
                  {match.estimatedCo2AvoidedTonnes} t CO₂e
                </span>
              </div>
            </div>
          </div>

          {/* WHY THIS MATCH? (Deterministic Factual Reasons) */}
          <div className="py-3 border-b border-[#EEF3F0]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#2A3E33] uppercase tracking-wider text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Why This Match?</span>
              </span>
              <button
                onClick={() => setShowWhyModal(true)}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 hover:underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Full Diagnostics</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {(match.matchReasons && match.matchReasons.length > 0
                ? match.matchReasons.slice(0, 3)
                : [
                    `Exact material category: ${mat.category} complies with procurement requirements.`,
                    `${mat.quantity.toLocaleString()} ${mat.unit} volume satisfies demand.`,
                    `Proximity: ${match.distanceKm} km away in ${mat.city || 'Hub'}.`,
                  ]
              ).map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-[#283830]"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5 font-bold" />
                  <span className="leading-snug">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7 Compatibility Factors Matrix */}
          <div className="pt-3 pb-2 space-y-2">
            <span className="font-bold text-[#4B5F54] uppercase tracking-wider text-[10px] block">
              Compatibility Matrix (% Alignment)
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5">
              <div className="p-1.5 rounded-lg bg-[#F6FAF7] border border-[#E3EDE6] text-center">
                <span className="text-[9px] text-[#62756A] block truncate">Material</span>
                <span className="font-mono font-bold text-xs text-[#16382C]">
                  {match.compatibility.material}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#F6FAF7] border border-[#E3EDE6] text-center">
                <span className="text-[9px] text-[#62756A] block truncate">Quantity</span>
                <span className="font-mono font-bold text-xs text-[#16382C]">
                  {match.compatibility.quantity}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#F6FAF7] border border-[#E3EDE6] text-center">
                <span className="text-[9px] text-[#62756A] block truncate">Distance</span>
                <span className="font-mono font-bold text-xs text-[#16382C]">
                  {match.compatibility.distance}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#F6FAF7] border border-[#E3EDE6] text-center">
                <span className="text-[9px] text-[#62756A] block truncate">Condition</span>
                <span className="font-mono font-bold text-xs text-[#16382C]">
                  {match.compatibility.condition ?? 90}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#F6FAF7] border border-[#E3EDE6] text-center">
                <span className="text-[9px] text-[#62756A] block truncate">Terms</span>
                <span className="font-mono font-bold text-xs text-[#16382C]">
                  {match.compatibility.transaction ?? 95}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#F6FAF7] border border-[#E3EDE6] text-center">
                <span className="text-[9px] text-[#62756A] block truncate">Price</span>
                <span className="font-mono font-bold text-xs text-[#16382C]">
                  {match.compatibility.price}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#F6FAF7] border border-[#E3EDE6] text-center">
                <span className="text-[9px] text-[#62756A] block truncate">Carbon</span>
                <span className="font-mono font-bold text-xs text-emerald-800">
                  {match.compatibility.carbon}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="pt-3 border-t border-[#EEF3F0] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setShowWhyModal(true)}
            className="text-xs font-semibold text-[#485950] hover:text-[#16382C] flex items-center gap-1"
          >
            <span>Score Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/marketplace/${mat.id}`)}
            >
              View Material
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/matches/${match.id}`)}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Match Dossier
            </Button>
          </div>
        </div>
      </div>

      {/* Why this match diagnostic modal */}
      <WhyThisMatchModal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        match={match}
      />
    </>
  );
};
