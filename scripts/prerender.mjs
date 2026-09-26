import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const BASE_HTML_PATH = path.join(DIST_DIR, 'index.html');
const DOMAIN = 'https://www.sktradersphilipslighting.com';

// Route-specific metadata mapping
const ROUTE_METADATA = [
  {
    route: '/products',
    title: 'Products Catalogue | SK Traders Authorized Philips Distributor',
    description: 'Browse authentic Philips Lighting products, commercial LED panels, COB downlights, industrial floodlights, WiZ smart lights, and BLDC ceiling fans in Hyderabad.',
    h1: 'SK Traders Lighting Product Catalogue',
    canonical: `${DOMAIN}/products`,
  },
  {
    route: '/applications',
    title: 'Lighting Applications & Solutions | SK Traders Philips Lighting',
    description: 'Professional lighting solutions for commercial offices, warehouses, industrial logistics hubs, hospitals, and cleanrooms in Hyderabad.',
    h1: 'Commercial & Industrial Lighting Applications',
    canonical: `${DOMAIN}/applications`,
  },
  {
    route: '/products/ceiling-lights',
    title: 'Architectural Ceiling Lights & Troffers | SK Traders Philips Distributor',
    description: 'Explore ultra-thin, glare-free Philips LED ceiling troffers and architectural surface luminaires for offices and homes in Hyderabad.',
    h1: 'Philips LED Ceiling Lights & Architectural Troffers',
    canonical: `${DOMAIN}/products/ceiling-lights`,
  },
  {
    route: '/products/led-bulbs',
    title: 'Philips LED Bulbs & B22/E27 Lamps | SK Traders Hyderabad',
    description: 'High-efficacy Philips LED bulbs, B22 pin and E27 screw retrofit lamps for maximum energy savings and long lifetime.',
    h1: 'Philips Energy-Saving LED Bulbs & Lamps',
    canonical: `${DOMAIN}/products/led-bulbs`,
  },
  {
    route: '/products/panel-lights',
    title: 'Philips 2x2 LED Panel Lights | SK Traders Hyderabad',
    description: 'Edge-lit 2x2 office grid LED panel lights with high CRI, anti-glare diffuser, and Signify driver warranty.',
    h1: 'Philips Commercial 2x2 LED Panel Lights',
    canonical: `${DOMAIN}/products/panel-lights`,
  },
  {
    route: '/products/downlights',
    title: 'COB Recessed Downlights & Spotlights | SK Traders Philips Distributor',
    description: 'Trimless architectural COB downlights with deep recessed baffle, low glare (UGR<19), and premium finish.',
    h1: 'Architectural Trimless COB LED Downlights',
    canonical: `${DOMAIN}/products/downlights`,
  },
  {
    route: '/products/spotlights',
    title: '48V Low-Voltage Magnetic Track Spotlights | SK Traders',
    description: 'Flexible 48V low voltage magnetic track spotlights, linear accents, and 360-degree rotatable architectural tracks.',
    h1: '48V Magnetic Track Spotlights & Linear Accents',
    canonical: `${DOMAIN}/products/spotlights`,
  },
  {
    route: '/products/decorative-lights',
    title: 'Decorative Lighting & Ambient Sconces | SK Traders Philips',
    description: 'Elegant chandeliers, suspended architectural pendants, and warm ambient wall sconces for luxury interiors.',
    h1: 'Decorative Architectural & Ambient Lighting',
    canonical: `${DOMAIN}/products/decorative-lights`,
  },
  {
    route: '/products/smart-lighting',
    title: 'Philips WiZ Smart Connected Lighting | SK Traders Hyderabad',
    description: 'WiZ Connected smart LED bulbs, ceiling panels, and RGB lightstrips with 16 million colors, voice control, and mobile app scheduled dimming.',
    h1: 'Philips WiZ Connected Smart Lighting Systems',
    canonical: `${DOMAIN}/products/smart-lighting`,
  },
  {
    route: '/products/fans',
    title: 'Energy Efficient BLDC Ceiling Fans | SK Traders Hyderabad',
    description: 'Silent BLDC motor ceiling fans with remote control, 65% energy savings, and premium wood/metallic finishes.',
    h1: 'Energy Efficient BLDC Motor Ceiling Fans',
    canonical: `${DOMAIN}/products/fans`,
  },
  {
    route: '/applications/office-commercial',
    title: 'Office & Commercial Space Lighting Solutions | SK Traders',
    description: 'Ergonomic, glare-free office illumination, LED grid troffers, and smart conference room ambient lighting.',
    h1: 'Commercial Office & Corporate Workspace Lighting',
    canonical: `${DOMAIN}/applications/office-commercial`,
  },
  {
    route: '/applications/industry-logistics',
    title: 'Industrial & Warehouse High-Bay Lighting | SK Traders',
    description: 'Heavy-duty IP65 high-bay floodlights, industrial canopy luminaires, and logistics warehouse lighting.',
    h1: 'Industrial Warehouse & High-Bay Lighting Solutions',
    canonical: `${DOMAIN}/applications/industry-logistics`,
  },
  {
    route: '/applications/healthcare-hospitals',
    title: 'Hospital Cleanroom & Medical Grade Lighting | SK Traders',
    description: 'Cleanroom certified sealed LED troffers, hospital surgical suite lighting, and patient room glare-free luminaires.',
    h1: 'Hospital Cleanroom & Healthcare Facility Lighting',
    canonical: `${DOMAIN}/applications/healthcare-hospitals`,
  },
  {
    route: '/products/detail/philips-wiz-smart-led-bulb-12w-rgbw',
    title: 'Philips WiZ Smart LED Bulb 12W RGBW | SK Traders',
    description: 'Buy authentic Philips WiZ Smart LED Bulb 12W RGBW in Hyderabad. Voice controlled, 16 million colors, B22/E27 base.',
    h1: 'Philips WiZ Smart LED Bulb 12W RGBW',
    canonical: `${DOMAIN}/products/detail/philips-wiz-smart-led-bulb-12w-rgbw`,
  },
  {
    route: '/products/detail/sk-traders-architectural-trimless-cob-downlight-18w',
    title: 'SK Traders Architectural Trimless COB Downlight 18W',
    description: '18W Trimless deep recessed architectural COB spotlight with die-cast aluminum housing and Osram/Philips COB chip.',
    h1: 'Architectural Trimless COB Downlight 18W',
    canonical: `${DOMAIN}/products/detail/sk-traders-architectural-trimless-cob-downlight-18w`,
  },
  {
    route: '/products/detail/sk-traders-48v-magnetic-track-spotlight-20w',
    title: 'SK Traders 48V Low-Voltage Magnetic Track Spotlight 20W',
    description: '20W 48V magnetic track light fixture with magnetic click-in mechanism, 360-degree rotation, and honeycomb louvre.',
    h1: '48V Low-Voltage Magnetic Track Spotlight 20W',
    canonical: `${DOMAIN}/products/detail/sk-traders-48v-magnetic-track-spotlight-20w`,
  },
  {
    route: '/products/detail/philips-slimline-led-panel-2x2-36w',
    title: 'Philips Slimline 2x2 LED Panel Light 36W | SK Traders',
    description: '36W 2x2 square ultra-slim office grid LED panel light with 3600 lumens and 50,000-hour rated lifespan.',
    h1: 'Philips Slimline 2x2 LED Panel Light 36W',
    canonical: `${DOMAIN}/products/detail/philips-slimline-led-panel-2x2-36w`,
  },
];

async function prerender() {
  console.log('🏗️ Starting Post-Build Static Page Prerendering...');

  if (!fs.existsSync(BASE_HTML_PATH)) {
    console.error('❌ dist/index.html not found! Run vite build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(BASE_HTML_PATH, 'utf-8');

  for (const item of ROUTE_METADATA) {
    const targetDir = path.join(DIST_DIR, item.route.replace(/^\//, ''));
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, 'index.html');

    let html = baseHtml;

    // Replace Title
    html = html.replace(/<title>.*?<\/title>/gi, `<title>${item.title}</title>`);

    // Replace Meta Description
    html = html.replace(
      /<meta name="description" content=".*?" \/>/gi,
      `<meta name="description" content="${item.description}" />`
    );

    // Inject Canonical URL
    const canonicalTag = `<link rel="canonical" href="${item.canonical}" />`;
    html = html.replace('</head>', `  ${canonicalTag}\n  </head>`);

    // Update OpenGraph Title, Description, and URL
    html = html.replace(
      /<meta property="og:title" content=".*?" \/>/gi,
      `<meta property="og:title" content="${item.title}" />`
    );
    html = html.replace(
      /<meta property="og:description" content=".*?" \/>/gi,
      `<meta property="og:description" content="${item.description}" />`
    );
    html = html.replace(
      /<meta property="og:url" content=".*?" \/>/gi,
      `<meta property="og:url" content="${item.canonical}" />`
    );

    // Update H1 in SSR Fallback text
    html = html.replace(
      /<h1 style=".*?">.*?<\/h1>/gi,
      `<h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">${item.h1}</h1>`
    );

    fs.writeFileSync(targetFile, html, 'utf-8');
    console.log(`  ✅ Generated static HTML route: dist${item.route}/index.html`);
  }

  console.log('🎉 Static prerendering complete for all 17 sub-routes!');
}

prerender();
