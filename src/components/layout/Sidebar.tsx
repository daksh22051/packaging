import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Sparkles,
  Package,
  Truck,
  Leaf,
  BarChart3,
  Receipt,
  Bot,
  Globe2,
  User,
  Settings,
  HelpCircle,
  Building2,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { currentUser, matches, unreadNotificationsCount, setIsAiAssistantOpen } = useApp();
  const location = useLocation();

  const mainNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Marketplace', path: '/marketplace', icon: Store },
    {
      label: 'Smart Matches',
      path: '/matches',
      icon: Sparkles,
      badge: `${matches.length}`
    },
    { label: 'My Materials', path: '/materials', icon: Package },
    { label: 'Logistics', path: '/logistics', icon: Truck },
    { label: 'Impact', path: '/impact', icon: Leaf },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Opportunity Map', path: '/opportunity-map', icon: Globe2 },
    { label: 'Transactions', path: '/transactions', icon: Receipt },
    {
      label: 'Circular AI',
      path: '#ai',
      icon: Bot,
      highlight: true,
      onClick: () => {
        setIsAiAssistantOpen(true);
        if (onCloseMobile) onCloseMobile();
      }
    }
  ];

  const secondaryNavItems = [
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside className="w-64 h-full bg-[#FBFCF8] border-r border-[#DDE4DC] flex flex-col justify-between select-none">
      {/* Top Section */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#DDE4DC]">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 text-[#123C2B] font-bold text-xl tracking-tight group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#123C2B] text-white flex items-center justify-center text-sm shadow-xs group-hover:bg-[#1C4E3A] transition-colors">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-lg tracking-wider font-extrabold text-[#123C2B] font-display">
                CIRCULA
              </span>
              <span className="text-[9px] font-semibold text-[#657169] uppercase tracking-widest mt-0.5">
                Circular Materials
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation list */}
        <div className="px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-[#657169] uppercase tracking-wider">
            Ecosystem Platform
          </div>

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-[#123C2B] hover:bg-[#EEF2E8] group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#2E7D5B] group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#DCE9DA] text-[#123C2B]">
                    AI
                  </span>
                </button>
              );
            }

            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#DCE9DA] text-[#123C2B] font-bold shadow-xs'
                    : 'text-[#657169] hover:bg-[#EEF2E8] hover:text-[#123C2B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#123C2B]' : 'text-[#657169]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive
                        ? 'bg-white text-[#123C2B]'
                        : 'bg-[#EEF2E8] text-[#123C2B]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="px-3 pt-2 pb-4 space-y-1 border-t border-[#DDE4DC] mt-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-[#657169] uppercase tracking-wider">
            Account & Support
          </div>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#DCE9DA] text-[#123C2B] font-bold'
                    : 'text-[#657169] hover:bg-[#EEF2E8] hover:text-[#123C2B]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#123C2B]' : 'text-[#657169]'
                  }`}
                />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <a
            href="mailto:support@circula.earth"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-[#657169] hover:bg-[#EEF2E8] hover:text-[#123C2B] transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#657169]" />
            <span>Help & Support</span>
          </a>
        </div>
      </div>

      {/* Bottom User / Company Profile Summary */}
      <div className="p-3 border-t border-[#DDE4DC] bg-[#F7F8F3]">
        <NavLink
          to={`/companies/${currentUser?.id || 'comp-abc-mfg'}`}
          onClick={onCloseMobile}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#EEF2E8] transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#123C2B] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {(currentUser?.name || 'CP').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[#16211B] truncate group-hover:text-[#123C2B]">
                {currentUser?.name || 'My Enterprise'}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B] shrink-0" />
            </div>
            <p className="text-[11px] text-[#657169] truncate">
              {currentUser?.city || 'Facility'} • Score: {currentUser?.circularityScore ?? 82}
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};
