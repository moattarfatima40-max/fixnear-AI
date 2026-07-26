import { ServiceCategory } from '../types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'hvac',
    name: 'AC Technician & Cooling',
    iconName: 'Wind',
    description: 'AC servicing, inverter gas refilling, compressor repair, cooling coil replacement, and split unit mounting.',
    popularIssues: [
      'Split AC throwing warm air or low cooling',
      'AC indoor unit leaking water inside room',
      'Compressor making loud buzzing or clicking noise',
      'Inverter error codes or gas leakage'
    ],
    averageCostRange: 'Rs. 1,500 - Rs. 6,000',
    recommendedTrade: 'Certified AC Technician'
  },
  {
    id: 'electrical',
    name: 'Electrician & Wiring',
    iconName: 'Zap',
    description: 'UPS & solar inverter wiring, main DB breakers, short circuit fix, fan installation, and switchboards.',
    popularIssues: [
      'UPS or solar inverter trips repeatedly',
      'Main circuit breaker tripping or burning smell from DB box',
      'Sparking from wall socket or light switch',
      'Ceiling fan or chandelier installation'
    ],
    averageCostRange: 'Rs. 1,000 - Rs. 4,500',
    recommendedTrade: 'Licensed Electrician'
  },
  {
    id: 'plumbing',
    name: 'Plumbing & Pipes',
    iconName: 'Droplets',
    description: 'Motor pump repair, water tank cleaning, pipe leaks, geyser installation, and bathroom fitting.',
    popularIssues: [
      'Water motor pump not pulling water or motor burnt',
      'Water leak inside wall tile or ceiling dampness',
      'Gas or instant electric geyser not heating water',
      'Severely blocked kitchen drain or commode'
    ],
    averageCostRange: 'Rs. 1,200 - Rs. 5,000',
    recommendedTrade: 'Master Plumber'
  },
  {
    id: 'auto',
    name: 'Mechanic & Mobile Auto',
    iconName: 'Car',
    description: 'Mobile auto mechanics for battery jumpstart, brake pads, engine diagnostics, oil change, and tuning.',
    popularIssues: [
      'Car won\'t start, battery dead or click sound',
      'Squealing brakes or engine overheating',
      'Check engine light diagnostic check',
      'Mobile battery replacement or roadside assistance'
    ],
    averageCostRange: 'Rs. 1,500 - Rs. 7,000',
    recommendedTrade: 'Qualified Mobile Mechanic'
  },
  {
    id: 'mobile_repair',
    name: 'Mobile Phone Repair',
    iconName: 'Smartphone',
    description: 'Doorstep & shop mobile screen replacement, battery replacement, charging port repair, and water damage recovery.',
    popularIssues: [
      'Cracked iPhone/Android display screen',
      'Mobile battery draining fast or swelling',
      'Charging port loose or not taking charge',
      'Water damage or motherboard short circuit'
    ],
    averageCostRange: 'Rs. 1,000 - Rs. 8,000',
    recommendedTrade: 'Mobile Hardware Specialist'
  },
  {
    id: 'laptop_repair',
    name: 'Laptop Repair',
    iconName: 'Laptop',
    description: 'Display screen replacement, keyboard repair, SSD/RAM upgrade, motherboard repair, and heating/fan clean.',
    popularIssues: [
      'Laptop screen broken or showing lines',
      'Laptop not powering on or battery dead',
      'Overheating & loud fan noise',
      'SSD installation & OS re-installation'
    ],
    averageCostRange: 'Rs. 1,500 - Rs. 12,000',
    recommendedTrade: 'Laptop Hardware Technician'
  },
  {
    id: 'appliance',
    name: 'Appliance Repair',
    iconName: 'Refrigerator',
    description: 'Deep freezer, refrigerator gas refill, washing machine spinner/dryer motor, microwave, and oven repairs.',
    popularIssues: [
      'Refrigerator not cooling or ice forming on coils',
      'Automatic washing machine error codes or not spinning',
      'Microwave running but not heating food',
      'Deep freezer compressor overload'
    ],
    averageCostRange: 'Rs. 1,200 - Rs. 5,500',
    recommendedTrade: 'Appliance Technician'
  },
  {
    id: 'handyman',
    name: 'Handyman & Home Fixes',
    iconName: 'Wrench',
    description: 'Furniture assembly, curtain rods, door locks, painting touch-ups, and general home maintenance.',
    popularIssues: [
      'Door lock jamming or hinge repair',
      'Wall mounting LED TV or shelves',
      'Minor drywall/plaster touch up',
      'General wood carpentry fixes'
    ],
    averageCostRange: 'Rs. 800 - Rs. 3,000',
    recommendedTrade: 'Home Repair Handyman'
  }
];
