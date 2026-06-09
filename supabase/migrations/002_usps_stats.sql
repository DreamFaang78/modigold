-- Requirement #3 — Task 5: usps and stats tables
-- Idempotent: safe to re-run. DROP POLICY IF EXISTS prevents duplicate-policy errors.
-- Run in Supabase Dashboard → SQL Editor → Run

-- ─── usps ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.usps (
  id          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT                     NOT NULL,
  description TEXT,
  icon_name   TEXT,
  order_index INTEGER                  NOT NULL UNIQUE,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.usps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read usps" ON public.usps;
CREATE POLICY "public can read usps"
  ON public.usps
  FOR SELECT
  USING (true);


-- ─── stats ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stats (
  id          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  label       TEXT                     NOT NULL,
  value       NUMERIC                  NOT NULL,
  prefix      TEXT,
  suffix      TEXT,
  order_index INTEGER                  NOT NULL UNIQUE,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read stats" ON public.stats;
CREATE POLICY "public can read stats"
  ON public.stats
  FOR SELECT
  USING (true);
