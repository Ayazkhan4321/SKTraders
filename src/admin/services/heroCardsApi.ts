import { supabase } from '@/lib/supabase';

export interface HeroCardItem {
  id: string;
  title: string;
  short_description: string;
  description: string;
  image_url: string;
  pdf_url?: string;
  pdf_name?: string;
  button_text: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'sk_cms_hero_cards_v1';

export const INITIAL_HERO_CARDS: HeroCardItem[] = [
  {
    id: 'card-1',
    title: 'Ceiling Design Lights',
    short_description: 'Elegant architectural ceiling solutions that illuminate and transform modern interiors.',
    description: 'Featuring LineaBright, LineaGlow, ColorMagic 3-in-1, ProGlow Nxt, Sharp COB, Aura StylEdge, and DuraSlim ceiling lights.',
    image_url: '/images/card_ceiling_design_lights.jpg',
    pdf_url: '/catalogues/Home Decorative Lighting catalogue - Year 2025 - Final.pdf',
    pdf_name: 'Home Decorative Lighting Catalogue 2025.pdf',
    button_text: 'View PDF Catalogue',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'card-2',
    title: 'Decorative & Smart Fans',
    short_description: 'Powerful, whisper-quiet BLDC energy efficient fans with smart remote connectivity.',
    description: 'Official Philips Premium Decorative & Smart Fans Master Specification Catalogue featuring silent BLDC motor technology.',
    image_url: '/images/card_fans.jpg',
    pdf_url: '/catalogues/Fans Catalogue 2026.pdf',
    pdf_name: 'Decorative & Smart Fans Catalogue 2026.pdf',
    button_text: 'View PDF Catalogue',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'card-3',
    title: 'Smart LED Bulbs & Trade',
    short_description: 'WiZ connected lighting, customizable color temperatures, and trade specification series.',
    description: 'Philips Trade & Professional Specification Catalogue featuring smart LED bulbs, WiZ connected lighting, and commercial troffers.',
    image_url: '/images/card_smart_led_bulb.jpg',
    pdf_url: '/catalogues/Philips Trade Catalogue 2024-25.pdf',
    pdf_name: 'Philips Trade & Smart LED Catalogue 2024-25.pdf',
    button_text: 'View PDF Catalogue',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'card-4',
    title: 'Modern LED Architectural Lighting',
    short_description: 'Sleek, stylish recessed panels and linear luminaires engineered for zero glare.',
    description: 'Sleek architectural LED strips and magnetic track profile lights for luxury residences and offices.',
    image_url: '/images/card_modern_led_lighting.jpg',
    pdf_url: '',
    pdf_name: '',
    button_text: 'Learn More',
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'card-5',
    title: 'Outdoor & Facade Lighting',
    short_description: 'Durable IP66 weatherproof floodlights, bollards, and facade wall washers.',
    description: 'High durability outdoor landscape luminaires engineered to withstand extreme climates and environmental exposure.',
    image_url: '/images/card_outdoor_lighting.jpg',
    pdf_url: '',
    pdf_name: '',
    button_text: 'Explore Outdoor',
    is_active: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'card-6',
    title: 'Commercial & Office Lumina',
    short_description: 'High performance workspace illumination designed for employee wellness and focus.',
    description: 'Commercial grid panel troffers, intelligent occupancy sensors, and human-centric circadian office lighting.',
    image_url: '/images/card_commercial_office.jpg',
    pdf_url: '',
    pdf_name: '',
    button_text: 'View Solutions',
    is_active: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getLocalHeroCards(): HeroCardItem[] {
  if (typeof window === 'undefined') return INITIAL_HERO_CARDS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HERO_CARDS));
    return INITIAL_HERO_CARDS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_HERO_CARDS;
  }
}

export function saveLocalHeroCards(cards: HeroCardItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }
}

export async function fetchAdminHeroCards(): Promise<HeroCardItem[]> {
  try {
    const { data, error } = await supabase
      .from('hero_cards')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase fetch hero_cards notice:', error);
      return getLocalHeroCards();
    }

    if (!data || data.length === 0) {
      try {
        const seedRows = INITIAL_HERO_CARDS.map((c) => ({
          id: c.id,
          title: c.title,
          short_description: c.short_description,
          description: c.description,
          image_url: c.image_url,
          pdf_url: c.pdf_url,
          pdf_name: c.pdf_name,
          button_text: c.button_text,
          is_active: c.is_active,
          display_order: c.display_order,
          updated_at: c.updated_at,
        }));
        await supabase.from('hero_cards').upsert(seedRows);

        const { data: reFetched } = await supabase
          .from('hero_cards')
          .select('*')
          .order('display_order', { ascending: true });

        if (reFetched && reFetched.length > 0) {
          return reFetched.map((item: any) => ({
            id: item.id,
            title: item.title,
            short_description: item.short_description || item.description || '',
            description: item.description || '',
            image_url: item.image_url || '',
            pdf_url: item.pdf_url || '',
            pdf_name: item.pdf_name || '',
            button_text: item.button_text || 'View PDF',
            is_active: item.is_active ?? true,
            display_order: item.display_order ?? 1,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString(),
          }));
        }
      } catch (e) {
        console.warn('Auto-seed hero_cards error:', e);
      }
      return getLocalHeroCards();
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      short_description: item.short_description || item.description || '',
      description: item.description || '',
      image_url: item.image_url || '',
      pdf_url: item.pdf_url || '',
      pdf_name: item.pdf_name || '',
      button_text: item.button_text || 'View PDF',
      is_active: item.is_active ?? true,
      display_order: item.display_order ?? 1,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
    }));
  } catch {
    return getLocalHeroCards();
  }
}

export async function fetchPublicHeroCards(): Promise<HeroCardItem[]> {
  const all = await fetchAdminHeroCards();
  return all
    .filter((c) => c.is_active)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function saveHeroCard(card: Omit<HeroCardItem, 'created_at' | 'updated_at'> & { id?: string }): Promise<HeroCardItem> {
  const now = new Date().toISOString();
  const id = card.id || 'card_' + Math.random().toString(36).substring(2, 9);

  const cardToSave: HeroCardItem = {
    ...card,
    id,
    created_at: now,
    updated_at: now,
  };

  const current = getLocalHeroCards();
  const index = current.findIndex((item) => item.id === id);
  let updated: HeroCardItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = cardToSave;
  } else {
    updated = [...current, cardToSave];
  }
  saveLocalHeroCards(updated);

  try {
    const { error } = await supabase.from('hero_cards').upsert({
      id: cardToSave.id,
      title: cardToSave.title,
      short_description: cardToSave.short_description,
      description: cardToSave.description,
      image_url: cardToSave.image_url,
      pdf_url: cardToSave.pdf_url,
      pdf_name: cardToSave.pdf_name,
      button_text: cardToSave.button_text,
      is_active: cardToSave.is_active,
      display_order: cardToSave.display_order,
      updated_at: now,
    });
    if (error) {
      console.warn('Supabase hero_cards upsert error:', error);
    }
  } catch (e) {
    console.warn('Supabase hero_cards upsert fallback:', e);
  }

  return cardToSave;
}

export async function deleteHeroCard(id: string): Promise<boolean> {
  const current = getLocalHeroCards();
  const updated = current.filter((c) => c.id !== id);
  saveLocalHeroCards(updated);

  try {
    await supabase.from('hero_cards').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase hero_cards delete fallback:', e);
  }
  return true;
}
