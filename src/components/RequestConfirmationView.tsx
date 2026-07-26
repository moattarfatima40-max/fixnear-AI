import React from 'react';
import { CheckCircle2, ShieldCheck, Clock, MapPin, Phone, Mail, Copy, Printer, Calendar, FileText, ArrowRight, UserCheck, Sparkles, RefreshCw, Home } from 'lucide-react';
import { ServiceRequest } from '../types';

interface RequestConfirmationViewProps {
  request: ServiceRequest;
  onViewMyRequests: () => void;
  onGoHome: () => void;
  onNewRequest: () => void;
}

export const RequestConfirmationView: React.FC<RequestConfirmationViewProps> = ({
  request,
  onViewMyRequests,
  onGoHome,
  onNewRequest,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(request.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="request-confirmation-screen" className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Top Success Badge Header */}
      <div className="bg-white rounded-3xl border border-teal-200/90 p-6 sm:p-8 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Request Successfully Submitted
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight pt-2">
            Service Request Confirmed
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your problem statement has been assigned and dispatched to your matched local professional.
          </p>
        </div>

        {/* Unique Tracking ID Pill */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 inline-flex items-center space-x-3 text-left">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Unique Request Tracking ID</span>
            <span className="text-xl font-mono font-black text-teal-700">{request.id}</span>
          </div>
          <button
            onClick={handleCopyId}
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            title="Copy Tracking ID"
          >
            {copied ? <span className="text-teal-600 font-bold">Copied ✓</span> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Request Progress Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Real-Time Request Timeline
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          
          <div className="bg-teal-50 border border-teal-200 p-3 rounded-2xl space-y-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span>
            <p className="font-bold text-teal-900">1. Submitted</p>
            <p className="text-[10px] text-teal-700 font-medium">Completed</p>
          </div>

          <div className="bg-teal-50/80 border border-teal-200 p-3 rounded-2xl space-y-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block animate-ping"></span>
            <p className="font-bold text-teal-900">2. AI Matched</p>
            <p className="text-[10px] text-teal-700 font-medium">In Progress</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1 opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
            <p className="font-bold text-slate-700">3. Pro Notified</p>
            <p className="text-[10px] text-slate-500">Pending Call</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1 opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
            <p className="font-bold text-slate-700">4. Scheduled</p>
            <p className="text-[10px] text-slate-500">On-Site Visit</p>
          </div>

        </div>
      </div>

      {/* Summary Receipt Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">Service Request Details</h3>
          <button
            onClick={handlePrint}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
          
          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Requested Category & Trade</span>
            <p className="text-sm font-bold text-slate-900">{request.aiAnalysis.categoryName || request.aiAnalysis.category}</p>
            <p className="text-slate-600">{request.aiAnalysis.recommendedTrade || request.aiAnalysis.professional}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Selected Provider</span>
            <p className="text-sm font-bold text-teal-800">{request.selectedProviderName || 'Verified Partner'}</p>
            <p className="text-slate-500">FixNear Partner Network</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Scheduled Slot</span>
            <p className="text-sm font-bold text-slate-900">
              {request.scheduledDate} • {request.scheduledTimeSlot}
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Estimated Price Range</span>
            <p className="text-sm font-bold text-amber-700">{request.estimatedCostRange}</p>
            <p className="text-slate-400">Final quote given prior to work start</p>
          </div>

        </div>

        {/* Problem Description Summary */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1 text-xs">
          <span className="font-bold text-slate-500 uppercase text-[10px]">Original Problem Description</span>
          <p className="font-medium text-slate-900 italic">"{request.problemDescription}"</p>
        </div>

        {/* Customer Info Summary */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
          <span className="font-bold text-slate-500 uppercase text-[10px]">Customer Contact & Location</span>
          <p className="font-bold text-slate-900">
            {request.customerInfo.name} • {request.customerInfo.phone}
          </p>
          <p className="text-slate-600">
            {request.customerInfo.address}, {request.customerInfo.area || ''} {request.customerInfo.city}
          </p>
        </div>

      </div>

      {/* Bottom Action Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onGoHome}
          className="w-full sm:flex-1 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm py-3.5 px-5 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>

        <button
          onClick={onViewMyRequests}
          className="w-full sm:flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm py-3.5 px-5 rounded-2xl border border-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-slate-600" />
          <span>Track in My Requests</span>
        </button>

        <button
          onClick={onNewRequest}
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3.5 px-5 rounded-2xl border border-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Analyze New Issue</span>
        </button>
      </div>

    </div>
  );
};

