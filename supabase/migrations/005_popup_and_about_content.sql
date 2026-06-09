-- Requirement #3 — Task 9: Popup CMS + About Section CMS
-- Idempotent: safe to re-run.  DROP POLICY IF EXISTS prevents duplicate-policy errors.
-- Run in Supabase Dashboard → SQL Editor → Run

-- ─── 1. site_popups ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_popups (
  id                     UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  title                  TEXT                     NOT NULL,
  description            TEXT,
  badge_text             TEXT,
  image_url              TEXT,
  cta_text               TEXT,
  cta_link               TEXT,
  secondary_cta_text     TEXT,
  secondary_cta_link     TEXT,
  popup_type             TEXT                     DEFAULT 'modal',
  trigger_delay_seconds  INTEGER                  DEFAULT 2,
  display_frequency      TEXT                     DEFAULT 'once_per_session',
  start_at               TIMESTAMP WITH TIME ZONE,
  end_at                 TIMESTAMP WITH TIME ZONE,
  is_active              BOOLEAN                  DEFAULT false,
  order_index            INTEGER                  DEFAULT 1,
  updated_at             TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.site_popups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read site_popups"  ON public.site_popups;
CREATE POLICY "public can read site_popups"
  ON public.site_popups
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "admin can write site_popups"  ON public.site_popups;
CREATE POLICY "admin can write site_popups"
  ON public.site_popups
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Seed default (inactive) popup if none exists yet
INSERT INTO public.site_popups
  (title, badge_text, description, cta_text, cta_link,
   secondary_cta_text, secondary_cta_link, popup_type, is_active)
SELECT
  'Get Dealer Pricing',
  'BULK ENQUIRY',
  'Submit your requirement and our team will share competitive pricing within 24 hours.',
  'Get a Quote',
  '/bulk-enquiry',
  'Shop Online',
  '/shop',
  'modal',
  false
WHERE NOT EXISTS (SELECT 1 FROM public.site_popups LIMIT 1);

-- ─── 2. about_main in homepage_sections ───────────────────────────────────────
-- homepage_sections was created in migration 004 — just upsert the about row.
INSERT INTO public.homepage_sections
  (section_key, eyebrow, title, highlighted_text, description,
   cta_text, cta_link, metadata, is_active)
VALUES (
  'about_main',
  'SINCE 1996',
  'Premium Pipes Built for Indian Businesses',
  'Since 1996',
  'Manufacturing premium PVC, UPVC, and HDPE pipes with trusted quality, strong dealer relationships, and pan-India reach.',
  'Learn More',
  '/about',
  '{
    "image_url": "",
    "badge_text": "28+ Years of Trust",
    "features": [
      "ISI & BIS aligned quality standards",
      "Trusted by 500+ dealers",
      "Supplying across 15+ Indian states"
    ]
  }',
  true
)
ON CONFLICT (section_key) DO UPDATE
  SET
    eyebrow          = EXCLUDED.eyebrow,
    title            = EXCLUDED.title,
    highlighted_text = EXCLUDED.highlighted_text,
    description      = EXCLUDED.description,
    cta_text         = EXCLUDED.cta_text,
    cta_link         = EXCLUDED.cta_link,
    metadata         = EXCLUDED.metadata,
    is_active        = EXCLUDED.is_active,
    updated_at       = now()
  WHERE public.homepage_sections.section_key = 'about_main';
