-- ==========================================
-- SK Traders Supabase Database Setup Script
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xyyqlmkszozyvlkmotgw/sql
-- ==========================================

-- 1. Create footer_brands table
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.footer_brands ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for Anonymous Public Access (Read & Write)
DROP POLICY IF EXISTS "Allow public select on footer_brands" ON public.footer_brands;
CREATE POLICY "Allow public select on footer_brands"
  ON public.footer_brands FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public all on footer_brands" ON public.footer_brands;
CREATE POLICY "Allow public all on footer_brands"
  ON public.footer_brands FOR ALL USING (true) WITH CHECK (true);

-- 4. Create Storage Bucket 'cms_storage' for logo and image uploads (if not already existing)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms_storage', 'cms_storage', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Enable Public Storage Read & Write Policies
DROP POLICY IF EXISTS "Allow public access to cms_storage" ON storage.objects;
CREATE POLICY "Allow public access to cms_storage"
  ON storage.objects FOR ALL
  USING (bucket_id = 'cms_storage')
  WITH CHECK (bucket_id = 'cms_storage');
