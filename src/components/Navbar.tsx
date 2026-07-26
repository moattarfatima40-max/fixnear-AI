import React, { useState } from 'react';
import { Sparkles, Wrench, ShieldCheck, PhoneCall, Menu, X, Clock, ClipboardList, Search, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  onOpenMyRequests: () => void;
  onQuickAnalyze: (promptText?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenMyRequests,
  onQuickAnalyze,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'analyzer', label: 'AI Problem Analyzer', isAi: true },
    { id: 'marketplace', label: 'Service Marketplace' },
    { id: 'how-it-works', label: 'How It Works' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            id="brand-logo-btn"
            className="flex items-center space-x-3 text-left focus:outline-hidden group cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-slate-900 via-teal-900 to-teal-700 flex items-center justify-center text-teal-300 shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  FixNear<span className="text-teal-600">.AI</span>
                </span>
                <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
                  AI Triage
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Describe issue in English or Roman Urdu. Get matched instantly.
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 bg-slate-100/70 p-1 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {item.isAi && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* My Requests Trigger */}
            <button
              onClick={onOpenMyRequests}
              id="my-requests-btn"
              className="relative px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer"
              title="View your submitted requests"
            >
              <ClipboardList className="w-4 h-4 text-teal-700" />
              <span className="hidden sm:inline">My Requests</span>
              {savedCount > 0 && (
                <span className="bg-teal-700 text-white text-[11px] font-black px-1.5 py-0.2 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Quick AI Diagnosis CTA */}
            <button
              onClick={() => {
                setActiveTab('analyzer');
              }}
              id="header-quick-ai-btn"
              className="hidden lg:flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Diagnose Issue</span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden cursor-pointer border border-slate-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Navigation
          </p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  {item.isAi && <Sparkles className="w-4 h-4 text-amber-500" />}
                  <span>{item.label}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setActiveTab('analyzer');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-blue-600 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Start AI Problem Diagnosis</span>
            </button>

            <button
              onClick={() => {
                onOpenMyRequests();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-100 text-slate-700 font-semibold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2"
            >
              <ClipboardList className="w-4 h-4 text-blue-600" />
              <span>View Saved Requests ({savedCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
