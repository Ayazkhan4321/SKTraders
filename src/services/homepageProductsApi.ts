import { supabase } from '@/lib/supabase';
import { getProducts, DetailedProduct } from './productsApi';

export interface HomepageProductConfig {
  id: string;
  product_id: string;
  homepage_name?: string;
  homepage_price?: number;
  homepage_image_url?: string;
  homepage_description?: string;
  show_price?: boolean;
  show_view_button?: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MergedHomepageProduct {
  id: string; // config ID
  product_id: string; // master product ID
  masterProduct: DetailedProduct;
  // Effective homepage presentation fields:
  name: string;
  price: number;
  image_url: string;
  short_description: string;
  show_price: boolean;
  show_view_button: boolean;
  display_order: number;
  is_active: boolean;
  slug: string; // master product slug for routing to /products/detail/:slug
}

const STORAGE_HOMEPAGE_PRODUCTS_KEY = 'sk_cms_homepage_products_v2';

export const INITIAL_HOMEPAGE_CONFIGS: HomepageProductConfig[] = [
  {
    id: 'hp-cfg-1',
    product_id: 'prod-smart-bulb-12w',
    homepage_name: 'Philips Smart LED Bulb',
    homepage_price: 899,
    homepage_image_url: '/images/card_smart_led_bulb.jpg',
    homepage_description: 'Next-generation connected Wi-Fi smart LED bulb powered by WiZ. 16 million colors.',
    show_price: true,
    show_view_button: true,
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hp-cfg-2',
    product_id: 'prod-cob-downlight-18w',
    homepage_name: 'Philips LED Downlight',
    homepage_price: 1499,
    homepage_image_url: '/images/card_ceiling_design_lights.jpg',
    homepage_description: 'Deep anti-glare trimless recessed COB spotlight engineered for luxury residences.',
    show_price: true,
    show_view_button: true,
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hp-cfg-3',
    product_id: 'prod-magnetic-track-light',
    homepage_name: 'Philips COB Spotlight',
    homepage_price: 1999,
    homepage_image_url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80',
    homepage_description: 'Modular 48V magnetic track spotlight fixture with hot-swappable click placement.',
    show_price: true,
    show_view_button: true,
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hp-cfg-4',
    product_id: 'prod-led-panel-2x2-36w',
    homepage_name: 'Philips Ceiling Light',
    homepage_price: 2499,
    homepage_image_url: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80',
    homepage_description: 'Ultra-slim 2x2 edge-lit commercial ceiling panel light for office workspaces.',
    show_price: true,
    show_view_button: true,
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getLocalHomepageProducts(): HomepageProductConfig[] {
  if (typeof window === 'undefined') return INITIAL_HOMEPAGE_CONFIGS;
  try {
    const data = localStorage.getItem(STORAGE_HOMEPAGE_PRODUCTS_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_HOMEPAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_HOMEPAGE_CONFIGS));
      return INITIAL_HOMEPAGE_CONFIGS;
    }
    const parsed = JSON.parse(data);
    return parsed.length > 0 ? parsed : INITIAL_HOMEPAGE_CONFIGS;
  } catch (e) {
    return INITIAL_HOMEPAGE_CONFIGS;
  }
}

export function saveLocalHomepageProducts(configs: HomepageProductConfig[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_HOMEPAGE_PRODUCTS_KEY, JSON.stringify(configs));
  } catch (e) {
    console.error('Error saving local homepage products:', e);
  }
}

export async function apiFetchHomepageProducts(): Promise<HomepageProductConfig[]> {
  try {
    const { data, error } = await supabase
      .from('homepage_products')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalHomepageProducts();
    }

    return data.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      homepage_name: item.homepage_name || item.title || '',
      homepage_price: item.homepage_price != null ? Number(item.homepage_price) : undefined,
      homepage_image_url: item.homepage_image_url || item.image_url || '',
      homepage_description: item.homepage_description || item.description || '',
      show_price: item.show_price ?? true,
      show_view_button: item.show_view_button ?? true,
      display_order: item.display_order ?? 1,
      is_active: item.is_active ?? true,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
    }));
  } catch (e) {
    return getLocalHomepageProducts();
  }
}

export async function apiFetchMergedHomepageProducts(): Promise<MergedHomepageProduct[]> {
  const [configs, masterProducts] = await Promise.all([
    apiFetchHomepageProducts(),
    getProducts(),
  ]);

  const activeConfigs = configs.filter((c) => c.is_active);

  const merged: MergedHomepageProduct[] = [];

  for (const cfg of activeConfigs) {
    const master = masterProducts.find((p) => p.id === cfg.product_id || p.slug === cfg.product_id);
    if (!master) continue;

    merged.push({
      id: cfg.id,
      product_id: cfg.product_id,
      masterProduct: master,
      name: cfg.homepage_name?.trim() ? cfg.homepage_name : master.name,
      price: cfg.homepage_price != null ? cfg.homepage_price : master.price,
      image_url: cfg.homepage_image_url?.trim() ? cfg.homepage_image_url : master.image_url,
      short_description: cfg.homepage_description?.trim()
        ? cfg.homepage_description
        : (master.short_description || master.description?.substring(0, 120) || ''),
      show_price: cfg.show_price ?? master.show_price ?? true,
      show_view_button: cfg.show_view_button ?? master.show_view_button ?? true,
      display_order: cfg.display_order ?? 1,
      is_active: cfg.is_active,
      slug: master.slug,
    });
  }

  return merged.sort((a, b) => a.display_order - b.display_order);
}

export async function apiSaveHomepageProduct(config: Partial<HomepageProductConfig>): Promise<HomepageProductConfig> {
  const now = new Date().toISOString();
  const configId = config.id || 'hp-cfg-' + Math.random().toString(36).substring(2, 9);

  const savedConfig: HomepageProductConfig = {
    id: configId,
    product_id: config.product_id || '',
    homepage_name: config.homepage_name || '',
    homepage_price: config.homepage_price != null ? Number(config.homepage_price) : undefined,
    homepage_image_url: config.homepage_image_url || '',
    homepage_description: config.homepage_description || '',
    show_price: config.show_price ?? true,
    show_view_button: config.show_view_button ?? true,
    display_order: Number(config.display_order) || 1,
    is_active: config.is_active ?? true,
    created_at: config.created_at || now,
    updated_at: now,
  };

  const current = getLocalHomepageProducts();
  const idx = current.findIndex((c) => c.id === configId);
  let updatedList: HomepageProductConfig[];
  if (idx >= 0) {
    updatedList = [...current];
    updatedList[idx] = savedConfig;
  } else {
    updatedList = [...current, savedConfig];
  }
  saveLocalHomepageProducts(updatedList);

  try {
    await supabase.from('homepage_products').upsert({
      id: savedConfig.id,
      product_id: savedConfig.product_id,
      homepage_name: savedConfig.homepage_name,
      homepage_price: savedConfig.homepage_price,
      homepage_image_url: savedConfig.homepage_image_url,
      homepage_description: savedConfig.homepage_description,
      show_price: savedConfig.show_price,
      show_view_button: savedConfig.show_view_button,
      display_order: savedConfig.display_order,
      is_active: savedConfig.is_active,
      updated_at: now,
    });
  } catch (e) {
    console.warn('Supabase homepage_products save fallback to local:', e);
  }

  return savedConfig;
}

export async function apiDeleteHomepageProduct(id: string): Promise<boolean> {
  const current = getLocalHomepageProducts();
  const filtered = current.filter((c) => c.id !== id);
  saveLocalHomepageProducts(filtered);

  try {
    await supabase.from('homepage_products').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase homepage_products delete fallback to local:', e);
  }
  return true;
}
