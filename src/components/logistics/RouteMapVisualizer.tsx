import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  Navigation,
  CheckCircle2,
  Maximize2,
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { LogisticsPlan } from '../../types';

export const RouteMapVisualizer: React.FC<{
  plan: LogisticsPlan;
  routeMode: 'optimized' | 'standard';
  onToggleMode: (mode: 'optimized' | 'standard') => void;
}> = ({ plan, routeMode, onToggleMode }) => {
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-[#E8EFE9] overflow-hidden border border-[#D5E1D7] flex flex-col justify-between p-4 select-none">
      {/* Visual map canvas styling - clean vector mock topology */}
      <div className="absolute inset-0 bg-[#E8EFE9]">
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(#BDCEBE 1.5px, transparent 1.5px), radial-gradient(#BDCEBE 1.5px, #E8EFE9 1.5px)',
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px'
          }}
        />

        {/* Vector SVG Routes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Standard route path (gray dashed) */}
          <path
            d="M 120 250 Q 220 90, 420 160 T 780 200"
            fill="none"
            stroke="#9BAFA0"
            strokeWidth="3"
            strokeDasharray="6,6"
            className={`transition-opacity duration-300 ${
              routeMode === 'standard' ? 'opacity-100' : 'opacity-30'
            }`}
          />

          {/* Optimized route path (solid emerald green) */}
          <path
            d="M 120 250 C 260 270, 460 210, 780 200"
            fill="none"
            stroke="#16382C"
            strokeWidth="4"
            className={`transition-opacity duration-300 ${
              routeMode === 'optimized' ? 'opacity-100' : 'opacity-40'
            }`}
          />
        </svg>

        {/* Origin Pin (Supplier: ABC Packaging Changodar) */}
        <div
          className="absolute left-[12%] sm:left-[15%] top-[60%] sm:top-[62%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
          onClick={() => setActivePin('origin')}
        >
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-md bg-[#16382C] text-white text-[10px] font-bold shadow-sm whitespace-nowrap mb-1">
              Origin: ABC Packaging
            </div>
            <div className="w-8 h-8 rounded-full bg-[#16382C] text-white flex items-center justify-center ring-4 ring-white shadow-md">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Waypoint (Aslali Logistics Hub / Sarkhej Bypass) */}
        <div
          className="absolute left-[45%] top-[55%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
          onClick={() => setActivePin('hub')}
        >
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-md bg-white text-[#16382C] border border-[#CBD9CE] text-[9px] font-semibold shadow-xs whitespace-nowrap mb-1">
              Sarkhej Green Corridor
            </div>
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Destination Pin (Buyer: ABC Manufacturing Sanand) */}
        <div
          className="absolute right-[10%] sm:right-[15%] top-[50%] -translate-y-1/2 cursor-pointer z-10"
          onClick={() => setActivePin('destination')}
        >
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-md bg-emerald-800 text-white text-[10px] font-bold shadow-sm whitespace-nowrap mb-1">
              Destination: Sanand Plant
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center ring-4 ring-white shadow-md">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Live Truck Marker traveling along route */}
        <div className="absolute left-[38%] top-[60%] -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#CBD8CE] shadow-md text-xs font-semibold text-[#16382C]">
            <Truck className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
            <span>Green LCV</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* Top Map Controls Overlay */}
      <div className="relative z-20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs p-1 rounded-xl border border-[#D0DDD2] shadow-xs">
          <button
            onClick={() => onToggleMode('optimized')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              routeMode === 'optimized'
                ? 'bg-[#16382C] text-white shadow-xs'
                : 'text-[#506257] hover:text-[#16382C]'
            }`}
          >
            Optimized Green Route (112 km)
          </button>
          <button
            onClick={() => onToggleMode('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              routeMode === 'standard'
                ? 'bg-[#4B5E53] text-white shadow-xs'
                : 'text-[#506257] hover:text-[#16382C]'
            }`}
          >
            Standard Transit (138 km)
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 border border-[#D0DDD2] text-xs font-medium text-[#46574D]">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>EV Carrier Priority</span>
        </div>
      </div>

      {/* Bottom Map Info Footer */}
      <div className="relative z-20 flex items-center justify-between bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-[#D0DDD2] shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-800" />
          <span className="font-semibold text-[#182620]">
            Sardar Patel Outer Bypass Route
          </span>
          <span className="text-[#75887D] hidden sm:inline">•</span>
          <span className="text-[#5B6D62] hidden sm:inline">
            Zero-congestion bypass avoiding city interior peak hours
          </span>
        </div>
        <div className="font-mono font-bold text-emerald-900">
          ETA: 2h 24m (Save 1h 06m)
        </div>
      </div>
    </div>
  );
};
