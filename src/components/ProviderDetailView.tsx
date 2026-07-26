import React from 'react';
import { ShieldCheck, Star, MapPin, Phone, Mail, Clock, Calendar, Award, CheckCircle, ArrowLeft, ArrowRight, MessageSquare, Briefcase, FileCheck, ThumbsUp } from 'lucide-react';
import { ServiceProvider } from '../types';

interface ProviderDetailViewProps {
  provider: ServiceProvider;
  onBack: () => void;
  onRequestQuote: (provider: ServiceProvider) => void;
}

export const ProviderDetailView: React.FC<ProviderDetailViewProps> = ({
  provider,
  onBack,
  onRequestQuote,
}) => {
  return (
    <div id="provider-detail-view" className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-bold text-sm bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Providers</span>
      </button>

      {/* Profile Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Cover Graphic Accent */}
        <div className="h-32 bg-gradient-to-r from-blue-900 via-blue-700 to-teal-600 p-6 relative flex items-end justify-end">
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
            License #{provider.licenseNumber}
          </span>
        </div>

        {/* Profile Details Container */}
        <div className="p-6 sm:p-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-5">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {provider.companyName}
                  </h1>
                  <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
                </div>
                <p className="text-sm font-semibold text-teal-700">
                  Lead Professional: {provider.name} • {provider.categoryName}
                </p>
                <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium pt-1">
                  <span className="flex items-center text-amber-600 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                    {provider.rating} ({provider.reviewCount} Reviews)
                  </span>
                  <span>•</span>
                  <span>{provider.area}, {provider.city}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => onRequestQuote(provider)}
              className="w-full md:w-auto bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              <span>Request Service Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <p className="text-xs text-slate-400 uppercase font-bold">Experience</p>
              <p className="text-lg font-extrabold text-slate-900">{provider.yearsInBusiness} Years</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <p className="text-xs text-slate-400 uppercase font-bold">Completed Jobs</p>
              <p className="text-lg font-extrabold text-slate-900">{provider.completedJobs}+</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <p className="text-xs text-slate-400 uppercase font-bold">Starting Price</p>
              <p className="text-lg font-extrabold text-slate-900">Rs. {(provider.startingPriceRs || provider.serviceCallFeeRs || 1000).toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <p className="text-xs text-slate-400 uppercase font-bold">Avg Response</p>
              <p className="text-lg font-extrabold text-teal-700">{provider.responseTime}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Bio, Services, Portfolio, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Verified Badges */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Verification & Safety Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              {provider.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-1.5 bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold px-3 py-1.5 rounded-xl"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About & Bio */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-lg font-bold text-slate-900">About {provider.companyName}</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {provider.bio}
            </p>
          </div>

          {/* Services Offered */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Services Offered</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {provider.servicesOffered.map((service, idx) => (
                <div key={idx} className="flex items-center space-x-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Images Gallery */}
          {provider.portfolioImages.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Recent Completed Work</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {provider.portfolioImages.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Work project ${idx + 1}`}
                    className="w-full h-48 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Verified Customer Reviews</h3>
                <p className="text-xs text-slate-500">Real feedback from local homeowners</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-600 flex items-center justify-end">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400 mr-1" />
                  {provider.rating}
                </span>
                <span className="text-xs text-slate-400">out of 5.0</span>
              </div>
            </div>

            <div className="space-y-4">
              {provider.reviews.map((rev) => (
                <div key={rev.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{rev.author}</span>
                      {rev.verified && (
                        <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-teal-600" />
                          <span>Verified Job</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-semibold text-slate-600 ml-2">
                      Job: {rev.jobType}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Sticky Request Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-teal-200 p-6 shadow-xl space-y-5 sticky top-24">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Direct Service Request
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                Rs. {(provider.startingPriceRs || provider.serviceCallFeeRs || 1000).toLocaleString()} <span className="text-xs font-normal text-slate-500">starting</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Location: <strong>{provider.area}, {provider.city}</strong>
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Availability:</span>
                <span className="font-bold text-teal-700">{provider.availability}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Dispatch Speed:</span>
                <span className="font-bold text-slate-900">{provider.responseTime}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">License Verification:</span>
                <span className="font-bold text-slate-900">Checked ✓</span>
              </div>
            </div>

            <button
              onClick={() => onRequestQuote(provider)}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-extrabold text-sm py-4 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Submit Service Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-400">
              🔒 No payment required now. Quote provided before work begins.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
