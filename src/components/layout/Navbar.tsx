import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  Building2,
  CheckCircle2,
  Menu,
  ExternalLink,
  Package,
  Store,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const Navbar: React.FC<{ onOpenMobileMenu?: () => void }> = ({
  onOpenMobileMenu
}) => {
  const {
    currentUser,
    setCurrentUser,
    availableCompanies,
    materials,
    transactions,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    setIsAiAssistantOpen
  } = useApp();

  const navigate = useNavigate();
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const companyMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
      if (
        companyMenuRef.current &&
        !companyMenuRef.current.contains(e.target as Node)
      ) {
        setShowCompanyMenu(false);
      }
      if (
        notifMenuRef.current &&
        !notifMenuRef.current.contains(e.target as Node)
      ) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const q = searchQuery.trim().toLowerCase();
  const matchedMaterials = q
    ? materials.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedCompanies = q
    ? availableCompanies.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.city && c.city.toLowerCase().includes(q)) ||
          (c.industry && c.industry.toLowerCase().includes(q))
      ).slice(0, 2)
    : [];

  const matchedTransactions = q
    ? transactions.filter(
        (t) =>
          t.orderNumber.toLowerCase().includes(q) ||
          t.materialTitle.toLowerCase().includes(q)
      ).slice(0, 2)
    : [];

  const hasSearchResults =
    matchedMaterials.length > 0 ||
    matchedCompanies.length > 0 ||
    matchedTransactions.length > 0;

  return (
    <header className="h-16 bg-[#FBFCF8] border-b border-[#DDE4DC] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#16211B] hover:bg-[#EEF2E8]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search input with live suggestion drop */}
        <div ref={searchContainerRef} className="relative flex-1">
          <div className="relative">
            <Search className="w-4 h-4 text-[#657169] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search materials, companies, locations..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F8F3] border border-[#DDE4DC] rounded-xl text-xs sm:text-sm text-[#16211B] placeholder-[#657169] focus:outline-none focus:ring-2 focus:ring-[#123C2B]/15 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#657169] hover:text-[#16211B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grouped Search Dropdown */}
          {showSearchDropdown && q && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E0E7E2] shadow-xl overflow-hidden z-40 text-xs sm:text-sm max-h-96 overflow-y-auto">
              {hasSearchResults ? (
                <div className="p-2 space-y-3">
                  {matchedMaterials.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-bold text-[#7E9086] uppercase tracking-wider">
                        Materials
                      </div>
                      {matchedMaterials.map((mat) => (
                        <div
                          key={mat.id}
                          onClick={() => {
                            navigate(`/marketplace/${mat.id}`);
                            setShowSearchDropdown(false);
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F0F6F2] cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Package className="w-4 h-4 text-emerald-700" />
                            <div>
                              <p className="font-medium text-[#1A2520]">
                                {mat.title}
                              </p>
                              <p className="text-[11px] text-[#63756C]">
                                {mat.quantity} {mat.unit} • {mat.city}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold text-xs text-[#16382C]">
                            ₹{mat.pricePerUnit}/{mat.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedCompanies.length > 0 && (
                    <div className="border-t border-[#EEF3F0] pt-2">
                      <div className="px-3 py-1 text-[10px] font-bold text-[#7E9086] uppercase tracking-wider">
                        Companies
                      </div>
                      {matchedCompanies.map((comp) => (
                        <div
                          key={comp.id}
                          onClick={() => {
                            navigate(`/companies/${comp.id}`);
                            setShowSearchDropdown(false);
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F0F6F2] cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Building2 className="w-4 h-4 text-[#2563EB]" />
                            <div>
                              <p className="font-medium text-[#1A2520]">
                                {comp.name}
                              </p>
                              <p className="text-[11px] text-[#63756C]">
                                {comp.type} • {comp.city}
                              </p>
                            </div>
                          </div>
                          <Badge variant="emerald" size="sm">
                            Score {comp.circularityScore}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedTransactions.length > 0 && (
                    <div className="border-t border-[#EEF3F0] pt-2">
                      <div className="px-3 py-1 text-[10px] font-bold text-[#7E9086] uppercase tracking-wider">
                        Orders & Shipments
                      </div>
                      {matchedTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          onClick={() => {
                            navigate(`/transactions/${tx.id}`);
                            setShowSearchDropdown(false);
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F0F6F2] cursor-pointer"
                        >
                          <div>
                            <p className="font-medium text-[#1A2520]">
                              {tx.orderNumber}
                            </p>
                            <p className="text-[11px] text-[#63756C]">
                              {tx.materialTitle}
                            </p>
                          </div>
                          <Badge variant="sage" size="sm">
                            {tx.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-2 border-t border-[#EEF3F0] text-center">
                    <button
                      onClick={() => {
                        navigate('/marketplace');
                        setShowSearchDropdown(false);
                      }}
                      className="text-xs font-semibold text-[#16382C] hover:underline"
                    >
                      View all results in Marketplace →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#6B7E74]">
                  No matching materials or businesses found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: AI Assistant, Notifications, Company Switcher, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Circular AI trigger */}
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-[#144230] border border-emerald-200 text-xs font-semibold transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Circular AI</span>
        </button>

        {/* Notifications */}
        <div ref={notifMenuRef} className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-[#425249] hover:bg-[#EDF3EF] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#DFE7E1] shadow-xl z-40 overflow-hidden text-xs sm:text-sm">
              <div className="p-3.5 border-b border-[#EEF2EF] flex items-center justify-between bg-[#F8FAF8]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#182620]">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <Badge variant="emerald" size="sm">
                      {unreadNotificationsCount} new
                    </Badge>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-[#1E523F] font-medium hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#F2F6F3]">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.link) {
                        navigate(n.link);
                        setShowNotifMenu(false);
                      }
                    }}
                    className={`p-3.5 hover:bg-[#F4F8F5] transition-colors cursor-pointer flex gap-3 items-start ${
                      !n.read ? 'bg-[#FAFCFA]' : ''
                    }`}
                  >
                    <div
                      className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                        !n.read ? 'bg-emerald-600' : 'bg-transparent'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-xs text-[#182620]">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-[#55665D] mt-0.5 leading-snug">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-[#84968C] mt-1 block font-mono">
                        {n.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-[#EEF2EF] text-center bg-[#FAFCFA]">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifMenu(false)}
                  className="text-xs font-semibold text-[#16382C] hover:underline"
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Company Selector Dropdown */}
        <div ref={companyMenuRef} className="relative">
          <button
            onClick={() => setShowCompanyMenu(!showCompanyMenu)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#DDE5DF] bg-[#F8FAF8] hover:bg-[#EEF4F0] text-xs font-semibold text-[#182620] transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-[#1E5642]" />
            <span className="hidden sm:inline truncate max-w-[120px]">
              {currentUser?.name || 'My Enterprise'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7E73]" />
          </button>

          {showCompanyMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#DFE7E1] shadow-xl z-40 overflow-hidden text-xs">
              <div className="p-3 border-b border-[#EEF2EF] bg-[#F7FAF8]">
                <p className="text-[10px] font-bold text-[#7E9187] uppercase tracking-wider">
                  Active Entity
                </p>
                <p className="font-bold text-sm text-[#182620] truncate">
                  {currentUser?.name || 'Active Entity'}
                </p>
                <p className="text-[11px] text-[#55675E]">
                  {currentUser?.type || 'Enterprise'} • {currentUser?.city || 'Local'}
                </p>
              </div>

              <div className="p-2 space-y-1">
                <p className="px-2 py-1 text-[10px] font-bold text-[#809489] uppercase tracking-wider">
                  Switch Demo Counterparty
                </p>
                {availableCompanies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCurrentUser(c);
                      setShowCompanyMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                      c.id === currentUser?.id
                        ? 'bg-[#EAF3EC] text-[#16382C] font-bold'
                        : 'hover:bg-[#F2F6F3] text-[#33423A]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="truncate text-xs font-medium">{c.name}</p>
                      <p className="text-[10px] text-[#697B71]">
                        {c.type} • Score {c.circularityScore}
                      </p>
                    </div>
                    {c.id === currentUser?.id && (
                      <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-2 border-t border-[#EEF2EF] bg-[#FAFCFA]">
                <Link
                  to="/onboarding"
                  onClick={() => setShowCompanyMenu(false)}
                  className="w-full block text-center py-1.5 rounded-lg text-xs font-semibold text-[#16382C] hover:bg-[#EEF4F0]"
                >
                  + Add New Entity Profile
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Link */}
        <Link
          to="/profile"
          className="w-8 h-8 rounded-xl bg-[#16382C] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-[#16382C]/30 transition-all"
        >
          {(currentUser?.name || 'CP').slice(0, 2).toUpperCase()}
        </Link>
      </div>
    </header>
  );
};
