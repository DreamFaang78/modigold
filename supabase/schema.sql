-- Modigold CMS — content storage table.
-- Run this once in your Supabase project: Dashboard → SQL Editor → paste → Run.

create table if not exists public.site_content (
  id          text primary key default 'singleton',
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Seed the single row the app reads/writes.
insert into public.site_content (id, data)
values ('singleton', '{}'::jsonb)
on conflict (id) do nothing;

-- Lock the table down. The website talks to this table ONLY from the server
-- using the service-role key (which bypasses RLS), so no public policies are
-- needed. With RLS on and no policies, the public anon key can't touch it.
alter table public.site_content enable row level security;
