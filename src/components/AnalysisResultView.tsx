import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, ShieldAlert, DollarSign, Clock, HelpCircle, ShieldCheck, ArrowRight, UserCheck, Star, Phone, ChevronRight, RefreshCw, FileText } from 'lucide-react';
import { AIAnalysisResult, ServiceProvider } from '../types';
import { SERVICE_PROVIDERS } from '../data/providers';

interface AnalysisResultViewProps {
  result: AIAnalysisResult;
  userProblemText: string;
  userZipCode: string;
  onSelectProvider: (provider: ServiceProvider) => void;
  onRequestQuote: (provider?: ServiceProvider) => void;
  onReAnalyze: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  userProblemText,
  userZipCode,
  onSelectProvider,
  onRequestQuote,
  onReAnalyze,
}) => {
  // Find matching providers
  const matchedProviders = SERVICE_PROVIDERS.filter(
    (p) =>
      p.categoryId === result.primaryCategoryId ||
      result.recommendedProviderIds.includes(p.id)
  );

  const bestProvider = matchedProviders[0] || SERVICE_PROVIDERS[0];

  const getUrgencyBadge = (urgencyStr: string) => {
    const norm = urgencyStr ? urgencyStr.toLowerCase() : 'medium';
    if (norm === 'high' || norm === 'emergency') {
      return (
        <span className="bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          <span>High Urgency</span>
        </span>
      );
    }
    if (norm === 'medium') {
      return (
        <span className="bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Medium Urgency</span>
        </span>
      );
    }
    return (
      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Low Urgency</span>
      </span>
    );
  };

  return (
    <div id="ai-analysis-result-view" className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Top Banner / Problem Echo */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900 text-white p-6 rounded-3xl shadow-lg gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Classification Complete • Zip {userZipCode}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {result.category} Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 italic line-clamp-2">
            "{userProblemText}"
          </p>
        </div>

        <button
          onClick={onReAnalyze}
          id="reanalyze-problem-btn"
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Analyze Another Problem</span>
        </button>
      </div>

      {/* Primary Structured AI Result Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 border-b border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            {getUrgencyBadge(result.urgency || result.urgencyLevel)}
            <div className="bg-teal-900/60 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold text-teal-300">
              FixNear AI Confidence: {result.matchConfidence}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* 1. Category */}
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                1. Service Category
              </p>
              <p className="text-2xl font-black text-white">{result.category || result.categoryName}</p>
            </div>

            {/* 2. Professional Needed */}
            <div className="space-y-1 md:border-l md:border-slate-800 md:pl-6">
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                2. Professional Needed
              </p>
              <p className="text-xl font-bold text-teal-300">{result.professional || result.recommendedTrade}</p>
            </div>

            {/* 3. Urgency Level */}
            <div className="space-y-1 md:border-l md:border-slate-800 md:pl-6">
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                3. Urgency Level
              </p>
              <p className="text-xl font-bold text-white">{result.urgency || result.urgencyLevel}</p>
            </div>
          </div>
        </div>

        {/* Breakdown Details Grid */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800">
          
          {/* 4. Possible Issue */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>4. Possible Issue (Explanation)</span>
            </h3>
            <p className="text-base font-medium leading-relaxed text-slate-800">
              {result.possibleIssue || result.diagnosticSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 5. Safe Basic Troubleshooting Suggestions */}
            <div className="bg-teal-50/50 rounded-2xl p-5 border border-teal-100 space-y-3">
              <h4 className="font-bold text-sm uppercase tracking-wider text-teal-900 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>5. Safe Basic Troubleshooting / Advice</span>
              </h4>
              <ul className="space-y-2">
                {(result.safeAdvice || result.safetyTips || []).map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm bg-white p-3 rounded-xl border border-teal-100 text-slate-800 font-medium flex items-start space-x-2.5">
                    <span className="w-2 h-2 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. Recommended Next Step */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-teal-400 flex items-center space-x-2 mb-2">
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                  <span>6. Recommended Next Step</span>
                </h4>
                <p className="text-sm font-medium text-slate-200 leading-relaxed">
                  {result.nextStep || 'Connect with a verified local technician near Zip ' + userZipCode + ' to schedule an on-site inspection.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center space-x-3">
                <button
                  onClick={() => onRequestQuote(bestProvider)}
                  id="request-quote-next-step-btn"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Get Service Quotes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Cost Estimate & Duration Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-500">
                Estimated Local Market Cost Range
              </p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">
                Rs. {(result.estimatedCostMinRs || result.estimatedCostMin || 1500).toLocaleString()} - Rs. {(result.estimatedCostMaxRs || result.estimatedCostMax || 4500).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">
                Estimated duration: {result.estimatedTimeToFix}
              </p>
            </div>

            <button
              onClick={() => onRequestQuote(bestProvider)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Request Service in Pakistan
            </button>
          </div>

        </div>
      </div>

      {/* Matched Local Service Providers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Top Matched Local Professionals
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified & background-checked experts specializing in {result.category || result.categoryName} serving {userZipCode}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchedProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-base truncate group-hover:text-teal-700 transition-colors">
                      {provider.companyName}
                    </h4>
                    <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {provider.area}, {provider.city}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Lead Tech: {provider.name}</p>

                  <div className="flex items-center space-x-3 mt-1.5 text-xs">
                    <span className="flex items-center font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                      {provider.rating} ({provider.reviewCount})
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-semibold">{provider.availability}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {provider.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Pricing & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Service Call Fee</span>
                  <span className="text-sm font-black text-slate-900">
                    Rs. {(provider.startingPriceRs || provider.serviceCallFeeRs || 1000).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSelectProvider(provider)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onRequestQuote(provider)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Request Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
