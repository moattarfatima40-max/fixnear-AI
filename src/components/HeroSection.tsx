import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Building2 } from 'lucide-react';
import { PAKISTAN_CITIES } from '../data/locations';

interface HeroSectionProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  onAnalyzePrompt: (promptText: string) => void;
  onSelectCategory: (catId: string) => void;
  onGoToAnalyzer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCity,
  setSelectedCity,
  selectedArea,
  setSelectedArea,
  onAnalyzePrompt,
  onSelectCategory,
  onGoToAnalyzer,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');

  const currentCityObj = PAKISTAN_CITIES.find(c => c.name === selectedCity) || PAKISTAN_CITIES[0];

  const samplePrompts = [
    'mera AC thanda nahi kar raha',
    'bijli baar baar ja rahi hai',
    'pani leak ho raha hai',
    'bike start nahi ho rahi',
    'mobile charge nahi ho raha',
    'WiFi slow chal raha hai',
    'fridge thanda nahi kar raha',
    'geyser kaam nahi kar raha',
    '1.5 ton Inverter AC blowing warm air in Karachi',
    'UPS changeover relay tripping main breaker in Lahore',
  ];

  const handleCityChange = (newCityName: string) => {
    setSelectedCity(newCityName);
    const newCityObj = PAKISTAN_CITIES.find(c => c.name === newCityName) || PAKISTAN_CITIES[0];
    if (newCityObj && newCityObj.areas.length > 0) {
      setSelectedArea(newCityObj.areas[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPrompt.trim()) {
      onAnalyzePrompt(inputPrompt.trim());
    } else {
      onGoToAnalyzer();
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-8 pb-14 lg:pt-12 lg:pb-20">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-teal-600/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          {/* Pakistan Marketplace Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-teal-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Pakistan’s #1 AI Local Services Marketplace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-medium">Instant AI Triage</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
            Describe Your Problem. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-200">
              Find Verified Local Pros in Pakistan.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Select your city & area, describe what’s broken in plain words. FixNear AI instantly categorizes your problem, estimates local repair costs in Pakistani Rupees (Rs.), and connects you with verified nearby experts.
          </p>

          {/* Location Selector Bar */}
          <div className="bg-slate-900/90 border border-teal-500/30 p-4 rounded-2xl max-w-2xl mx-auto text-left space-y-3">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-bold text-teal-400">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Step 1 & 2: Select Your Location in Pakistan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Select City */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select City:
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    id="hero-city-select"
                    className="w-full bg-slate-800 text-white pl-9 pr-8 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold focus:border-teal-500 focus:outline-none cursor-pointer appearance-none"
                  >
                    {PAKISTAN_CITIES.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name} ({city.province})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Select Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Area in {selectedCity}:
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    id="hero-area-select"
                    className="w-full bg-slate-800 text-white pl-9 pr-8 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold focus:border-teal-500 focus:outline-none cursor-pointer appearance-none"
                  >
                    {currentCityObj.areas.map((area, idx) => (
                      <option key={idx} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive AI Problem Description Box */}
          <div className="bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 text-slate-900 text-left max-w-2xl mx-auto space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                  Step 3: Describe Your Problem
                </label>
                <textarea
                  id="hero-problem-input"
                  rows={3}
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder={`e.g. 'Orient 1.5 ton inverter AC in ${selectedArea}, ${selectedCity} is throwing warm air and making a humming noise...'`}
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 p-3.5 rounded-xl sm:rounded-2xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-sm font-medium resize-none focus:outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs text-slate-600 w-full sm:w-auto">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free AI Analysis • Serving {selectedArea}, {selectedCity}</span>
                </div>

                <button
                  type="submit"
                  id="hero-analyze-btn"
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer shrink-0"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Analyze My Problem</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Sample Suggestions */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                <span>Try an example issue (English & Roman Urdu):</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">Bilingual AI</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputPrompt(prompt);
                      onAnalyzePrompt(prompt);
                    }}
                    className="text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-800 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors text-left max-w-full cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Social Proof / Stats */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto border-t border-slate-800 mt-8">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">9 Cities</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Coverage Across Pakistan</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-teal-400">100% Rs.</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Transparent PKR Estimates</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">&lt; 30 Mins</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Average Dispatch Time</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">4.9 ★</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Verified Local Ratings</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
