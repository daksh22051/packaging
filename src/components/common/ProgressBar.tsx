import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  sublabel?: string;
  color?: 'green' | 'emerald' | 'sage' | 'blue' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  showPercent?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  color = 'green',
  size = 'md',
  showPercent = true
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorStyles = {
    green: 'bg-[#16382C]',
    emerald: 'bg-[#0F766E]',
    sage: 'bg-[#3B7A57]',
    blue: 'bg-[#2563EB]',
    amber: 'bg-[#D97706]'
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          {label && <span className="font-medium text-[#2E3B34]">{label}</span>}
          {showPercent && (
            <span className="font-mono text-[#52635A]">
              {sublabel ? `${sublabel} (${percentage}%)` : `${percentage}%`}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-[#EBF0EC] rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} ${colorStyles[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
