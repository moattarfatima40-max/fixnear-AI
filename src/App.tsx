import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemAnalyzer } from './components/ProblemAnalyzer';
import { AnalysisResultView } from './components/AnalysisResultView';
import { MarketplaceView } from './components/MarketplaceView';
import { ProviderDetailView } from './components/ProviderDetailView';
import { RequestFormView } from './components/RequestFormView';
import { RequestConfirmationView } from './components/RequestConfirmationView';
import { MyRequestsView } from './components/MyRequestsView';
import { HowItWorksSection } from './components/HowItWorksSection';
import { Footer } from './components/Footer';

import { AIAnalysisResult, ServiceProvider, ServiceRequest } from './types';
import { getSavedRequests, analyzeProblemWithAI } from './lib/api';
import { SERVICE_PROVIDERS } from './data/providers';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysisResult | null>(null);
  const [userProblemText, setUserProblemText] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Karachi');
  const [selectedArea, setSelectedArea] = useState<string>('Gulshan-e-Iqbal');
  const [userZipCode, setUserZipCode] = useState<string>('Gulshan-e-Iqbal, Karachi');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [lastSubmittedRequest, setLastSubmittedRequest] = useState<ServiceRequest | null>(null);
  const [savedRequests, setSavedRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    setSavedRequests(getSavedRequests());
  }, []);

  const refreshSavedRequests = () => {
    setSavedRequests(getSavedRequests());
  };

  // Handlers
  const handleHeroAnalyzePrompt = async (promptText: string) => {
    setUserProblemText(promptText);
    setActiveTab('analyzer');
  };

  const handleAnalysisComplete = (
    result: AIAnalysisResult,
    problemText: string,
    locationStr: string
  ) => {
    setCurrentAnalysis(result);
    setUserProblemText(problemText);
    setUserZipCode(locationStr);
    setActiveTab('analysis_result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProvider = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setActiveTab('provider_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestQuote = (provider?: ServiceProvider) => {
    if (provider) {
      setSelectedProvider(provider);
    } else if (!selectedProvider) {
      setSelectedProvider(SERVICE_PROVIDERS[0]);
    }
    setActiveTab('request_form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestSubmitted = (createdRequest: ServiceRequest) => {
    setLastSubmittedRequest(createdRequest);
    refreshSavedRequests();
    setActiveTab('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedRequests.length}
        onOpenMyRequests={() => {
          setActiveTab('my_requests');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickAnalyze={() => {
          setActiveTab('analyzer');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Screen Container */}
      <main className="flex-1">
        
        {/* Homepage View */}
        {activeTab === 'home' && (
          <div>
            <HeroSection
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedArea={selectedArea}
              setSelectedArea={setSelectedArea}
              onAnalyzePrompt={handleHeroAnalyzePrompt}
              onSelectCategory={(catId) => {
                setActiveTab('marketplace');
              }}
              onGoToAnalyzer={() => {
                setActiveTab('analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* In-page Problem Analyzer preview */}
            <ProblemAnalyzer
              initialPrompt={userProblemText}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedArea={selectedArea}
              setSelectedArea={setSelectedArea}
              onAnalysisComplete={handleAnalysisComplete}
            />

            {/* How It Works Section */}
            <HowItWorksSection
              onStart={() => {
                setActiveTab('analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Marketplace Teaser */}
            <MarketplaceView
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedArea={selectedArea}
              setSelectedArea={setSelectedArea}
              onSelectProvider={handleSelectProvider}
              onRequestQuote={handleRequestQuote}
              onGoToAnalyzer={() => {
                setActiveTab('analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Dedicated AI Problem Analyzer View */}
        {activeTab === 'analyzer' && (
          <div className="py-6">
            <ProblemAnalyzer
              initialPrompt={userProblemText}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedArea={selectedArea}
              setSelectedArea={setSelectedArea}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        )}

        {/* AI Analysis Result View */}
        {activeTab === 'analysis_result' && currentAnalysis && (
          <AnalysisResultView
            result={currentAnalysis}
            userProblemText={userProblemText}
            userZipCode={userZipCode}
            onSelectProvider={handleSelectProvider}
            onRequestQuote={handleRequestQuote}
            onReAnalyze={() => {
              setActiveTab('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Service Provider Marketplace View */}
        {activeTab === 'marketplace' && (
          <MarketplaceView
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            onSelectProvider={handleSelectProvider}
            onRequestQuote={handleRequestQuote}
            onGoToAnalyzer={() => {
              setActiveTab('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Provider Details Profile View */}
        {activeTab === 'provider_detail' && selectedProvider && (
          <ProviderDetailView
            provider={selectedProvider}
            onBack={() => {
              setActiveTab('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRequestQuote={handleRequestQuote}
          />
        )}

        {/* Service Request Form View */}
        {activeTab === 'request_form' && (
          <RequestFormView
            initialAnalysis={currentAnalysis}
            initialProblemText={userProblemText}
            selectedProvider={selectedProvider}
            onBack={() => {
              if (currentAnalysis) {
                setActiveTab('analysis_result');
              } else {
                setActiveTab('marketplace');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRequestSubmitted={handleRequestSubmitted}
          />
        )}

        {/* Request Confirmation Screen */}
        {activeTab === 'confirmation' && lastSubmittedRequest && (
          <RequestConfirmationView
            request={lastSubmittedRequest}
            onViewMyRequests={() => {
              setActiveTab('my_requests');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNewRequest={() => {
              setUserProblemText('');
              setCurrentAnalysis(null);
              setActiveTab('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* My Saved Requests History */}
        {activeTab === 'my_requests' && (
          <MyRequestsView
            requests={savedRequests}
            onBack={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectRequest={(req) => {
              setLastSubmittedRequest(req);
              setActiveTab('confirmation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNewRequest={() => {
              setActiveTab('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* How It Works Section Direct */}
        {activeTab === 'how-it-works' && (
          <div className="py-8">
            <HowItWorksSection
              onStart={() => {
                setActiveTab('analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(catId) => {
          setActiveTab('marketplace');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoToAnalyzer={() => {
          setActiveTab('analyzer');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
