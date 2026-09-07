export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  wattage: string;
  lumens: string;
  cct: string; // Color Temperature (e.g., 3000K / 4000K / 6500K)
  application: string;
  image: string;
  description: string;
  features: string[];
}

export interface Project {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Retail' | 'Industrial' | 'Outdoor';
  location: string;
  image: string;
  description: string;
  fixturesUsed: string;
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  count: string;
  image: string;
  description: string;
}

export const COMPANY_INFO = {
  name: 'SK Traders',
  tagline: 'Authorized Distributor of Philips',
  corePillars: ['LIGHT', 'INNOVATION', 'TRUST', 'QUALITY'],
  primaryBrand: 'Philips Lighting',
  email: 'SKraders113@gmail.com',
  phone: '+91 95735 77765',
  address: 'Troop Bazar, Abids, Hyderabad, TS, India',
  locationCity: 'Hyderabad, Telangana, India',
  whatsappUrl: 'https://wa.me/919573577765?text=Hello%20SK%20Traders,%20I%20have%20a%20lighting%20requirement.',
  phoneUrl: 'tel:+919573577765',
};

export const CATEGORIES: Category[] = [
  {
    id: 'led-bulbs',
    name: 'LED Bulbs',
    subtitle: 'Energy Efficient Household & Accent Lighting',
    count: '24+ Variants',
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=1200&q=80',
    description: 'High-performance LED lamps delivering flicker-free, crisp illumination with up to 90% energy savings.',
  },
  {
    id: 'led-tubes',
    name: 'LED Tubes',
    subtitle: 'Linear Architectural & Office Illumination',
    count: '16+ Variants',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
    description: 'Durable glass and polycarbonate T8/T5 LED batten solutions designed for seamless linear light.',
  },
  {
    id: 'downlights',
    name: 'Downlights',
    subtitle: 'Recessed Architectural Ceiling Luminaires',
    count: '32+ Variants',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Ultra-slim recessed downlights offering glare-free ambient lighting for modern interiors.',
  },
  {
    id: 'panel-lights',
    name: 'Panel Lights',
    subtitle: 'Edge-Lit Office & Commercial Ceiling Grid Panels',
    count: '18+ Variants',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    description: 'Sleek 2x2 and 1x4 ceiling grid panels providing uniform light distribution for workspace productivity.',
  },
  {
    id: 'spotlights',
    name: 'Spotlights',
    subtitle: 'Precision Accent & Track Lighting',
    count: '20+ Variants',
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1200&q=80',
    description: 'Adjustable beam track and surface spotlights engineered for retail galleries and display walls.',
  },
  {
    id: 'floodlights',
    name: 'Floodlights',
    subtitle: 'High-Lumen Exterior Security & Facade Illumination',
    count: '15+ Variants',
    image: '/images/card_outdoor_lighting.jpg',
    description: 'IP66 rugged floodlighting systems providing wide throw illumination for sports grounds, yards, and building facades.',
  },
  {
    id: 'street-lights',
    name: 'Street Lights',
    subtitle: 'Municipal Roadway & Infrastructure Lighting',
    count: '12+ Variants',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    description: 'Smart city compatible LED street luminaires with surge protection and thermal dissipation optics.',
  },
  {
    id: 'smart-lighting',
    name: 'Smart Lighting',
    subtitle: 'IoT Connected Light Controls & Automated Scenes',
    count: '25+ Variants',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    description: 'Wi-Fi/Zigbee enabled tunable white and color ambiance smart fixtures integrated with voice assistants.',
  },
  {
    id: 'decorative-lighting',
    name: 'Decorative Lighting',
    subtitle: 'Bespoke Chandelier & Cove Ambient Strips',
    count: '30+ Variants',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    description: 'Designer pendant fittings, cove lighting LED strips, and statement accent luminaires.',
  },
  {
    id: 'commercial-lighting',
    name: 'Commercial Lighting',
    subtitle: 'Industrial Highbays & Warehouse Systems',
    count: '22+ Variants',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    description: 'Heavy-duty highbay suspended luminaires for manufacturing units, logistics hubs, and cold storage.',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'philips-greenperform-downlight',
    name: 'Philips GreenPerform Recessed Downlight',
    category: 'Downlights',
    brand: 'Philips',
    wattage: '15W / 22W',
    lumens: '1800 lm',
    cct: '3000K Warm / 4000K Neutral / 6500K Cool',
    application: 'Corporate Executive Suites & Luxury Residences',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'High-efficacy architectural recessed downlight with low glare index (UGR<19) engineered for premium visual comfort.',
    features: ['High color rendering index CRI > 85', 'Extruded aluminum heat sink', 'Lifespan 50,000 hrs L70', 'DALI dimmable option available'],
  },
  {
    id: 'philips-smartbright-panel',
    name: 'Philips SmartBright LED Panel 2x2',
    category: 'Panel Lights',
    brand: 'Philips',
    wattage: '36W',
    lumens: '3600 lm',
    cct: '4000K Neutral / 6500K Daylight',
    application: 'Open Plan Workspaces & Healthcare Facilities',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Uniform light distribution panel with micro-prismatic optics preventing harsh shadows and eye fatigue.',
    features: ['Ultra-thin 8mm profile', 'High efficacy 100 lm/W', 'Anti-yellowing diffuser lens', 'Class II electrical rating'],
  },
  {
    id: 'philips-byp007-highbay',
    name: 'Philips GreenUp LED Highbay Luminaire',
    category: 'Commercial Lighting',
    brand: 'Philips',
    wattage: '100W / 150W / 200W',
    lumens: '24,000 lm',
    cct: '5000K / 6500K',
    application: 'Industrial Warehouses, Plants & Logistics Hubs',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    description: 'IP65 impact resistant IK08 die-cast aluminum highbay fixture built for high temperature industrial environments.',
    features: ['Hook and pipe mounting flexibility', 'Surge protection up to 4kV', 'High efficacy up to 140 lm/W', 'Wide optical beam angle optics'],
  },
  {
    id: 'philips-tango-g3-floodlight',
    name: 'Philips Tango G3 LED Floodlight',
    category: 'Floodlights',
    brand: 'Philips',
    wattage: '70W / 120W / 240W',
    lumens: '28,800 lm',
    cct: '4000K / 5700K',
    application: 'Outdoor Stadiums, Parking Grounds & Infrastructure',
    image: '/images/card_outdoor_lighting.jpg',
    description: 'Next-generation exterior floodlight with asymmetrical light throw optics for targeted glare control.',
    features: ['IP66 dust & moisture ingress protection', 'Salt spray corrosion resistant coating', '10kV integrated surge protective device', 'Aerodynamic wind load structure'],
  },
  {
    id: 'philips-essential-spotlight',
    name: 'Philips Accent Track Spotlight',
    category: 'Spotlights',
    brand: 'Philips',
    wattage: '12W / 24W',
    lumens: '2100 lm',
    cct: '2700K Warm / 3000K Warm White',
    application: 'Retail Boutiques, Jewelry Showrooms & Art Galleries',
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80',
    description: 'Precision adjustable track luminaire designed to accentuate merchandise textures and colors with high fidelity.',
    features: ['360-degree horizontal rotation', '90-degree vertical tilt angle', 'Interchangeable beam optics (15°, 24°, 36°)', 'Superior color rendering CRI > 90'],
  },
  {
    id: 'philips-hue-tunable-strip',
    name: 'Philips Hue Smart Lightstrip Plus',
    category: 'Smart Lighting',
    brand: 'Philips Hue',
    wattage: '20W / 2m Base',
    lumens: '1600 lm',
    cct: '16 Million Colors + 2200K-6500K Tunable White',
    application: 'Cove Accent Lighting, Architectural Feature Walls',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    description: 'Flexible smart indirect lighting strip integrated with wireless automation, custom scenes, and sync capabilities.',
    features: ['Zigbee & Bluetooth smart connectivity', 'Cuttable and extendable up to 10m', 'Custom light schedules and scene presets', 'Voice control via Google Assistant & Alexa'],
  },
  {
    id: 'philips-master-ledtube-t8',
    name: 'Philips Master LEDtube T8 Linear',
    category: 'LED Tubes',
    brand: 'Philips',
    wattage: '18W (Replaces 36W Fluorescent)',
    lumens: '2100 lm',
    cct: '4000K Cool White / 6500K Daylight',
    application: 'Parking Garages, Stairwells & Office Corridors',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    description: 'Shatter-proof glass tube replacement saving 50%+ electricity compared to conventional T8 electromagnetic ballasts.',
    features: ['Instant 100% full lumen output', 'No UV or infrared radiation', 'Rotatable end caps for directional control', '50,000 hour rated life span'],
  },
  {
    id: 'philips-essential-smartbright-street',
    name: 'Philips SmartBright LED Street Light',
    category: 'Street Lights',
    brand: 'Philips',
    wattage: '35W / 70W / 140W',
    lumens: '15,400 lm',
    cct: '4000K / 5700K',
    application: 'Gated Communities, Commercial Campuses, Roadways',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    description: 'Optically optimized streetlight fixture delivering uniform illumination on road surfaces with zero upward waste.',
    features: ['High pressure die-cast aluminum housing', 'Tool-less opening access cover', 'IP66 water resistance rating', '7-pin NEMA socket smart city ready'],
  },
];

export const SOLUTIONS_PANELS = [
  {
    id: 'residential',
    title: 'RESIDENTIAL LIGHTING',
    subtitle: 'Crafting Warmth & Elegance for Modern Living Spaces',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    description: 'From recessed glare-free downlights to cove ambient lighting, SK Traders helps homeowners and architects build personalized lighting atmospheres that blend comfort, visual aesthetics, and smart control.',
    highlights: ['Tunable White Ambiance', 'Glare-free Recessed Optics', 'Decorative Cove Lighting', 'Smart App & Voice Automation'],
  },
  {
    id: 'commercial',
    title: 'COMMERCIAL LIGHTING',
    subtitle: 'Optimizing Workspace Productivity & Visual Comfort',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    description: 'High-efficacy LED panels and architectural linear luminaires designed to minimize glare, enhance workplace focus, meet strict lux level codes, and reduce corporate energy expenditures.',
    highlights: ['UGR < 19 Low Glare Panels', 'Occupancy Sensor Integration', 'Daylight Harvesting Controls', 'Continuous Linear Batten Systems'],
  },
  {
    id: 'retail',
    title: 'RETAIL LIGHTING',
    subtitle: 'Illuminating Products to Captivate & Convert Customers',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    description: 'High-CRI accent track spotlights and custom showcase lighting engineered to highlight apparel colors, jewelry sparkle, and product textures in luxury retail environments.',
    highlights: ['CRI 90+ True Color Rendering', '3-Phase Track Spotlights', 'Accent Wall Wash Optics', 'Dynamic Showcase Illumination'],
  },
  {
    id: 'industrial',
    title: 'INDUSTRIAL LIGHTING',
    subtitle: 'Heavy-Duty Reliability for Demanding Work Environments',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    description: 'High-bay LED luminaires engineered with rugged die-cast aluminum heat sinks, surge protection, and high dust/water resistance to withstand manufacturing plants and warehouses.',
    highlights: ['IP65 Ingress & IK08 Impact Protection', 'Up to 140 lm/W Efficacy', 'High Ambient Temp Resistance', 'Heavy Duty Suspension Hardware'],
  },
  {
    id: 'outdoor',
    title: 'OUTDOOR LIGHTING',
    subtitle: 'Safety, Vision & Visual Presence in Exterior Architecture',
    image: '/images/card_outdoor_lighting.jpg',
    description: 'Weatherproof floodlights, street lights, and facade accent fixtures designed to transform outdoor grounds, parking facilities, and building exteriors with powerful, reliable light.',
    highlights: ['IP66 Waterproof Sealed Housings', 'Asymmetric Precision Beams', '10kV Integrated Surge Protection', 'Facade Accent Wall Grazing'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Modern Luxury Villa',
    category: 'Residential',
    location: 'Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    description: 'Comprehensive architectural lighting supply including recessed warm downlights, magnetic track accent spots, and smart dimmable cove LED strips throughout living zones.',
    fixturesUsed: 'Philips GreenPerform Downlights, Philips Hue Smart Strips',
  },
  {
    id: 'proj-2',
    title: 'Tech Park Executive Headquarters',
    category: 'Commercial',
    location: 'Hitec City, Hyderabad',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    description: 'Complete office grid illumination setup using ultra-slim low glare 2x2 LED panel lights, continuous linear lobby accents, and presence-sensor corridor lighting.',
    fixturesUsed: 'Philips SmartBright 2x2 Panels, Philips Master LEDtubes',
  },
  {
    id: 'proj-3',
    title: 'Premium Fashion Store',
    category: 'Retail',
    location: 'Gachibowli, Hyderabad',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
    description: 'High-CRI 3000K accent track spotlights mounted on ceiling grids to reveal garment colors with high accuracy and enhance window display appeal.',
    fixturesUsed: 'Philips Accent Track Spotlights CRI 90+',
  },
  {
    id: 'proj-4',
    title: 'Logistics Warehouse & Processing Hub',
    category: 'Industrial',
    location: 'Patancheru Industrial Zone, Hyderabad',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    description: 'High-bay LED luminaire installation over 50,000 sq. ft. storage facility providing uniform lux levels across aisle racks with zero delay start.',
    fixturesUsed: 'Philips GreenUp 150W LED Highbays',
  },
  {
    id: 'proj-5',
    title: 'Commercial Complex & Landscape Park',
    category: 'Outdoor',
    location: 'Banjara Hills, Hyderabad',
    image: '/images/card_outdoor_lighting.jpg',
    description: 'Exterior facade illumination with IP66 asymmetrical floodlighting, perimeter bollard lights, and street lighting along entry driveways.',
    fixturesUsed: 'Philips Tango G3 Floodlights, Philips SmartBright Street Luminaires',
  },
];

export const VALUE_PILLARS = [
  {
    number: '01',
    title: 'GENUINE PRODUCTS',
    detail: 'Direct supply of authentic Philips lighting fixtures with complete original warranties and optical test certificates.',
  },
  {
    number: '02',
    title: 'LIGHTING SOLUTIONS',
    detail: 'Comprehensive support ranging from lux calculation consultations to customized fixture recommendations for any scale project.',
  },
  {
    number: '03',
    title: 'EXPERT GUIDANCE',
    detail: 'Dedicated technical assistance to guide electrical contractors, architects, interior designers, and project managers.',
  },
  {
    number: '04',
    title: 'CUSTOMER SUPPORT',
    detail: 'Responsive after-sales service, prompt product quotes, and dependable stock dispatch from our Hyderabad hub.',
  },
];
