// SERVER-ONLY content store. Do not import from Client Components.
//
// Storage strategy:
//   Supabase (when env vars are set):
//     • brand/contact       → public.site_settings     (Section 4.2 schema)
//     • hero slides         → public.hero_slides        (Section 4.2 schema)
//     • USP cards           → public.usps               (Section 4.2 schema)
//     • homepage sections   → public.homepage_sections
//     • homepage cards      → public.homepage_cards
//     • footer link groups  → public.footer_link_groups
//     • footer links        → public.footer_links
//   Local file (dev / demo, no Supabase env):
//     • .data/site-content.json + in-memory defaults from cms-schema.ts

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createSupabaseAdminClient } from '@/lib/supabase';
import { sanitizeContent, DEFAULT_CONTENT, type SiteContent, type HeroSlide, type UspItem } from './schema';
import {
  DEFAULT_HOMEPAGE_SECTIONS, DEFAULT_ORDERING_CARDS, DEFAULT_FOOTER_CONTENT,
  DEFAULT_ABOUT_SECTION, DEFAULT_POPUP,
  DEFAULT_CONTACT_HERO, DEFAULT_CONTACT_FORM_SECTION, DEFAULT_CONTACT_INFO_CARDS,
  DEFAULT_BULK_HERO, DEFAULT_BULK_FORM_SECTION, DEFAULT_BULK_BENEFIT_CARDS,
  type HomepageSection, type HomepageCard, type FooterLinkGroup, type FooterLink, type FooterContent,
  type SitePopup, type ContactPageContent, type BulkEnquiryPageContent,
} from './cms-schema';

// ── env detection ─────────────────────────────────────────────────────────────

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USE_SUPABASE = Boolean(
  SUPA_URL && SUPA_KEY &&
  !SUPA_URL.includes('your-project') &&
  !SUPA_KEY.includes('your-'),
);

export type StorageMode = 'supabase' | 'file';
export function storageMode(): StorageMode {
  return USE_SUPABASE ? 'supabase' : 'file';
}

// ── local file fallback ───────────────────────────────────────────────────────

const FILE = path.join(process.cwd(), '.data', 'site-content.json');

async function readFile(): Promise<unknown> {
  try { return JSON.parse(await fs.readFile(FILE, 'utf8')); }
  catch { return {}; }
}

async function writeFile(data: SiteContent): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ── site_settings ─────────────────────────────────────────────────────────────

async function readSiteSettings(): Promise<Partial<SiteContent['brand']>> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from('site_settings')
    .select('brand_name, phone_number, email_address, address, social_links')
    .limit(1)
    .single();

  if (error || !data) return {};

  const sl = (data.social_links ?? {}) as Record<string, string>;
  return {
    name:           data.brand_name  ?? DEFAULT_CONTENT.brand.name,
    phonePrimary:   data.phone_number ?? DEFAULT_CONTENT.brand.phonePrimary,
    email:          data.email_address ?? DEFAULT_CONTENT.brand.email,
    addressFactory: data.address      ?? DEFAULT_CONTENT.brand.addressFactory,
    heroLabel:      sl.heroLabel      ?? DEFAULT_CONTENT.brand.heroLabel,
    phoneSecondary: sl.phoneSecondary ?? DEFAULT_CONTENT.brand.phoneSecondary,
    whatsapp:       sl.whatsapp       ?? DEFAULT_CONTENT.brand.whatsapp,
    addressOffice:  sl.addressOffice  ?? DEFAULT_CONTENT.brand.addressOffice,
  };
}

async function writeSiteSettings(brand: SiteContent['brand']): Promise<void> {
  const db = createSupabaseAdminClient();
  const { data: existing } = await db
    .from('site_settings')
    .select('id')
    .limit(1)
    .single();

  const payload = {
    brand_name:    brand.name,
    phone_number:  brand.phonePrimary,
    email_address: brand.email,
    address:       brand.addressFactory,
    social_links: {
      heroLabel:      brand.heroLabel,
      phoneSecondary: brand.phoneSecondary,
      whatsapp:       brand.whatsapp,
      addressOffice:  brand.addressOffice,
    },
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await db.from('site_settings').update(payload).eq('id', existing.id);
    if (error) throw new Error(`site_settings update failed: ${error.message}`);
  } else {
    const { error } = await db.from('site_settings').insert(payload);
    if (error) throw new Error(`site_settings insert failed: ${error.message}`);
  }
}

// ── hero_slides ───────────────────────────────────────────────────────────────

async function readHeroSlides(): Promise<HeroSlide[]> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from('hero_slides')
    .select('id, primary_tagline, secondary_tagline, cta_text, cta_link, image_url, order_index, is_active')
    .order('order_index', { ascending: true });

  if (error || !data?.length) return DEFAULT_CONTENT.hero.slides;

  return data.map((row) => ({
    id:      row.id,
    headline: row.primary_tagline,
    subtext:  row.secondary_tagline ?? '',
    cta1: {
      label: row.cta_text ?? 'Explore Products',
      href:  row.cta_link ?? '/shop',
    },
    // cta2 / overlay are not in the Section 4.2 schema — use defaults
    cta2:    DEFAULT_CONTENT.hero.slides[0]?.cta2 ?? { label: 'Get a Quote', href: '/enquiry' },
    image:   row.image_url,
    overlay: 'rgba(26,35,64,0.65)',
  }));
}

async function writeHeroSlides(slides: HeroSlide[]): Promise<void> {
  const db = createSupabaseAdminClient();

  // Delete all then re-insert — simpler than diffing UUIDs.
  const { error: delErr } = await db
    .from('hero_slides')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) throw new Error(`hero_slides delete failed: ${delErr.message}`);

  if (!slides.length) return;

  const rows = slides.map((s, i) => ({
    primary_tagline:   s.headline,
    secondary_tagline: s.subtext,
    cta_text:          s.cta1.label,
    cta_link:          s.cta1.href,
    image_url:         s.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85',
    order_index:       i,
    is_active:         true,
    updated_at:        new Date().toISOString(),
  }));

  const { error } = await db.from('hero_slides').insert(rows);
  if (error) throw new Error(`hero_slides insert failed: ${error.message}`);
}

// ── usps ──────────────────────────────────────────────────────────────────────

async function readUsps(): Promise<UspItem[]> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from('usps')
    .select('title, description, icon_name, order_index')
    .order('order_index', { ascending: true });

  if (error || !data?.length) return DEFAULT_CONTENT.usps;

  return data.map((row) => ({
    title:       row.title,
    description: row.description ?? '',
    icon:        row.icon_name   ?? 'award',
  }));
}

async function writeUsps(usps: UspItem[]): Promise<void> {
  const db = createSupabaseAdminClient();

  // Delete all then re-insert — consistent with hero_slides strategy.
  const { error: delErr } = await db
    .from('usps')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) throw new Error(`usps delete failed: ${delErr.message}`);

  if (!usps.length) return;

  const rows = usps.map((u, i) => ({
    title:       u.title,
    description: u.description,
    icon_name:   u.icon,
    order_index: i,
    updated_at:  new Date().toISOString(),
  }));

  const { error } = await db.from('usps').insert(rows);
  if (error) throw new Error(`usps insert failed: ${error.message}`);
}

// ── public API ────────────────────────────────────────────────────────────────

/** Read the live site content, always returning a complete, valid object. */
export async function getContent(): Promise<SiteContent> {
  if (!USE_SUPABASE) return sanitizeContent(await readFile());

  const [brandPartial, slides, usps] = await Promise.all([
    readSiteSettings(),
    readHeroSlides(),
    readUsps(),
  ]);

  return sanitizeContent({
    brand: { ...DEFAULT_CONTENT.brand, ...brandPartial },
    hero:  { slides },
    usps,
  });
}

// ── cms helpers ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSection(r: any): HomepageSection {
  return {
    sectionKey:      r.section_key      as string,
    eyebrow:         (r.eyebrow         as string)  || '',
    title:           (r.title           as string)  || '',
    highlightedText: (r.highlighted_text as string) || '',
    description:     (r.description     as string)  || '',
    ctaText:         (r.cta_text        as string)  || '',
    ctaLink:         (r.cta_link        as string)  || '',
    metadata:        (r.metadata as Record<string, unknown>) ?? {},
    isActive:        (r.is_active as boolean) ?? true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCard(r: any): HomepageCard {
  return {
    id:          r.id          as string,
    sectionKey:  r.section_key as string,
    badgeText:   (r.badge_text  as string)   || '',
    title:       (r.title       as string)   || '',
    description: (r.description as string)   || '',
    iconName:    (r.icon_name   as string)   || '',
    bullets:     Array.isArray(r.bullets) ? (r.bullets as string[]) : [],
    ctaText:     (r.cta_text    as string)   || '',
    ctaLink:     (r.cta_link    as string)   || '',
    variant:     (r.variant     as string)   || '',
    orderIndex:  (r.order_index as number)   ?? 0,
    isActive:    (r.is_active   as boolean)  ?? true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGroup(r: any): FooterLinkGroup {
  return {
    id:         r.id          as string,
    groupKey:   r.group_key   as string,
    groupTitle: r.group_title as string,
    orderIndex: (r.order_index as number) ?? 0,
    isActive:   (r.is_active  as boolean) ?? true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLink(r: any): FooterLink {
  return {
    id:         r.id          as string,
    groupKey:   r.group_key   as string,
    label:      r.label       as string,
    href:       r.href        as string,
    orderIndex: (r.order_index as number) ?? 0,
    isActive:   (r.is_active  as boolean) ?? true,
  };
}

// ── homepage_sections ─────────────────────────────────────────────────────────

export async function getHomepageSections(): Promise<HomepageSection[]> {
  if (!USE_SUPABASE) return DEFAULT_HOMEPAGE_SECTIONS;

  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from('homepage_sections')
    .select('*')
    .order('section_key', { ascending: true });

  if (error || !data?.length) return DEFAULT_HOMEPAGE_SECTIONS;
  return data.map(mapSection);
}

export async function getHomepageSection(key: string): Promise<HomepageSection> {
  const fallback =
    DEFAULT_HOMEPAGE_SECTIONS.find((s) => s.sectionKey === key) ??
    (key === 'about_main' ? DEFAULT_ABOUT_SECTION : DEFAULT_HOMEPAGE_SECTIONS[0]);

  if (!USE_SUPABASE) return fallback;

  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from('homepage_sections')
    .select('*')
    .eq('section_key', key)
    .single();

  if (error || !data) return fallback;
  return mapSection(data);
}

export async function updateHomepageSection(
  key: string,
  patch: Partial<Pick<HomepageSection, 'eyebrow' | 'title' | 'highlightedText' | 'description' | 'ctaText' | 'ctaLink' | 'metadata'>>,
): Promise<void> {
  if (!USE_SUPABASE) return;
  const db = createSupabaseAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = { updated_at: new Date().toISOString() };
  if (patch.eyebrow         !== undefined) payload.eyebrow          = patch.eyebrow;
  if (patch.title           !== undefined) payload.title            = patch.title;
  if (patch.highlightedText !== undefined) payload.highlighted_text = patch.highlightedText;
  if (patch.description     !== undefined) payload.description      = patch.description;
  if (patch.ctaText         !== undefined) payload.cta_text         = patch.ctaText;
  if (patch.ctaLink         !== undefined) payload.cta_link         = patch.ctaLink;
  if (patch.metadata        !== undefined) payload.metadata         = patch.metadata;

  const { error } = await db
    .from('homepage_sections')
    .upsert({ section_key: key, ...payload }, { onConflict: 'section_key' });
  if (error) throw new Error(`homepage_sections update failed: ${error.message}`);
}

// ── homepage_cards ────────────────────────────────────────────────────────────

export async function getHomepageCards(sectionKey: string): Promise<HomepageCard[]> {
  const fallback = DEFAULT_ORDERING_CARDS.filter((c) => c.sectionKey === sectionKey);
  if (!USE_SUPABASE) return fallback;

  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from('homepage_cards')
    .select('*')
    .eq('section_key', sectionKey)
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error || !data?.length) return fallback;
  return data.map(mapCard);
}

export async function updateHomepageCard(
  id: string,
  patch: Partial<Pick<HomepageCard, 'badgeText' | 'title' | 'description' | 'bullets' | 'ctaText' | 'ctaLink' | 'isActive'>>,
): Promise<void> {
  if (!USE_SUPABASE) return;
  const db = createSupabaseAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = { updated_at: new Date().toISOString() };
  if (patch.badgeText   !== undefined) payload.badge_text   = patch.badgeText;
  if (patch.title       !== undefined) payload.title        = patch.title;
  if (patch.description !== undefined) payload.description  = patch.description;
  if (patch.bullets     !== undefined) payload.bullets      = patch.bullets;
  if (patch.ctaText     !== undefined) payload.cta_text     = patch.ctaText;
  if (patch.ctaLink     !== undefined) payload.cta_link     = patch.ctaLink;
  if (patch.isActive    !== undefined) payload.is_active    = patch.isActive;

  const { error } = await db.from('homepage_cards').update(payload).eq('id', id);
  if (error) throw new Error(`homepage_cards update failed: ${error.message}`);
}

// ── footer ────────────────────────────────────────────────────────────────────

export async function getFooterContent(): Promise<FooterContent> {
  if (!USE_SUPABASE) return DEFAULT_FOOTER_CONTENT;

  const db = createSupabaseAdminClient();
  const [sectionRes, groupsRes, linksRes] = await Promise.all([
    db.from('homepage_sections').select('metadata').eq('section_key', 'footer_main').single(),
    db.from('footer_link_groups').select('*').eq('is_active', true).order('order_index', { ascending: true }),
    db.from('footer_links').select('*').eq('is_active', true).order('order_index', { ascending: true }),
  ]);

  const meta = (sectionRes.data?.metadata ?? {}) as Record<string, unknown>;

  const groups  = (groupsRes.data ?? []).map(mapGroup);
  const links   = (linksRes.data ?? []).map(mapLink);

  return {
    brandBlurb:     (meta.brand_blurb     as string)   || DEFAULT_FOOTER_CONTENT.brandBlurb,
    factoryAddress: (meta.factory_address as string)   || DEFAULT_FOOTER_CONTENT.factoryAddress,
    officeAddress:  (meta.office_address  as string)   || DEFAULT_FOOTER_CONTENT.officeAddress,
    phoneNumbers:   Array.isArray(meta.phone_numbers)
      ? (meta.phone_numbers as string[])
      : DEFAULT_FOOTER_CONTENT.phoneNumbers,
    email:          (meta.email           as string)   || DEFAULT_FOOTER_CONTENT.email,
    linkGroups:     groups.length ? groups : DEFAULT_FOOTER_CONTENT.linkGroups,
    links:          links.length  ? links  : DEFAULT_FOOTER_CONTENT.links,
  };
}

export async function upsertFooterContent(data: {
  brandBlurb:     string;
  factoryAddress: string;
  officeAddress:  string;
  phoneNumbers:   string[];
  email:          string;
}): Promise<void> {
  if (!USE_SUPABASE) return;
  const db = createSupabaseAdminClient();
  const metadata = {
    brand_blurb:     data.brandBlurb,
    factory_address: data.factoryAddress,
    office_address:  data.officeAddress,
    phone_numbers:   data.phoneNumbers,
    email:           data.email,
  };
  const { error } = await db
    .from('homepage_sections')
    .upsert(
      { section_key: 'footer_main', metadata, updated_at: new Date().toISOString() },
      { onConflict: 'section_key' },
    );
  if (error) throw new Error(`footer_main upsert failed: ${error.message}`);
}

export async function createFooterLink(data: {
  groupKey:   string;
  label:      string;
  href:       string;
  orderIndex: number;
}): Promise<FooterLink> {
  if (!USE_SUPABASE) {
    return { id: `tmp-${Date.now()}`, groupKey: data.groupKey, label: data.label, href: data.href, orderIndex: data.orderIndex, isActive: true };
  }
  const db = createSupabaseAdminClient();
  const { data: row, error } = await db
    .from('footer_links')
    .insert({ group_key: data.groupKey, label: data.label, href: data.href, order_index: data.orderIndex, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error || !row) throw new Error(`footer_links insert failed: ${error?.message}`);
  return mapLink(row);
}

export async function updateFooterLink(
  id: string,
  patch: Partial<Pick<FooterLink, 'label' | 'href' | 'isActive' | 'orderIndex'>>,
): Promise<void> {
  if (!USE_SUPABASE) return;
  const db = createSupabaseAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = { updated_at: new Date().toISOString() };
  if (patch.label      !== undefined) payload.label       = patch.label;
  if (patch.href       !== undefined) payload.href        = patch.href;
  if (patch.isActive   !== undefined) payload.is_active   = patch.isActive;
  if (patch.orderIndex !== undefined) payload.order_index = patch.orderIndex;
  const { error } = await db.from('footer_links').update(payload).eq('id', id);
  if (error) throw new Error(`footer_links update failed: ${error.message}`);
}

export async function deleteFooterLink(id: string): Promise<void> {
  if (!USE_SUPABASE) return;
  const db = createSupabaseAdminClient();
  const { error } = await db.from('footer_links').delete().eq('id', id);
  if (error) throw new Error(`footer_links delete failed: ${error.message}`);
}

// ── public API ────────────────────────────────────────────────────────────────

// ── site_popups ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPopup(r: any): SitePopup {
  return {
    id:                  r.id                   as string,
    title:               (r.title               as string) || '',
    description:         (r.description         as string) || '',
    badgeText:           (r.badge_text          as string) || '',
    imageUrl:            (r.image_url           as string) || '',
    ctaText:             (r.cta_text            as string) || '',
    ctaLink:             (r.cta_link            as string) || '',
    secondaryCtaText:    (r.secondary_cta_text  as string) || '',
    secondaryCtaLink:    (r.secondary_cta_link  as string) || '',
    popupType:           ((r.popup_type as string) || 'modal') as SitePopup['popupType'],
    triggerDelaySeconds: (r.trigger_delay_seconds as number) ?? 2,
    displayFrequency:    ((r.display_frequency  as string) || 'once_per_session') as SitePopup['displayFrequency'],
    startAt:             (r.start_at            as string | null) ?? null,
    endAt:               (r.end_at              as string | null) ?? null,
    isActive:            (r.is_active           as boolean) ?? false,
    orderIndex:          (r.order_index         as number)  ?? 1,
  };
}

/** Returns the first active popup, or null if none. Never throws. */
export async function getActivePopup(): Promise<SitePopup | null> {
  if (!USE_SUPABASE) return null; // local dev: no popup

  try {
    const db = createSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await db
      .from('site_popups')
      .select('*')
      .eq('is_active', true)
      .or(`start_at.is.null,start_at.lte.${now}`)
      .or(`end_at.is.null,end_at.gte.${now}`)
      .order('order_index', { ascending: true })
      .limit(1)
      .single();

    if (error || !data) return null;
    return mapPopup(data);
  } catch {
    return null;
  }
}

/** Returns all popups (for admin). Never throws. */
export async function getPopups(): Promise<SitePopup[]> {
  if (!USE_SUPABASE) return [DEFAULT_POPUP];

  try {
    const db = createSupabaseAdminClient();
    const { data, error } = await db
      .from('site_popups')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data) return [DEFAULT_POPUP];
    return data.map(mapPopup);
  } catch {
    return [DEFAULT_POPUP];
  }
}

export async function createPopup(
  input: Omit<SitePopup, 'id'>,
): Promise<SitePopup> {
  if (!USE_SUPABASE) return { ...input, id: `tmp-${Date.now()}` };

  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from('site_popups')
    .insert({
      title:                 input.title,
      description:           input.description,
      badge_text:            input.badgeText,
      image_url:             input.imageUrl,
      cta_text:              input.ctaText,
      cta_link:              input.ctaLink,
      secondary_cta_text:    input.secondaryCtaText,
      secondary_cta_link:    input.secondaryCtaLink,
      popup_type:            input.popupType,
      trigger_delay_seconds: input.triggerDelaySeconds,
      display_frequency:     input.displayFrequency,
      start_at:              input.startAt   || null,
      end_at:                input.endAt     || null,
      is_active:             input.isActive,
      order_index:           input.orderIndex,
      updated_at:            new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !data) throw new Error(`site_popups insert failed: ${error?.message}`);
  return mapPopup(data);
}

export async function updatePopup(
  id: string,
  patch: Partial<Omit<SitePopup, 'id'>>,
): Promise<void> {
  if (!USE_SUPABASE) return;

  const db = createSupabaseAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = { updated_at: new Date().toISOString() };
  if (patch.title                !== undefined) payload.title                 = patch.title;
  if (patch.description          !== undefined) payload.description           = patch.description;
  if (patch.badgeText            !== undefined) payload.badge_text            = patch.badgeText;
  if (patch.imageUrl             !== undefined) payload.image_url             = patch.imageUrl;
  if (patch.ctaText              !== undefined) payload.cta_text              = patch.ctaText;
  if (patch.ctaLink              !== undefined) payload.cta_link              = patch.ctaLink;
  if (patch.secondaryCtaText     !== undefined) payload.secondary_cta_text    = patch.secondaryCtaText;
  if (patch.secondaryCtaLink     !== undefined) payload.secondary_cta_link    = patch.secondaryCtaLink;
  if (patch.popupType            !== undefined) payload.popup_type            = patch.popupType;
  if (patch.triggerDelaySeconds  !== undefined) payload.trigger_delay_seconds = patch.triggerDelaySeconds;
  if (patch.displayFrequency     !== undefined) payload.display_frequency     = patch.displayFrequency;
  if (patch.startAt              !== undefined) payload.start_at              = patch.startAt  || null;
  if (patch.endAt                !== undefined) payload.end_at                = patch.endAt    || null;
  if (patch.isActive             !== undefined) payload.is_active             = patch.isActive;
  if (patch.orderIndex           !== undefined) payload.order_index           = patch.orderIndex;

  const { error } = await db.from('site_popups').update(payload).eq('id', id);
  if (error) throw new Error(`site_popups update failed: ${error.message}`);
}

export async function deletePopup(id: string): Promise<void> {
  if (!USE_SUPABASE) return;
  const db = createSupabaseAdminClient();
  const { error } = await db.from('site_popups').delete().eq('id', id);
  if (error) throw new Error(`site_popups delete failed: ${error.message}`);
}

// ── contact / bulk enquiry page content ──────────────────────────────────────

export async function getContactPageContent(): Promise<ContactPageContent> {
  const [hero, form, infoCards] = await Promise.all([
    getHomepageSection('contact_page_hero').catch(() => DEFAULT_CONTACT_HERO),
    getHomepageSection('contact_page_form').catch(() => DEFAULT_CONTACT_FORM_SECTION),
    getHomepageCards('contact_info_cards').then((c) => c.length ? c : DEFAULT_CONTACT_INFO_CARDS).catch(() => DEFAULT_CONTACT_INFO_CARDS),
  ]);
  return {
    hero:      hero.sectionKey === 'contact_page_hero' ? hero : DEFAULT_CONTACT_HERO,
    form:      form.sectionKey === 'contact_page_form' ? form : DEFAULT_CONTACT_FORM_SECTION,
    infoCards: infoCards.length ? infoCards : DEFAULT_CONTACT_INFO_CARDS,
  };
}

export async function getBulkEnquiryPageContent(): Promise<BulkEnquiryPageContent> {
  const [hero, form, benefits] = await Promise.all([
    getHomepageSection('bulk_enquiry_hero').catch(() => DEFAULT_BULK_HERO),
    getHomepageSection('bulk_enquiry_form').catch(() => DEFAULT_BULK_FORM_SECTION),
    getHomepageCards('bulk_enquiry_benefits').then((c) => c.length ? c : DEFAULT_BULK_BENEFIT_CARDS).catch(() => DEFAULT_BULK_BENEFIT_CARDS),
  ]);
  return {
    hero:     hero.sectionKey === 'bulk_enquiry_hero' ? hero : DEFAULT_BULK_HERO,
    form:     form.sectionKey === 'bulk_enquiry_form' ? form : DEFAULT_BULK_FORM_SECTION,
    benefits: benefits.length ? benefits : DEFAULT_BULK_BENEFIT_CARDS,
  };
}

// ── public API ────────────────────────────────────────────────────────────────

/** Persist edited content (input is sanitized before writing). */
export async function saveContent(input: unknown): Promise<SiteContent> {
  const clean = sanitizeContent(input);

  if (!USE_SUPABASE) {
    await writeFile(clean);
    return clean;
  }

  await Promise.all([
    writeSiteSettings(clean.brand),
    writeHeroSlides(clean.hero.slides),
    writeUsps(clean.usps),
  ]);

  return clean;
}
