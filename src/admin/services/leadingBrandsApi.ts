import { supabase } from '@/lib/supabase';

export interface BrandSectionContent {
  id: string;
  heading: string;
  description: string;
  button_text: string;
  button_url: string;
  is_enabled: boolean;
  updated_at: string;
}

export interface LeadingBrand {
  id: string;
  name: string;
  description: string;
  image_url: string;
  website_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SECTION_STORAGE_KEY = 'sk_cms_brand_section_v1';
const BRANDS_STORAGE_KEY = 'sk_cms_leading_brands_v1';

export const INITIAL_SECTION_CONTENT: BrandSectionContent = {
  id: 'default',
  heading: "The world's leading lighting brands\nPhilips\nSignify Innovation India Limited",
  description:
    'Our products, connected systems and services unlock the extraordinary potential of light to enhance well-being and performance, elevate experiences and advance sustainability.',
  button_text: 'View all brands',
  button_url: '/brands',
  is_enabled: true,
  updated_at: new Date().toISOString(),
};

export const INITIAL_LEADING_BRANDS: LeadingBrand[] = [
  {
    id: 'brand-philips',
    name: 'Philips',
    description: 'Professional and consumer lighting solutions across residential, healthcare & trade applications.',
    image_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
    website_url: '/brands/philips',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-signify',
    name: 'Signify',
    description: 'Connected lighting and intelligent lighting systems driving energy efficiency worldwide.',
    image_url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=800&auto=format&fit=crop',
    website_url: '/brands/signify',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-interact',
    name: 'Interact',
    description: 'IoT software platform empowering smart buildings, connected cities, and retail experiences.',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    website_url: '/brands/interact',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-dynalite',
    name: 'Dynalite',
    description: 'Sophisticated architectural lighting control and high-performance automation systems.',
    image_url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop',
    website_url: '/brands/dynalite',
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper Functions for LocalStorage
export function getLocalBrandSection(): BrandSectionContent {
  if (typeof window === 'undefined') return INITIAL_SECTION_CONTENT;
  const stored = localStorage.getItem(SECTION_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(SECTION_STORAGE_KEY, JSON.stringify(INITIAL_SECTION_CONTENT));
    return INITIAL_SECTION_CONTENT;
  }
  try {
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed.heading === 'string') {
      // Auto-migrate old single-line heading if needed
      if (!parsed.heading.includes('\n') && parsed.heading.includes('Signify Innovation')) {
        parsed.heading = "The world's leading lighting brands\nPhilips\nSignify Innovation India Limited";
        saveLocalBrandSection(parsed);
      }
    }
    return parsed;
  } catch {
    return INITIAL_SECTION_CONTENT;
  }
}

export function saveLocalBrandSection(section: BrandSectionContent) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SECTION_STORAGE_KEY, JSON.stringify(section));
  }
}

export function getLocalLeadingBrands(): LeadingBrand[] {
  if (typeof window === 'undefined') return INITIAL_LEADING_BRANDS;
  const stored = localStorage.getItem(BRANDS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(INITIAL_LEADING_BRANDS));
    return INITIAL_LEADING_BRANDS;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_LEADING_BRANDS;
  } catch {
    return INITIAL_LEADING_BRANDS;
  }
}

export function saveLocalLeadingBrands(brands: LeadingBrand[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(brands));
  }
}

// Supabase Async API for Brand Section Content
export async function fetchAdminBrandSection(): Promise<BrandSectionContent> {
  try {
    const { data, error } = await supabase
      .from('brand_section')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error || !data) {
      // Auto-seed table if empty or missing
      try {
        await supabase.from('brand_section').upsert([
          {
            id: INITIAL_SECTION_CONTENT.id,
            heading: INITIAL_SECTION_CONTENT.heading,
            description: INITIAL_SECTION_CONTENT.description,
            button_text: INITIAL_SECTION_CONTENT.button_text,
            button_url: INITIAL_SECTION_CONTENT.button_url,
            is_enabled: INITIAL_SECTION_CONTENT.is_enabled,
            updated_at: INITIAL_SECTION_CONTENT.updated_at,
          },
        ]);
      } catch (e) {
        // ignore seed error
      }
      return getLocalBrandSection();
    }

    return {
      id: data.id || 'default',
      heading: data.heading || INITIAL_SECTION_CONTENT.heading,
      description: data.description || INITIAL_SECTION_CONTENT.description,
      button_text: data.button_text || INITIAL_SECTION_CONTENT.button_text,
      button_url: data.button_url || INITIAL_SECTION_CONTENT.button_url,
      is_enabled: data.is_enabled ?? true,
      updated_at: data.updated_at || new Date().toISOString(),
    };
  } catch {
    return getLocalBrandSection();
  }
}

export async function saveBrandSection(section: BrandSectionContent): Promise<BrandSectionContent> {
  const updated: BrandSectionContent = {
    ...section,
    updated_at: new Date().toISOString(),
  };
  saveLocalBrandSection(updated);

  try {
    await supabase.from('brand_section').upsert({
      id: updated.id,
      heading: updated.heading,
      description: updated.description,
      button_text: updated.button_text,
      button_url: updated.button_url,
      is_enabled: updated.is_enabled,
      updated_at: updated.updated_at,
    });
  } catch (e) {
    console.warn('Supabase brand_section upsert fallback:', e);
  }

  return updated;
}

// Supabase Async API for Brands Cards
export async function fetchAdminLeadingBrands(): Promise<LeadingBrand[]> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      // Auto seed brands table if empty
      try {
        const seedRows = INITIAL_LEADING_BRANDS.map((b) => ({
          id: b.id,
          name: b.name,
          description: b.description,
          image_url: b.image_url,
          website_url: b.website_url,
          display_order: b.display_order,
          is_active: b.is_active,
          updated_at: b.updated_at,
        }));
        await supabase.from('brands').upsert(seedRows);

        const { data: reFetched } = await supabase
          .from('brands')
          .select('*')
          .order('display_order', { ascending: true });

        if (reFetched && reFetched.length > 0) {
          return reFetched.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            image_url: item.image_url || '',
            website_url: item.website_url || '',
            display_order: item.display_order ?? 1,
            is_active: item.is_active ?? true,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString(),
          }));
        }
      } catch (e) {
        console.warn('Auto-seed brands error:', e);
      }
      return getLocalLeadingBrands();
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      image_url: item.image_url || '',
      website_url: item.website_url || '',
      display_order: item.display_order ?? 1,
      is_active: item.is_active ?? true,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
    }));
  } catch {
    return getLocalLeadingBrands();
  }
}

export async function fetchPublicLeadingBrands(): Promise<LeadingBrand[]> {
  const all = await fetchAdminLeadingBrands();
  return all
    .filter((b) => b.is_active)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function saveLeadingBrand(
  brand: Omit<LeadingBrand, 'created_at' | 'updated_at'> & { id?: string }
): Promise<LeadingBrand> {
  const now = new Date().toISOString();
  const id = brand.id || 'brand_' + Math.random().toString(36).substring(2, 9);

  const brandToSave: LeadingBrand = {
    ...brand,
    id,
    created_at: now,
    updated_at: now,
  };

  const current = getLocalLeadingBrands();
  const index = current.findIndex((item) => item.id === id);
  let updated: LeadingBrand[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = brandToSave;
  } else {
    updated = [...current, brandToSave];
  }
  saveLocalLeadingBrands(updated);

  try {
    await supabase.from('brands').upsert({
      id: brandToSave.id,
      name: brandToSave.name,
      description: brandToSave.description,
      image_url: brandToSave.image_url,
      website_url: brandToSave.website_url,
      display_order: brandToSave.display_order,
      is_active: brandToSave.is_active,
      updated_at: now,
    });
  } catch (e) {
    console.warn('Supabase brands upsert fallback:', e);
  }

  return brandToSave;
}

export async function deleteLeadingBrand(id: string): Promise<boolean> {
  const current = getLocalLeadingBrands();
  const updated = current.filter((b) => b.id !== id);
  saveLocalLeadingBrands(updated);

  try {
    await supabase.from('brands').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase brands delete fallback:', e);
  }
  return true;
}

export async function reorderLeadingBrands(brands: LeadingBrand[]): Promise<boolean> {
  const reordered = brands.map((b, index) => ({
    ...b,
    display_order: index + 1,
    updated_at: new Date().toISOString(),
  }));
  saveLocalLeadingBrands(reordered);

  try {
    const updates = reordered.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      image_url: b.image_url,
      website_url: b.website_url,
      display_order: b.display_order,
      is_active: b.is_active,
      updated_at: b.updated_at,
    }));
    await supabase.from('brands').upsert(updates);
  } catch (e) {
    console.warn('Supabase reorder brands fallback:', e);
  }
  return true;
}
