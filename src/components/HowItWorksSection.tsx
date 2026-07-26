import React from 'react';
import { Sparkles, Search, UserCheck, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onStart: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onStart }) => {
  const steps = [
    {
      num: '01',
      title: 'Describe Your Problem',
      desc: 'Use natural everyday language. Tell FixNear AI about leaks, strange sounds, sparkings, or broken appliances.',
      icon: Search,
    },
    {
      num: '02',
      title: 'AI Symptom & Cost Triage',
      desc: 'Our Gemini AI model categorizes the exact trade needed, assesses safety urgency, and provides an estimated cost range.',
      icon: Sparkles,
    },
    {
      num: '03',
      title: 'Matched with Verified Pros',
      desc: 'Browse top-rated local professionals with verified licenses, background checks, upfront pricing, and real customer reviews.',
      icon: UserCheck,
    },
    {
      num: '04',
      title: 'Guaranteed On-Site Repair',
      desc: 'Submit your service request. Track arrival, receive written quotes before work begins, and get your problem solved.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="how-it-works-section" className="py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How FixNear AI Solves Everyday Home Problems
          </h2>
          <p className="text-sm text-slate-600">
            No more guessing which trade you need or calling the wrong service provider.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 group-hover:text-blue-200 transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{step.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Try AI Problem Analyzer Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
