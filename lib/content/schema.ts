// Editable site content model + safe defaults.
// This file is PURE DATA ONLY (no node/server imports) so it can be shared
// between server code (store, actions) and client code (admin editor).

import { SLIDES, USPS } from '@/lib/data';

/** A hero slide = one primary tagline (headline) + secondary tagline (subtext) + CTAs. */
export interface HeroSlide {
  id: number | string;
  headline: string; // primary tagline
  subtext: string; // secondary tagline
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
  image: string;
  overlay: string;
}

export interface BrandSettings {
  name: string;
  heroLabel: string; // small uppercase label above the hero headline
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  email: string;
  addressFactory: string;
  addressOffice: string;
}

export interface UspItem {
  icon: string;
  title: string;
  description: string;
}

export interface SiteContent {
  brand: BrandSettings;
  hero: { slides: HeroSlide[] };
  usps: UspItem[];
}

/** Icons the homepage knows how to render for USP cards. */
export const USP_ICONS = [
  'award', 'truck', 'tag', 'clock', 'leaf', 'headphones', 'shield', 'users', 'map',
] as const;

export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    name: 'Modigold Pipes Pvt Ltd',
    heroLabel: 'Modigold Pipes Pvt Ltd',
    phonePrimary: '+91 9960 937 588',
    phoneSecondary: '+91 8329 369 356',
    whatsapp: '919960937588',
    email: 'sales@modigold.in',
    addressFactory: 'B-104 MIDC Butibori, Nagpur, MH 441122',
    addressOffice: 'D-106, M.I.D.C., Hingna, Nagpur – 440016',
  },
  hero: {
    slides: SLIDES.map((s) => ({
      id: s.id,
      headline: s.headline,
      subtext: s.subtext,
      cta1: { ...s.cta1 },
      cta2: { ...s.cta2 },
      image: s.image,
      overlay: s.overlay,
    })),
  },
  usps: USPS.map((u) => ({ icon: u.icon, title: u.title, description: u.description })),
};

function asStr(v: unknown, fallback: string): string {
  return typeof v === 'string' ? v : fallback;
}

/**
 * Coerce arbitrary input (untrusted — Server Actions are directly reachable)
 * into a complete, valid SiteContent. Missing/blank sections fall back to
 * defaults so the public site is never left without content.
 */
export function sanitizeContent(input: unknown): SiteContent {
  const o = (input ?? {}) as Record<string, unknown>;

  const brandIn = (o.brand ?? {}) as Record<string, unknown>;
  const d = DEFAULT_CONTENT.brand;
  const brand: BrandSettings = {
    name: asStr(brandIn.name, d.name),
    heroLabel: asStr(brandIn.heroLabel, d.heroLabel),
    phonePrimary: asStr(brandIn.phonePrimary, d.phonePrimary),
    phoneSecondary: asStr(brandIn.phoneSecondary, d.phoneSecondary),
    whatsapp: asStr(brandIn.whatsapp, d.whatsapp),
    email: asStr(brandIn.email, d.email),
    addressFactory: asStr(brandIn.addressFactory, d.addressFactory),
    addressOffice: asStr(brandIn.addressOffice, d.addressOffice),
  };

  const heroIn = (o.hero ?? {}) as Record<string, unknown>;
  const slidesIn = Array.isArray(heroIn.slides) ? heroIn.slides : [];
  const slides: HeroSlide[] = slidesIn
    .map((raw, i): HeroSlide => {
      const s = (raw ?? {}) as Record<string, unknown>;
      const c1 = (s.cta1 ?? {}) as Record<string, unknown>;
      const c2 = (s.cta2 ?? {}) as Record<string, unknown>;
      return {
        id: typeof s.id === 'number' || typeof s.id === 'string' ? s.id : i + 1,
        headline: asStr(s.headline, ''),
        subtext: asStr(s.subtext, ''),
        cta1: { label: asStr(c1.label, ''), href: asStr(c1.href, '/') },
        cta2: { label: asStr(c2.label, ''), href: asStr(c2.href, '/') },
        image: asStr(s.image, ''),
        overlay: asStr(s.overlay, 'rgba(26,35,64,0.65)'),
      };
    })
    .filter((s) => s.headline.trim() !== '');

  const uspsIn = Array.isArray(o.usps) ? o.usps : [];
  const usps: UspItem[] = uspsIn
    .map((raw): UspItem => {
      const u = (raw ?? {}) as Record<string, unknown>;
      return {
        icon: asStr(u.icon, 'award'),
        title: asStr(u.title, ''),
        description: asStr(u.description, ''),
      };
    })
    .filter((u) => u.title.trim() !== '');

  return {
    brand,
    hero: { slides: slides.length ? slides : DEFAULT_CONTENT.hero.slides },
    usps: usps.length ? usps : DEFAULT_CONTENT.usps,
  };
}
