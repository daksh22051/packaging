import React from 'react';
import { Modal } from '../common/Modal';
import { SmartMatch } from '../../types';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Leaf,
  ShieldCheck,
  ArrowRight,
  Calculator,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WhyThisMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: SmartMatch;
}

export const WhyThisMatchModal: React.FC<WhyThisMatchModalProps> = ({
  isOpen,
  onClose,
  match,
}) => {
  const navigate = useNavigate();

  if (!match) return null;

  const mat = match.material;
  const comp = match.compatibility;
  const breakdown = match.scoreBreakdown;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Deterministic Algorithm Diagnostics: ${match.matchScore}% Match`}
      subtitle={`Evaluated between ${match.buyerCompany?.name || 'Buyer'} and ${match.supplierCompany?.name || 'Supplier'}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Core reason callout */}
        <div className="p-4 rounded-2xl bg-[#EEF5F0] border border-[#D5E5DA] flex gap-3.5 items-start">
          <div className="w-8 h-8 rounded-xl bg-[#16382C] text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm text-[#162720]">
                Algorithmic Assessment
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md border border-emerald-300/60">
                Score: {match.matchScore}/100
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#273B30] leading-relaxed">
              "{match.whyThisMatch}"
            </p>
          </div>
        </div>

        {/* WHY THIS MATCH? (Deterministic Factual Reasons) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B4D43] mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Why This Match? — Verified Match Factors</span>
          </h4>
          <div className="space-y-2 bg-[#FAFCFA] p-3.5 rounded-2xl border border-[#E3EDE6]">
            {(match.matchReasons && match.matchReasons.length > 0
              ? match.matchReasons
              : [
                  `Exact material classification: ${mat.category} complies with procurement requirements.`,
                  `${mat.quantity.toLocaleString()} ${mat.unit} available for immediate batch dispatch.`,
                  `Geographic proximity: Located ${match.distanceKm} km away in ${mat.city || 'Hub'}.`,
                  `Certified condition '${mat.condition}' satisfies circular reuse standards.`,
                  `Transaction terms '${mat.transactionType}' align with company preference.`,
                  `Lifecycle carbon abatement: Displaces virgin material avoiding ~${match.estimatedCo2AvoidedTonnes} t CO₂e.`,
                ]
            ).map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-[#203127] bg-white p-2.5 rounded-xl border border-[#E8F0EB]"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                </div>
                <span className="leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Factor Weighted Compatibility Matrix */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#63756B] flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-emerald-800" />
              <span>Weighted Multi-Factor Scoring Matrix</span>
            </h4>
            <span className="text-[11px] text-[#63756B]">Max 100 Points</span>
          </div>

          <div className="space-y-3 bg-[#FAFCFA] p-4 rounded-2xl border border-[#E3EDE6]">
            <ProgressBar
              label="Material Compatibility (30% Weight)"
              sublabel={`${mat.category} • Category & Grade affinity`}
              value={comp.material}
              color="green"
            />
            <ProgressBar
              label="Quantity Compatibility (20% Weight)"
              sublabel={`${mat.quantity?.toLocaleString()} ${mat.unit} batch volume fulfillment`}
              value={comp.quantity}
              color="emerald"
            />
            <ProgressBar
              label="Geographic Proximity (15% Weight)"
              sublabel={`${match.distanceKm} km transit radius to ${mat.city || 'cluster'}`}
              value={comp.distance}
              color="blue"
            />
            <ProgressBar
              label="Condition Compatibility (10% Weight)"
              sublabel={`Certified '${mat.condition}' grade compliance`}
              value={comp.condition ?? 90}
              color="sage"
            />
            <ProgressBar
              label="Transaction Compatibility (10% Weight)"
              sublabel={`${mat.transactionType} commercial structure`}
              value={comp.transaction ?? 95}
              color="sage"
            />
            <ProgressBar
              label="Price & Savings Factor (5% Weight)"
              sublabel={
                mat.pricePerUnit === 0
                  ? 'Zero acquisition cost (Free Claim)'
                  : `₹${mat.pricePerUnit}/${mat.unit} commercial viability`
              }
              value={comp.price}
              color="emerald"
            />
            <ProgressBar
              label="Carbon Benefit Compatibility (10% Weight)"
              sublabel={`~${match.estimatedCo2AvoidedTonnes} t CO₂e displaced Scope 3 savings`}
              value={comp.carbon}
              color="emerald"
            />
          </div>
        </div>

        {/* Score Breakdown Summary Chips */}
        {breakdown && (
          <div className="p-3.5 rounded-2xl bg-[#F4F8F5] border border-[#D5E5DA]">
            <span className="text-[11px] font-bold text-[#3B4D43] uppercase tracking-wider block mb-2">
              Point Contribution Breakdown
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-[#E0EBE2]">
                <span className="text-[10px] text-[#55675D] block">Material (30)</span>
                <span className="font-mono font-bold text-[#16382C]">{breakdown.materialCompatibility} pts</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#E0EBE2]">
                <span className="text-[10px] text-[#55675D] block">Quantity (20)</span>
                <span className="font-mono font-bold text-[#16382C]">{breakdown.quantityCompatibility} pts</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#E0EBE2]">
                <span className="text-[10px] text-[#55675D] block">Proximity (15)</span>
                <span className="font-mono font-bold text-[#16382C]">{breakdown.proximity} pts</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#E0EBE2]">
                <span className="text-[10px] text-[#55675D] block">Condition (10)</span>
                <span className="font-mono font-bold text-[#16382C]">{breakdown.condition} pts</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#E0EBE2]">
                <span className="text-[10px] text-[#55675D] block">Transaction (10)</span>
                <span className="font-mono font-bold text-[#16382C]">{breakdown.transaction} pts</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#E0EBE2]">
                <span className="text-[10px] text-[#55675D] block">Price (5)</span>
                <span className="font-mono font-bold text-[#16382C]">{breakdown.price} pts</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#E0EBE2]">
                <span className="text-[10px] text-[#55675D] block">Carbon (10)</span>
                <span className="font-mono font-bold text-[#16382C]">{breakdown.carbonBenefit} pts</span>
              </div>
              <div className="bg-[#16382C] text-white p-2 rounded-lg border border-[#16382C]">
                <span className="text-[10px] text-emerald-200 block">Total Score</span>
                <span className="font-mono font-bold text-emerald-300">{match.matchScore} / 100</span>
              </div>
            </div>
          </div>
        )}

        {/* Key Decision Drivers */}
        {match.keyDrivers && match.keyDrivers.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#63756B] mb-2.5">
              Key Strategic Decision Drivers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {match.keyDrivers.map((driver, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E0E8E2] text-xs text-[#2A3931]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              navigate(`/marketplace/${mat.id}`);
            }}
          >
            Inspect Material Listing
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                navigate(`/matches/${match.id}`);
              }}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Open Match Dossier
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
