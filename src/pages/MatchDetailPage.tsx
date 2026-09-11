import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Check,
  Truck,
  ArrowRight,
  HelpCircle,
  Building2,
  Calculator,
  Scale,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { WhyThisMatchModal } from '../components/matches/WhyThisMatchModal';

export const MatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { matches, requestMaterial, activeRequirement } = useApp();

  const match = matches.find((m) => m.id === id) || matches[0];
  const [showWhyModal, setShowWhyModal] = useState(false);

  if (!match) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-[#DFE7E1]">
        <h2 className="text-xl font-bold text-[#162720]">Match Not Found</h2>
        <p className="text-xs text-[#52645B] mt-1 mb-4">
          The requested circular match could not be found.
        </p>
        <Button onClick={() => navigate('/matches')}>Back to Smart Matches</Button>
      </div>
    );
  }

  const mat = match.material;
  const supplier = match.supplierCompany || mat.supplier;
  const buyer = match.buyerCompany;

  const handleInitiateExchange = () => {
    if (!mat) return;
    requestMaterial(
      mat.id,
      mat.quantity,
      'Initiated from Smart Match recommendation.'
    );
    navigate('/transactions');
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#53655B] hover:text-[#16382C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Smart Matches</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#16382C] text-emerald-300">
            {match.matchScore}% MATCH INDEX
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            {match.matchQuality || 'Verified Match'}
          </span>
        </div>
      </div>

      {/* Main Dossier Header */}
      <div className="bg-white rounded-3xl border border-[#DFE7E1] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EEF3F0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Algorithmic Match Dossier
              </span>
              <span className="text-xs text-[#7B8E82]">•</span>
              <span className="text-xs text-[#52645B] font-medium">
                {match.distanceKm} km transit distance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
              {mat?.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#54675B] mt-1">
              Supplied by <strong>{supplier?.name || 'Verified Supplier'}</strong> to{' '}
              <strong>{buyer?.name || 'Procuring Enterprise'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowWhyModal(true)}
              icon={<HelpCircle className="w-4 h-4 text-emerald-800" />}
            >
              Why this match?
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleInitiateExchange}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Initiate Exchange
            </Button>
          </div>
        </div>

        {/* Counterparty Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supplier Profile */}
          <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-[#E1EBE4] space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#63766B] block">
              Supplier (Origin)
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-base text-[#182620]">
                  {supplier?.name || 'Supplier'}
                </h3>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-xs text-[#52645B]">
              Located in {mat?.city || supplier?.city || 'Regional Hub'} ({match.distanceKm} km away)
            </p>
            <div className="pt-2 border-t border-[#E8EFEA] text-xs text-[#3E5045] space-y-1.5">
              <p className="flex justify-between">
                <span>Available Lot:</span>
                <strong className="font-mono">{mat?.quantity?.toLocaleString()} {mat?.unit}</strong>
              </p>
              <p className="flex justify-between">
                <span>Offered Rate:</span>
                <strong className="font-mono">₹{mat?.pricePerUnit} / {mat?.unit}</strong>
              </p>
              <p className="flex justify-between">
                <span>Condition Grade:</span>
                <strong className="text-emerald-800">{mat?.condition}</strong>
              </p>
            </div>
          </div>

          {/* Buyer Profile */}
          <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-[#E1EBE4] space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#63766B] block">
              Buyer Requirement (Destination)
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-base text-[#182620]">
                  {buyer?.name || 'Procuring Enterprise'}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Target Facility
              </span>
            </div>
            <p className="text-xs text-[#52645B]">
              Facility in {activeRequirement?.city || buyer?.city || 'Ahmedabad'}
            </p>
            <div className="pt-2 border-t border-[#E8EFEA] text-xs text-[#3E5045] space-y-1.5">
              <p className="flex justify-between">
                <span>Requirement Target:</span>
                <strong className="font-mono">
                  {activeRequirement?.quantity?.toLocaleString() || 5000} {activeRequirement?.unit || 'kg'}
                </strong>
              </p>
              <p className="flex justify-between">
                <span>Target Stream:</span>
                <strong className="font-mono">{activeRequirement?.category || mat.category}</strong>
              </p>
              <p className="flex justify-between">
                <span>Max Budget:</span>
                <strong className="font-mono">
                  {activeRequirement?.maxPrice ? `₹${activeRequirement.maxPrice}/unit` : 'Standard'}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* WHY THIS MATCH? (Deterministic Factual Reasons) */}
        <div className="p-5 rounded-2xl bg-[#F6FAF7] border border-[#D5E5DA] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#21352A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Why This Match? — Verified Match Factors</span>
            </h3>
            <span className="text-[11px] font-mono text-[#52655A]">
              Score: {match.matchScore}/100
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                className="flex items-start gap-2.5 text-xs text-[#203127] bg-white p-3 rounded-xl border border-[#E8F0EB]"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                </div>
                <span className="leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Factor 7-Dimension Breakdown */}
        <div className="space-y-4 pt-4 border-t border-[#EEF3F0]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#35483E] flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-800" />
              <span>Multi-Factor Mathematical Scoring Breakdown</span>
            </h3>
            <span className="text-xs text-[#5D7065]">Weighted 100 pt Scale</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#F6FAF7] border border-[#DEEBE1] space-y-3">
              <ProgressBar
                label="Material Grade & Classification (30% Weight)"
                sublabel={`${mat.category} specification compliance`}
                value={match.compatibility.material}
                color="green"
              />
              <ProgressBar
                label="Quantity & Demand Fit (20% Weight)"
                sublabel={`${mat.quantity?.toLocaleString()} ${mat.unit} batch volume fulfillability`}
                value={match.compatibility.quantity}
                color="emerald"
              />
              <ProgressBar
                label="Transport Proximity (15% Weight)"
                sublabel={`${match.distanceKm} km transit radius to destination`}
                value={match.compatibility.distance}
                color="blue"
              />
              <ProgressBar
                label="Condition Compatibility (10% Weight)"
                sublabel={`Grade '${mat.condition}' alignment`}
                value={match.compatibility.condition ?? 90}
                color="sage"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#F6FAF7] border border-[#DEEBE1] space-y-3">
              <ProgressBar
                label="Transaction Preference (10% Weight)"
                sublabel={`${mat.transactionType} commercial structure`}
                value={match.compatibility.transaction ?? 95}
                color="sage"
              />
              <ProgressBar
                label="Price & Commercial Advantage (5% Weight)"
                sublabel={`₹${mat.pricePerUnit}/${mat.unit} unit acquisition rate`}
                value={match.compatibility.price}
                color="emerald"
              />
              <ProgressBar
                label="Carbon Abatement Compatibility (10% Weight)"
                sublabel={`~${match.estimatedCo2AvoidedTonnes} t CO₂e displaced Scope 3 emissions`}
                value={match.compatibility.carbon}
                color="emerald"
              />
            </div>
          </div>
        </div>

        {/* Engine Reason Statement */}
        <div className="p-5 rounded-2xl bg-[#EEF5F0] border border-[#D5E5DA] flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#16382C] text-emerald-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#162720] mb-1">
              Matching Engine Assessment
            </h4>
            <p className="text-xs sm:text-sm text-[#2D4034] leading-relaxed">
              "{match.whyThisMatch}"
            </p>
          </div>
        </div>

        {/* Next Step Action Footer */}
        <div className="pt-4 border-t border-[#EEF3F0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#576B60]">
            <Truck className="w-4 h-4 text-emerald-800" />
            <span>
              Low-carbon transit arranged through circular logistics partner network.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate(`/marketplace/${mat.id}`)}
            >
              View Material Listing
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleInitiateExchange}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Initiate Exchange Request
            </Button>
          </div>
        </div>
      </div>

      {/* Diagnostics Modal */}
      <WhyThisMatchModal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        match={match}
      />
    </div>
  );
};
