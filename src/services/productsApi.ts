import { supabase } from '@/lib/supabase';

export interface ProductSpecification {
  id?: string;
  product_id?: string;
  specification_name: string;
  specification_value: string;
  sort_order?: number;
}

export interface ProductCatalogue {
  id?: string;
  product_id?: string;
  name: string;
  file_url: string;
  file_size_bytes?: number;
  description?: string;
  sort_order?: number;
  created_at?: string;
}

export interface ProductImageItem {
  id?: string;
  product_id?: string;
  image_url: string;
  is_main?: boolean;
  sort_order?: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name?: string;
  price?: number;
  color?: string;
  color_finish?: string;
  light_color?: string;
  wattage?: number | string;
  image_url?: string;
  model_3d_url?: string;
  availability: 'Available' | 'Out of Stock';
}

export interface DetailedProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  sub_category?: string;
  brand: string;
  wattage: number | string;
  wattage_num: number; // For sorting & filtering
  lumens: number | string;
  lumens_num: number; // For sorting & filtering
  cct: string; // Color Temperature (e.g. Warm White 3000K, Cool White 6500K)
  cct_options?: string[];
  voltage: string;
  cri?: string;
  base?: string;
  beam_angle: string;
  material?: string;
  material_finish?: string;
  ip_rating: string;
  lifetime?: string;
  lifespan_hours?: number;
  warranty_years?: number;
  dimensions: string;
  price: number;
  original_price?: number;
  image_url: string;
  images?: string[];
  gallery_images?: string[];
  product_images?: ProductImageItem[];
  model_3d_url?: string;
  catalogue_url?: string;
  catalogues?: ProductCatalogue[];
  is_3d_enabled?: boolean;
  auto_rotate?: boolean;
  short_description?: string;
  description: string;
  overview_text?: string;
  features: string[];
  benefits?: string[];
  applications?: string[];
  installation_text?: string;
  technical_info_text?: string;
  specifications?: ProductSpecification[];
  related_product_ids?: string[];
  tags?: string[];
  variants?: ProductVariant[];
  shape?: 'Round' | 'Square' | 'Linear' | 'Decorative' | 'Other';
  product_color?: 'White' | 'Black' | 'Gold' | 'Silver' | 'Grey' | 'Other';
  is_smart?: boolean;
  is_dimmable?: boolean;
  show_price?: boolean;
  show_view_button?: boolean;
  is_in_stock?: boolean;
  rating?: number;
  reviews_count?: number;
  availability?: 'Available' | 'Out of Stock';
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  image_url: string;
  banner_image_url?: string;
  item_count_label?: string;
  status?: 'published' | 'draft';
  sort_order: number;
  is_active: boolean;
}

const STORAGE_PRODUCTS_KEY = 'sk_cms_products_v2';
const STORAGE_CATEGORIES_KEY = 'sk_cms_categories_v2';

export const INITIAL_PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'indoor-lighting',
    name: 'Indoor Lighting',
    slug: 'indoor-lighting',
    subtitle: 'Residential & Indoor Living Solutions',
    description: 'Lighting solutions designed for residential spaces, living rooms, master suites, and indoor architectural spaces.',
    image_url: '/images/card_home_lighting.jpg',
    banner_image_url: '/images/card_home_lighting.jpg',
    item_count_label: '32+ Fixtures',
    status: 'published',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'outdoor-lighting',
    name: 'Outdoor Lighting',
    slug: 'outdoor-lighting',
    subtitle: 'Weatherproof Exterior & Landscape Lighting',
    description: 'High durability IP-rated illumination engineered for architectural facades, garden landscapes, pathways, and security floodlights.',
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    banner_image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    item_count_label: '16+ Fixtures',
    status: 'published',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'smart-lighting',
    name: 'Smart Lighting',
    slug: 'smart-lighting',
    subtitle: 'WiZ Connected Wireless Smart Systems',
    description: 'App-controlled wireless smart bulbs, WiZ LED strips, and tunable white panels with Alexa & Google Assistant voice support.',
    image_url: '/images/card_smart_led_bulb.jpg',
    banner_image_url: '/images/card_smart_led_bulb.jpg',
    item_count_label: '25+ Smart Items',
    status: 'published',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'commercial-lighting',
    name: 'Commercial Lighting',
    slug: 'commercial-lighting',
    subtitle: 'Office Grid Panels & Industrial Solutions',
    description: 'High-efficacy 2x2 ceiling grid panels, linear trunking, and high bay luminaires engineered for corporate suites and warehouses.',
    image_url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    banner_image_url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    item_count_label: '28+ Fixtures',
    status: 'published',
    sort_order: 4,
    is_active: true,
  },
  {
    id: 'ceiling-lights',
    name: 'Ceiling Lights',
    slug: 'ceiling-lights',
    subtitle: 'Surface & Recessed Ceiling Fixtures',
    description: 'Ultra-thin, glare-free ceiling fixtures designed for modern spaces.',
    image_url: '/images/card_ceiling_design_lights.jpg',
    item_count_label: '32+ Variants',
    status: 'published',
    sort_order: 5,
    is_active: true,
  },
  {
    id: 'downlights',
    name: 'Downlights & Spotlights',
    slug: 'downlights',
    subtitle: 'Deep Recessed COB & Track Spotlights',
    description: 'Precision reflector downlights offering comfortable EyeComfort illumination.',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    item_count_label: '30+ Variants',
    status: 'published',
    sort_order: 6,
    is_active: true,
  },
  {
    id: 'fans',
    name: 'Fans & BLDC Fans',
    slug: 'fans',
    subtitle: 'Silent Energy-Efficient BLDC Ceiling & Smart Fans',
    description: 'Premium Philips decorative BLDC ceiling fans featuring silent operation and airflow automation.',
    image_url: '/images/card_fans.jpg',
    item_count_label: '12+ Variants',
    status: 'published',
    sort_order: 7,
    is_active: true,
  },
];

export const INITIAL_DETAILED_PRODUCTS: DetailedProduct[] = [
  {
    id: 'prod-smart-bulb-12w',
    name: 'Philips WiZ Smart LED Bulb 12W RGBW',
    slug: 'philips-wiz-smart-led-bulb-12w-rgbw',
    sku: 'SK-WZ-12W-RGBW',
    category_id: 'smart-lighting',
    category_name: 'Smart Lighting',
    category_slug: 'smart-lighting',
    brand: 'Philips',
    wattage: 12,
    wattage_num: 12,
    lumens: 1050,
    lumens_num: 1050,
    cct: '2700K – 6500K + 16M Colors',
    cct_options: ['Warm White (3000K)', 'Neutral White (4000K)', 'Cool White (6500K)', 'RGB / Tunable Smart'],
    voltage: '220–240V AC',
    base: 'B22 / E27',
    beam_angle: '220°',
    material: 'Polycarbonate + Die-Cast Aluminum',
    material_finish: 'Aerospace Composite Polycarbonate',
    ip_rating: 'IP20',
    lifetime: '25,000 Hours',
    lifespan_hours: 25000,
    warranty_years: 5,
    dimensions: '60mm x 120mm',
    price: 899,
    original_price: 1299,
    image_url: '/images/card_smart_led_bulb.jpg',
    images: [
      '/images/card_smart_led_bulb.jpg',
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
    ],
    gallery_images: [
      '/images/card_smart_led_bulb.jpg',
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
    ],
    model_3d_url: '',
    is_3d_enabled: true,
    auto_rotate: true,
    short_description: 'Next-generation connected Wi-Fi smart LED bulb powered by WiZ. 16 million colors and circadian rhythm schedule.',
    description: 'Next-generation connected Wi-Fi smart LED bulb powered by WiZ. Enjoy 16 million colors, smooth wireless dimming, and sunrise automation directly from your smartphone or voice assistant without needing a hub.',
    features: [
      'Wi-Fi 2.4GHz + Bluetooth Low Energy direct connection',
      '16 Million RGB Colors + Tunable White (2700K to 6500K)',
      'Voice control via Alexa, Google Assistant, Siri Shortcuts',
      'Circadian rhythm schedules and vacation light automation',
      '5-Year Official Philips Warranty via SK Traders Hyderabad',
    ],
    tags: ['Smart', 'WiZ', 'Bulb', 'Philips', 'RGBW'],
    variants: [
      { id: 'v-1', sku: 'SK-WZ-12W-B22', name: '12W B22 Socket', price: 899, color: 'White', color_finish: 'Frosted White', light_color: 'RGBW Tunable', wattage: 12, availability: 'Available' },
      { id: 'v-2', sku: 'SK-WZ-9W-B22', name: '9W B22 Socket', price: 699, color: 'White', color_finish: 'Frosted White', light_color: 'RGBW Tunable', wattage: 9, availability: 'Available' },
    ],
    shape: 'Round',
    product_color: 'White',
    is_smart: true,
    is_dimmable: true,
    is_in_stock: true,
    rating: 4.9,
    reviews_count: 32,
    availability: 'Available',
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-cob-downlight-18w',
    name: 'SK Traders Architectural Trimless COB Downlight 18W',
    slug: 'sk-traders-architectural-trimless-cob-downlight-18w',
    sku: 'SK-COB-18W-TRM',
    category_id: 'ceiling-lights',
    category_name: 'Ceiling Lights',
    category_slug: 'ceiling-lights',
    brand: 'SK Traders Architectural',
    wattage: 18,
    wattage_num: 18,
    lumens: 1980,
    lumens_num: 1980,
    cct: 'Warm White (3000K) / Neutral (4000K)',
    cct_options: ['Warm White (3000K)', 'Neutral White (4000K)', 'Cool White (6500K)'],
    voltage: '220V–240V AC',
    base: 'Trimless Recessed Cavity',
    beam_angle: '36° Optical Refractor Lens',
    material: 'Die-cast Aerospace Aluminum',
    material_finish: 'Matte Deep Black Reflector',
    ip_rating: 'IP44',
    lifetime: '50,000 Hours',
    lifespan_hours: 50000,
    warranty_years: 5,
    dimensions: 'Dia: 110mm x H: 125mm',
    price: 1850,
    original_price: 2400,
    image_url: '/images/card_ceiling_design_lights.jpg',
    images: [
      '/images/card_ceiling_design_lights.jpg',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
    ],
    gallery_images: [
      '/images/card_ceiling_design_lights.jpg',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
    ],
    model_3d_url: '',
    is_3d_enabled: true,
    auto_rotate: true,
    short_description: 'Deep anti-glare trimless recessed COB downlight engineered for luxury residences and hotels.',
    description: 'Deep anti-glare trimless recessed COB spotlight engineered for seamless integration into false ceiling plasterboards. Features Citizen COB chip with high CRI 92+ for true color rendering.',
    features: [
      'Trimless plaster-in frame for completely flush architectural finish',
      'Citizen COB LED Chip with CRI > 92 Ra',
      'Deep baffle anti-glare design (UGR < 16)',
      'Triac & 0-10V Dimmable driver support',
      '5-Year On-Site Warranty',
    ],
    tags: ['COB', 'Trimless', 'Architectural', 'Downlight', 'SK Traders'],
    variants: [
      { id: 'v-10', sku: 'SK-COB-18W-BLK', name: '18W Matte Black Baffle', price: 1850, color: 'Black', color_finish: 'Matte Black', light_color: 'Warm White 3000K', wattage: 18, availability: 'Available' },
      { id: 'v-11', sku: 'SK-COB-12W-BLK', name: '12W Matte Black Baffle', price: 1450, color: 'Black', color_finish: 'Matte Black', light_color: 'Warm White 3000K', wattage: 12, availability: 'Available' },
    ],
    shape: 'Round',
    product_color: 'Black',
    is_smart: false,
    is_dimmable: true,
    is_in_stock: true,
    rating: 5.0,
    reviews_count: 14,
    availability: 'Available',
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-magnetic-track-light',
    name: 'SK Traders 48V Low Voltage Magnetic Track Spotlight 20W',
    slug: 'sk-traders-48v-magnetic-track-spotlight-20w',
    sku: 'SK-MAG-TRK-20W',
    category_id: 'spotlights',
    category_name: 'Spotlights',
    category_slug: 'spotlights',
    brand: 'SK Traders Architectural',
    wattage: 20,
    wattage_num: 20,
    lumens: 2200,
    lumens_num: 2200,
    cct: 'Tunable White 2700K - 6500K',
    cct_options: ['Warm White (3000K)', 'Neutral White (4000K)', 'Cool White (6500K)'],
    voltage: '48V DC Safety Low Voltage',
    base: 'Magnetic Track Click-In',
    beam_angle: '24° Narrow Spot',
    material: 'Extruded Aluminum Rail Housing',
    material_finish: 'Anodized Black',
    ip_rating: 'IP20',
    lifetime: '50,000 Hours',
    lifespan_hours: 50000,
    warranty_years: 5,
    dimensions: 'Dia: 45mm x L: 160mm',
    price: 3200,
    original_price: 3990,
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'],
    gallery_images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'],
    model_3d_url: '',
    is_3d_enabled: true,
    auto_rotate: true,
    short_description: 'Modular 48V magnetic track spotlight fixture with hot-swappable click placement.',
    description: 'State-of-the-art 48V magnetic track system fixture. Slide and position anywhere along the track with magnetic mechanical safety locks. Ideal for luxury retail displays and modern minimalist homes.',
    features: [
      'Safe touch 48V DC low-voltage magnetic system',
      '355° horizontal rotation + 90° vertical tilt',
      'Tool-free click and repositions along magnetic rails',
      'High CRI 95 for vibrant color reproduction',
      '5-Year SK Traders Guarantee',
    ],
    tags: ['Magnetic Track', 'Spotlight', '48V', 'SK Traders'],
    variants: [],
    shape: 'Linear',
    product_color: 'Black',
    is_smart: true,
    is_dimmable: true,
    is_in_stock: true,
    rating: 4.8,
    reviews_count: 22,
    availability: 'Available',
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-led-panel-2x2-36w',
    name: 'Philips Slimline LED Panel 2x2 36W Neutral White',
    slug: 'philips-slimline-led-panel-2x2-36w',
    sku: 'SK-PH-PNL-36W',
    category_id: 'panel-lights',
    category_name: 'Panel Lights',
    category_slug: 'panel-lights',
    brand: 'Philips',
    wattage: 36,
    wattage_num: 36,
    lumens: 3600,
    lumens_num: 3600,
    cct: 'Neutral White (4000K)',
    cct_options: ['Neutral White (4000K)', 'Cool White (6500K)'],
    voltage: '220V - 240V AC',
    base: 'Grid Ceiling Recessed',
    beam_angle: '110° Diffused',
    material: 'Edge-lit PMMA Light Guide Plate',
    material_finish: 'White Powder Coated Aluminum',
    ip_rating: 'IP20',
    lifetime: '30,000 Hours',
    lifespan_hours: 30000,
    warranty_years: 3,
    dimensions: '595mm x 595mm x 10mm',
    price: 1650,
    original_price: 2100,
    image_url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80'],
    gallery_images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80'],
    model_3d_url: '',
    is_3d_enabled: true,
    auto_rotate: true,
    short_description: 'Ultra-slim 2x2 edge-lit commercial ceiling panel light for office workspaces.',
    description: 'High-efficacy 36W LED panel light designed for corporate office ceiling grids. Provides glare-free 4000K neutral light preventing eye fatigue.',
    features: [
      '100 lm/W high efficacy energy efficiency',
      'Non-yellowing PMMA optical diffuser plate',
      'Flicker-free electronic LED driver included',
      '3-Year Philips Warranty',
    ],
    tags: ['Panel', 'Office', 'Philips', '2x2'],
    variants: [],
    shape: 'Square',
    product_color: 'White',
    is_smart: false,
    is_dimmable: false,
    is_in_stock: true,
    rating: 4.7,
    reviews_count: 40,
    availability: 'Available',
    is_featured: false,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getLocalCategories(): ProductCategory[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCT_CATEGORIES;
  try {
    const data = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (!data) return INITIAL_PRODUCT_CATEGORIES;
    const parsed = JSON.parse(data);
    return parsed.length > 0 ? parsed : INITIAL_PRODUCT_CATEGORIES;
  } catch (e) {
    return INITIAL_PRODUCT_CATEGORIES;
  }
}

export function saveLocalCategories(cats: ProductCategory[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(cats));
  } catch (e) {
    console.error('Error saving local categories:', e);
  }
}

export function getLocalProducts(): DetailedProduct[] {
  if (typeof window === 'undefined') return INITIAL_DETAILED_PRODUCTS;
  try {
    const data = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (!data) return INITIAL_DETAILED_PRODUCTS;
    const parsed = JSON.parse(data);
    return parsed.length > 0 ? parsed : INITIAL_DETAILED_PRODUCTS;
  } catch (e) {
    return INITIAL_DETAILED_PRODUCTS;
  }
}

export function saveLocalProducts(prods: DetailedProduct[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(prods));
  } catch (e) {
    console.error('Error saving local products:', e);
  }
}

export async function apiFetchCategories(): Promise<ProductCategory[]> {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalCategories();
    }
    return data.map((item: any) => ({
      id: item.id || item.slug,
      name: item.name,
      slug: item.slug,
      subtitle: item.subtitle || '',
      description: item.description || '',
      image_url: item.image_url || item.image || '',
      banner_image_url: item.banner_image_url || item.image_url || '',
      item_count_label: item.item_count_label || 'Available',
      status: item.status || 'published',
      sort_order: item.sort_order ?? 1,
      is_active: item.is_active ?? true,
    }));
  } catch (e) {
    return getLocalCategories();
  }
}

export async function apiFetchCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  const categories = await apiFetchCategories();
  const found = categories.find(
    (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.id.toLowerCase() === slug.toLowerCase()
  );
  return found || null;
}

export async function apiSaveCategory(category: ProductCategory): Promise<ProductCategory> {
  const catId = category.id || category.slug || 'cat_' + Date.now();
  const savedCat: ProductCategory = {
    ...category,
    id: catId,
    slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  };

  const currentCats = getLocalCategories();
  const idx = currentCats.findIndex((c) => c.id === catId || c.slug === savedCat.slug);
  let updatedList: ProductCategory[];
  if (idx >= 0) {
    updatedList = [...currentCats];
    updatedList[idx] = savedCat;
  } else {
    updatedList = [...currentCats, savedCat];
  }
  saveLocalCategories(updatedList);

  try {
    await supabase.from('product_categories').upsert({
      id: savedCat.id,
      name: savedCat.name,
      slug: savedCat.slug,
      subtitle: savedCat.subtitle || '',
      description: savedCat.description || '',
      image_url: savedCat.image_url || '',
      banner_image_url: savedCat.banner_image_url || savedCat.image_url || '',
      status: savedCat.status || 'published',
      sort_order: savedCat.sort_order || 1,
      is_active: savedCat.is_active ?? true,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Supabase category save fallback to local:', e);
  }

  return savedCat;
}

export async function apiDeleteCategory(id: string): Promise<boolean> {
  const current = getLocalCategories();
  saveLocalCategories(current.filter((c) => c.id !== id && c.slug !== id));
  try {
    await supabase.from('product_categories').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase category delete fallback notice:', e);
  }
  return true;
}

export async function apiGetProductCountForCategory(categoryIdOrSlug: string): Promise<number> {
  const products = await apiFetchProducts();
  const count = products.filter(
    (p) =>
      p.category_id === categoryIdOrSlug ||
      p.category_slug.toLowerCase() === categoryIdOrSlug.toLowerCase()
  ).length;
  return count;
}

export async function apiFetchProducts(): Promise<DetailedProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    let rawProducts = data;
    if (error || !rawProducts || rawProducts.length === 0) {
      rawProducts = getLocalProducts();
    }

    // Attempt to fetch relational data from Supabase tables
    let allSpecs: any[] = [];
    let allCatalogues: any[] = [];
    let allImages: any[] = [];
    let allRelated: any[] = [];

    try {
      const [specRes, catRes, imgRes, relRes] = await Promise.all([
        supabase.from('product_specifications').select('*').order('sort_order', { ascending: true }),
        supabase.from('product_catalogues').select('*').order('sort_order', { ascending: true }),
        supabase.from('product_images').select('*').order('sort_order', { ascending: true }),
        supabase.from('related_products').select('*').order('sort_order', { ascending: true }),
      ]);
      allSpecs = specRes.data || [];
      allCatalogues = catRes.data || [];
      allImages = imgRes.data || [];
      allRelated = relRes.data || [];
    } catch (e) {
      // Ignore relational fetch errors, fallback to JSON fields
    }

    return rawProducts.map((p: any) => {
      const imagesList = p.images || p.gallery_images || [p.image_url || p.image || '/images/card_smart_led_bulb.jpg'];
      const wattNum = typeof p.wattage === 'number' ? p.wattage : (parseInt(p.wattage) || 12);
      const lumNum = typeof p.lumens === 'number' ? p.lumens : (parseInt(p.lumens) || 1200);

      // Relational specs or embedded fallback specs
      const pSpecs: ProductSpecification[] = allSpecs
        .filter((s) => s.product_id === p.id)
        .map((s) => ({
          id: s.id,
          product_id: s.product_id,
          specification_name: s.specification_name,
          specification_value: s.specification_value,
          sort_order: s.sort_order,
        }));

      // If no DB specs, construct default initial specs array from product properties
      const defaultSpecs: ProductSpecification[] = pSpecs.length > 0 ? pSpecs : (p.specifications || [
        { specification_name: 'Wattage', specification_value: `${p.wattage || 12}W`, sort_order: 1 },
        { specification_name: 'Brightness / Lumens', specification_value: `${p.lumens || 1200} lm`, sort_order: 2 },
        { specification_name: 'Efficiency', specification_value: `${Number(p.wattage) > 0 ? Math.round(Number(p.lumens || 1200) / Number(p.wattage || 12)) : 100} lm/W`, sort_order: 3 },
        { specification_name: 'Color Temperature', specification_value: p.cct || '6500K / 4000K / 3000K', sort_order: 4 },
        { specification_name: 'Operating Voltage', specification_value: p.voltage || '220V–240V AC 50Hz', sort_order: 5 },
        { specification_name: 'CRI Index', specification_value: p.cri || '>80 Ra', sort_order: 6 },
        { specification_name: 'Beam Angle', specification_value: p.beam_angle || '36° / 120°', sort_order: 7 },
        { specification_name: 'IP Rating', specification_value: p.ip_rating || 'IP20', sort_order: 8 },
        { specification_name: 'Lifespan Hours', specification_value: p.lifetime || '25,000 Hours', sort_order: 9 },
        { specification_name: 'Size / Dimensions', specification_value: p.dimensions || 'Standard', sort_order: 10 },
        { specification_name: 'Material & Finish', specification_value: p.material_finish || p.material || 'Aluminum & Polycarbonate', sort_order: 11 },
        { specification_name: 'Warranty', specification_value: `${p.warranty_years || 2} Years Warranty`, sort_order: 12 },
      ]);

      // Relational catalogues
      const pCatalogues: ProductCatalogue[] = allCatalogues
        .filter((c) => c.product_id === p.id)
        .map((c) => ({
          id: c.id,
          product_id: c.product_id,
          name: c.name,
          file_url: c.file_url,
          file_size_bytes: c.file_size_bytes,
          description: c.description,
          sort_order: c.sort_order,
          created_at: c.created_at,
        }));

      // Relational images
      const pImages: ProductImageItem[] = allImages
        .filter((i) => i.product_id === p.id)
        .map((i) => ({
          id: i.id,
          product_id: i.product_id,
          image_url: i.image_url,
          is_main: i.is_main,
          sort_order: i.sort_order,
        }));

      // Relational related product IDs
      const pRelatedIds: string[] = allRelated
        .filter((r) => r.product_id === p.id)
        .map((r) => r.related_product_id);

      return {
        id: p.id,
        name: p.name,
        slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: p.sku || 'SK-PRD-' + p.id,
        category_id: p.category_id || p.category_slug || 'ceiling-lights',
        category_name: p.category_name || p.category || 'Ceiling Lights',
        category_slug: p.category_slug || p.category_id || 'ceiling-lights',
        sub_category: p.sub_category || '',
        brand: p.brand || 'SK Traders Architectural',
        wattage: p.wattage ?? 12,
        wattage_num: p.wattage_num ?? wattNum,
        lumens: p.lumens ?? 1200,
        lumens_num: p.lumens_num ?? lumNum,
        cct: p.cct || 'Warm White 3000K',
        cct_options: p.cct_options || ['Warm White (3000K)', 'Neutral White (4000K)', 'Cool White (6500K)'],
        voltage: p.voltage || '220V - 240V AC 50/60Hz',
        base: p.base || 'Direct Mount',
        beam_angle: p.beam_angle || '24° / 36°',
        material: p.material || 'Die-cast Aluminum',
        material_finish: p.material_finish || p.material || 'Die-cast Aerospace Aluminum',
        ip_rating: p.ip_rating || 'IP44',
        lifetime: p.lifetime || '50,000 Hours',
        lifespan_hours: p.lifespan_hours ?? 50000,
        warranty_years: p.warranty_years ?? 5,
        dimensions: p.dimensions || 'Dia: 90mm x H: 110mm',
        price: p.price ?? 1499,
        original_price: p.original_price ?? (p.price ? Math.round(p.price * 1.25) : 1999),
        image_url: p.image_url || imagesList[0],
        images: p.images || imagesList,
        gallery_images: p.gallery_images || imagesList,
        product_images: pImages.length > 0 ? pImages : imagesList.map((url: string, idx: number) => ({ image_url: url, is_main: idx === 0, sort_order: idx + 1 })),
        model_3d_url: p.model_3d_url || '',
        catalogue_url: p.catalogue_url || p.file_url || p.pdf_url || '',
        catalogues: pCatalogues.length > 0 ? pCatalogues : (p.catalogue_url ? [{ name: `${p.name} Specification Sheet`, file_url: p.catalogue_url, description: 'Official PDF Datasheet', sort_order: 1 }] : []),
        is_3d_enabled: p.is_3d_enabled ?? true,
        auto_rotate: p.auto_rotate ?? true,
        short_description: p.short_description || p.description?.substring(0, 100) || '',
        description: p.description || '',
        overview_text: p.overview_text || p.description || '',
        features: Array.isArray(p.features) ? p.features : [],
        benefits: Array.isArray(p.benefits) ? p.benefits : ['High efficiency energy savings', 'Long lifespan EyeComfort optical lens', 'Flicker-free solid state LED driver'],
        applications: Array.isArray(p.applications) ? p.applications : ['Commercial Offices', 'Residential Living Rooms', 'Retail Showrooms & Hotels'],
        installation_text: p.installation_text || 'Ensure main power supply is isolated before installation. Connect standard 220-240V AC driver input wires.',
        technical_info_text: p.technical_info_text || 'Tested in accordance with BIS and IEC lighting compliance standards. Operating temperature -20°C to +45°C.',
        specifications: defaultSpecs,
        related_product_ids: pRelatedIds.length > 0 ? pRelatedIds : (p.related_product_ids || []),
        tags: p.tags || [p.category_slug || 'lighting', p.brand || 'SK Traders'],
        variants: p.variants || [],
        shape: p.shape || 'Round',
        product_color: p.product_color || 'White',
        is_smart: p.is_smart ?? false,
        is_dimmable: p.is_dimmable ?? false,
        show_price: p.show_price ?? true,
        show_view_button: p.show_view_button ?? true,
        is_in_stock: p.is_in_stock ?? (p.availability !== 'Out of Stock'),
        rating: p.rating ?? 4.9,
        reviews_count: p.reviews_count ?? 18,
        availability: p.availability || 'Available',
        is_featured: p.is_featured ?? true,
        is_published: p.is_published ?? true,
        created_at: p.created_at || new Date().toISOString(),
        updated_at: p.updated_at || new Date().toISOString(),
      };
    });
  } catch (e) {
    return getLocalProducts();
  }
}

export async function apiFetchProductBySlug(slug: string): Promise<DetailedProduct | null> {
  const all = await apiFetchProducts();
  const found = all.find((p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id === slug);
  return found || null;
}

export async function apiSaveProduct(product: DetailedProduct): Promise<DetailedProduct> {
  const now = new Date().toISOString();
  const prodId = product.id || 'prod_' + Math.random().toString(36).substring(2, 9);
  const slug = (product.slug || product.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const savedProduct: DetailedProduct = {
    ...product,
    id: prodId,
    slug,
    updated_at: now,
  };

  const current = getLocalProducts();
  const idx = current.findIndex((p) => p.id === prodId);
  let updatedList: DetailedProduct[];
  if (idx >= 0) {
    updatedList = [...current];
    updatedList[idx] = savedProduct;
  } else {
    updatedList = [savedProduct, ...current];
  }
  saveLocalProducts(updatedList);

  try {
    // 1. Upsert into products table
    const { error: prodErr } = await supabase.from('products').upsert({
      id: savedProduct.id,
      name: savedProduct.name,
      slug: savedProduct.slug,
      sku: savedProduct.sku,
      category_id: savedProduct.category_id,
      category_name: savedProduct.category_name,
      category_slug: savedProduct.category_slug,
      sub_category: savedProduct.sub_category || '',
      brand: savedProduct.brand,
      wattage: savedProduct.wattage,
      wattage_num: savedProduct.wattage_num,
      lumens: savedProduct.lumens,
      lumens_num: savedProduct.lumens_num,
      cct: savedProduct.cct,
      cct_options: savedProduct.cct_options || [],
      voltage: savedProduct.voltage,
      base: savedProduct.base,
      beam_angle: savedProduct.beam_angle,
      material: savedProduct.material,
      material_finish: savedProduct.material_finish,
      ip_rating: savedProduct.ip_rating,
      lifetime: savedProduct.lifetime,
      dimensions: savedProduct.dimensions,
      price: savedProduct.price,
      original_price: savedProduct.original_price,
      image_url: savedProduct.image_url,
      images: savedProduct.images || [],
      gallery_images: savedProduct.images || [],
      model_3d_url: savedProduct.model_3d_url || '',
      catalogue_url: savedProduct.catalogue_url || '',
      is_3d_enabled: savedProduct.is_3d_enabled ?? true,
      auto_rotate: savedProduct.auto_rotate ?? true,
      short_description: savedProduct.short_description || '',
      description: savedProduct.description || '',
      overview_text: savedProduct.overview_text || '',
      features: savedProduct.features || [],
      benefits: savedProduct.benefits || [],
      applications: savedProduct.applications || [],
      installation_text: savedProduct.installation_text || '',
      technical_info_text: savedProduct.technical_info_text || '',
      variants: savedProduct.variants || [],
      shape: savedProduct.shape || 'Round',
      product_color: savedProduct.product_color || 'White',
      is_smart: Boolean(savedProduct.is_smart),
      is_dimmable: Boolean(savedProduct.is_dimmable),
      show_price: savedProduct.show_price ?? true,
      show_view_button: savedProduct.show_view_button ?? true,
      availability: savedProduct.availability || 'Available',
      is_featured: savedProduct.is_featured ?? true,
      is_published: savedProduct.is_published ?? true,
      updated_at: now,
    });

    if (prodErr) {
      console.error('Supabase product upsert error:', prodErr);
    }

    // 2. Manage product_specifications table
    if (savedProduct.specifications) {
      await supabase.from('product_specifications').delete().eq('product_id', prodId);
      const specsToInsert = savedProduct.specifications.map((spec, sIdx) => ({
        id: spec.id || `spec_${prodId}_${sIdx}_${Date.now()}`,
        product_id: prodId,
        specification_name: spec.specification_name,
        specification_value: spec.specification_value,
        sort_order: spec.sort_order || sIdx + 1,
      }));
      if (specsToInsert.length > 0) {
        await supabase.from('product_specifications').insert(specsToInsert);
      }
    }

    // 3. Manage product_catalogues table
    if (savedProduct.catalogues) {
      await supabase.from('product_catalogues').delete().eq('product_id', prodId);
      const catsToInsert = savedProduct.catalogues.map((cat, cIdx) => ({
        id: cat.id || `cat_${prodId}_${cIdx}_${Date.now()}`,
        product_id: prodId,
        name: cat.name,
        file_url: cat.file_url,
        file_size_bytes: cat.file_size_bytes || 0,
        description: cat.description || '',
        sort_order: cat.sort_order || cIdx + 1,
      }));
      if (catsToInsert.length > 0) {
        await supabase.from('product_catalogues').insert(catsToInsert);
      }
    }

    // 4. Manage product_images table
    if (savedProduct.images) {
      await supabase.from('product_images').delete().eq('product_id', prodId);
      const imgsToInsert = savedProduct.images.map((imgUrl, iIdx) => ({
        id: `img_${prodId}_${iIdx}_${Date.now()}`,
        product_id: prodId,
        image_url: imgUrl,
        is_main: iIdx === 0,
        sort_order: iIdx + 1,
      }));
      if (imgsToInsert.length > 0) {
        await supabase.from('product_images').insert(imgsToInsert);
      }
    }

    // 5. Manage related_products table
    if (savedProduct.related_product_ids) {
      await supabase.from('related_products').delete().eq('product_id', prodId);
      const relsToInsert = savedProduct.related_product_ids.map((relId, rIdx) => ({
        id: `rel_${prodId}_${relId}_${Date.now()}`,
        product_id: prodId,
        related_product_id: relId,
        sort_order: rIdx + 1,
      }));
      if (relsToInsert.length > 0) {
        await supabase.from('related_products').insert(relsToInsert);
      }
    }
  } catch (e) {
    console.warn('Supabase product save fallback to local notice:', e);
  }

  return savedProduct;
}

export async function syncAllProductsToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  const local = getLocalProducts();
  const prodsToSync = local.length > 0 ? local : INITIAL_DETAILED_PRODUCTS;

  try {
    const formatted = prodsToSync.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: p.sku || 'SK-PRD-' + p.id,
      category_id: p.category_id || 'ceiling-lights',
      category_name: p.category_name || 'Ceiling Lights',
      category_slug: p.category_slug || 'ceiling-lights',
      sub_category: p.sub_category || '',
      brand: p.brand || 'SK Traders Architectural',
      wattage: p.wattage ?? 12,
      wattage_num: p.wattage_num ?? 12,
      lumens: p.lumens ?? 1200,
      lumens_num: p.lumens_num ?? 1200,
      cct: p.cct || 'Warm White 3000K',
      voltage: p.voltage || '220V - 240V AC 50/60Hz',
      base: p.base || 'Direct Mount',
      beam_angle: p.beam_angle || '24° / 36°',
      material: p.material || 'Die-cast Aluminum',
      ip_rating: p.ip_rating || 'IP44',
      lifetime: p.lifetime || '50,000 Hours',
      dimensions: p.dimensions || 'Dia: 90mm x H: 110mm',
      price: p.price ?? 1499,
      original_price: p.original_price ?? 1999,
      image_url: p.image_url || p.images?.[0] || '/images/card_smart_led_bulb.jpg',
      gallery_images: p.gallery_images || p.images || [],
      model_3d_url: p.model_3d_url || '',
      catalogue_url: p.catalogue_url || '',
      is_3d_enabled: p.is_3d_enabled ?? true,
      auto_rotate: p.auto_rotate ?? true,
      description: p.description || '',
      features: p.features || [],
      variants: p.variants || [],
      shape: p.shape || 'Round',
      product_color: p.product_color || 'White',
      is_smart: p.is_smart ?? false,
      is_dimmable: p.is_dimmable ?? false,
      show_price: p.show_price ?? true,
      show_view_button: p.show_view_button ?? true,
      availability: p.availability || 'Available',
      is_featured: p.is_featured ?? true,
      is_published: p.is_published ?? true,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('products').upsert(formatted);
    if (error) {
      return { success: false, count: 0, error: error.message };
    }
    return { success: true, count: formatted.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || String(err) };
  }
}

export async function apiDeleteProduct(id: string): Promise<boolean> {
  const current = getLocalProducts();
  saveLocalProducts(current.filter((p) => p.id !== id));
  try {
    await supabase.from('products').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase product delete fallback notice:', e);
  }
  return true;
}

// Function Aliases for flexible imports
export const getProducts = apiFetchProducts;
export const getProductById = apiFetchProductBySlug;
export const getProductBySlug = apiFetchProductBySlug;
export const getCategories = apiFetchCategories;
export const getCategoryBySlug = apiFetchCategoryBySlug;
export const upsertCategory = apiSaveCategory;
export const deleteCategory = apiDeleteCategory;
export const getProductCountForCategory = apiGetProductCountForCategory;
export const upsertProduct = apiSaveProduct;
export const deleteProduct = apiDeleteProduct;

