import React, { useState } from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, Upload, MapPin, Building2, CheckCircle, RefreshCw, ArrowRight, HelpCircle, FileText, Camera } from 'lucide-react';
import { AIAnalysisResult } from '../types';
import { analyzeProblemWithAI } from '../lib/api';
import { PAKISTAN_CITIES } from '../data/locations';

interface ProblemAnalyzerProps {
  initialPrompt?: string;
  selectedCity?: string;
  setSelectedCity?: (city: string) => void;
  selectedArea?: string;
  setSelectedArea?: (area: string) => void;
  onAnalysisComplete: (result: AIAnalysisResult, problemText: string, locationStr: string) => void;
}

export const ProblemAnalyzer: React.FC<ProblemAnalyzerProps> = ({
  initialPrompt = '',
  selectedCity = 'Karachi',
  setSelectedCity,
  selectedArea = 'Gulshan-e-Iqbal',
  setSelectedArea,
  onAnalysisComplete,
}) => {
  const [problemText, setProblemText] = useState(initialPrompt);
  const [localCity, setLocalCity] = useState(selectedCity);
  const [localArea, setLocalArea] = useState(selectedArea);
  const [urgencyHint, setUrgencyHint] = useState<'normal' | 'high' | 'emergency'>('normal');
  const [attachedImageName, setAttachedImageName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeCity = selectedCity || localCity;
  const activeArea = selectedArea || localArea;

  const currentCityObj = PAKISTAN_CITIES.find(c => c.name === activeCity) || PAKISTAN_CITIES[0];

  const handleCityChange = (cityName: string) => {
    if (setSelectedCity) setSelectedCity(cityName);
    setLocalCity(cityName);

    const cityObj = PAKISTAN_CITIES.find(c => c.name === cityName) || PAKISTAN_CITIES[0];
    if (cityObj && cityObj.areas.length > 0) {
      if (setSelectedArea) setSelectedArea(cityObj.areas[0]);
      setLocalArea(cityObj.areas[0]);
    }
  };

  const handleAreaChange = (areaName: string) => {
    if (setSelectedArea) setSelectedArea(areaName);
    setLocalArea(areaName);
  };

  const sampleScenarioPrompts = [
    {
      label: 'AC Cooling (AC Technician)',
      text: 'mera AC thanda nahi kar raha',
      urgency: 'high' as const,
    },
    {
      label: 'Power Outage (Electrician)',
      text: 'bijli baar baar ja rahi hai',
      urgency: 'emergency' as const,
    },
    {
      label: 'Water Leak (Plumber)',
      text: 'pani leak ho raha hai',
      urgency: 'high' as const,
    },
    {
      label: 'Bike Repair (Mechanic)',
      text: 'bike start nahi ho rahi',
      urgency: 'normal' as const,
    },
    {
      label: 'Mobile Charging (Mobile Fix)',
      text: 'mobile charge nahi ho raha',
      urgency: 'normal' as const,
    },
    {
      label: 'WiFi / Laptop (Laptop Fix)',
      text: 'WiFi slow chal raha hai',
      urgency: 'normal' as const,
    },
    {
      label: 'Fridge Repair (Appliance)',
      text: 'fridge thanda nahi kar raha',
      urgency: 'high' as const,
    },
    {
      label: 'Geyser Repair (Plumbing/Appliance)',
      text: 'geyser kaam nahi kar raha',
      urgency: 'normal' as const,
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedImageName(e.target.files[0].name);
    }
  };

  const handleRunAnalysis = async (textToRun = problemText) => {
    if (!textToRun.trim()) {
      setErrorMsg('Please enter a description of what is happening before running the analysis.');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);

    const locationStr = `${activeArea}, ${activeCity}`;

    const steps = [
      'Scanning problem description with Gemini AI engine...',
      'Categorizing primary physical failure & recommended trade...',
      'Evaluating safety risk & emergency urgency factors...',
      'Calculating estimated Pakistani Rupee (Rs.) market cost & matching top pros...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 380));
    }

    try {
      const result = await analyzeProblemWithAI(textToRun, locationStr, urgencyHint);
      setIsAnalyzing(false);
      onAnalysisComplete(result, textToRun, locationStr);
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMsg(err.message || 'An error occurred during AI analysis. Please try again.');
    }
  };

  return (
    <div id="ai-problem-analyzer-section" className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Step 1: AI Symptom Triage</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Describe What’s Wrong in Plain Language
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          No jargon required. Describe sounds, leaks, smells, or broken behavior. Our Gemini AI model identifies the right trade category, urgency level, and costs.
        </p>
      </div>

      {/* Main Analyzer Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-5 sm:p-8 space-y-6">
        
        {/* Pakistani City & Area Selector */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-extrabold text-teal-800">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>Service Location in Pakistan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Select City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select City:
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={activeCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  id="analyzer-city-select"
                  className="w-full bg-white text-slate-900 pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:border-teal-600 focus:outline-hidden cursor-pointer appearance-none"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.province})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Area in {activeCity}:
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={activeArea}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  id="analyzer-area-select"
                  className="w-full bg-white text-slate-900 pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:border-teal-600 focus:outline-hidden cursor-pointer appearance-none"
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

        {/* Text Input Area */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            Describe the problem or symptoms (English or Roman Urdu) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="analyzer-textarea"
            rows={3}
            value={problemText}
            onChange={(e) => {
              setProblemText(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder={`Describe what's wrong e.g. 'mera AC thanda nahi kar raha', 'pani leak ho raha hai', or '1.5 ton AC blowing warm air in ${activeArea}, ${activeCity}'`}
            className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 p-4 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-sm sm:text-base font-medium resize-y focus:outline-hidden"
          />

          {/* Example Problem Suggestions Below Input Box */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Click an example problem to pre-fill (English & Roman Urdu):</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-extrabold px-2 py-0.5 rounded-full">Bilingual AI Triage</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleScenarioPrompts.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setProblemText(item.text);
                    setUrgencyHint(item.urgency);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 text-slate-800 font-medium px-3 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <span className="font-bold text-teal-800">"{item.text}"</span>
                  <span className="text-[10px] text-slate-500 font-medium">({item.label})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location & Urgency Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Area / Neighborhood */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Area / Sector / Phase</span>
            </label>
            <input
              type="text"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              placeholder="e.g. Gulshan-e-Iqbal, DHA, F-7"
              className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-sm font-semibold focus:outline-hidden"
            />
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setUrgencyHint('normal')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  urgencyHint === 'normal'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setUrgencyHint('high')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  urgencyHint === 'high'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                High Priority
              </button>
              <button
                type="button"
                onClick={() => setUrgencyHint('emergency')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  urgencyHint === 'emergency'
                    ? 'bg-red-50 text-red-700 border-red-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🚨 Emergency 24/7
              </button>
            </div>
          </div>
        </div>

        {/* Optional Photo Attachment */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-dashed border-slate-300 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Attach a photo (Optional)
              </p>
              <p className="text-[11px] text-slate-500">
                {attachedImageName ? `Attached: ${attachedImageName}` : 'Upload photo of water leak, outlet, or model label for enhanced AI triage.'}
              </p>
            </div>
          </div>

          <label className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors shrink-0">
            <span>{attachedImageName ? 'Change Photo' : 'Upload Photo'}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Error Message if any */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-xs sm:text-sm flex items-start justify-between space-x-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Analysis Error</p>
                <p className="text-red-700 mt-0.5">{errorMsg}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRunAnalysis()}
              className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Analyze Action Button */}
        <div className="pt-2">
          {isAnalyzing ? (
            <div className="bg-teal-700 text-white p-6 rounded-2xl shadow-lg text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-teal-200 animate-spin mx-auto" />
              <p className="text-lg font-bold">FixNear AI is analyzing your problem...</p>
              <p className="text-xs sm:text-sm text-teal-100 font-medium">{loadingStep}</p>
            </div>
          ) : (
            <button
              onClick={() => handleRunAnalysis()}
              id="analyze-my-problem-btn"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-3 cursor-pointer"
            >
              <Sparkles className="w-6 h-6 text-amber-300" />
              <span>Analyze My Problem</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>100% Free AI Diagnosis</span>
          </span>
          <span>•</span>
          <span>Instant Category Recommendation</span>
          <span>•</span>
          <span>Verified Local Pros</span>
        </div>

      </div>
    </div>
  );
};
