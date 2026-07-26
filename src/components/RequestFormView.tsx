import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, User, Phone, Mail, FileText, AlertTriangle, ShieldCheck, Sparkles, Building2, Wrench } from 'lucide-react';
import { ServiceProvider, AIAnalysisResult, ServiceRequest, CustomerInfo } from '../types';
import { SERVICE_PROVIDERS } from '../data/providers';
import { saveServiceRequest } from '../lib/api';

interface RequestFormViewProps {
  initialAnalysis?: AIAnalysisResult | null;
  initialProblemText?: string;
  selectedProvider?: ServiceProvider | null;
  onBack: () => void;
  onRequestSubmitted: (createdRequest: ServiceRequest) => void;
}

export const RequestFormView: React.FC<RequestFormViewProps> = ({
  initialAnalysis,
  initialProblemText = '',
  selectedProvider,
  onBack,
  onRequestSubmitted,
}) => {
  const provider = selectedProvider || SERVICE_PROVIDERS[0];

  const [problemDesc, setProblemDesc] = useState(
    initialProblemText || (initialAnalysis ? initialAnalysis.diagnosticSummary || initialAnalysis.possibleIssue || initialAnalysis.summaryTitle : 'Home service repair request')
  );

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: 'Fatima Khan',
    phone: '+92 300 1234567',
    email: 'fatima.khan@example.com',
    address: 'Block 13-D, Gulshan-e-Iqbal',
    city: provider.city || 'Karachi',
    area: provider.area || 'Gulshan-e-Iqbal',
    notes: 'Please call before arrival.',
  });

  const [scheduledDate, setScheduledDate] = useState('Today');
  const [timeSlot, setTimeSlot] = useState('Morning (8:00 AM - 12:00 PM)');
  const [isEmergency, setIsEmergency] = useState(
    initialAnalysis?.urgencyLevel === 'emergency' || initialAnalysis?.urgency === 'High'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (customerInfo.phone.trim().length < 8) {
      newErrors.phone = 'Please enter a valid contact phone number';
    }
    if (!customerInfo.address.trim()) {
      newErrors.address = 'Street address / Location is required';
    }
    if (!customerInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!customerInfo.area.trim()) {
      newErrors.area = 'Area / Neighborhood is required';
    }
    if (!problemDesc.trim()) {
      newErrors.problemDesc = 'Problem description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll to top of form to see validation errors
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Generate unique Request ID starting with FN- (e.g. FN-782104)
      const uniqueNum = Math.floor(100000 + Math.random() * 900000);
      const requestId = `FN-${uniqueNum}`;

      const categoryName = initialAnalysis?.category || initialAnalysis?.categoryName || provider.categoryName || 'Home Repair';

      const newRequest: ServiceRequest = {
        id: requestId,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
        status: 'submitted',
        problemDescription: problemDesc,
        aiAnalysis: initialAnalysis || {
          category: categoryName,
          professional: provider.name,
          possibleIssue: problemDesc,
          urgency: isEmergency ? 'High' : 'Medium',
          safeAdvice: ['Keep area clear for the technician.'],
          nextStep: 'Technician dispatched for on-site diagnosis.',
          primaryCategoryId: provider.categoryId,
          categoryName: categoryName,
          recommendedTrade: provider.categoryName,
          urgencyLevel: isEmergency ? 'emergency' : 'high',
          urgencyReason: 'Direct user booked dispatch.',
          summaryTitle: problemDesc,
          diagnosticSummary: problemDesc,
          potentialCauses: ['Wear & tear', 'Diagnostic required'],
          estimatedCostMin: provider.startingPriceRs || 1000,
          estimatedCostMax: (provider.startingPriceRs || 1000) * 3,
          estimatedTimeToFix: '1 - 2 hours',
          questionsToAskProvider: ['What is the warranty period?'],
          safetyTips: ['Do not tamper with wiring or pipes.'],
          recommendedProviderIds: [provider.id],
          matchConfidence: 98,
        },
        selectedProviderId: provider.id,
        selectedProviderName: provider.companyName,
        scheduledDate,
        scheduledTimeSlot: isEmergency ? '🚨 Immediate Emergency Dispatch' : timeSlot,
        customerInfo,
        isEmergency,
        estimatedCostRange: initialAnalysis
          ? `Rs. ${(initialAnalysis.estimatedCostMinRs || initialAnalysis.estimatedCostMin || 1500).toLocaleString()} - Rs. ${(initialAnalysis.estimatedCostMaxRs || initialAnalysis.estimatedCostMax || 4500).toLocaleString()}`
          : `Rs. ${(provider.startingPriceRs || provider.serviceCallFeeRs || 1000).toLocaleString()}`,
      };

      saveServiceRequest(newRequest);
      setIsSubmitting(false);
      onRequestSubmitted(newRequest);
    }, 500);
  };

  const categoryDisplayName = initialAnalysis?.category || initialAnalysis?.categoryName || provider.categoryName;

  return (
    <div id="service-request-form-section" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-bold text-sm bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
          FixNear Booking System
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Complete Service Request
        </h2>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Review your issue, schedule your time, and submit your request directly to your selected professional.
        </p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-800 font-bold space-y-1">
          <p className="flex items-center space-x-1.5 text-sm">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Please complete all required fields before submitting:</span>
          </p>
          <ul className="list-disc pl-6 font-medium text-red-700">
            {Object.values(errors).map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Automatically Show Selected Provider & Category */}
        <div className="bg-white rounded-3xl border border-teal-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Selected Service Provider
              </span>
            </div>
            <span className="bg-teal-50 text-teal-800 text-[11px] font-bold px-3 py-0.5 rounded-full border border-teal-200">
              Verified Partner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Provider / Company</p>
              <h3 className="text-lg font-extrabold text-slate-900">{provider.companyName}</h3>
              <p className="text-slate-600 font-medium">Lead Specialist: {provider.name}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Requested Category:</span>
                <span className="font-bold text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded-md">
                  {categoryDisplayName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Service Location:</span>
                <span className="font-bold text-slate-800">{provider.area}, {provider.city}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Starting Fee:</span>
                <span className="font-black text-slate-900">
                  Rs. {(provider.startingPriceRs || provider.serviceCallFeeRs || 1000).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Automatically Show Original AI-Analyzed Problem & Description */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                AI Diagnostic & Problem Summary
              </span>
            </div>
            {initialAnalysis && (
              <span className="bg-amber-50 text-amber-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                {initialAnalysis.urgency || initialAnalysis.urgencyLevel} Urgency
              </span>
            )}
          </div>

          {initialProblemText && (
            <div className="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-3.5 text-xs">
              <span className="font-bold text-teal-900 block mb-0.5">Original AI Problem Input:</span>
              <p className="text-slate-800 italic">"{initialProblemText}"</p>
            </div>
          )}

          {initialAnalysis?.diagnosticSummary && (
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">AI Diagnostic Summary:</strong>
              {initialAnalysis.diagnosticSummary}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>Problem Description / Notes for Technician <span className="text-red-500">*</span></span>
              {errors.problemDesc && <span className="text-red-600 font-semibold">{errors.problemDesc}</span>}
            </label>
            <textarea
              rows={3}
              value={problemDesc}
              onChange={(e) => {
                setProblemDesc(e.target.value);
                if (errors.problemDesc) setErrors({ ...errors, problemDesc: '' });
              }}
              placeholder="Provide specific details e.g., 'AC is blowing warm air, 2nd floor bedroom, unit making rattling noise.'"
              className={`w-full bg-slate-50 text-slate-900 p-3.5 rounded-xl border ${
                errors.problemDesc ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-teal-600'
              } focus:ring-2 focus:ring-teal-500/20 text-sm font-medium resize-y focus:outline-hidden`}
            />
          </div>
        </div>

        {/* 3. Customer Info Form (Full Name, Phone, Location) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Customer Contact & Service Location</span>
            <span className="text-xs text-slate-400 font-normal">* Required fields</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                <span>Full Name <span className="text-red-500">*</span></span>
                {errors.name && <span className="text-red-600 font-medium">{errors.name}</span>}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => {
                    setCustomerInfo({ ...customerInfo, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Fatima Khan"
                  className={`w-full bg-slate-50 text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border ${
                    errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-teal-600'
                  } text-sm font-medium focus:outline-hidden`}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                <span>Phone Number <span className="text-red-500">*</span></span>
                {errors.phone && <span className="text-red-600 font-medium">{errors.phone}</span>}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerInfo.phone}
                  onChange={(e) => {
                    setCustomerInfo({ ...customerInfo, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="e.g. 0300 1234567"
                  className={`w-full bg-slate-50 text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border ${
                    errors.phone ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-teal-600'
                  } text-sm font-medium focus:outline-hidden`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-slate-400">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  placeholder="e.g. fatima@example.com"
                  className="w-full bg-slate-50 text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-sm font-medium focus:outline-hidden"
                />
              </div>
            </div>

            {/* Area / Sector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                <span>Area / Sector / Phase <span className="text-red-500">*</span></span>
                {errors.area && <span className="text-red-600 font-medium">{errors.area}</span>}
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerInfo.area}
                  onChange={(e) => {
                    setCustomerInfo({ ...customerInfo, area: e.target.value });
                    if (errors.area) setErrors({ ...errors, area: '' });
                  }}
                  placeholder="e.g. Gulshan-e-Iqbal, DHA Phase 5"
                  className={`w-full bg-slate-50 text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border ${
                    errors.area ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-teal-600'
                  } text-sm font-medium focus:outline-hidden`}
                />
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                <span>Street Address / House / Plot <span className="text-red-500">*</span></span>
                {errors.address && <span className="text-red-600 font-medium">{errors.address}</span>}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerInfo.address}
                  onChange={(e) => {
                    setCustomerInfo({ ...customerInfo, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  placeholder="e.g. House #14, Block 13-D"
                  className={`w-full bg-slate-50 text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border ${
                    errors.address ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-teal-600'
                  } text-sm font-medium focus:outline-hidden`}
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                <span>City <span className="text-red-500">*</span></span>
                {errors.city && <span className="text-red-600 font-medium">{errors.city}</span>}
              </label>
              <input
                type="text"
                value={customerInfo.city}
                onChange={(e) => {
                  setCustomerInfo({ ...customerInfo, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: '' });
                }}
                placeholder="e.g. Karachi, Lahore, Islamabad"
                className={`w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border ${
                  errors.city ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-teal-600'
                } text-sm font-medium focus:outline-hidden`}
              />
            </div>

          </div>
        </div>

        {/* 4. Preferred Date and Time */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Preferred Date and Time</span>
          </h3>

          {/* Emergency Option */}
          <div className="bg-red-50 p-4 rounded-2xl border border-red-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-red-900">Request Emergency 24/7 Dispatch?</p>
                <p className="text-[11px] text-red-700">Technician will prioritize your ticket for immediate arrival.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isEmergency}
              onChange={(e) => setIsEmergency(e.target.checked)}
              className="w-5 h-5 rounded-md text-red-600 focus:ring-red-500 cursor-pointer shrink-0"
            />
          </div>

          {!isEmergency && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferred Date <span className="text-red-500">*</span></span>
                </label>
                <select
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-sm font-semibold focus:outline-hidden cursor-pointer"
                >
                  <option value="Today">Today (Fastest Slot)</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="In 2 Days">In 2 Days</option>
                  <option value="This Weekend">This Weekend</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferred Time Slot <span className="text-red-500">*</span></span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-sm font-semibold focus:outline-hidden cursor-pointer"
                >
                  <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                  <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            id="submit-service-request-final-btn"
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-base sm:text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Generating Request ID & Confirming...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>Submit Service Request</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
