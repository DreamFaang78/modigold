-- Requirement #3 — Task 7: categories and products tables
-- Idempotent: safe to re-run.
-- Run in Supabase Dashboard → SQL Editor → Run

-- ─── categories ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT    NOT NULL UNIQUE,
  name        TEXT    NOT NULL,
  description TEXT,
  image_url   TEXT,
  icon_name   TEXT,
  order_index INTEGER NOT NULL UNIQUE,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read categories" ON public.categories;
CREATE POLICY "public can read categories"
  ON public.categories FOR SELECT USING (true);

-- ─── products ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT         NOT NULL UNIQUE,
  name           TEXT         NOT NULL,
  sku            TEXT         NOT NULL UNIQUE,
  category_id    UUID         REFERENCES public.categories(id) ON DELETE SET NULL,
  purchase_mode  TEXT         NOT NULL DEFAULT 'enquiry',
  price          NUMERIC,
  mrp            NUMERIC,
  bulk_threshold INTEGER,
  image_urls     TEXT[]       DEFAULT '{}',
  rating         NUMERIC(3,1) DEFAULT 0,
  review_count   INTEGER      DEFAULT 0,
  is_featured    BOOLEAN      DEFAULT FALSE,
  in_stock       BOOLEAN      DEFAULT TRUE,
  description    TEXT,
  specs          JSONB        DEFAULT '{}',
  tags           TEXT[]       DEFAULT '{}',
  updated_at     TIMESTAMPTZ  DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read products" ON public.products;
CREATE POLICY "public can read products"
  ON public.products FOR SELECT USING (true);

-- ─── seed categories (skip if already seeded) ────────────────────────────────
INSERT INTO public.categories (slug, name, description, image_url, icon_name, order_index) VALUES
  ('pvc-upvc-pipes',  'PVC / UPVC Pipes',           'uPVC casing, column, pressure & well casing pipes for agriculture and construction', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', 'pipe',     0),
  ('hdpe-pipes',      'HDPE Pipes',                  'High density polyethylene pipes for water supply, irrigation and sewerage systems',   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', 'pipeline', 1),
  ('ld-ldpe-pipes',   'LD / LDPE Pipes & Sheets',    'Lightweight low-density polyethylene pipes and barsati waterproof sheets',           'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&q=80', 'layers',   2),
  ('garden-hoses',    'Garden Hoses & Pipes',        'Flexible, durable garden hoses and pipes for home & farm irrigation',               'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', 'droplets', 3),
  ('suction-hoses',   'Suction & Delivery Hoses',    'PVC suction and delivery hose pipes for pumps, agriculture and industry',           'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', 'wave',     4),
  ('shade-nets',      'Shade Nets',                  'HDPE shade nets for greenhouses, agriculture, construction and sun protection',     'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80', 'sun',      5),
  ('tarpaulins',      'Tarpaulins',                  'Heavy-duty cross-laminated tarpaulins for agriculture, construction and storage',   'https://images.unsplash.com/photo-1558618047-f4e3b0e10e87?w=600&q=80', 'shield',   6),
  ('water-tanks',     'Water Tanks',                 'BIS certified food-grade water storage tanks for home, farm and industrial use',    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80', 'cylinder', 7)
ON CONFLICT (slug) DO NOTHING;

-- ─── seed products ────────────────────────────────────────────────────────────
INSERT INTO public.products (slug, name, sku, category_id, purchase_mode, price, mrp, bulk_threshold, image_urls, rating, review_count, is_featured, in_stock, description, specs, tags)
SELECT
  p.slug, p.name, p.sku,
  c.id AS category_id,
  p.purchase_mode, p.price, p.mrp, p.bulk_threshold,
  p.image_urls, p.rating, p.review_count, p.is_featured, p.in_stock,
  p.description, p.specs::jsonb, p.tags
FROM (VALUES
  ('garden-pipe-12mm-30m',    'Premium Garden Pipe 12mm × 30m',     'MG-GH-001', 'garden-hoses',   'buy_online', 499,  649,  50,  ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80'], 4.5, 128, true,  true, 'Modigold Premium Garden Pipe is manufactured from food-grade PVC compound, UV stabilised for outdoor durability.',  '{"Diameter":"12mm","Length":"30 metres","Material":"Food-grade PVC","Working Pressure":"4 kg/cm²","Color":"Green"}',               ARRAY['garden','hose','irrigation','home']),
  ('garden-pipe-19mm-50m',    'Heavy Duty Garden Pipe 19mm × 50m',  'MG-GH-002', 'garden-hoses',   'both',       1199, 1499, 20,  ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&sat=20'], 4.7, 84,  true,  true, 'Our 19mm heavy-duty garden pipe is engineered for farms and large gardens requiring high-volume water flow.',       '{"Diameter":"19mm","Length":"50 metres","Material":"PVC (3-layer)","Working Pressure":"6 kg/cm²","Color":"Green/Blue"}',          ARRAY['garden','hose','farm','heavy-duty']),
  ('upvc-casing-pipe-4in',    'uPVC Casing Pipe 4" (ISI Marked)',   'MG-UP-001', 'pvc-upvc-pipes', 'enquiry',    NULL, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'], 4.8, 56,  true,  true, 'ISI-certified uPVC well casing pipes designed for borewell and tube well applications.',                          '{"Diameter":"4 inch (100mm)","Length":"3 metres/piece","Material":"uPVC","Standard":"IS:12818","Wall Thickness":"5.5mm"}',         ARRAY['borewell','casing','upvc','isi']),
  ('hdpe-pipe-63mm',          'HDPE Pipe PN6 63mm',                 'MG-HD-001', 'hdpe-pipes',     'enquiry',    NULL, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'], 4.6, 43,  false, true, 'High-density polyethylene pipes conforming to IS:4984. Ideal for potable water supply, sewerage, and irrigation.', '{"Diameter":"63mm OD","Pressure Rating":"PN6 (6 kg/cm²)","Material":"HDPE (PE100)","Standard":"IS:4984","Color":"Black/blue"}',   ARRAY['hdpe','irrigation','water supply']),
  ('shade-net-50pc-green',    'Shade Net 50% Green (Agricultural)', 'MG-SN-001', 'shade-nets',     'enquiry',    NULL, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80'], 4.4, 39,  true,  true, 'HDPE mono filament shade net providing 50% light filtration. UV-stabilised for 5+ years outdoor life.',            '{"Shade %":"50%","Material":"HDPE Mono Filament","UV Stabilised":"Yes (5+ years)","Width":"Up to 4 metres","GSM":"40–45 GSM"}',   ARRAY['shade net','agriculture','greenhouse','nursery']),
  ('pvc-suction-hose-2in',    'PVC Suction Hose 2" (per metre)',    'MG-SH-001', 'suction-hoses',  'both',       180,  220,  100, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&hue=200'], 4.5, 67,  false, true, 'Heavy-duty PVC suction hose with rigid PVC helix reinforcement. Flexible even at low temperatures.',               '{"Bore":"2 inch (50mm)","Material":"PVC + PVC Helix","Working Pressure":"Vacuum rated","Temperature":"-10°C to +60°C"}',         ARRAY['suction hose','pump','agriculture','pvc']),
  ('tarpaulin-12x15ft-blue',  'Cross Laminated Tarpaulin 12×15 ft','MG-TP-001', 'tarpaulins',     'enquiry',    NULL, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1558618047-f4e3b0e10e87?w=600&q=80'], 4.3, 29,  false, true, 'Cross-laminated tarpaulins manufactured from HDPE fabric coated with LDPE on both sides. Waterproof.',            '{"Size":"12 × 15 ft","Material":"HDPE + LDPE laminated","GSM":"90–150 GSM","UV Stabilised":"Yes","Color":"Blue/Silver"}',        ARRAY['tarpaulin','waterproof','agriculture','construction']),
  ('water-tank-500l',         'Water Storage Tank 500 Litre',       'MG-WT-001', 'water-tanks',    'enquiry',    NULL, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80'], 4.7, 112, true,  true, 'BIS-certified triple-layer food-grade water storage tanks. UV-stabilised outer layer, anti-bacterial inner layer.','{"Capacity":"500 Litres","Layers":"3 (UV + insulation + food-grade)","Standard":"IS:12701 (BIS Certified)","Warranty":"5 Years"}', ARRAY['water tank','storage','bis certified','food grade']),
  ('garden-pipe-spray-nozzle-set','Garden Pipe + Spray Nozzle Set', 'MG-GH-010', 'garden-hoses',   'buy_online', 349,  449,  NULL,ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&bri=10'], 4.2, 203, false, true, '15-metre garden pipe bundled with a 7-pattern adjustable spray nozzle. Perfect home garden combo.',             '{"Pipe Length":"15 metres","Pipe Dia":"12mm","Nozzle Patterns":"7 modes","Connector":"Quick-release brass"}',                    ARRAY['garden','nozzle','combo','home']),
  ('upvc-column-pipe-1-25in', 'uPVC Column Pipe 1¼" (ISI)',         'MG-UP-010', 'pvc-upvc-pipes', 'enquiry',    NULL, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&sat=-20'], 4.6, 88, false, true, 'ISI-certified uPVC column pipes for submersible pump applications. Available in 3m and 6m lengths.',            '{"Bore":"1¼ inch","Standard":"IS:12818","Length":"3m / 6m","Thread":"BSP standard"}',                                           ARRAY['column pipe','submersible','upvc'])
) AS p(slug, name, sku, cat_slug, purchase_mode, price, mrp, bulk_threshold, image_urls, rating, review_count, is_featured, in_stock, description, specs, tags)
JOIN public.categories c ON c.slug = p.cat_slug
ON CONFLICT (slug) DO NOTHING;
