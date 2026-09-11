import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CircularityScoreCard: React.FC = () => {
  const { userStats } = useApp();
  const score = userStats.circularityScore; // e.g. 82
  const breakdown = userStats.scoreBreakdown;

  // SVG circle calculation
  const radius = 64;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#687C71]">
              Performance Index
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#162720] mt-0.5">
            Circularity Score
          </h3>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Top 8% in Region</span>
        </div>
      </div>

      {/* Center Circular Progress Indicator */}
      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        <div className="relative flex items-center justify-center shrink-0">
          <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
            {/* Background ring */}
            <circle
              stroke="#E8EFEA"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress ring */}
            <circle
              stroke="#16382C"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-[#152720] tracking-tight font-sans">
              {score}
            </span>
            <span className="text-[10px] font-bold text-[#6D8075] uppercase tracking-wider">
              / 100
            </span>
          </div>
        </div>

        {/* Narrative */}
        <div className="flex-1 space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Circular Leadership Tier</span>
          </div>
          <p className="text-xs text-[#52645B] leading-relaxed">
            Your closed-loop index combines secondary material procurement, low-emission routing, and verified packaging diversions.
          </p>
        </div>
      </div>

      {/* 4 Breakdown Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#EEF3EF] mt-4">
        <ProgressBar
          label="Material Reuse"
          value={breakdown.materialReuse}
          color="green"
          size="sm"
        />
        <ProgressBar
          label="Waste Diversion"
          value={breakdown.wasteDiversion}
          color="emerald"
          size="sm"
        />
        <ProgressBar
          label="Recycled Inputs"
          value={breakdown.recycledInputs}
          color="sage"
          size="sm"
        />
        <ProgressBar
          label="Local Sourcing"
          value={breakdown.localSourcing}
          color="blue"
          size="sm"
        />
      </div>
    </Card>
  );
};
