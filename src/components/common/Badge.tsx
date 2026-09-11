import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'sage' | 'emerald' | 'charcoal' | 'amber' | 'blue' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sage',
  size = 'sm',
  className = '',
  icon
}) => {
  const variantStyles = {
    green: 'bg-[#123C2B] text-white font-medium',
    sage: 'bg-[#DCE9DA] text-[#123C2B] border border-[#CBD6CA]',
    emerald: 'bg-[#EEF2E8] text-[#2E7D5B] border border-[#DDE4DC]',
    charcoal: 'bg-[#16211B] text-white',
    amber: 'bg-[#FFF7ED] text-[#9A3412] border border-[#FED7AA]',
    blue: 'bg-[#F0F7F6] text-[#1E5246] border border-[#D3E5E1]',
    gray: 'bg-[#F7F8F3] text-[#657169] border border-[#DDE4DC]'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full',
    md: 'text-sm px-3 py-1 rounded-full'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium whitespace-nowrap leading-none transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
