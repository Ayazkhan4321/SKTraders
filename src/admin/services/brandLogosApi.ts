import { supabase } from '@/lib/supabase';

export interface FooterBrand {
  id: string;
  brand_name: string;
  logo_url: string;
  website_url?: string;
  logo_height?: number;
  logo_width?: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'sk_cms_brand_logos_v2';

export const INITIAL_BRAND_LOGOS: FooterBrand[] = [
  {
    id: 'brand-philips',
    brand_name: 'PHILIPS',
    logo_url: '/images/brands/philips.svg',
    website_url: 'https://www.lighting.philips.com',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-signify',
    brand_name: 'Signify',
    logo_url: '/images/brands/signify.svg',
    website_url: 'https://www.signify.com',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-ecolink',
    brand_name: 'Ecolink',
    logo_url: '/images/brands/ecolink.svg',
    website_url: 'https://www.ecolink-lighting.com',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-interact',
    brand_name: 'Interact',
    logo_url: '/images/brands/interact.svg',
    website_url: 'https://www.interact-lighting.com',
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-colorkinetics',
    brand_name: 'Color Kinetics',
    logo_url: '/images/brands/color_kinetics.svg',
    website_url: 'https://www.colorkinetics.com',
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-dynalite',
    brand_name: 'Dynalite',
    logo_url: '/images/brands/dynalite.svg',
    website_url: 'https://www.dynalite.org',
    display_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-wiz',
    brand_name: 'WiZ',
    logo_url: '/images/brands/wiz.svg',
    website_url: 'https://www.wizconnected.com',
    display_order: 7,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getLocalBrandLogos(): FooterBrand[] {
  if (typeof window === 'undefined') return INITIAL_BRAND_LOGOS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BRAND_LOGOS));
    return INITIAL_BRAND_LOGOS;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_BRAND_LOGOS;
  } catch {
    return INITIAL_BRAND_LOGOS;
  }
}

export function saveLocalBrandLogos(brands: FooterBrand[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
  }
}

export async function fetchAdminBrandLogos(): Promise<FooterBrand[]> {
  try {
    const { data, error } = await supabase
      .from('footer_brands')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase fetch brand logos notice:', error);
      return getLocalBrandLogos();
    }

    if (!data || data.length === 0) {
      return getLocalBrandLogos();
    }

    return data.map((item: any) => ({
      id: item.id,
      brand_name: item.brand_name,
      logo_url: item.logo_url || '',
      website_url: item.website_url || '',
      logo_height: item.logo_height || undefined,
      logo_width: item.logo_width || undefined,
      display_order: item.display_order ?? 1,
      is_active: item.is_active ?? true,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
    }));
  } catch {
    return getLocalBrandLogos();
  }
}

export async function fetchPublicBrandLogos(): Promise<FooterBrand[]> {
  const all = await fetchAdminBrandLogos();
  return all
    .filter((b) => b.is_active)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function saveBrandLogo(
  brand: Omit<FooterBrand, 'created_at' | 'updated_at'> & { id?: string }
): Promise<FooterBrand> {
  const now = new Date().toISOString();
  const id = brand.id || 'brand_' + Math.random().toString(36).substring(2, 9);

  const brandToSave: FooterBrand = {
    ...brand,
    id,
    created_at: now,
    updated_at: now,
  };

  const current = getLocalBrandLogos();
  const index = current.findIndex((item) => item.id === id);
  let updated: FooterBrand[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = brandToSave;
  } else {
    updated = [...current, brandToSave];
  }
  saveLocalBrandLogos(updated);

  try {
    const { error } = await supabase.from('footer_brands').upsert({
      id: brandToSave.id,
      brand_name: brandToSave.brand_name,
      logo_url: brandToSave.logo_url,
      website_url: brandToSave.website_url || null,
      logo_height: brandToSave.logo_height || null,
      logo_width: brandToSave.logo_width || null,
      display_order: brandToSave.display_order,
      is_active: brandToSave.is_active,
      updated_at: now,
    });
    if (error) {
      console.warn('Supabase footer_brands upsert notice:', error);
    }
  } catch (e) {
    console.warn('Supabase footer_brands upsert fallback:', e);
  }

  return brandToSave;
}

export async function deleteBrandLogo(id: string): Promise<boolean> {
  const current = getLocalBrandLogos();
  const updated = current.filter((b) => b.id !== id);
  saveLocalBrandLogos(updated);

  try {
    await supabase.from('footer_brands').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase footer_brands delete fallback:', e);
  }
  return true;
}

export async function reorderBrandLogos(brands: FooterBrand[]): Promise<boolean> {
  const reordered = brands.map((b, index) => ({
    ...b,
    display_order: index + 1,
    updated_at: new Date().toISOString(),
  }));
  saveLocalBrandLogos(reordered);

  try {
    const updates = reordered.map((b) => ({
      id: b.id,
      brand_name: b.brand_name,
      logo_url: b.logo_url,
      website_url: b.website_url || null,
      logo_height: b.logo_height || null,
      logo_width: b.logo_width || null,
      display_order: b.display_order,
      is_active: b.is_active,
      updated_at: b.updated_at,
    }));
    await supabase.from('footer_brands').upsert(updates);
  } catch (e) {
    console.warn('Supabase reorder fallback:', e);
  }
  return true;
}
