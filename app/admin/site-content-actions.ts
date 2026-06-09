'use server';

import { revalidatePath } from 'next/cache';
import { isAuthed } from '@/lib/auth';
import {
  updateHomepageSection, updateHomepageCard,
  upsertFooterContent,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
  createPopup,
  updatePopup,
  deletePopup,
} from '@/lib/content/store';
import type { HomepageSection, HomepageCard, FooterLink, SitePopup } from '@/lib/content/cms-schema';

type ActionResult = { ok: true } | { ok: false; error: string };

function guard() {
  // isAuthed is async — callers must await
}
void guard; // suppress unused warning

// ── sections ──────────────────────────────────────────────────────────────────

export async function updateSectionAction(
  key: string,
  patch: Partial<Pick<HomepageSection, 'eyebrow' | 'title' | 'highlightedText'>>,
): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await updateHomepageSection(key, patch);
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

// ── homepage cards ────────────────────────────────────────────────────────────

export async function updateHomepageCardAction(
  id: string,
  patch: Partial<Pick<HomepageCard, 'badgeText' | 'title' | 'description' | 'bullets' | 'ctaText' | 'ctaLink' | 'isActive'>>,
): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await updateHomepageCard(id, patch);
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

// ── footer content ────────────────────────────────────────────────────────────

export async function updateFooterContentAction(data: {
  brandBlurb:     string;
  factoryAddress: string;
  officeAddress:  string;
  phoneNumbers:   string[];
  email:          string;
}): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await upsertFooterContent(data);
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

// ── footer links ──────────────────────────────────────────────────────────────

export async function createFooterLinkAction(data: {
  groupKey:   string;
  label:      string;
  href:       string;
  orderIndex: number;
}): Promise<{ ok: true; link: FooterLink } | { ok: false; error: string }> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    const link = await createFooterLink(data);
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true, link };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function updateFooterLinkAction(
  id: string,
  patch: Partial<Pick<FooterLink, 'label' | 'href' | 'isActive' | 'orderIndex'>>,
): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await updateFooterLink(id, patch);
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteFooterLinkAction(id: string): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await deleteFooterLink(id);
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

// ── about section ─────────────────────────────────────────────────────────────

export async function updateAboutSectionAction(data: {
  eyebrow:         string;
  title:           string;
  highlightedText: string;
  description:     string;
  ctaText:         string;
  ctaLink:         string;
  badgeText:       string;
  imageUrl:        string;
  features:        string; // newline-separated
}): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    const features = data.features
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    await updateHomepageSection('about_main', {
      eyebrow:         data.eyebrow,
      title:           data.title,
      highlightedText: data.highlightedText,
      description:     data.description,
      ctaText:         data.ctaText,
      ctaLink:         data.ctaLink,
      metadata: {
        badge_text: data.badgeText,
        image_url:  data.imageUrl,
        features,
      },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

// ── popups ────────────────────────────────────────────────────────────────────

function parsePopupInput(data: Record<string, string>): Omit<SitePopup, 'id'> {
  return {
    title:               data.title               ?? '',
    description:         data.description         ?? '',
    badgeText:           data.badge_text          ?? '',
    imageUrl:            data.image_url           ?? '',
    ctaText:             data.cta_text            ?? '',
    ctaLink:             data.cta_link            ?? '',
    secondaryCtaText:    data.secondary_cta_text  ?? '',
    secondaryCtaLink:    data.secondary_cta_link  ?? '',
    popupType:           (data.popup_type ?? 'modal') as SitePopup['popupType'],
    triggerDelaySeconds: parseInt(data.trigger_delay_seconds ?? '2', 10) || 2,
    displayFrequency:    (data.display_frequency ?? 'once_per_session') as SitePopup['displayFrequency'],
    startAt:             data.start_at   || null,
    endAt:               data.end_at     || null,
    isActive:            data.is_active === 'true',
    orderIndex:          parseInt(data.order_index ?? '1', 10) || 1,
  };
}

export async function createPopupAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    const raw = Object.fromEntries(
      Array.from(formData.entries()).map(([k, v]) => [k, String(v)]),
    );
    await createPopup(parsePopupInput(raw));
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function updatePopupAction(
  id: string,
  patch: Partial<Omit<SitePopup, 'id'>>,
): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await updatePopup(id, patch);
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deletePopupAction(id: string): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await deletePopup(id);
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function togglePopupActiveAction(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await updatePopup(id, { isActive });
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

// ── contact page ──────────────────────────────────────────────────────────────

export async function updateContactSectionAction(
  key: string,
  patch: Partial<Pick<HomepageSection, 'eyebrow' | 'title' | 'highlightedText' | 'description' | 'ctaText' | 'ctaLink' | 'metadata'>>,
): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await updateHomepageSection(key, patch);
    revalidatePath('/contact');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function updateContactCardAction(
  id: string,
  patch: Partial<Pick<HomepageCard, 'title' | 'description' | 'iconName' | 'bullets' | 'ctaLink' | 'isActive'>>,
): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await updateHomepageCard(id, patch);
    revalidatePath('/contact');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

// ── bulk enquiry page ─────────────────────────────────────────────────────────

export async function updateBulkEnquirySectionAction(
  key: string,
  patch: Partial<Pick<HomepageSection, 'eyebrow' | 'title' | 'highlightedText' | 'description' | 'ctaText' | 'ctaLink' | 'metadata'>>,
): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await updateHomepageSection(key, patch);
    revalidatePath('/bulk-enquiry');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function updateBulkBenefitCardAction(
  id: string,
  patch: Partial<Pick<HomepageCard, 'title' | 'description' | 'iconName' | 'isActive'>>,
): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: 'Unauthorized' };
  try {
    await updateHomepageCard(id, patch);
    revalidatePath('/bulk-enquiry');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}
