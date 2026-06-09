-- Requirement #3 — Task 1: site_settings and hero_slides tables
-- Run in Supabase Dashboard → SQL Editor → Run

-- ─── site_settings ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  id             UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name     TEXT                     NOT NULL,
  logo_url       TEXT,
  phone_number   TEXT,
  email_address  TEXT,
  address        TEXT,
  social_links   JSONB,
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed one row so the app always has a record to UPDATE rather than INSERT.
INSERT INTO public.site_settings (brand_name)
VALUES ('Modigold')
ON CONFLICT DO NOTHING;

-- RLS: only the service-role key (server-side) can read/write this table.
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;


-- ─── hero_slides ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id                UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_tagline   TEXT                     NOT NULL,
  secondary_tagline TEXT,
  cta_text          TEXT,
  cta_link          TEXT,
  image_url         TEXT                     NOT NULL,
  order_index       INTEGER                  NOT NULL UNIQUE,
  is_active         BOOLEAN                  DEFAULT TRUE,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS: only the service-role key (server-side) can read/write this table.
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow public read of active slides so the public site can fetch them
-- without the service-role key (uses the anon key from server components).
DROP POLICY IF EXISTS "public can read active slides" ON public.hero_slides;
CREATE POLICY "public can read active slides"
  ON public.hero_slides
  FOR SELECT
  USING (is_active = TRUE);
