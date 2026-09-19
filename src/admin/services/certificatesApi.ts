import { supabase } from '@/lib/supabase';
import signifyCertificate from '@/assets/signify_certificate.jpg';

export interface CertificateItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  pdf_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'sk_cms_certificates_v1';

export const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-1',
    title: 'Signify Authorized Channel Partner Certificate',
    description: 'Official Corporate Certification & Compliance document verifying SK Traders as authorized Signify lighting distributor.',
    image_url: signifyCertificate,
    pdf_url: '',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cert-2',
    title: 'ISO 9001:2015 Quality Management System',
    description: 'International quality standard certification for lighting distribution and technical specification compliance.',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    pdf_url: '',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cert-3',
    title: 'ISO 14001:2015 Environmental Management',
    description: 'Certified commitment to eco-friendly LED sustainability, carbon footprint reduction, and energy efficiency.',
    image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    pdf_url: '',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getLocalCertificates(): CertificateItem[] {
  if (typeof window === 'undefined') return INITIAL_CERTIFICATES;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CERTIFICATES));
    return INITIAL_CERTIFICATES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CERTIFICATES;
  }
}

export function saveLocalCertificates(certs: CertificateItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
  }
}

export async function fetchAdminCertificates(): Promise<CertificateItem[]> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase fetch certificates notice:', error);
      return getLocalCertificates();
    }

    if (!data || data.length === 0) {
      try {
        const seedRows = INITIAL_CERTIFICATES.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          image_url: c.image_url,
          pdf_url: c.pdf_url,
          is_active: c.is_active,
          display_order: c.display_order,
          updated_at: c.updated_at,
        }));
        await supabase.from('certificates').upsert(seedRows);

        const { data: reFetched } = await supabase
          .from('certificates')
          .select('*')
          .order('display_order', { ascending: true });

        if (reFetched && reFetched.length > 0) {
          return reFetched.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            image_url: item.image_url || '',
            pdf_url: item.pdf_url || '',
            is_active: item.is_active ?? true,
            display_order: item.display_order ?? 1,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString(),
          }));
        }
      } catch (e) {
        console.warn('Auto-seed certificates error:', e);
      }
      return getLocalCertificates();
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      image_url: item.image_url || '',
      pdf_url: item.pdf_url || '',
      is_active: item.is_active ?? true,
      display_order: item.display_order ?? 1,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
    }));
  } catch {
    return getLocalCertificates();
  }
}

export async function fetchPublicCertificates(): Promise<CertificateItem[]> {
  const all = await fetchAdminCertificates();
  return all
    .filter((c) => c.is_active)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function saveCertificate(cert: Omit<CertificateItem, 'created_at' | 'updated_at'> & { id?: string }): Promise<CertificateItem> {
  const now = new Date().toISOString();
  const id = cert.id || 'cert_' + Math.random().toString(36).substring(2, 9);

  const certToSave: CertificateItem = {
    ...cert,
    id,
    created_at: now,
    updated_at: now,
  };

  const current = getLocalCertificates();
  const index = current.findIndex((item) => item.id === id);
  let updated: CertificateItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = certToSave;
  } else {
    updated = [...current, certToSave];
  }
  saveLocalCertificates(updated);

  try {
    const { error } = await supabase.from('certificates').upsert({
      id: certToSave.id,
      title: certToSave.title,
      description: certToSave.description,
      image_url: certToSave.image_url,
      pdf_url: certToSave.pdf_url,
      is_active: certToSave.is_active,
      display_order: certToSave.display_order,
      updated_at: now,
    });
    if (error) {
      console.warn('Supabase certificates upsert error:', error);
    }
  } catch (e) {
    console.warn('Supabase certificates upsert fallback:', e);
  }

  return certToSave;
}

export async function deleteCertificate(id: string): Promise<boolean> {
  const current = getLocalCertificates();
  const updated = current.filter((c) => c.id !== id);
  saveLocalCertificates(updated);

  try {
    await supabase.from('certificates').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase certificates delete fallback:', e);
  }
  return true;
}
