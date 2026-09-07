import { createClient } from '@supabase/supabase-js';

// Supabase Project Credentials provided by client
const SUPABASE_URL = 'https://xyyqlmkszozyvlkmotgw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_smK5LgQJbySJsIfcnK71yQ_Ridd-KOD';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface CatalogueItem {
  id: string;
  title: string;
  category: 'Residential' | 'Hospitals & Healthcare' | 'Commercial & Retail' | 'Construction & Infrastructure';
  fileUrl: string;
  imageUrl: string;
  description: string;
  pageCount: number;
  updatedAt: string;
}

export interface LightingProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  wattage: string;
  lumens: string;
  cct: string;
  application: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
}

export interface PaymentOrderRecord {
  id: string;
  orderNumber: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAddress: string;
  itemsSummary: string;
  amount: number;
  currency: string;
  paymentMethod: 'Razorpay' | 'UPI' | 'Card' | 'NetBanking';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  razorpayPaymentId?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isAdmin: boolean;
}

// Initial Mock Seed Data
const INITIAL_CATALOGUES: CatalogueItem[] = [
  {
    id: 'cat-res-2025',
    title: 'Philips Home Lighting Collection 2025',
    category: 'Residential',
    fileUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    imageUrl: '/images/hero_influencer.jpg',
    description: 'Complete luxury residential chandeliers, smart WiZ ambient LEDs, ceiling downlights & decorative pendants.',
    pageCount: 68,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-hosp-2025',
    title: 'Philips Healthcare & Hospital Lighting Specifier',
    category: 'Hospitals & Healthcare',
    fileUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    description: 'Cleanroom ISO-compliant ceiling troffers, anti-glare surgical lights & patient room circadian rhythm illumination.',
    pageCount: 52,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-const-2025',
    title: 'Philips Construction & Infrastructure Master Catalogue',
    category: 'Construction & Infrastructure',
    fileUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    description: 'High-bay industrial LED fixtures, IP66 waterproof floodlights, site safety floodlights & roadway streetlights.',
    pageCount: 94,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-comm-2025',
    title: 'Philips Commercial & Retail Architectural Solutions',
    category: 'Commercial & Retail',
    fileUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Edge-lit LED ceiling grid panels, track spotlights for retail galleries & smart office sensors.',
    pageCount: 44,
    updatedAt: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_KEYS = {
  CATALOGUES: 'sk_traders_catalogues_v1',
  PRODUCTS: 'sk_traders_products_v1',
  ORDERS: 'sk_traders_orders_v1',
  HERO: 'sk_traders_hero_v1',
  USER: 'sk_traders_user_v1',
};

// Storage helper functions (Syncing with LocalStorage & Supabase)
export function getLocalCatalogues(): CatalogueItem[] {
  if (typeof window === 'undefined') return INITIAL_CATALOGUES;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.CATALOGUES);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATALOGUES, JSON.stringify(INITIAL_CATALOGUES));
    return INITIAL_CATALOGUES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CATALOGUES;
  }
}

export function saveLocalCatalogues(catalogues: CatalogueItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATALOGUES, JSON.stringify(catalogues));
  }
}

export function getLocalOrders(): PaymentOrderRecord[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveLocalOrders(orders: PaymentOrderRecord[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }
}

// Supabase Async API wrapper functions with fallback support
export async function apiFetchCatalogues(): Promise<CatalogueItem[]> {
  try {
    const { data, error } = await supabase.from('catalogues').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return getLocalCatalogues();
    }
    return data.map((item: any) => ({
      id: item.id || item.title,
      title: item.title,
      category: item.category,
      fileUrl: item.file_url || item.fileUrl,
      imageUrl: item.image_url || item.imageUrl,
      description: item.description,
      pageCount: item.page_count || 50,
      updatedAt: item.updated_at || new Date().toISOString(),
    }));
  } catch (err) {
    return getLocalCatalogues();
  }
}

export async function apiSaveCatalogue(catalogue: CatalogueItem): Promise<boolean> {
  // Update local storage
  const current = getLocalCatalogues();
  const existingIdx = current.findIndex((c) => c.id === catalogue.id);
  let updated: CatalogueItem[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = catalogue;
  } else {
    updated = [catalogue, ...current];
  }
  saveLocalCatalogues(updated);

  // Attempt Supabase upsert
  try {
    await supabase.from('catalogues').upsert({
      id: catalogue.id,
      title: catalogue.title,
      category: catalogue.category,
      file_url: catalogue.fileUrl,
      image_url: catalogue.imageUrl,
      description: catalogue.description,
      page_count: catalogue.pageCount,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Supabase catalogue save fallback to local:', e);
  }
  return true;
}

export async function apiDeleteCatalogue(id: string): Promise<boolean> {
  const current = getLocalCatalogues();
  const updated = current.filter((c) => c.id !== id);
  saveLocalCatalogues(updated);
  try {
    await supabase.from('catalogues').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase catalogue delete fallback to local:', e);
  }
  return true;
}

export async function apiCreateOrder(order: Omit<PaymentOrderRecord, 'id' | 'createdAt'>): Promise<PaymentOrderRecord> {
  const newOrder: PaymentOrderRecord = {
    ...order,
    id: 'ord_' + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  };

  const current = getLocalOrders();
  saveLocalOrders([newOrder, ...current]);

  try {
    await supabase.from('orders').insert({
      id: newOrder.id,
      order_number: newOrder.orderNumber,
      user_name: newOrder.userName,
      user_email: newOrder.userEmail,
      user_phone: newOrder.userPhone,
      user_address: newOrder.userAddress,
      items_summary: newOrder.itemsSummary,
      amount: newOrder.amount,
      currency: newOrder.currency,
      payment_method: newOrder.paymentMethod,
      payment_status: newOrder.paymentStatus,
      razorpay_payment_id: newOrder.razorpayPaymentId,
      created_at: newOrder.createdAt,
    });
  } catch (e) {
    console.warn('Supabase order insert fallback to local:', e);
  }
  return newOrder;
}

export async function apiFetchOrders(): Promise<PaymentOrderRecord[]> {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return getLocalOrders();
    }
    return data.map((item: any) => ({
      id: item.id,
      orderNumber: item.order_number || item.orderNumber,
      userName: item.user_name || item.userName,
      userEmail: item.user_email || item.userEmail,
      userPhone: item.user_phone || item.userPhone,
      userAddress: item.user_address || item.userAddress,
      itemsSummary: item.items_summary || item.itemsSummary,
      amount: item.amount,
      currency: item.currency || 'INR',
      paymentMethod: item.payment_method || item.paymentMethod || 'Razorpay',
      paymentStatus: item.payment_status || item.paymentStatus || 'Paid',
      razorpayPaymentId: item.razorpay_payment_id || item.razorpayPaymentId,
      createdAt: item.created_at || item.createdAt || new Date().toISOString(),
    }));
  } catch (e) {
    return getLocalOrders();
  }
}
