import { AIAnalysisResult, ServiceRequest } from '../types';

export async function analyzeProblemWithAI(
  problemDescription: string,
  locationZip: string = '90210',
  urgencyHint: string = 'normal'
): Promise<AIAnalysisResult> {
  if (!problemDescription || !problemDescription.trim()) {
    throw new Error('Please enter a description of the problem before analyzing.');
  }

  try {
    const response = await fetch('/api/analyze-problem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        problemDescription,
        locationZip,
        urgencyHint,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to analyze problem');
    }

    const data: AIAnalysisResult = await response.json();
    return data;
  } catch (error: any) {
    if (error.message && error.message.includes('Please enter')) {
      throw error;
    }

    console.warn('API connection error, using local classification fallback:', error);

    const lower = problemDescription.toLowerCase();
    let category = 'Appliance Repair';
    let professional = 'Certified Repair Specialist';
    let primaryCategoryId = 'appliance';
    let categoryName = 'Appliance Repair';
    let minCost = 1500;
    let maxCost = 4000;

    if (
      lower.includes('ac') || lower.includes('air condition') || lower.includes('cooling') ||
      lower.includes('cold') || lower.includes('thanda') || lower.includes('garm hawa') ||
      lower.includes('compressor') || lower.includes('inverter')
    ) {
      category = 'AC Technician';
      professional = 'Certified AC Specialist';
      primaryCategoryId = 'hvac';
      categoryName = 'AC Technician & Cooling';
      minCost = 1500;
      maxCost = 5000;
    } else if (
      lower.includes('light') || lower.includes('electric') || lower.includes("flicker") ||
      lower.includes('flickering') || lower.includes('spark') || lower.includes('breaker') ||
      lower.includes('bijli') || lower.includes('short circuit') || lower.includes('ups') || lower.includes('wire')
    ) {
      category = 'Electrician';
      professional = 'Licensed Electrician';
      primaryCategoryId = 'electrical';
      categoryName = 'Electrical & Wiring';
      minCost = 1200;
      maxCost = 4500;
    } else if (
      lower.includes('water') || lower.includes('leak') || lower.includes('leaking') ||
      lower.includes('sink') || lower.includes('drain') || lower.includes('pipe') ||
      lower.includes('pani') || lower.includes('geyser') || lower.includes('nalka') || lower.includes('toilet')
    ) {
      category = 'Plumber';
      professional = 'Master Plumber';
      primaryCategoryId = 'plumbing';
      categoryName = 'Plumbing & Pipes';
      minCost = 1200;
      maxCost = 4000;
    } else if (
      lower.includes('motorcycle') || lower.includes('bike') || lower.includes('accelerate') ||
      lower.includes('noise') || lower.includes('car') || lower.includes('gaadi') ||
      lower.includes('engine') || lower.includes('brake') || lower.includes('mechanic')
    ) {
      category = 'Mechanic';
      professional = 'Certified Mobile Mechanic';
      primaryCategoryId = 'auto';
      categoryName = 'Mechanic & Auto Repair';
      minCost = 1500;
      maxCost = 4500;
    } else if (
      lower.includes('mobile') || lower.includes('phone') || lower.includes('screen') ||
      lower.includes('charge') || lower.includes('charging') || lower.includes('iphone') || lower.includes('display')
    ) {
      category = 'Mobile Phone Repair';
      professional = 'Doorstep Mobile Technician';
      primaryCategoryId = 'mobile_repair';
      categoryName = 'Mobile Phone Repair';
      minCost = 1500;
      maxCost = 4000;
    } else if (
      lower.includes('laptop') || lower.includes('wifi') || lower.includes('internet') ||
      lower.includes('pc') || lower.includes('keyboard') || lower.includes('macbook')
    ) {
      category = 'Laptop Repair';
      professional = 'Chip-Level Laptop Specialist';
      primaryCategoryId = 'laptop_repair';
      categoryName = 'Laptop Repair';
      minCost = 2000;
      maxCost = 5500;
    }

    return {
      category,
      professional,
      possibleIssue: `Symptoms point to internal component stress or routine maintenance requirement in ${categoryName.toLowerCase()}.`,
      urgency: urgencyHint === 'emergency' ? 'High' : 'Medium',
      safeAdvice: [
        'Turn off power or water to the unit if active leaking or sparking occurs.',
        'Keep workspace clear and dry until a professional inspects the unit.'
      ],
      nextStep: 'Connect with a verified local specialist to inspect the unit and confirm repair scope.',

      primaryCategoryId,
      categoryName,
      recommendedTrade: professional,
      urgencyLevel: urgencyHint === 'emergency' ? 'emergency' : 'high',
      urgencyReason: 'Requires professional evaluation to inspect physical components and prevent minor issues from worsening.',
      summaryTitle: `${categoryName} Issue Triage`,
      diagnosticSummary: `Local fallback analysis diagnosed statement: "${problemDescription}". Symptoms point to ${categoryName.toLowerCase()} failure or physical wear.`,
      potentialCauses: [
        'Component mechanical fatigue or age',
        'Pressure / electrical connectivity variance',
        'Primary assembly seal or alignment drift'
      ],
      estimatedCostMin: minCost,
      estimatedCostMax: maxCost,
      estimatedTimeToFix: '1 - 3 hours',
      questionsToAskProvider: [
        'Does the diagnostic fee apply towards the final repair cost?',
        'Do you offer warranty on replaced hardware components?',
        'Are you available for doorstep service today?'
      ],
      safetyTips: [
        'Disconnect local power or water shutoff valve if active leaks or sparks occur.',
        'Clear the work environment for technician accessibility.'
      ],
      recommendedProviderIds: ['prov-p1', 'prov-e1'],
      matchConfidence: 90
    };
  }
}

const STORAGE_KEY = 'fixnear_ai_requests_v1';

export function getSavedRequests(): ServiceRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveServiceRequest(req: ServiceRequest): void {
  const existing = getSavedRequests();
  const updated = [req, ...existing.filter((r) => r.id !== req.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateRequestStatus(id: string, status: ServiceRequest['status']): void {
  const existing = getSavedRequests();
  const updated = existing.map((r) => (r.id === id ? { ...r, status } : r));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
