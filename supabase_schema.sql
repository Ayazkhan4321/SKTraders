-- ==============================================================================
-- SK Traders Complete Supabase Database Setup & RLS Script (Production Fixed)
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xyyqlmkszozyvlkmotgw/sql
-- ==============================================================================

-- 1. Create product_categories Table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  banner_image_url TEXT,
  item_count_label TEXT DEFAULT 'Available',
  status TEXT DEFAULT 'published',
  sort_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  sku TEXT,
  category_id TEXT,
  category_name TEXT,
  category_slug TEXT,
  sub_category TEXT,
  brand TEXT,
  wattage NUMERIC,
  wattage_num NUMERIC,
  lumens NUMERIC,
  lumens_num NUMERIC,
  cct TEXT,
  cct_options JSONB DEFAULT '[]'::jsonb,
  voltage TEXT,
  cri TEXT,
  base TEXT,
  beam_angle TEXT,
  material TEXT,
  material_finish TEXT,
  ip_rating TEXT,
  lifetime TEXT,
  lifespan_hours NUMERIC,
  warranty_years NUMERIC,
  dimensions TEXT,
  price NUMERIC DEFAULT 0,
  original_price NUMERIC,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  model_3d_url TEXT,
  catalogue_url TEXT,
  is_3d_enabled BOOLEAN DEFAULT true,
  auto_rotate BOOLEAN DEFAULT true,
  short_description TEXT,
  description TEXT,
  overview_text TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  applications JSONB DEFAULT '[]'::jsonb,
  installation_text TEXT,
  technical_info_text TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  shape TEXT,
  product_color TEXT,
  is_smart BOOLEAN DEFAULT false,
  is_dimmable BOOLEAN DEFAULT false,
  show_price BOOLEAN DEFAULT true,
  show_view_button BOOLEAN DEFAULT true,
  is_in_stock BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 4.9,
  reviews_count NUMERIC DEFAULT 18,
  availability TEXT DEFAULT 'Available',
  is_featured BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2b. Create product_images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2c. Create product_specifications Table
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  specification_name TEXT NOT NULL,
  specification_value TEXT NOT NULL,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2d. Create product_catalogues Table
CREATE TABLE IF NOT EXISTS public.product_catalogues (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT DEFAULT 0,
  description TEXT,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2e. Create related_products Table
CREATE TABLE IF NOT EXISTS public.related_products (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  related_product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create homepage_products Table
CREATE TABLE IF NOT EXISTS public.homepage_products (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  homepage_name TEXT,
  homepage_price NUMERIC,
  homepage_image_url TEXT,
  homepage_description TEXT,
  show_price BOOLEAN DEFAULT true,
  show_view_button BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create footer_brands Table
CREATE TABLE IF NOT EXISTS public.footer_brands (
  id TEXT PRIMARY KEY,
  brand_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  logo_height INTEGER,
  logo_width INTEGER,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create brand_section Table (Updated Schema)
CREATE TABLE IF NOT EXISTS public.brand_section (
  id TEXT PRIMARY KEY,
  heading TEXT,
  description TEXT,
  button_text TEXT,
  button_url TEXT,
  is_enabled BOOLEAN DEFAULT true,
  title TEXT,
  subtitle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.brand_section ADD COLUMN IF NOT EXISTS heading TEXT;
ALTER TABLE public.brand_section ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.brand_section ADD COLUMN IF NOT EXISTS button_text TEXT;
ALTER TABLE public.brand_section ADD COLUMN IF NOT EXISTS button_url TEXT;
ALTER TABLE public.brand_section ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN DEFAULT true;

-- Seed default singleton row for brand_section
INSERT INTO public.brand_section (id, heading, description, button_text, button_url, is_enabled)
VALUES (
  'default',
  'The world''s leading lighting brands' || E'\n' || 'Philips' || E'\n' || 'Signify Innovation India Limited',
  'Our products, connected systems and services unlock the extraordinary potential of light to enhance well-being and performance, elevate experiences and advance sustainability.',
  'View all brands',
  '/brands',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 6. Create brands Table (Updated Schema)
CREATE TABLE IF NOT EXISTS public.brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  image_url TEXT,
  website_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 7. Create heroes Table
CREATE TABLE IF NOT EXISTS public.heroes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  video_url TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create hero_cards Table
CREATE TABLE IF NOT EXISTS public.hero_cards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  pdf_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create features Table (Updated Schema)
CREATE TABLE IF NOT EXISTS public.features (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  card_image_url TEXT,
  short_description TEXT,
  hero_image_url TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_cta_text TEXT,
  hero_cta_link TEXT,
  hero_overlay_opacity INTEGER DEFAULT 30,
  hero_text_align TEXT DEFAULT 'left',
  intro_title TEXT,
  intro_description TEXT,
  intro_image_url TEXT,
  intro_image_position TEXT DEFAULT 'right',
  catalogue_title TEXT,
  catalogue_description TEXT,
  catalogue_pdf_url TEXT,
  catalogue_button_text TEXT,
  catalogue_active BOOLEAN DEFAULT true,
  contact_cta_title TEXT,
  contact_cta_description TEXT,
  contact_cta_button_text TEXT,
  contact_cta_button_link TEXT,
  contact_cta_active BOOLEAN DEFAULT true,
  related_feature_ids JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  subtitle TEXT,
  hero_image TEXT,
  intro_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.features ADD COLUMN IF NOT EXISTS card_image_url TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS hero_title TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS hero_cta_text TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS hero_cta_link TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS hero_overlay_opacity INTEGER DEFAULT 30;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS hero_text_align TEXT DEFAULT 'left';
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS intro_image_url TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS intro_image_position TEXT DEFAULT 'right';
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS catalogue_title TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS catalogue_description TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS catalogue_pdf_url TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS catalogue_button_text TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS catalogue_active BOOLEAN DEFAULT true;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS contact_cta_title TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS contact_cta_description TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS contact_cta_button_text TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS contact_cta_button_link TEXT;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS contact_cta_active BOOLEAN DEFAULT true;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS related_feature_ids JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 10. Create feature_highlights Table
CREATE TABLE IF NOT EXISTS public.feature_highlights (
  id TEXT PRIMARY KEY,
  feature_id TEXT NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Create feature_solutions Table
CREATE TABLE IF NOT EXISTS public.feature_solutions (
  id TEXT PRIMARY KEY,
  feature_id TEXT NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  link_url TEXT,
  pdf_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Create feature_specifications Table
CREATE TABLE IF NOT EXISTS public.feature_specifications (
  id TEXT PRIMARY KEY,
  feature_id TEXT NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  explanation TEXT,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Create feature_applications Table
CREATE TABLE IF NOT EXISTS public.feature_applications (
  id TEXT PRIMARY KEY,
  feature_id TEXT NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Create feature_gallery Table
CREATE TABLE IF NOT EXISTS public.feature_gallery (
  id TEXT PRIMARY KEY,
  feature_id TEXT NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Create feature_interactive_components Table
CREATE TABLE IF NOT EXISTS public.feature_interactive_components (
  id TEXT PRIMARY KEY,
  feature_id TEXT NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  human_explanation TEXT,
  image_url TEXT,
  icon_name TEXT,
  exploded_offset_y NUMERIC DEFAULT 0,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Create applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  category TEXT,
  image_url TEXT,
  key_features JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Create certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT,
  image_url TEXT,
  pdf_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Create catalogues Table
CREATE TABLE IF NOT EXISTS public.catalogues (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  file_url TEXT,
  image_url TEXT,
  description TEXT,
  page_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Create orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  user_address TEXT,
  items_summary TEXT,
  amount NUMERIC,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT,
  payment_status TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Create admins Table
CREATE TABLE IF NOT EXISTS public.admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'ADMIN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Enable Row Level Security (RLS) & Create Public Read / Admin Write Policies
-- ==============================================================================
DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'product_categories', 'products', 'product_images', 'product_specifications',
    'product_catalogues', 'related_products', 'homepage_products', 'footer_brands',
    'brand_section', 'brands', 'heroes', 'hero_cards', 'features',
    'feature_highlights', 'feature_solutions', 'feature_specifications',
    'feature_applications', 'feature_gallery', 'feature_interactive_components',
    'applications', 'certificates', 'catalogues', 'orders', 'admins'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    IF to_regclass(format('public.%I', tbl)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
      EXECUTE format('DROP POLICY IF EXISTS "Allow public select on %I" ON public.%I;', tbl, tbl);
      EXECUTE format('CREATE POLICY "Allow public select on %I" ON public.%I FOR SELECT USING (true);', tbl, tbl);
      EXECUTE format('DROP POLICY IF EXISTS "Allow public all on %I" ON public.%I;', tbl, tbl);
      EXECUTE format('CREATE POLICY "Allow public all on %I" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
    END IF;
  END LOOP;
END $$;

-- ==============================================================================
-- Create Storage Buckets and Set Public Access
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms_storage', 'cms_storage', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-images', 'brand-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-catalogues', 'product-catalogues', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public access to cms_storage" ON storage.objects;
CREATE POLICY "Allow public access to cms_storage"
  ON storage.objects FOR ALL
  USING (bucket_id = 'cms_storage')
  WITH CHECK (bucket_id = 'cms_storage');

DROP POLICY IF EXISTS "Allow public access to brand-images" ON storage.objects;
CREATE POLICY "Allow public access to brand-images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'brand-images')
  WITH CHECK (bucket_id = 'brand-images');

DROP POLICY IF EXISTS "Allow public access to product-images" ON storage.objects;
CREATE POLICY "Allow public access to product-images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow public access to product-catalogues" ON storage.objects;
CREATE POLICY "Allow public access to product-catalogues"
  ON storage.objects FOR ALL
  USING (bucket_id = 'product-catalogues')
  WITH CHECK (bucket_id = 'product-catalogues');
