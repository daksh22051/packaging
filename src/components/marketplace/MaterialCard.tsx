import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  ShieldCheck,
  Star,
  Leaf,
  ArrowUpRight,
  Bookmark,
  Check
} from 'lucide-react';
import { Material } from '../../types';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';

export const MaterialCard: React.FC<{ material: Material }> = ({ material }) => {
  const { savedMaterialIds, toggleSaveMaterial } = useApp();
  const isSaved = savedMaterialIds.includes(material.id);

  return (
    <div className="bg-white rounded-2xl border border-[#E3ECE6] hover:border-[#CADACF] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Material Image Header */}
        <div className="relative h-44 w-full bg-[#EBF0EC] overflow-hidden">
          <img
            src={material.images[0]}
            alt={material.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/95 text-[#16382C] backdrop-blur-xs shadow-xs border border-white/40">
              {material.category}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSaveMaterial(material.id);
              }}
              className={`p-1.5 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/90 text-[#4D6055] hover:text-[#16382C]'
              }`}
              aria-label="Save material"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Bottom image overlay stats */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
            <span className="bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
              {material.availability}
            </span>
            <span className="font-semibold bg-emerald-950/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
              {material.condition}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Supplier row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-medium text-[#4D5E55] truncate max-w-[150px]">
                {material.supplier?.name || 'Verified Supplier'}
              </span>
              {material.supplier?.verifiedLevel && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[#66776E] shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-xs text-[#1E2E26]">
                {material.supplier?.rating ?? 4.8}
              </span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/marketplace/${material.id}`}
            className="block font-bold text-[#162720] hover:text-emerald-800 transition-colors text-sm sm:text-base leading-snug line-clamp-2"
          >
            {material.title}
          </Link>

          {/* Quantity and Pricing */}
          <div className="flex items-baseline justify-between pt-1 border-t border-[#EEF3F0]">
            <div>
              <span className="text-[11px] text-[#697C72] block">Available Quantity</span>
              <span className="font-extrabold text-sm sm:text-base text-[#152720] font-mono">
                {material.quantity.toLocaleString()} {material.unit}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#697C72] block">Unit Price</span>
              <span className="font-extrabold text-sm sm:text-base text-[#16382C] font-mono">
                {material.pricePerUnit === 0
                  ? 'Free Claim'
                  : `₹${material.pricePerUnit.toFixed(2)} / ${material.unit}`}
              </span>
            </div>
          </div>

          {/* Location & Distance */}
          <div className="flex items-center gap-1.5 text-xs text-[#52645B]">
            <MapPin className="w-3.5 h-3.5 text-[#86998E] shrink-0" />
            <span className="truncate">{material.city}</span>
            <span className="text-[#889B90]">•</span>
            <span className="font-semibold text-emerald-800 shrink-0">
              {material.distanceKm} km away
            </span>
          </div>

          {/* Carbon Impact Callout */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F2F8F4] border border-[#DEEBE1] text-xs">
            <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
              <Leaf className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Avoided Carbon</span>
            </div>
            <span className="font-mono font-bold text-emerald-800 text-xs">
              ~{material.impact.co2eAvoidedTonnes} t CO₂e
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 sm:p-5 pt-0">
        <Link
          to={`/marketplace/${material.id}`}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#F4F8F5] hover:bg-[#16382C] text-[#16382C] hover:text-white border border-[#DCE7E0] hover:border-[#16382C] font-semibold text-xs transition-all duration-150 group/btn"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
