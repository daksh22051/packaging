import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  padded = true,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#DDE4DC] transition-all duration-200 ${
        padded ? 'p-5 sm:p-6' : ''
      } ${
        hoverable
          ? 'hover:border-[#CBD6CA] hover:shadow-xs cursor-pointer'
          : 'shadow-[0_1px_2px_rgba(18,60,43,0.03)]'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
