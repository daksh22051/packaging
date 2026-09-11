import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { activeToast, triggerToast } = useApp();

  if (!activeToast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
  };

  const bgColors = {
    success: 'bg-white border-emerald-200 text-[#192721]',
    info: 'bg-white border-teal-200 text-[#192721]',
    warning: 'bg-white border-amber-200 text-[#192721]'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgColors[activeToast.type]}`}
      >
        {icons[activeToast.type]}
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-sm font-semibold tracking-tight leading-snug">
            {activeToast.title}
          </p>
          <p className="text-xs text-[#52635A] mt-0.5 leading-relaxed">
            {activeToast.message}
          </p>
        </div>
        <button
          onClick={() => triggerToast('', '', 'info')}
          className="text-[#7A8C82] hover:text-[#182620] p-1 rounded-md hover:bg-[#F2F6F3]"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
