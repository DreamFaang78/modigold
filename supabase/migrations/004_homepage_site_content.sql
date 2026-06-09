-- Requirement #3 — Task 8: Homepage Sections, Cards & Footer CMS
-- Idempotent: safe to re-run.  DROP POLICY IF EXISTS prevents duplicate-policy errors.
-- Run in Supabase Dashboard → SQL Editor → Run

-- ─── 1. Add is_active to usps if not already present ─────────────────────────
ALTER TABLE public.usps ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ─── 2. homepage_sections ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  section_key      TEXT                     PRIMARY KEY,
  eyebrow          TEXT                     DEFAULT '',
  title            TEXT                     DEFAULT '',
  highlighted_text TEXT                     DEFAULT '',
  description      TEXT                     DEFAULT '',
  cta_text         TEXT                     DEFAULT '',
  cta_link         TEXT                     DEFAULT '',
  metadata         JSONB                    DEFAULT '{}',
  is_active        BOOLEAN                  DEFAULT true,
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read homepage_sections" ON public.homepage_sections;
CREATE POLICY "public can read homepage_sections"
  ON public.homepage_sections
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "admin can write homepage_sections" ON public.homepage_sections;
CREATE POLICY "admin can write homepage_sections"
  ON public.homepage_sections
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Seed section rows (idempotent via ON CONFLICT DO NOTHING on PK)
INSERT INTO public.homepage_sections (section_key, eyebrow, title, highlighted_text)
VALUES ('modigold_advantage', 'WHY CHOOSE US', 'The Modigold', 'Advantage')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.homepage_sections (section_key, eyebrow, title, highlighted_text)
VALUES ('flexible_ordering', 'FLEXIBLE ORDERING', 'Buy Retail or Order Bulk —', 'Your Choice')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.homepage_sections (section_key, eyebrow, title, highlighted_text, metadata)
VALUES (
  'footer_main', 'FOOTER', 'Footer', '',
  '{
    "brand_blurb":      "Manufacturing premium PVC, UPVC, and HDPE pipes since 1996. Trusted by 500+ dealers across 15+ Indian states.",
    "factory_address":  "B-104 MIDC Butibori, Nagpur, MH 441122",
    "office_address":   "D-106, M.I.D.C., Hingna, Nagpur – 440016",
    "phone_numbers":    ["+91 9960 937 588", "+91 8329 369 356"],
    "email":            "sales@modigold.in"
  }'
)
ON CONFLICT (section_key) DO NOTHING;

-- ─── 3. homepage_cards ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.homepage_cards (
  id          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT                     NOT NULL REFERENCES public.homepage_sections(section_key) ON DELETE CASCADE,
  badge_text  TEXT                     DEFAULT '',
  title       TEXT                     NOT NULL,
  description TEXT                     DEFAULT '',
  icon_name   TEXT                     DEFAULT '',
  bullets     JSONB                    DEFAULT '[]',
  cta_text    TEXT                     DEFAULT '',
  cta_link    TEXT                     DEFAULT '',
  variant     TEXT                     DEFAULT '',
  order_index INTEGER                  NOT NULL,
  is_active   BOOLEAN                  DEFAULT true,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.homepage_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read homepage_cards" ON public.homepage_cards;
CREATE POLICY "public can read homepage_cards"
  ON public.homepage_cards
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "admin can write homepage_cards" ON public.homepage_cards;
CREATE POLICY "admin can write homepage_cards"
  ON public.homepage_cards
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Seed flexible_ordering cards (skip if already seeded)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.homepage_cards WHERE section_key = 'flexible_ordering'
  ) THEN
    INSERT INTO public.homepage_cards
      (section_key, badge_text, title, description, bullets, cta_text, cta_link, variant, order_index)
    VALUES
      (
        'flexible_ordering', 'BUY ONLINE', 'Retail Purchase',
        'Add to cart, pay via Razorpay (UPI, card, netbanking, wallets), and get delivered to your door. Available for garden pipes, spray nozzles and small SKUs.',
        '["Fixed retail price visible","Add to Cart + Instant Checkout","Prepaid, Partial COD, or Full COD","Live shipment tracking"]',
        'SHOP NOW', '/shop', 'retail', 0
      ),
      (
        'flexible_ordering', 'BULK ENQUIRY', 'Wholesale / Dealer',
        'For container loads, dealer purchases, or custom specs — submit an enquiry and our sales team will respond with competitive pricing within 24 hours.',
        '["Custom quantity & spec requests","Dealer & wholesale pricing","Dedicated sales support","Pan-India logistics network"]',
        'GET A QUOTE', '/enquiry', 'wholesale', 1
      );
  END IF;
END $$;

-- ─── 4. footer_link_groups ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.footer_link_groups (
  id          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  group_key   TEXT                     NOT NULL UNIQUE,
  group_title TEXT                     NOT NULL,
  order_index INTEGER                  NOT NULL,
  is_active   BOOLEAN                  DEFAULT true,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.footer_link_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read footer_link_groups" ON public.footer_link_groups;
CREATE POLICY "public can read footer_link_groups"
  ON public.footer_link_groups
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "admin can write footer_link_groups" ON public.footer_link_groups;
CREATE POLICY "admin can write footer_link_groups"
  ON public.footer_link_groups
  FOR ALL
  USING (auth.role() = 'authenticated');

INSERT INTO public.footer_link_groups (group_key, group_title, order_index)
VALUES
  ('quick_links',   'Quick Links', 0),
  ('product_links', 'Products',    1)
ON CONFLICT (group_key) DO NOTHING;

-- ─── 5. footer_links ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.footer_links (
  id          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  group_key   TEXT                     NOT NULL,
  label       TEXT                     NOT NULL,
  href        TEXT                     NOT NULL,
  order_index INTEGER                  NOT NULL,
  is_active   BOOLEAN                  DEFAULT true,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read footer_links" ON public.footer_links;
CREATE POLICY "public can read footer_links"
  ON public.footer_links
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "admin can write footer_links" ON public.footer_links;
CREATE POLICY "admin can write footer_links"
  ON public.footer_links
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Seed footer links (skip if already seeded)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.footer_links WHERE group_key = 'quick_links') THEN
    INSERT INTO public.footer_links (group_key, label, href, order_index)
    VALUES
      ('quick_links', 'Home',         '/',             0),
      ('quick_links', 'About Us',     '/about',        1),
      ('quick_links', 'Shop',         '/shop',         2),
      ('quick_links', 'Bulk Enquiry', '/bulk-enquiry', 3),
      ('quick_links', 'Track Order',  '/track-order',  4),
      ('quick_links', 'Contact Us',   '/contact',      5),
      ('quick_links', 'Admin Login',  '/admin',        6);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.footer_links WHERE group_key = 'product_links') THEN
    INSERT INTO public.footer_links (group_key, label, href, order_index)
    VALUES
      ('product_links', 'PVC / UPVC Pipes',        '/shop?category=pvc-upvc-pipes', 0),
      ('product_links', 'HDPE Pipes',               '/shop?category=hdpe-pipes',     1),
      ('product_links', 'LD / LDPE Pipes & Sheets', '/shop?category=ld-ldpe-pipes',  2),
      ('product_links', 'Garden Hoses & Pipes',     '/shop?category=garden-hoses',   3),
      ('product_links', 'Suction & Delivery Hoses', '/shop?category=suction-hoses',  4),
      ('product_links', 'Shade Nets',               '/shop?category=shade-nets',     5),
      ('product_links', 'Tarpaulins',               '/shop?category=tarpaulins',     6),
      ('product_links', 'Water Tanks',              '/shop?category=water-tanks',    7);
  END IF;
END $$;
