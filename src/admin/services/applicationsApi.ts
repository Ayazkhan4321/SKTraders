import { supabase } from '@/lib/supabase';

export interface ApplicationItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  image_url: string;
  key_features: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'sk_cms_applications_v1';

export const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app-office-commercial',
    slug: 'office-commercial',
    title: 'Office & Commercial Spaces',
    subtitle: 'Human-centric & circadian LED lighting for modern workplaces',
    description:
      'Transform workspace productivity, employee well-being, and energy efficiency with connected Signify Interact office lighting systems, glare-free ceiling troffers, and smart occupancy sensors.',
    category: 'Commercial',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    key_features: [
      'Circadian rhythm & tunable white lighting',
      'WiZ & Interact IoT sensor integration',
      'Up to 80% energy savings with daylight harvesting',
      'UGR < 19 glare control compliance',
    ],
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'app-industry-logistics',
    slug: 'industry-logistics',
    title: 'Industry & Warehousing',
    subtitle: 'High-bay industrial LED illumination for heavy manufacturing & logistics',
    description:
      'High-impact, dustproof, and waterproof IP65/IP66 industrial lighting designed for continuous operation in high-ceiling factories, fulfillment centers, and assembly lines.',
    category: 'Industrial',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
    key_features: [
      'Ultra-high lumen output up to 160 lm/W',
      'Robust die-cast aluminum heat sinks',
      'Hazardous area & extreme temperature resistance',
      'Intelligent motion & high-bay occupancy sensing',
    ],
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'app-healthcare-hospitals',
    slug: 'healthcare-hospitals',
    title: 'Healthcare & Hospitals',
    subtitle: 'Cleanroom ISO-certified LED fixtures for medical suites & patient rooms',
    description:
      'Precision illumination crafted for surgical suites, ICU cleanrooms, diagnostic labs, and soothing patient recovery rooms with anti-microbial coatings and high Color Rendering Index (CRI > 90).',
    category: 'Healthcare',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
    key_features: [
      'ISO Cleanroom Class 3 to 9 compliance',
      'CRI > 90 color accuracy for clinical examination',
      'Sealed IP65 dust and moisture resistant enclosures',
      'Night-light soothing circadian patient dimming',
    ],
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'app-retail-hospitality',
    slug: 'retail-hospitality',
    title: 'Retail & Shopping Malls',
    subtitle: 'Architectural track spotlights & accent lighting for luxury stores',
    description:
      'Accentuate products, elevate store aesthetics, and guide shopper journeys with high-CRI accent spotlights, magnetic linear tracks, and dynamic color-changing ambient lighting.',
    category: 'Retail',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    key_features: [
      'Accent spot optical zoom and beam shaping',
      'Fresh food & textile color enhancement spectra',
      'Flexible magnetic track system installation',
      'Dynamic scene scheduling for seasonal displays',
    ],
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'app-roads-cities',
    slug: 'roads-cities',
    title: 'Roads, Cities & Urban Infrastructure',
    subtitle: 'Smart connected streetlights & architectural facade floodlighting',
    description:
      'Smart city LED streetlights, highway luminaires, decorative post-tops, and dynamic RGB facade lighting powered by Signify Interact City remote telemanagement.',
    category: 'Outdoor',
    image_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
    key_features: [
      'Interact City remote web dashboard controls',
      'IP66 / IK10 heavy-duty weather & vandal protection',
      'Surge protection up to 10kV',
      'Dark-sky compliant zero light pollution optics',
    ],
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'app-sports-entertainment',
    slug: 'sports-entertainment',
    title: 'Sports & Arena Floodlighting',
    subtitle: 'Flicker-free HDTV broadcast lighting for stadiums & arenas',
    description:
      'High-performance LED floodlights for outdoor stadiums, indoor sports arenas, and event venues delivering broadcast-quality flicker-free slow-motion coverage.',
    category: 'Outdoor',
    image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    key_features: [
      'HDTV & 4K slow-motion broadcast flicker-free compliance',
      'Asymmetric beam control minimizing spill light',
      'Instant-on power recovery without warm-up time',
      'DMX & Interact Sports entertainment show syncing',
    ],
    display_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// LocalStorage Helper Functions
export function getLocalApplications(): ApplicationItem[] {
  if (typeof window === 'undefined') return INITIAL_APPLICATIONS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_APPLICATIONS;
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function saveLocalApplications(apps: ApplicationItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }
}

// Supabase Async API functions
export async function fetchAdminApplications(): Promise<ApplicationItem[]> {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalApplications();
    }

    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug || item.id,
      title: item.title,
      subtitle: item.subtitle || '',
      description: item.description || '',
      category: item.category || 'General',
      image_url: item.image_url || '',
      key_features: Array.isArray(item.key_features) ? item.key_features : [],
      display_order: item.display_order ?? 1,
      is_active: item.is_active ?? true,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
    }));
  } catch {
    return getLocalApplications();
  }
}

export async function fetchPublicApplications(): Promise<ApplicationItem[]> {
  const all = await fetchAdminApplications();
  return all
    .filter((a) => a.is_active)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function fetchApplicationBySlug(slug: string): Promise<ApplicationItem | null> {
  const all = await fetchPublicApplications();
  return all.find((a) => a.slug === slug || a.id === slug) || null;
}

export async function saveApplication(
  app: Omit<ApplicationItem, 'created_at' | 'updated_at'> & { id?: string }
): Promise<ApplicationItem> {
  const now = new Date().toISOString();
  const id = app.id || 'app_' + Math.random().toString(36).substring(2, 9);
  const slug = app.slug || app.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const appToSave: ApplicationItem = {
    ...app,
    id,
    slug,
    created_at: now,
    updated_at: now,
  };

  const current = getLocalApplications();
  const index = current.findIndex((item) => item.id === id);
  let updated: ApplicationItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = appToSave;
  } else {
    updated = [...current, appToSave];
  }
  saveLocalApplications(updated);

  try {
    await supabase.from('applications').upsert({
      id: appToSave.id,
      slug: appToSave.slug,
      title: appToSave.title,
      subtitle: appToSave.subtitle,
      description: appToSave.description,
      category: appToSave.category,
      image_url: appToSave.image_url,
      key_features: appToSave.key_features,
      display_order: appToSave.display_order,
      is_active: appToSave.is_active,
      updated_at: now,
    });
  } catch (e) {
    console.warn('Supabase applications upsert fallback:', e);
  }

  return appToSave;
}

export async function deleteApplication(id: string): Promise<boolean> {
  const current = getLocalApplications();
  const updated = current.filter((a) => a.id !== id);
  saveLocalApplications(updated);

  try {
    await supabase.from('applications').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase applications delete fallback:', e);
  }
  return true;
}

export async function reorderApplications(apps: ApplicationItem[]): Promise<boolean> {
  const reordered = apps.map((a, index) => ({
    ...a,
    display_order: index + 1,
    updated_at: new Date().toISOString(),
  }));
  saveLocalApplications(reordered);

  try {
    const updates = reordered.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle,
      description: a.description,
      category: a.category,
      image_url: a.image_url,
      key_features: a.key_features,
      display_order: a.display_order,
      is_active: a.is_active,
      updated_at: a.updated_at,
    }));
    await supabase.from('applications').upsert(updates);
  } catch (e) {
    console.warn('Supabase reorder applications fallback:', e);
  }
  return true;
}
