export interface CityLocation {
  id: string;
  name: string;
  province: string;
  areas: string[];
}

export const PAKISTAN_CITIES: CityLocation[] = [
  {
    id: 'karachi',
    name: 'Karachi',
    province: 'Sindh',
    areas: [
      'Gulshan-e-Iqbal',
      'North Nazimabad',
      'DHA Karachi',
      'Clifton',
      'PECHS',
      'Federal B Area',
      'Malir Cantt',
      'Gulistan-e-Johar',
    ],
  },
  {
    id: 'lahore',
    name: 'Lahore',
    province: 'Punjab',
    areas: [
      'Johar Town',
      'Gulberg',
      'DHA Lahore',
      'Bahria Town Lahore',
      'Model Town',
      'Faisal Town',
      'Wapda Town',
      'Garden Town',
    ],
  },
  {
    id: 'islamabad',
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    areas: [
      'F-6',
      'F-7',
      'G-11',
      'F-10',
      'E-11',
      'I-8',
      'DHA Islamabad',
      'F-11',
      'Blue Area',
    ],
  },
  {
    id: 'rawalpindi',
    name: 'Rawalpindi',
    province: 'Punjab',
    areas: [
      'Bahria Town Rawalpindi',
      'Saddar',
      'Satellite Town',
      'Chaklala Scheme 3',
      'Westridge',
      'Gulraiz Housing Scheme',
    ],
  },
  {
    id: 'faisalabad',
    name: 'Faisalabad',
    province: 'Punjab',
    areas: [
      'Gulberg Faisalabad',
      'D Ground',
      'Madina Town',
      "People's Colony",
      'Civil Lines',
      'Canal Road',
    ],
  },
  {
    id: 'multan',
    name: 'Multan',
    province: 'Punjab',
    areas: [
      'Cantt Multan',
      'Bosan Road',
      'Shah Rukn-e-Alam',
      'Gulgasht Colony',
      'Officers Colony',
    ],
  },
  {
    id: 'peshawar',
    name: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    areas: [
      'University Road',
      'Hayatabad',
      'Peshawar Cantt',
      'Saddar',
      'Town Jamrud Road',
    ],
  },
  {
    id: 'quetta',
    name: 'Quetta',
    province: 'Balochistan',
    areas: [
      'Civil Lines',
      'Cantt Quetta',
      'Jinnah Road',
      'Model Town',
      'Zarghoon Road',
    ],
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    province: 'Sindh',
    areas: [
      'Latifabad',
      'Qasimabad',
      'Hyderabad Cantt',
      'Auto Bhan Road',
      'Saddar',
    ],
  },
];
