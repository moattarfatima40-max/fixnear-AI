import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, MapPin, ShieldCheck, Clock, CheckCircle2, Phone, Sparkles, ArrowRight, X, Building2, Wrench } from 'lucide-react';
import { ServiceProvider, FilterState } from '../types';
import { SERVICE_PROVIDERS } from '../data/providers';
import { SERVICE_CATEGORIES } from '../data/categories';
import { PAKISTAN_CITIES } from '../data/locations';

interface MarketplaceViewProps {
  selectedCity?: string;
  setSelectedCity?: (city: string) => void;
  selectedArea?: string;
  setSelectedArea?: (area: string) => void;
  onSelectProvider: (provider: ServiceProvider) => void;
  onRequestQuote: (provider: ServiceProvider) => void;
  onGoToAnalyzer: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  selectedCity = 'Karachi',
  setSelectedCity,
  selectedArea = 'Gulshan-e-Iqbal',
  setSelectedArea,
  onSelectProvider,
  onRequestQuote,
  onGoToAnalyzer,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    categoryId: 'all',
    searchKeyword: '',
    minRating: 0,
    maxDistance: 50,
    emergencyOnly: false,
    verifiedOnly: false,
    sortBy: 'rating',
    city: selectedCity,
    area: selectedArea,
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeCity = selectedCity || filters.city || 'Karachi';
  const activeArea = selectedArea || filters.area || 'Gulshan-e-Iqbal';

  const currentCityObj = PAKISTAN_CITIES.find(c => c.name === activeCity) || PAKISTAN_CITIES[0];

  const handleCityChange = (newCity: string) => {
    if (setSelectedCity) setSelectedCity(newCity);
    const newCityObj = PAKISTAN_CITIES.find(c => c.name === newCity) || PAKISTAN_CITIES[0];
    const defaultArea = newCityObj?.areas[0] || '';
    if (setSelectedArea) setSelectedArea(defaultArea);
    setFilters(prev => ({ ...prev, city: newCity, area: defaultArea }));
  };

  const handleAreaChange = (newArea: string) => {
    if (setSelectedArea) setSelectedArea(newArea);
    setFilters(prev => ({ ...prev, area: newArea }));
  };

  const filteredProviders = useMemo(() => {
    // First filter by city
    let list = SERVICE_PROVIDERS.filter((p) => p.city === activeCity);

    // If no provider in this city, show all for demo
    if (list.length === 0) {
      list = SERVICE_PROVIDERS;
    }

    // Filter by category
    if (filters.categoryId !== 'all') {
      list = list.filter((p) => p.categoryId === filters.categoryId);
    }

    // Filter by keyword
    if (filters.searchKeyword.trim()) {
      const kw = filters.searchKeyword.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(kw) ||
        p.companyName.toLowerCase().includes(kw) ||
        p.categoryName.toLowerCase().includes(kw) ||
        p.area.toLowerCase().includes(kw) ||
        p.servicesOffered.some((s) => s.toLowerCase().includes(kw))
      );
    }

    // Minimum rating
    if (filters.minRating > 0) {
      list = list.filter((p) => p.rating >= filters.minRating);
    }

    // Emergency only
    if (filters.emergencyOnly) {
      list = list.filter((p) => p.isEmergencyAvailable);
    }

    // Verified only
    if (filters.verifiedOnly) {
      list = list.filter((p) => p.badges.includes('Verified Pro'));
    }

    // Sort
    return list.sort((a, b) => {
      // Prioritize same area
      if (a.area === activeArea && b.area !== activeArea) return -1;
      if (b.area === activeArea && a.area !== activeArea) return 1;

      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'price') return (a.startingPriceRs || a.hourlyRateRs || 1000) - (b.startingPriceRs || b.hourlyRateRs || 1000);
      if (filters.sortBy === 'experience') return b.yearsInBusiness - a.yearsInBusiness;
      return (a.distanceKm || 0) - (b.distanceKm || 0);
    });
  }, [SERVICE_PROVIDERS, activeCity, activeArea, filters]);

  return (
    <div id="marketplace-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Marketplace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-900 font-extrabold px-3 py-1 rounded-full text-xs mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pakistan Verified Local Experts</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Service Provider Marketplace ({activeCity})
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Verified technicians, plumbers, electricians, and mechanics near <strong>{activeArea}, {activeCity}</strong>.
          </p>
        </div>

        <button
          onClick={onGoToAnalyzer}
          className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 text-xs sm:text-sm self-start md:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Don't know who you need? Use AI Triage</span>
        </button>
      </div>

      {/* Location Filter & Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* City and Area Selection Dropdowns */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Filter City:</span>
            </label>
            <select
              value={activeCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold focus:border-teal-600 focus:outline-none cursor-pointer"
            >
              {PAKISTAN_CITIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.province})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Filter Area:</span>
            </label>
            <select
              value={activeArea}
              onChange={(e) => handleAreaChange(e.target.value)}
              className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold focus:border-teal-600 focus:outline-none cursor-pointer"
            >
              {currentCityObj.areas.map((area, idx) => (
                <option key={idx} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category:
            </label>
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
              className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold focus:border-teal-600 focus:outline-none cursor-pointer"
            >
              <option value="all">All Service Categories</option>
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sort By:
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
              }
              className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold focus:border-teal-600 focus:outline-none cursor-pointer"
            >
              <option value="rating">Highest Rating</option>
              <option value="price">Lowest Starting Price (Rs.)</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>
        </div>

        {/* Search Keyword Input */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchKeyword}
              onChange={(e) => setFilters({ ...filters, searchKeyword: e.target.value })}
              placeholder={`Search providers in ${activeCity} by name, area, or service e.g. 'Inverter AC', 'UPS', 'Breaker'...`}
              className="w-full bg-slate-50 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-sm font-medium focus:outline-none"
            />
            {filters.searchKeyword && (
              <button
                onClick={() => setFilters({ ...filters, searchKeyword: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden w-full bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Options {filters.emergencyOnly || filters.verifiedOnly ? '(Active)' : ''}</span>
          </button>
        </div>

        {/* Quick Checkboxes */}
        <div className="hidden md:flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={filters.emergencyOnly}
                onChange={(e) => setFilters({ ...filters, emergencyOnly: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>🚨 24/7 Emergency Service</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Verified Pro Badge</span>
            </label>
          </div>

          <p className="text-slate-500 font-medium">
            Found <strong className="text-slate-900">{filteredProviders.length}</strong> matching providers in {activeCity}
          </p>
        </div>

      </div>

      {/* Provider Cards Grid */}
      {filteredProviders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">No Providers Found for Selected Criteria</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try switching cities, clearing your search keyword, or selecting "All Service Categories".
          </p>
          <button
            onClick={() =>
              setFilters({
                categoryId: 'all',
                searchKeyword: '',
                minRating: 0,
                maxDistance: 50,
                emergencyOnly: false,
                verifiedOnly: false,
                sortBy: 'rating',
                city: activeCity,
                area: activeArea,
              })
            }
            className="px-4 py-2 bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 text-xs font-bold rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start space-x-3.5 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-slate-900 text-base truncate group-hover:text-teal-700 transition-colors">
                      {provider.companyName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Lead: {provider.name}</p>
                    <p className="text-xs font-bold text-teal-700 mt-0.5">{provider.categoryName}</p>
                  </div>
                </div>

                {/* Location Pill & Rating */}
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl text-xs mb-3 border border-slate-100">
                  <div className="flex items-center font-bold text-amber-600">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                    <span>{provider.rating}</span>
                    <span className="text-slate-400 font-normal ml-1">({provider.reviewCount})</span>
                  </div>
                  <span className="text-slate-700 font-bold flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 mr-1" />
                    {provider.area}, {provider.city}
                  </span>
                </div>

                {/* Services List */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {provider.bio}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  {provider.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md font-semibold"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Pricing & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Service Call Fee</span>
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
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Request</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
