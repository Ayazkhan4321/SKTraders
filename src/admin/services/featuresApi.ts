import { supabase } from '@/lib/supabase';

export interface FeatureItem {
  id: string;
  title: string;
  slug: string;
  card_image_url: string;
  short_description: string;

  // Hero Section
  hero_image_url: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text?: string;
  hero_cta_link?: string;
  hero_overlay_opacity?: number; // 0 to 100
  hero_text_align?: 'left' | 'center' | 'right';

  // Intro Section
  intro_title?: string;
  intro_description?: string;
  intro_image_url?: string;
  intro_image_position?: 'left' | 'right';

  // Catalogue PDF
  catalogue_title?: string;
  catalogue_description?: string;
  catalogue_pdf_url?: string;
  catalogue_button_text?: string;
  catalogue_active?: boolean;

  // Contact CTA
  contact_cta_title?: string;
  contact_cta_description?: string;
  contact_cta_button_text?: string;
  contact_cta_button_link?: string;
  contact_cta_active?: boolean;

  // Related feature IDs
  related_feature_ids?: string[];

  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FeatureHighlight {
  id: string;
  feature_id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name, e.g. "Zap", "Sun", "ShieldCheck", "Cpu", "Sparkles"
  display_order: number;
  is_active: boolean;
}

export interface FeatureSolution {
  id: string;
  feature_id: string;
  title: string;
  image_url: string;
  description: string;
  link_url?: string;
  pdf_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface FeatureSpecification {
  id: string;
  feature_id: string;
  label: string;
  value: string;
  explanation?: string; // Human friendly explanation, e.g. "Protected against dust and rain"
  display_order: number;
}

export interface FeatureInteractiveComponent {
  id: string;
  feature_id: string;
  name: string;
  tagline: string;
  description: string;
  human_explanation: string;
  image_url?: string;
  icon_name?: string;
  exploded_offset_y: number; // Vertical separation percentage during scroll (0-100)
  display_order: number;
  is_active: boolean;
}

export interface FeatureApplication {
  id: string;
  feature_id: string;
  title: string;
  image_url: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface FeatureGalleryImage {
  id: string;
  feature_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
  is_active: boolean;
}

export interface CompleteFeatureData {
  feature: FeatureItem;
  highlights: FeatureHighlight[];
  solutions: FeatureSolution[];
  specifications: FeatureSpecification[];
  applications: FeatureApplication[];
  gallery: FeatureGalleryImage[];
  interactive_components?: FeatureInteractiveComponent[];
}

const STORAGE_KEY = 'sk_cms_features_v1';

// Initial Seed Dataset for Default Features
export const INITIAL_FEATURES: CompleteFeatureData[] = [
  {
    feature: {
      id: 'feat-smart-lighting',
      title: 'Smart Lighting & WiZ Connected Systems',
      slug: 'smart-lighting',
      card_image_url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
      short_description: 'Next-generation connected wireless illumination with app scheduling, motion automation, and circadian rhythm tuning.',
      hero_image_url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=80',
      hero_title: 'SMART LIGHTING SOLUTIONS',
      hero_subtitle: 'Experience total lighting automation with wireless control, Wi-Fi & Bluetooth integration, and energy scheduling for modern intelligent spaces.',
      hero_cta_text: 'Explore Catalogue',
      hero_cta_link: '#catalogue',
      hero_overlay_opacity: 30,
      hero_text_align: 'left',
      intro_title: 'Intelligent Connected Illumination for Every Room',
      intro_description: 'Philips Smart Lighting powered by WiZ connected technology allows seamless wireless dimming, 16 million RGB colors, and automated routines directly from your smartphone, voice assistant (Alexa & Google Assistant), or smart wall switches.\n\nWhether designing luxury residential interiors or smart commercial offices, Philips connected luminaires reduce energy consumption by up to 65% while dynamically adapting light intensity to support natural circadian rhythms.',
      intro_image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      intro_image_position: 'right',
      catalogue_title: 'Philips WiZ Smart Lighting Master Catalogue 2026',
      catalogue_description: 'Complete technical specification guide featuring smart bulbs, WiZ LED strips, ambient ceiling panels, motion sensors, and wireless smart switches.',
      catalogue_pdf_url: '/catalogues/Home Decorative Lighting catalogue - Year 2025 - Final.pdf',
      catalogue_button_text: 'Download Smart Lighting PDF',
      catalogue_active: true,
      contact_cta_title: 'Need a Custom Smart Lighting Layout?',
      contact_cta_description: 'Our technical lighting engineers in Hyderabad can help design your wireless smart mesh architecture and product BOQ.',
      contact_cta_button_text: 'Request Expert Consultation',
      contact_cta_button_link: '#contact',
      contact_cta_active: true,
      related_feature_ids: ['feat-led-lighting', 'feat-commercial-lighting'],
      is_active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    highlights: [
      { id: 'h-1', feature_id: 'feat-smart-lighting', title: 'Wireless App & Voice Control', description: 'Control lights anywhere via WiZ app, Siri, Alexa, and Google Assistant without a gateway hub.', icon: 'Cpu', display_order: 1, is_active: true },
      { id: 'h-2', feature_id: 'feat-smart-lighting', title: 'Tunable White & 16M Colors', description: 'Transition from warm 2700K relaxation tones to cool 6500K focus light plus full RGB spectrum.', icon: 'Sun', display_order: 2, is_active: true },
      { id: 'h-3', feature_id: 'feat-smart-lighting', title: 'Energy Automation & Schedules', description: 'Set automated sunrise routines, vacancy sensing, and real-time energy usage monitoring.', icon: 'Zap', display_order: 3, is_active: true },
      { id: 'h-4', feature_id: 'feat-smart-lighting', title: '5-Year Official Philips Warranty', description: 'Genuine Philips industrial-grade driver components guaranteed with local SK Traders service support.', icon: 'ShieldCheck', display_order: 4, is_active: true },
    ],
    solutions: [
      { id: 's-1', feature_id: 'feat-smart-lighting', title: 'WiZ Connected Smart Ceiling Panel', image_url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80', description: 'Ultra-thin edge-lit smart ceiling panel with smooth dimming and tunable white control.', display_order: 1, is_active: true },
      { id: 's-2', feature_id: 'feat-smart-lighting', title: 'Philips Smart Color Magic COB Spotlight', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', description: 'Architectural recessed spotlight with 360-degree beam adjustment and Wi-Fi mesh networking.', display_order: 2, is_active: true },
      { id: 's-3', feature_id: 'feat-smart-lighting', title: 'Philips Smart Wi-Fi LED Lightstrip', image_url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80', description: 'Flexible 2M extension-ready RGBW light strip for cove lighting, cabinets, and media walls.', display_order: 3, is_active: true },
    ],
    specifications: [
      { id: 'sp-1', feature_id: 'feat-smart-lighting', label: 'Wireless Protocol', value: 'Wi-Fi 2.4GHz + BLE', explanation: 'Connects directly to home Wi-Fi without needing an extra hub box.', display_order: 1 },
      { id: 'sp-2', feature_id: 'feat-smart-lighting', label: 'Color Temperature (CCT)', value: '2700K to 6500K + RGB', explanation: 'Switch from warm relaxing sunset light to crisp focus daylight anytime.', display_order: 2 },
      { id: 'sp-3', feature_id: 'feat-smart-lighting', label: 'Color Rendering Index (CRI)', value: '≥ 90 Ra', explanation: 'More natural-looking colours that match daylight quality.', display_order: 3 },
      { id: 'sp-4', feature_id: 'feat-smart-lighting', label: 'Input Voltage', value: '220V – 240V AC', explanation: 'Protected against local voltage fluctuations and surges.', display_order: 4 },
      { id: 'sp-5', feature_id: 'feat-smart-lighting', label: 'Dimming Range', value: '1% to 100% smooth dimming', explanation: 'Adjust light levels smoothly without flickering or noise.', display_order: 5 },
      { id: 'sp-6', feature_id: 'feat-smart-lighting', label: 'Expected Lifespan', value: '25,000 Hours', explanation: 'Built to last over 10 years of typical daily family use.', display_order: 6 },
    ],
    interactive_components: [
      {
        id: 'ic-1',
        feature_id: 'feat-smart-lighting',
        name: 'Outer Polycarbonate Shell',
        tagline: 'Light Diffuser',
        description: 'Translucent anti-glare protective cover.',
        human_explanation: 'Diffuses light evenly across your room and protects internal parts from dust.',
        icon_name: 'Sun',
        exploded_offset_y: 12,
        display_order: 1,
        is_active: true,
      },
      {
        id: 'ic-2',
        feature_id: 'feat-smart-lighting',
        name: 'LED Engine Board',
        tagline: 'Light Creation Core',
        description: 'High-density SMD chips with RGBW diodes.',
        human_explanation: 'The part that creates the light. Engineered to produce bright, warm, or colorful illumination.',
        icon_name: 'Sparkles',
        exploded_offset_y: 35,
        display_order: 2,
        is_active: true,
      },
      {
        id: 'ic-3',
        feature_id: 'feat-smart-lighting',
        name: 'Wi-Fi & Bluetooth Smart Driver',
        tagline: 'Power & Wireless Control',
        description: 'Microcontroller chip with integrated surge isolation.',
        human_explanation: 'The brain that controls electricity going into the LEDs safely and connects to your phone.',
        icon_name: 'Cpu',
        exploded_offset_y: 58,
        display_order: 3,
        is_active: true,
      },
      {
        id: 'ic-4',
        feature_id: 'feat-smart-lighting',
        name: 'Aluminum Heat Sink',
        tagline: 'Cooling System',
        description: 'Extruded thermal aluminum housing.',
        human_explanation: 'Helps manage heat away from electronics to maintain reliable long-term performance.',
        icon_name: 'ShieldCheck',
        exploded_offset_y: 80,
        display_order: 4,
        is_active: true,
      },
      {
        id: 'ic-5',
        feature_id: 'feat-smart-lighting',
        name: 'Nickel Base Cap',
        tagline: 'Plug Connector',
        description: 'Standard B22 / E27 socket cap.',
        human_explanation: 'Fits right into standard home light sockets easily and securely.',
        icon_name: 'Zap',
        exploded_offset_y: 95,
        display_order: 5,
        is_active: true,
      },
    ],
    applications: [
      { id: 'a-1', feature_id: 'feat-smart-lighting', title: 'Luxury Residential Living', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', description: 'Ambient cove lighting, smart ceiling troffers, and mood scenes for master suites.', display_order: 1, is_active: true },
      { id: 'a-2', feature_id: 'feat-smart-lighting', title: 'Executive Offices & Boardrooms', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', description: 'Automated brightness adjustment for video conferencing and energy conservation.', display_order: 2, is_active: true },
      { id: 'a-3', feature_id: 'feat-smart-lighting', title: 'Boutique Retail Showrooms', image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', description: 'Dynamic spotlighting to highlight merchandise displays with custom scene presets.', display_order: 3, is_active: true },
    ],
    gallery: [
      { id: 'g-1', feature_id: 'feat-smart-lighting', image_url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80', caption: 'Philips WiZ Smart Living Room Atmosphere', display_order: 1, is_active: true },
      { id: 'g-2', feature_id: 'feat-smart-lighting', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Recessed Smart COB Downlight Installation', display_order: 2, is_active: true },
      { id: 'g-3', feature_id: 'feat-smart-lighting', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', caption: 'Tunable White Office Workspace', display_order: 3, is_active: true },
    ],
  },
  {
    feature: {
      id: 'feat-led-lighting',
      title: 'Architectural LED Panels & Downlights',
      slug: 'led-lighting',
      card_image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      short_description: 'High-efficacy glare-free LED ceiling panels, slim downlights, and linear batten fixtures engineered for longevity.',
      hero_image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
      hero_title: 'ARCHITECTURAL LED LIGHTING',
      hero_subtitle: 'Premium anti-glare LED downlights, linear ceiling profiles, and ultra-slim troffer panels for residential and commercial environments.',
      hero_cta_text: 'Download Catalogue',
      hero_cta_link: '#catalogue',
      hero_overlay_opacity: 65,
      hero_text_align: 'left',
      intro_title: 'Precision-Engineered LED Optics for Maximum Comfort',
      intro_description: 'SK Traders delivers Philips comprehensive range of energy-efficient LED luminaires designed with Micro-Prismatic Optics (MPO) to eliminate glare (UGR < 19).\n\nBuilt with die-cast aluminum heat sinks, surge protection up to 4kV, and high lumen efficiency (> 110 lm/W), these LED fixtures provide flicker-free, uniform light distribution for over 50,000 operational hours.',
      intro_image_url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
      intro_image_position: 'left',
      catalogue_title: 'Philips Architectural LED Ceiling Lighting Catalogue',
      catalogue_description: 'Complete 22-page technical catalogue featuring LineaBright, LineaGlow, ColorMagic 3-in-1, ProGlow Nxt, and DuraSlim ceiling lights.',
      catalogue_pdf_url: '/catalogues/Home Decorative Lighting catalogue - Year 2025 - Final.pdf',
      catalogue_button_text: 'Download LED Catalogue PDF',
      catalogue_active: true,
      contact_cta_title: 'Looking for Bulk Commercial LED Supply in Hyderabad?',
      contact_cta_description: 'Contact SK Traders for direct authorized distributor wholesale pricing and project BOQ estimates.',
      contact_cta_button_text: 'Get Wholesale Quote',
      contact_cta_button_link: '#contact',
      contact_cta_active: true,
      related_feature_ids: ['feat-smart-lighting', 'feat-commercial-lighting'],
      is_active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    highlights: [
      { id: 'hl-1', feature_id: 'feat-led-lighting', title: 'Ultra-High Efficacy (110+ lm/W)', description: 'Maximum lumen output with minimal wattage draw to slash electricity bills by up to 80%.', icon: 'Zap', display_order: 1, is_active: true },
      { id: 'hl-2', feature_id: 'feat-led-lighting', title: 'EyeComfort Anti-Glare Optics', description: 'Certified UGR < 19 glare control compliant with international workplace illumination standards.', icon: 'Sun', display_order: 2, is_active: true },
      { id: 'hl-3', feature_id: 'feat-led-lighting', title: 'Integrated 4kV Surge Protection', description: 'Heavy-duty surge isolation shields internal drivers against voltage fluctuations.', icon: 'ShieldCheck', display_order: 3, is_active: true },
      { id: 'hl-4', feature_id: 'feat-led-lighting', title: '50,000 Hours Rated Lifespan', description: 'Long-lasting aluminum heat dissipation housing ensures zero lumen degradation.', icon: 'Sparkles', display_order: 4, is_active: true },
    ],
    solutions: [
      { id: 'ls-1', feature_id: 'feat-led-lighting', title: 'Philips LineaGlow LED Ceiling Panel 2x2', image_url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80', description: 'Surface & recessed 36W LED panel delivering 4000 lumens of neutral white uniform illumination.', display_order: 1, is_active: true },
      { id: 'ls-2', feature_id: 'feat-led-lighting', title: 'Philips ProGlow Nxt Deep Recessed COB', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', description: 'Deep reflector spot downlight with zero glare ceiling cut-out for luxury residences.', display_order: 2, is_active: true },
    ],
    specifications: [
      { id: 'lsp-1', feature_id: 'feat-led-lighting', label: 'Wattage Range', value: '5W, 9W, 12W, 18W, 24W, 36W', explanation: 'Low energy consumption options for small to large rooms.', display_order: 1 },
      { id: 'lsp-2', feature_id: 'feat-led-lighting', label: 'Color Temperature (CCT)', value: '3000K / 4000K / 6500K', explanation: 'Choose warm cozy light, neutral office light, or bright cool daylight.', display_order: 2 },
      { id: 'lsp-3', feature_id: 'feat-led-lighting', label: 'Lumen Output', value: '110 lm/W (Up to 4950 lm)', explanation: 'Produces maximum brightness while consuming very low electricity.', display_order: 3 },
      { id: 'lsp-4', feature_id: 'feat-led-lighting', label: 'Unified Glare Rating', value: 'UGR < 19 (EyeComfort Certified)', explanation: 'Comfortable to work under all day without eye strain or headaches.', display_order: 4 },
      { id: 'lsp-5', feature_id: 'feat-led-lighting', label: 'Driver Lifespan', value: '50,000 Hours', explanation: 'Reliable commercial-grade driver that stays strong for years.', display_order: 5 },
    ],
    interactive_components: [
      {
        id: 'lic-1',
        feature_id: 'feat-led-lighting',
        name: 'Micro-Prismatic Lens',
        tagline: 'Glare Suppression Layer',
        description: 'Patterned optical plate.',
        human_explanation: 'Spreads light evenly to stop eye strain and unwanted harsh glare.',
        icon_name: 'Sun',
        exploded_offset_y: 15,
        display_order: 1,
        is_active: true,
      },
      {
        id: 'lic-2',
        feature_id: 'feat-led-lighting',
        name: 'COB / SMD Array',
        tagline: 'High Efficiency LED Matrix',
        description: 'Chip-on-Board LED module.',
        human_explanation: 'Creates clean, bright illumination while saving up to 80% energy.',
        icon_name: 'Sparkles',
        exploded_offset_y: 40,
        display_order: 2,
        is_active: true,
      },
      {
        id: 'lic-3',
        feature_id: 'feat-led-lighting',
        name: 'Constant Current LED Driver',
        tagline: 'Flicker-Free Power Supply',
        description: 'Heavy duty electronic transformer.',
        human_explanation: 'Keeps electrical current steady so the light never flickers or hums.',
        icon_name: 'Cpu',
        exploded_offset_y: 65,
        display_order: 3,
        is_active: true,
      },
      {
        id: 'lic-4',
        feature_id: 'feat-led-lighting',
        name: 'Die-Cast Aluminum Frame',
        tagline: 'Thermal Cooling Frame',
        description: 'ADC12 die-cast housing.',
        human_explanation: 'Keeps the fixture rigid, sleek, and cool to extend product lifespan.',
        icon_name: 'ShieldCheck',
        exploded_offset_y: 85,
        display_order: 4,
        is_active: true,
      },
    ],
    applications: [
      { id: 'la-1', feature_id: 'feat-led-lighting', title: 'Modern Apartments & Villas', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', description: 'Sleek ceiling downlights for living rooms, kitchens, and hallway corridors.', display_order: 1, is_active: true },
      { id: 'la-2', feature_id: 'feat-led-lighting', title: 'Corporate Workspaces & Banks', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', description: 'Energy-saving 2x2 grid panels providing continuous daylight-balanced illumination.', display_order: 2, is_active: true },
    ],
    gallery: [
      { id: 'lg-1', feature_id: 'feat-led-lighting', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', caption: 'Recessed Architectural COB Spotlight', display_order: 1, is_active: true },
      { id: 'lg-2', feature_id: 'feat-led-lighting', image_url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80', caption: 'Ultra-slim 2x2 LED Grid Ceiling Installation', display_order: 2, is_active: true },
    ],
  },
  {
    feature: {
      id: 'feat-outdoor-lighting',
      title: 'Outdoor & IP66 Industrial Floodlighting',
      slug: 'outdoor-lighting',
      card_image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      short_description: 'Weatherproof IP66 floodlights, street luminaires, and stadium high-mast fixtures built for extreme environments.',
      hero_image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80',
      hero_title: 'OUTDOOR & INDUSTRIAL LIGHTING',
      hero_subtitle: 'Heavy-duty IP66 waterproof floodlights, high-bay factory fixtures, and architectural facade illumination designed to withstand harsh outdoor weather.',
      hero_cta_text: 'View Outdoor Range',
      hero_cta_link: '#solutions',
      hero_overlay_opacity: 75,
      hero_text_align: 'left',
      intro_title: 'Reliable High-Power Floodlighting for Infrastructure',
      intro_description: 'Philips outdoor LED luminaires are engineered to deliver robust exterior performance across highways, sports arenas, industrial complexes, and facade landscapes.\n\nFeaturing pressure die-cast ADC12 aluminum enclosures, IK08 impact resistance, IP66 ingress protection, and 10kV surge protection, these fixtures safeguard your infrastructure 365 nights a year.',
      intro_image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      intro_image_position: 'right',
      catalogue_title: 'Philips Infrastructure & Industrial Master Catalogue',
      catalogue_description: 'Technical specifier catalogue covering high-bay LEDs, IP66 floodlights, street luminaires, and hazardous area lighting.',
      catalogue_pdf_url: '/catalogues/Philips Trade Catalogue 2024-25.pdf',
      catalogue_button_text: 'Download Infrastructure PDF',
      catalogue_active: true,
      contact_cta_title: 'Planning a Commercial Infrastructure or Field Project?',
      contact_cta_description: 'Get in touch with SK Traders for DIALux lighting simulation reports and site survey assistance.',
      contact_cta_button_text: 'Consult Lighting Engineer',
      contact_cta_button_link: '#contact',
      contact_cta_active: true,
      related_feature_ids: ['feat-led-lighting', 'feat-commercial-lighting'],
      is_active: true,
      display_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    highlights: [
      { id: 'oh-1', feature_id: 'feat-outdoor-lighting', title: 'IP66 Waterproof & Dustproof', description: 'Complete hermetic seal against torrential rain, dust, and coastal humidity.', icon: 'ShieldCheck', display_order: 1, is_active: true },
      { id: 'oh-2', feature_id: 'feat-outdoor-lighting', title: '10kV Heavy-Duty Surge Isolation', description: 'Built-in surge protection device prevents lightning strikes from damaging internal LEDs.', icon: 'Zap', display_order: 2, is_active: true },
      { id: 'oh-3', feature_id: 'feat-outdoor-lighting', title: 'IK08 Vandal & Impact Proof', description: 'High-strength toughened glass and die-cast housing resist physical impact.', icon: 'Cpu', display_order: 3, is_active: true },
    ],
    solutions: [
      { id: 'os-1', feature_id: 'feat-outdoor-lighting', title: 'Philips Tango G4 LED Floodlight 100W-400W', image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80', description: 'High-output stadium & perimeter floodlight with asymmetrical optic beam distribution.', display_order: 1, is_active: true },
      { id: 'os-2', feature_id: 'feat-outdoor-lighting', title: 'Philips GreenVision Xceed LED Streetlight', image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', description: 'Aerodynamic roadway luminaire with smart city NEMA socket compatibility.', display_order: 2, is_active: true },
    ],
    specifications: [
      { id: 'osp-1', feature_id: 'feat-outdoor-lighting', label: 'Ingress Protection', value: 'IP66 Waterproof', explanation: 'Completely protected against rain, water sprays, and dust.', display_order: 1 },
      { id: 'osp-2', feature_id: 'feat-outdoor-lighting', label: 'Impact Protection', value: 'IK08 Vandal Resistant', explanation: 'Toughened glass casing withstands strong physical impacts.', display_order: 2 },
      { id: 'osp-3', feature_id: 'feat-outdoor-lighting', label: 'Surge Protection', value: '10kV Surge Suppressor', explanation: 'Shields internal components from high lightning voltage surges.', display_order: 3 },
      { id: 'osp-4', feature_id: 'feat-outdoor-lighting', label: 'Operating Temperature', value: '-30°C to +50°C', explanation: 'Operates smoothly in extreme hot summer weather and cold rain.', display_order: 4 },
    ],
    interactive_components: [
      {
        id: 'oic-1',
        feature_id: 'feat-outdoor-lighting',
        name: 'Toughened Glass Front Lens',
        tagline: 'IK08 Protective Shield',
        description: 'Vandal-proof tempered glass front plate.',
        human_explanation: 'Shields the light against heavy storms, hail, dust, and physical impacts.',
        icon_name: 'ShieldCheck',
        exploded_offset_y: 15,
        display_order: 1,
        is_active: true,
      },
      {
        id: 'oic-2',
        feature_id: 'feat-outdoor-lighting',
        name: 'Silicone Gasket Seal',
        tagline: 'IP66 Weather Barrier',
        description: 'Hermetic waterproof seal.',
        human_explanation: 'Keeps water and dust completely outside the electronic compartment.',
        icon_name: 'Sun',
        exploded_offset_y: 38,
        display_order: 2,
        is_active: true,
      },
      {
        id: 'oic-3',
        feature_id: 'feat-outdoor-lighting',
        name: 'High-Power LED Matrix',
        tagline: 'Industrial Light Engine',
        description: 'Multi-die LED array with asymmetrical optics.',
        human_explanation: 'Produces intense daylight-quality illumination over large outdoor grounds.',
        icon_name: 'Sparkles',
        exploded_offset_y: 60,
        display_order: 3,
        is_active: true,
      },
      {
        id: 'oic-4',
        feature_id: 'feat-outdoor-lighting',
        name: '10kV Surge Isolated Driver',
        tagline: 'Lightning Protection Driver',
        description: 'Heavy duty outdoor driver module.',
        human_explanation: 'Prevents electrical spikes and lightning surges from damaging your light.',
        icon_name: 'Zap',
        exploded_offset_y: 82,
        display_order: 4,
        is_active: true,
      },
    ],
    applications: [
      { id: 'oa-1', feature_id: 'feat-outdoor-lighting', title: 'Stadiums & Sports Arenas', image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80', description: 'Flicker-free high-mast illumination engineered for HD sports broadcasting.', display_order: 1, is_active: true },
      { id: 'oa-2', feature_id: 'feat-outdoor-lighting', title: 'Highways & Urban Roadways', image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', description: 'Uniform light coverage reducing glare and driver fatigue on multi-lane expressways.', display_order: 2, is_active: true },
    ],
    gallery: [
      { id: 'og-1', feature_id: 'feat-outdoor-lighting', image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80', caption: 'High-mast LED Sports Stadium Floodlighting', display_order: 1, is_active: true },
    ],
  },
  {
    feature: {
      id: 'feat-commercial-lighting',
      title: 'Commercial & Retail Architectural Solutions',
      slug: 'commercial-lighting',
      card_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      short_description: 'Track spotlights, magnetic linear rails, and continuous trunking systems crafted for high-end retail and modern workspaces.',
      hero_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
      hero_title: 'COMMERCIAL & RETAIL LIGHTING',
      hero_subtitle: 'Architectural track lights, linear magnetic trunking systems, and accent spotlights for luxury retail stores, auto showrooms, and corporate campuses.',
      hero_cta_text: 'Explore Commercial Range',
      hero_cta_link: '#solutions',
      hero_overlay_opacity: 65,
      hero_text_align: 'left',
      intro_title: 'Elevate Brand Spaces with Superior Color Rendering',
      intro_description: 'Retail and commercial environments demand lighting that accentuates true product colors while creating inviting architectural ambiance.\n\nPhilips commercial track lights feature TrueColor technology (CRI > 95) with specialized optics to reduce heat emission on delicate merchandise while maintaining flawless color fidelity across your entire floor space.',
      intro_image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      intro_image_position: 'left',
      catalogue_title: 'Philips Commercial & Retail Specifier Guide',
      catalogue_description: 'Official catalogue covering magnetic track systems, recessed architectural downlights, and smart store sensor integration.',
      catalogue_pdf_url: '/catalogues/Philips Trade Catalogue 2024-25.pdf',
      catalogue_button_text: 'Download Retail Catalogue PDF',
      catalogue_active: true,
      contact_cta_title: 'Designing a New Retail Store or Showroom?',
      contact_cta_description: 'SK Traders provides specialized lighting layout assistance, track configuration, and prompt delivery in Hyderabad.',
      contact_cta_button_text: 'Schedule Showroom Visit',
      contact_cta_button_link: '#contact',
      contact_cta_active: true,
      related_feature_ids: ['feat-smart-lighting', 'feat-led-lighting'],
      is_active: true,
      display_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    highlights: [
      { id: 'ch-1', feature_id: 'feat-commercial-lighting', title: 'High CRI 95+ Color Accuracy', description: 'Renders rich fabric, jewelry, and car paint colors with true-to-life vibrancy.', icon: 'Sun', display_order: 1, is_active: true },
      { id: 'ch-2', feature_id: 'feat-commercial-lighting', title: '360° Rotatable Track Spotlights', description: 'Quick-release magnetic track mounting allowing effortless beam repositioning.', icon: 'Sparkles', display_order: 2, is_active: true },
    ],
    solutions: [
      { id: 'cs-1', feature_id: 'feat-commercial-lighting', title: 'Philips Stylid Architectural Track Spot', image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', description: '3-circuit track mounted LED spotlight with narrow, medium, and wide beam reflector options.', display_order: 1, is_active: true },
    ],
    specifications: [
      { id: 'csp-1', feature_id: 'feat-commercial-lighting', label: 'Color Rendering Index', value: 'CRI 95+ (R9 > 85)', explanation: 'Displays true, vivid colors on merchandise without fading or tinting.', display_order: 1 },
      { id: 'csp-2', feature_id: 'feat-commercial-lighting', label: 'Track System Compatibility', value: 'Universal 3-Circuit & Magnetic 48V', explanation: 'Snaps easily into modern magnetic ceiling tracks without rewiring.', display_order: 2 },
    ],
    interactive_components: [
      {
        id: 'cic-1',
        feature_id: 'feat-commercial-lighting',
        name: 'Optical Reflector Cone',
        tagline: 'Precision Beam Focus',
        description: 'Facet-cut aluminum reflector.',
        human_explanation: 'Directs light cleanly onto products without distracting side glow.',
        icon_name: 'Sun',
        exploded_offset_y: 20,
        display_order: 1,
        is_active: true,
      },
      {
        id: 'cic-2',
        feature_id: 'feat-commercial-lighting',
        name: 'High-CRI COB Chip',
        tagline: 'TrueColor Engine',
        description: 'Commercial retail LED diode.',
        human_explanation: 'Makes clothes, jewelry, and showroom products look vibrant and premium.',
        icon_name: 'Sparkles',
        exploded_offset_y: 50,
        display_order: 2,
        is_active: true,
      },
      {
        id: 'cic-3',
        feature_id: 'feat-commercial-lighting',
        name: 'Magnetic Track Connector',
        tagline: 'Tool-Free Track Lock',
        description: '48V magnetic latch adapter.',
        human_explanation: 'Lets you click and move spotlights along the ceiling track anytime.',
        icon_name: 'Zap',
        exploded_offset_y: 80,
        display_order: 3,
        is_active: true,
      },
    ],
    applications: [
      { id: 'ca-1', feature_id: 'feat-commercial-lighting', title: 'Luxury Apparel & Jewelry Boutiques', image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', description: 'High-contrast accent spotlights to draw customer focus to premium collections.', display_order: 1, is_active: true },
    ],
    gallery: [
      { id: 'cg-1', feature_id: 'feat-commercial-lighting', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', caption: 'Architectural Commercial Track Light Array', display_order: 1, is_active: true },
    ],
  },
];

export function getLocalFeatures(): CompleteFeatureData[] {
  if (typeof window === 'undefined') return INITIAL_FEATURES;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FEATURES));
    return INITIAL_FEATURES;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FEATURES;
  } catch {
    return INITIAL_FEATURES;
  }
}

export function saveLocalFeatures(features: CompleteFeatureData[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
  }
}

export async function fetchAdminFeatures(): Promise<CompleteFeatureData[]> {
  try {
    const { data: featureRows, error } = await supabase
      .from('features')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !featureRows || featureRows.length === 0) {
      return getLocalFeatures();
    }

    // Fetch related sub-tables from Supabase
    const completeList: CompleteFeatureData[] = [];
    for (const f of featureRows) {
      const [hRes, sRes, spRes, aRes, gRes, icRes] = await Promise.all([
        supabase.from('feature_highlights').select('*').eq('feature_id', f.id).order('display_order', { ascending: true }),
        supabase.from('feature_solutions').select('*').eq('feature_id', f.id).order('display_order', { ascending: true }),
        supabase.from('feature_specifications').select('*').eq('feature_id', f.id).order('display_order', { ascending: true }),
        supabase.from('feature_applications').select('*').eq('feature_id', f.id).order('display_order', { ascending: true }),
        supabase.from('feature_gallery').select('*').eq('feature_id', f.id).order('display_order', { ascending: true }),
        supabase.from('feature_interactive_components').select('*').eq('feature_id', f.id).order('display_order', { ascending: true }),
      ]);

      completeList.push({
        feature: {
          id: f.id,
          title: f.title,
          slug: f.slug,
          card_image_url: f.card_image_url || '',
          short_description: f.short_description || '',
          hero_image_url: f.hero_image_url || '',
          hero_title: f.hero_title || f.title,
          hero_subtitle: f.hero_subtitle || '',
          hero_cta_text: f.hero_cta_text || '',
          hero_cta_link: f.hero_cta_link || '',
          hero_overlay_opacity: f.hero_overlay_opacity ?? 30,
          hero_text_align: f.hero_text_align || 'left',
          intro_title: f.intro_title || '',
          intro_description: f.intro_description || '',
          intro_image_url: f.intro_image_url || '',
          intro_image_position: f.intro_image_position || 'right',
          catalogue_title: f.catalogue_title || '',
          catalogue_description: f.catalogue_description || '',
          catalogue_pdf_url: f.catalogue_pdf_url || '',
          catalogue_button_text: f.catalogue_button_text || '',
          catalogue_active: f.catalogue_active ?? true,
          contact_cta_title: f.contact_cta_title || '',
          contact_cta_description: f.contact_cta_description || '',
          contact_cta_button_text: f.contact_cta_button_text || '',
          contact_cta_button_link: f.contact_cta_button_link || '',
          contact_cta_active: f.contact_cta_active ?? true,
          related_feature_ids: f.related_feature_ids || [],
          is_active: f.is_active ?? true,
          display_order: f.display_order ?? 1,
          created_at: f.created_at || new Date().toISOString(),
          updated_at: f.updated_at || new Date().toISOString(),
        },
        highlights: hRes.data || [],
        solutions: sRes.data || [],
        specifications: spRes.data || [],
        applications: aRes.data || [],
        gallery: gRes.data || [],
        interactive_components: icRes.data || [],
      });
    }

    return completeList.length > 0 ? completeList : getLocalFeatures();
  } catch (e) {
    return getLocalFeatures();
  }
}

export async function fetchPublicFeatures(): Promise<CompleteFeatureData[]> {
  const all = await fetchAdminFeatures();
  return all
    .filter((f) => f.feature.is_active)
    .sort((a, b) => a.feature.display_order - b.feature.display_order);
}

export async function fetchFeatureBySlug(slug: string): Promise<CompleteFeatureData | null> {
  const all = await fetchAdminFeatures();
  const found = all.find((f) => f.feature.slug.toLowerCase() === slug.toLowerCase());
  return found || null;
}

export async function saveFeature(data: CompleteFeatureData): Promise<CompleteFeatureData> {
  const now = new Date().toISOString();
  const featureId = data.feature.id || 'feat_' + Math.random().toString(36).substring(2, 9);

  const updatedFeature: FeatureItem = {
    ...data.feature,
    id: featureId,
    slug: (data.feature.slug || data.feature.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    updated_at: now,
  };

  const fullDataToSave: CompleteFeatureData = {
    ...data,
    feature: updatedFeature,
  };

  // 1. Update Local Storage
  const current = getLocalFeatures();
  const idx = current.findIndex((item) => item.feature.id === featureId);
  let updatedList: CompleteFeatureData[];
  if (idx >= 0) {
    updatedList = [...current];
    updatedList[idx] = fullDataToSave;
  } else {
    updatedList = [...current, fullDataToSave];
  }
  saveLocalFeatures(updatedList);

  // 2. Attempt Supabase Upserts
  try {
    await supabase.from('features').upsert({
      id: updatedFeature.id,
      title: updatedFeature.title,
      slug: updatedFeature.slug,
      card_image_url: updatedFeature.card_image_url,
      short_description: updatedFeature.short_description,
      hero_image_url: updatedFeature.hero_image_url,
      hero_title: updatedFeature.hero_title,
      hero_subtitle: updatedFeature.hero_subtitle,
      hero_cta_text: updatedFeature.hero_cta_text,
      hero_cta_link: updatedFeature.hero_cta_link,
      hero_overlay_opacity: updatedFeature.hero_overlay_opacity,
      hero_text_align: updatedFeature.hero_text_align,
      intro_title: updatedFeature.intro_title,
      intro_description: updatedFeature.intro_description,
      intro_image_url: updatedFeature.intro_image_url,
      intro_image_position: updatedFeature.intro_image_position,
      catalogue_title: updatedFeature.catalogue_title,
      catalogue_description: updatedFeature.catalogue_description,
      catalogue_pdf_url: updatedFeature.catalogue_pdf_url,
      catalogue_button_text: updatedFeature.catalogue_button_text,
      catalogue_active: updatedFeature.catalogue_active,
      contact_cta_title: updatedFeature.contact_cta_title,
      contact_cta_description: updatedFeature.contact_cta_description,
      contact_cta_button_text: updatedFeature.contact_cta_button_text,
      contact_cta_button_link: updatedFeature.contact_cta_button_link,
      contact_cta_active: updatedFeature.contact_cta_active,
      related_feature_ids: updatedFeature.related_feature_ids,
      is_active: updatedFeature.is_active,
      display_order: updatedFeature.display_order,
      updated_at: now,
    });

    // Sync sub-tables if available
    if (data.highlights) {
      await supabase.from('feature_highlights').delete().eq('feature_id', featureId);
      if (data.highlights.length > 0) {
        await supabase.from('feature_highlights').insert(data.highlights.map((h) => ({ ...h, feature_id: featureId })));
      }
    }
    if (data.solutions) {
      await supabase.from('feature_solutions').delete().eq('feature_id', featureId);
      if (data.solutions.length > 0) {
        await supabase.from('feature_solutions').insert(data.solutions.map((s) => ({ ...s, feature_id: featureId })));
      }
    }
    if (data.specifications) {
      await supabase.from('feature_specifications').delete().eq('feature_id', featureId);
      if (data.specifications.length > 0) {
        await supabase.from('feature_specifications').insert(data.specifications.map((sp) => ({ ...sp, feature_id: featureId })));
      }
    }
    if (data.applications) {
      await supabase.from('feature_applications').delete().eq('feature_id', featureId);
      if (data.applications.length > 0) {
        await supabase.from('feature_applications').insert(data.applications.map((a) => ({ ...a, feature_id: featureId })));
      }
    }
    if (data.gallery) {
      await supabase.from('feature_gallery').delete().eq('feature_id', featureId);
      if (data.gallery.length > 0) {
        await supabase.from('feature_gallery').insert(data.gallery.map((g) => ({ ...g, feature_id: featureId })));
      }
    }
    if (data.interactive_components) {
      await supabase.from('feature_interactive_components').delete().eq('feature_id', featureId);
      if (data.interactive_components.length > 0) {
        await supabase.from('feature_interactive_components').insert(data.interactive_components.map((ic) => ({ ...ic, feature_id: featureId })));
      }
    }
  } catch (e) {
    console.warn('Supabase feature save fallback notice:', e);
  }

  return fullDataToSave;
}

export async function deleteFeature(id: string): Promise<boolean> {
  const current = getLocalFeatures();
  const updated = current.filter((f) => f.feature.id !== id);
  saveLocalFeatures(updated);

  try {
    await supabase.from('features').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase feature delete fallback notice:', e);
  }
  return true;
}

export async function duplicateFeature(id: string): Promise<CompleteFeatureData | null> {
  const all = await fetchAdminFeatures();
  const target = all.find((f) => f.feature.id === id);
  if (!target) return null;

  const newSlug = `${target.feature.slug}-copy-${Math.floor(Math.random() * 1000)}`;
  const duplicated: CompleteFeatureData = {
    ...target,
    feature: {
      ...target.feature,
      id: '',
      title: `${target.feature.title} (Copy)`,
      slug: newSlug,
      display_order: target.feature.display_order + 1,
      is_active: false,
    },
    highlights: target.highlights.map((h) => ({ ...h, id: 'h_' + Math.random().toString(36).substring(2, 9) })),
    solutions: target.solutions.map((s) => ({ ...s, id: 's_' + Math.random().toString(36).substring(2, 9) })),
    specifications: target.specifications.map((sp) => ({ ...sp, id: 'sp_' + Math.random().toString(36).substring(2, 9) })),
    applications: target.applications.map((a) => ({ ...a, id: 'a_' + Math.random().toString(36).substring(2, 9) })),
    gallery: target.gallery.map((g) => ({ ...g, id: 'g_' + Math.random().toString(36).substring(2, 9) })),
  };

  return await saveFeature(duplicated);
}

export async function reorderFeatures(features: CompleteFeatureData[]): Promise<boolean> {
  const reordered = features.map((item, index) => ({
    ...item,
    feature: {
      ...item.feature,
      display_order: index + 1,
      updated_at: new Date().toISOString(),
    },
  }));
  saveLocalFeatures(reordered);

  try {
    for (const item of reordered) {
      await supabase.from('features').update({ display_order: item.feature.display_order }).eq('id', item.feature.id);
    }
  } catch (e) {
    console.warn('Supabase feature reorder notice:', e);
  }
  return true;
}
