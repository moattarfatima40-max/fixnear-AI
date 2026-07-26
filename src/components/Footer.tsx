import React from 'react';
import { Wrench, ShieldCheck, PhoneCall, Sparkles, Heart } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/categories';

interface FooterProps {
  onSelectCategory: (catId: string) => void;
  onGoToAnalyzer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onGoToAnalyzer }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                FixNear<span className="text-blue-500">.AI</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Describe the problem. Find the right solution. AI-powered local service triage and verified professional matching.
            </p>
            <div className="pt-2 text-[11px] text-teal-400 font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Background & License Verified Pros</span>
            </div>
          </div>

          {/* Service Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Top Service Categories
            </h4>
            <ul className="space-y-2">
              {SERVICE_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Trades */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              More Repair Services
            </h4>
            <ul className="space-y-2">
              {SERVICE_CATEGORIES.slice(5, 10).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Triage & Emergency */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              24/7 AI Triage
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Unsure whether you need an electrician, plumber, or appliance technician? Describe what is broken and get an immediate AI breakdown.
            </p>
            <button
              onClick={onGoToAnalyzer}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Diagnose Problem Now</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} FixNear AI Marketplace. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Powered by Gemini AI Triage</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
