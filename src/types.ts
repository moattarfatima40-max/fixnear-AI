export type UrgencyLevel = 'emergency' | 'high' | 'medium' | 'low' | 'High' | 'Medium' | 'Low';

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  popularIssues: string[];
  averageCostRange: string;
  recommendedTrade: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  jobType: string;
  verified: boolean;
}

export interface ServiceProvider {
  id: string;
  name: string;
  companyName: string;
  avatarUrl: string;
  categoryId: string;
  categoryName: string;
  subCategories: string[];
  rating: number;
  reviewCount: number;
  startingPriceRs: number;
  hourlyRateRs: number;
  serviceCallFeeRs: number;
  city: string;
  area: string;
  province?: string;
  distanceKm: number;
  phone: string;
  whatsapp?: string;
  email: string;
  bio: string;
  yearsInBusiness: number;
  completedJobs: number;
  badges: string[]; // e.g. ['Verified Pro', 'License Checked', 'Top Rated', '24/7 Emergency', 'Pakistani Verified']
  licenseNumber: string;
  servicesOffered: string[];
  portfolioImages: string[];
  reviews: Review[];
  availability: string; // e.g. 'Available Today', 'Dispatch in 30 mins', 'Next Day'
  responseTime: string; // e.g. '15 mins'
  isEmergencyAvailable: boolean;
  isDemoProvider?: boolean;
}

export interface AIAnalysisResult {
  category: 'AC Technician' | 'Electrician' | 'Plumber' | 'Mechanic' | 'Mobile Phone Repair' | 'Laptop Repair' | 'Appliance Repair' | string;
  professional: string;
  possibleIssue: string;
  urgency: 'Low' | 'Medium' | 'High' | string;
  safeAdvice: string[];
  nextStep: string;

  // Additional detail fields for full-stack triage app features
  primaryCategoryId: string;
  categoryName: string;
  recommendedTrade: string;
  urgencyLevel: UrgencyLevel;
  urgencyReason: string;
  summaryTitle: string;
  diagnosticSummary: string;
  potentialCauses: string[];
  estimatedCostMin: number;
  estimatedCostMax: number;
  estimatedTimeToFix: string;
  questionsToAskProvider: string[];
  safetyTips: string[];
  recommendedProviderIds: string[];
  matchConfidence: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  notes?: string;
}

export interface ServiceRequest {
  id: string;
  createdAt: string;
  status: 'submitted' | 'matched' | 'notified' | 'estimate_ready' | 'scheduled' | 'completed';
  problemDescription: string;
  aiAnalysis: AIAnalysisResult;
  selectedProviderId?: string;
  selectedProviderName?: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  customerInfo: CustomerInfo;
  isEmergency: boolean;
  estimatedCostRange: string;
}

export interface FilterState {
  categoryId: string;
  city: string;
  area: string;
  searchKeyword: string;
  minRating: number;
  maxDistance: number;
  emergencyOnly: boolean;
  verifiedOnly: boolean;
  sortBy: 'rating' | 'distance' | 'price' | 'experience';
}
