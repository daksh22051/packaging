import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Toast } from '../common/Toast';
import { CircularAiDrawer } from '../ai/CircularAiDrawer';
import { Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAiAssistantOpen, setIsAiAssistantOpen } = useApp();
  const location = useLocation();

  return (
    <div className="flex h-screen w-screen bg-[#F7F8F3] text-[#16211B] overflow-hidden">
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#0B3022]/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-[#FBFCF8] z-10 shadow-2xl flex flex-col">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-[#F7F8F3] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Circular AI Assistant Launcher Button */}
      <div className="fixed bottom-6 left-6 sm:left-auto sm:right-6 z-40">
        <button
          onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#123C2B] text-white shadow-lg hover:shadow-xl hover:bg-[#1C4E3A] active:scale-95 transition-all font-semibold text-xs sm:text-sm border border-[#2E7D5B]/40 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#C6E865] animate-pulse" />
          <span>Circular AI</span>
          <span className="w-2 h-2 rounded-full bg-[#6FAF82]" />
        </button>
      </div>

      {/* Global AI Assistant Drawer */}
      <CircularAiDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

      {/* Global Notification Toast */}
      <Toast />
    </div>
  );
};
