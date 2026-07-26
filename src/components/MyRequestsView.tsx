import React from 'react';
import { ClipboardList, ArrowLeft, Clock, ShieldCheck, Trash2, CheckCircle2, ChevronRight, AlertCircle, Wrench, Sparkles } from 'lucide-react';
import { ServiceRequest } from '../types';

interface MyRequestsViewProps {
  requests: ServiceRequest[];
  onBack: () => void;
  onSelectRequest: (request: ServiceRequest) => void;
  onNewRequest: () => void;
}

export const MyRequestsView: React.FC<MyRequestsViewProps> = ({
  requests,
  onBack,
  onSelectRequest,
  onNewRequest,
}) => {
  return (
    <div id="my-requests-view-page" className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-bold text-sm bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to App</span>
      </button>

      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Service Requests
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track and manage your submitted local service triage requests
          </p>
        </div>

        <button
          onClick={onNewRequest}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>New AI Triage</span>
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Submitted Requests Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Describe an everyday problem using our FixNear AI analyzer to diagnose symptoms and connect with verified local pros.
          </p>
          <button
            onClick={onNewRequest}
            className="px-5 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Start AI Problem Analyzer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              onClick={() => onSelectRequest(req)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {req.id}
                  </span>
                  <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                    {req.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">{req.createdAt}</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {req.aiAnalysis.categoryName} Repair
                </h3>
                <p className="text-xs text-slate-600 line-clamp-1 italic">
                  "{req.problemDescription}"
                </p>

                <p className="text-xs font-bold text-slate-700 pt-1">
                  Provider: {req.selectedProviderName || 'Matching Pro'} • Scheduled: {req.scheduledDate} ({req.scheduledTimeSlot})
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                <span className="text-xs font-bold text-slate-500">View Specs</span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
