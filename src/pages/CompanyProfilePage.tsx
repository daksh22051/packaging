import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Leaf,
  Package,
  CheckCircle2,
  Star,
  ExternalLink,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MaterialCard } from '../components/marketplace/MaterialCard';

export const CompanyProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { materials, currentUser, triggerToast } = useApp();

  // Find company or use sample
  const companyName = id ? 'ABC Packaging Pvt Ltd' : currentUser.name;
  const city = id ? 'Changodar GIDC, Ahmedabad' : currentUser.city;
  const score = id ? 89 : currentUser.circularityScore;

  // Active listings
  const companyMaterials = materials.filter(
    (m) => m.supplier.id === id || m.supplier.name.includes('ABC')
  );

  return (
    <div className="space-y-6">
      {/* Company Hero Card (Section 28) */}
      <div className="bg-white rounded-3xl border border-[#DFE7E1] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[#EEF3F0]">
          <div className="flex gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#16382C] text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-sm">
              <Building2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
                  {companyName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Business</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#55675D] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                <span>{city}</span>
                <span className="text-[#98AA9F]">•</span>
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 (24 audited reviews)</span>
                </span>
              </p>

              <p className="text-xs text-[#526359] max-w-2xl pt-1">
                Specialized in closed-loop industrial corrugated board recovery, pallet consolidation, and polymer regrind supply. Serving regional manufacturing supply chains since 2018.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-[#F6FAF7] sm:bg-transparent p-4 sm:p-0 rounded-2xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
              Circularity Score
            </span>
            <div className="flex items-baseline sm:justify-end gap-1 mt-0.5">
              <span className="text-4xl font-extrabold font-mono text-[#16382C]">
                {score}
              </span>
              <span className="text-sm font-bold text-[#5B6D62]">/ 100</span>
            </div>
            <span className="text-xs text-emerald-800 font-semibold block mt-0.5">
              Advanced Tier
            </span>
          </div>
        </div>

        {/* Company Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-[#F8FAF8] rounded-xl border border-[#DEE7E0]">
            <span className="text-[10px] text-[#63756B] uppercase font-bold block">
              Materials Exchanged
            </span>
            <span className="text-lg font-mono font-bold text-[#182620]">
              12,450 kg
            </span>
          </div>

          <div className="p-3.5 bg-[#F8FAF8] rounded-xl border border-[#DEE7E0]">
            <span className="text-[10px] text-[#63756B] uppercase font-bold block">
              Completed Orders
            </span>
            <span className="text-lg font-mono font-bold text-[#182620]">
              18 Shipments
            </span>
          </div>

          <div className="p-3.5 bg-[#F8FAF8] rounded-xl border border-[#DEE7E0]">
            <span className="text-[10px] text-[#63756B] uppercase font-bold block">
              Waste Diverted
            </span>
            <span className="text-lg font-mono font-bold text-emerald-800">
              8.9 tonnes
            </span>
          </div>

          <div className="p-3.5 bg-[#F8FAF8] rounded-xl border border-[#DEE7E0]">
            <span className="text-[10px] text-[#63756B] uppercase font-bold block">
              ESG Compliance
            </span>
            <span className="text-lg font-mono font-bold text-[#16382C]">
              BRSR / CSRD Ready
            </span>
          </div>
        </div>
      </div>

      {/* Active Listings from this Company */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-[#162720]">
            Active Material Inventory from {companyName}
          </h2>
          <span className="text-xs text-[#62756A]">
            {companyMaterials.length} lots available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {companyMaterials.map((mat) => (
            <MaterialCard key={mat.id} material={mat} />
          ))}
        </div>
      </div>
    </div>
  );
};
