import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../common/Card';

interface KpiCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    comparisonText: string;
  };
  icon: React.ReactNode;
  accentColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subValue,
  trend,
  icon
}) => {
  return (
    <Card className="flex flex-col justify-between h-full hover:border-[#CADACF] transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs sm:text-sm font-medium text-[#55675D]">
          {title}
        </span>
        <div className="w-9 h-9 rounded-xl bg-[#EEF5F0] text-[#16382C] flex items-center justify-center shrink-0 border border-[#DBE7DF]/70">
          {icon}
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#15251F] tracking-tight font-sans">
            {value}
          </span>
          {subValue && (
            <span className="text-xs text-[#6C7F74] font-medium">
              {subValue}
            </span>
          )}
        </div>

        {trend && (
          <div className="flex items-center gap-1.5 mt-2.5 text-xs">
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                trend.isPositive ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
            <span className="text-[#75877E] text-[11px]">
              {trend.comparisonText}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
