import { supabase } from '@/lib/supabase';
import signifyVideo from '@/assets/09042026-signify-2026-16x9-12-sec.mp4';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  media_type: 'image' | 'video';
  image_url: string;
  video_url: string;
  button_text: string;
  button_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'sk_cms_heroes_v1';

export const INITIAL_HEROES: HeroSlide[] = [
  {
    id: 'hero-1',
    title: 'A Universe of Lights',
    subtitle: 'Lighting by Signify',
    description: 'Transform your environments with high-performance intelligent LED and smart architecture lighting solutions.',
    media_type: 'video',
    image_url: '/images/universe_of_lights.jpg',
    video_url: signifyVideo,
    button_text: 'Explore Catalogues',
    button_url: '#catalogues',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hero-2',
    title: 'The Shanghai Bund',
    subtitle: 'Lighting by Signify',
    description: 'Illuminating landmark riverfront architectural marvels with vibrant connected color dynamics.',
    media_type: 'image',
    image_url: '/images/shanghai_bund.jpg',
    video_url: '',
    button_text: 'Get Quote',
    button_url: '#contact',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hero-3',
    title: 'The London Eye',
    subtitle: 'Lighting by Signify',
    description: 'Iconic nighttime cityscape illumination designed with energy efficiency and high aesthetic precision.',
    media_type: 'image',
    image_url: '/images/london_eye.jpg',
    video_url: '',
    button_text: 'Learn More',
    button_url: '#resources',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hero-4',
    title: 'Maracana Stadium, Rio de Janeiro',
    subtitle: 'Lighting by Signify',
    description: 'Broadcast-compliant sports stadium floodlighting with instant dimming and stadium light show capabilities.',
    media_type: 'image',
    image_url: '/images/maracana_stadium.jpg',
    video_url: '',
    button_text: 'View Projects',
    button_url: '#projects',
    is_active: false,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getLocalHeroes(): HeroSlide[] {
  if (typeof window === 'undefined') return INITIAL_HEROES;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HEROES));
    return INITIAL_HEROES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_HEROES;
  }
}

export function saveLocalHeroes(heroes: HeroSlide[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(heroes));
  }
}

export async function fetchAdminHeroes(): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase
      .from('heroes')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase fetch heroes notice:', error);
      return getLocalHeroes();
    }

    // Auto-seed initial heroes to Supabase if table is empty
    if (!data || data.length === 0) {
      return getLocalHeroes();
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || '',
      description: item.description || '',
      media_type: item.media_type || (item.video_url ? 'video' : 'image'),
      image_url: item.image_url || '',
      video_url: item.video_url || '',
      button_text: item.button_text || 'Explore',
      button_url: item.button_url || '#',
      is_active: item.is_active ?? true,
      display_order: item.display_order ?? 1,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
    }));
  } catch {
    return getLocalHeroes();
  }
}

export async function fetchPublicHeroes(): Promise<HeroSlide[]> {
  const all = await fetchAdminHeroes();
  return all
    .filter((h) => h.is_active)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function saveHeroSlide(hero: Omit<HeroSlide, 'created_at' | 'updated_at'> & { id?: string }): Promise<HeroSlide> {
  const now = new Date().toISOString();
  const id = hero.id || 'hero_' + Math.random().toString(36).substring(2, 9);

  const slideToSave: HeroSlide = {
    ...hero,
    id,
    created_at: now,
    updated_at: now,
  };

  const current = getLocalHeroes();
  const index = current.findIndex((item) => item.id === id);
  let updated: HeroSlide[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = slideToSave;
  } else {
    updated = [...current, slideToSave];
  }
  saveLocalHeroes(updated);

  try {
    const { error } = await supabase.from('heroes').upsert({
      id: slideToSave.id,
      title: slideToSave.title,
      subtitle: slideToSave.subtitle,
      description: slideToSave.description,
      media_type: slideToSave.media_type,
      image_url: slideToSave.image_url,
      video_url: slideToSave.video_url,
      button_text: slideToSave.button_text,
      button_url: slideToSave.button_url,
      is_active: slideToSave.is_active,
      display_order: slideToSave.display_order,
      updated_at: now,
    });
    if (error) {
      console.warn('Supabase heroes upsert error:', error);
    }
  } catch (e) {
    console.warn('Supabase heroes upsert fallback:', e);
  }

  return slideToSave;
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  const current = getLocalHeroes();
  const updated = current.filter((h) => h.id !== id);
  saveLocalHeroes(updated);

  try {
    await supabase.from('heroes').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase heroes delete fallback:', e);
  }
  return true;
}
