import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import {
  TrendingDown,
  Leaf,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { LogisticsPlan } from '../../types';

interface RouteComparisonCardProps {
  plan: LogisticsPlan;
  routeMode: 'optimized' | 'standard';
  onSelectRoute: (mode: 'optimized' | 'standard') => void;
  onConfirmTransport?: () => void;
}

export const RouteComparisonCard: React.FC<RouteComparisonCardProps> = ({
  plan,
  routeMode,
  onSelectRoute,
  onConfirmTransport
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Standard Route Card */}
      <div
        onClick={() => onSelectRoute('standard')}
        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
          routeMode === 'standard'
            ? 'bg-white border-[#16382C] shadow-md ring-2 ring-[#16382C]/10'
            : 'bg-[#FAFCFA] border-[#E2EAE4] hover:bg-white hover:border-[#CADACF]'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#687C71]">
            Standard Route
          </span>
          <span className="text-xs text-[#52645B] font-medium">Standard Diesel Hauler</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#192721] font-mono">
              {plan.standardRoute.distanceKm} km
            </span>
            <span className="text-sm font-bold text-[#4B5D53] font-mono">
              ₹{plan.standardRoute.costInr.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#EEF3F0] text-xs text-[#596B61]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{plan.standardRoute.durationHours} hours</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Leaf className="w-3.5 h-3.5 text-amber-700" />
              <span>{plan.standardRoute.co2Kg} kg CO₂e</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EEF3F0] flex items-center justify-between">
          <span className="text-[11px] text-[#788B80]">Via City Interior Roadway</span>
          <span
            className={`text-xs font-semibold ${
              routeMode === 'standard' ? 'text-[#16382C]' : 'text-[#7D8F85]'
            }`}
          >
            {routeMode === 'standard' ? '✓ Selected' : 'Select'}
          </span>
        </div>
      </div>

      {/* Optimized Green Route Card */}
      <div
        onClick={() => onSelectRoute('optimized')}
        className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
          routeMode === 'optimized'
            ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-600/15'
            : 'bg-[#FAFCFA] border-[#E2EAE4] hover:bg-white hover:border-emerald-300'
        }`}
      >
        <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
          Recommended
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Optimized Route
          </span>
          <span className="text-xs text-emerald-900 font-semibold mr-12">
            ReLoop Green EV Fleet
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#16382C] font-mono">
              {plan.optimizedRoute.distanceKm} km
            </span>
            <span className="text-sm font-extrabold text-emerald-800 font-mono">
              ₹{plan.optimizedRoute.costInr.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#EEF3F0] text-xs text-[#596B61]">
            <div className="flex items-center gap-1.5 text-[#16382C] font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>{plan.optimizedRoute.durationHours} hours</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-mono font-bold">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>{plan.optimizedRoute.co2Kg} kg CO₂e</span>
            </div>
          </div>
        </div>

        {/* Highlights Banner */}
        <div className="mt-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs font-semibold text-emerald-900">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
            <span>₹{plan.savingsInr} saved</span>
          </div>
          <span className="text-emerald-700">•</span>
          <div className="flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span>{plan.emissionsAvoidedKg} kg CO₂e avoided (19.5% lower)</span>
          </div>
        </div>

        {onConfirmTransport && (
          <div className="mt-4 pt-2">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onConfirmTransport();
              }}
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Use Optimized Route
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
