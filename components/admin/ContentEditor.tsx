'use client';
import { useState, useRef, useTransition } from 'react';
import { Plus, Trash2, Save, ExternalLink, CheckCircle, AlertCircle, Image as ImageIcon, Edit2, X, Bell, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';
import { saveContentAction } from '@/app/admin/actions';
import {
  updateSectionAction,
  updateHomepageCardAction,
  updateFooterContentAction,
  createFooterLinkAction,
  updateFooterLinkAction,
  deleteFooterLinkAction,
  updateAboutSectionAction,
  updatePopupAction,
  deletePopupAction,
  togglePopupActiveAction,
  createPopupAction,
  updateContactSectionAction,
  updateContactCardAction,
  updateBulkEnquirySectionAction,
  updateBulkBenefitCardAction,
} from '@/app/admin/site-content-actions';
import { USP_ICONS, type SiteContent, type HeroSlide, type UspItem } from '@/lib/content/schema';
import type { HomepageSection, HomepageCard, FooterContent, FooterLink, SitePopup, ContactPageContent, BulkEnquiryPageContent } from '@/lib/content/cms-schema';

type Status = { ok: boolean; msg: string } | null;

// ── reusable save status badge ────────────────────────────────────────────────

function SaveStatus({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium ${status.ok ? 'text-emerald-600' : 'text-red-500'}`}>
      {status.ok ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
      {status.msg}
    </span>
  );
}

// ── section heading editor ────────────────────────────────────────────────────

function SectionHeadingEditor({
  label,
  sectionKey,
  initial,
}: {
  label: string;
  sectionKey: string;
  initial: HomepageSection;
}) {
  const [draft, setDraft] = useState(initial);
  const [pending, start]  = useTransition();
  const [status, setStatus] = useState<Status>(null);

  function save() {
    setStatus(null);
    start(async () => {
      const res = await updateSectionAction(sectionKey, {
        eyebrow:         draft.eyebrow,
        title:           draft.title,
        highlightedText: draft.highlightedText,
      });
      setStatus(res.ok
        ? { ok: true, msg: 'Saved' }
        : { ok: false, msg: 'ok' in res && !res.ok ? res.error : 'Save failed' });
    });
  }

  return (
    <div className="bg-white p-5 shadow-sm rounded-xl" style={{ border: '1px solid #ececec' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Edit2 size={13} className="text-gold-500 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={status} />
          <button onClick={save} disabled={pending}
            className="btn-gold py-1.5 px-4 text-xs rounded-lg disabled:opacity-50">
            <Save size={13} /> {pending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="input-label">Eyebrow (small label above)</label>
          <input className="input-field" value={draft.eyebrow}
            onChange={(e) => setDraft((d) => ({ ...d, eyebrow: e.target.value }))} />
        </div>
        <div>
          <label className="input-label">Title</label>
          <input className="input-field" value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
        </div>
        <div>
          <label className="input-label">Highlighted word / phrase</label>
          <input className="input-field" value={draft.highlightedText}
            onChange={(e) => setDraft((d) => ({ ...d, highlightedText: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}

// ── ordering card editor ──────────────────────────────────────────────────────

function OrderingCardEditor({ initial, cardNum }: { initial: HomepageCard; cardNum: number }) {
  const [draft, setDraft] = useState(initial);
  const [pending, start]  = useTransition();
  const [status, setStatus] = useState<Status>(null);

  function save() {
    setStatus(null);
    start(async () => {
      const res = await updateHomepageCardAction(draft.id, {
        badgeText:   draft.badgeText,
        title:       draft.title,
        description: draft.description,
        bullets:     draft.bullets,
        ctaText:     draft.ctaText,
        ctaLink:     draft.ctaLink,
      });
      setStatus(res.ok
        ? { ok: true, msg: 'Saved' }
        : { ok: false, msg: 'ok' in res && !res.ok ? res.error : 'Save failed' });
    });
  }

  return (
    <div className="bg-white p-5 shadow-sm rounded-xl" style={{ border: '1px solid #ececec' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Edit2 size={13} className="text-gold-500 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Card {cardNum}</span>
          {draft.variant && (
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${draft.variant === 'retail' ? 'badge-buy' : 'badge-enquiry'}`}>
              {draft.variant}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={status} />
          <button onClick={save} disabled={pending}
            className="btn-gold py-1.5 px-4 text-xs disabled:opacity-50">
            <Save size={13} /> {pending ? 'Saving…' : 'Save Card'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="input-label">Badge Text</label>
            <input className="input-field" value={draft.badgeText}
              onChange={(e) => setDraft((d) => ({ ...d, badgeText: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">Title</label>
            <input className="input-field" value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className="input-label">Description</label>
          <textarea className="input-field min-h-[72px]" value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
        </div>

        <div>
          <label className="input-label">Bullet points — one per line</label>
          <textarea
            className="input-field min-h-[88px] font-mono text-xs"
            value={draft.bullets.join('\n')}
            onChange={(e) => setDraft((d) => ({ ...d, bullets: e.target.value.split('\n').filter(Boolean) }))}
            placeholder="Feature one&#10;Feature two&#10;Feature three"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="input-label">CTA Button Text</label>
            <input className="input-field" value={draft.ctaText}
              onChange={(e) => setDraft((d) => ({ ...d, ctaText: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">CTA Button Link</label>
            <input className="input-field" value={draft.ctaLink}
              onChange={(e) => setDraft((d) => ({ ...d, ctaLink: e.target.value }))} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── footer links group editor ─────────────────────────────────────────────────

function FooterLinksGroup({
  groupKey,
  groupTitle,
  initialLinks,
}: {
  groupKey:     string;
  groupTitle:   string;
  initialLinks: FooterLink[];
}) {
  const [links, setLinks]       = useState(initialLinks);
  const [editId, setEditId]     = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editHref, setEditHref]   = useState('');
  const [addLabel, setAddLabel]   = useState('');
  const [addHref, setAddHref]     = useState('');
  const [busy, setBusy]         = useState<string | null>(null);
  const [addStatus, setAddStatus] = useState<Status>(null);

  async function startEdit(link: FooterLink) {
    setEditId(link.id);
    setEditLabel(link.label);
    setEditHref(link.href);
  }

  async function saveEdit() {
    if (!editId) return;
    setBusy(editId);
    const res = await updateFooterLinkAction(editId, { label: editLabel, href: editHref });
    if (res.ok) {
      setLinks((prev) => prev.map((l) => l.id === editId ? { ...l, label: editLabel, href: editHref } : l));
      setEditId(null);
    }
    setBusy(null);
  }

  async function toggleActive(link: FooterLink) {
    setBusy(link.id);
    const res = await updateFooterLinkAction(link.id, { isActive: !link.isActive });
    if (res.ok) setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, isActive: !l.isActive } : l));
    setBusy(null);
  }

  async function remove(link: FooterLink) {
    if (!confirm(`Remove "${link.label}"?`)) return;
    setBusy(link.id);
    const res = await deleteFooterLinkAction(link.id);
    if (res.ok) setLinks((prev) => prev.filter((l) => l.id !== link.id));
    setBusy(null);
  }

  async function add() {
    if (!addLabel.trim() || !addHref.trim()) return;
    setAddStatus(null);
    const res = await createFooterLinkAction({
      groupKey,
      label:      addLabel.trim(),
      href:       addHref.trim(),
      orderIndex: links.length,
    });
    if (res.ok) {
      setLinks((prev) => [...prev, res.link]);
      setAddLabel('');
      setAddHref('');
      setAddStatus({ ok: true, msg: 'Added' });
    } else {
      setAddStatus({ ok: false, msg: res.error });
    }
  }

  return (
    <div className="bg-white p-5 shadow-sm" style={{ border: '1px solid #f1f1f1' }}>
      <h4 className="font-bold text-navy-500 text-sm mb-4">{groupTitle}</h4>

      <div className="space-y-2 mb-4">
        {links.map((link) => (
          <div key={link.id}
            className="flex items-center gap-2 py-2 px-3 rounded"
            style={{ background: '#f9fafb', opacity: busy === link.id ? 0.5 : 1 }}>

            {editId === link.id ? (
              <>
                <input className="input-field py-1 text-xs flex-1" value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)} placeholder="Label" />
                <input className="input-field py-1 text-xs flex-1" value={editHref}
                  onChange={(e) => setEditHref(e.target.value)} placeholder="URL" />
                <button onClick={saveEdit} disabled={busy === link.id}
                  className="p-1.5 text-emerald-600 hover:text-emerald-800">
                  <CheckCircle size={15} />
                </button>
                <button onClick={() => setEditId(null)} className="p-1.5 text-gray-400 hover:text-gray-600">
                  <X size={15} />
                </button>
              </>
            ) : (
              <>
                <span className={`flex-1 text-sm ${link.isActive ? 'text-navy-500' : 'text-gray-300 line-through'}`}>
                  {link.label}
                </span>
                <span className="text-xs text-gray-400 flex-1 truncate">{link.href}</span>
                <button onClick={() => startEdit(link)}
                  className="p-1.5 text-gray-400 hover:text-blue-500" title="Edit">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => toggleActive(link)} disabled={busy === link.id}
                  className={`text-xs font-bold px-2 py-0.5 rounded transition-colors ${link.isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                  {link.isActive ? 'ON' : 'OFF'}
                </button>
                <button onClick={() => remove(link)}
                  className="p-1.5 text-gray-300 hover:text-red-500" title="Delete">
                  <Trash2 size={13} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new link */}
      <div className="pt-3" style={{ borderTop: '1px solid #f1f1f1' }}>
        <div className="flex items-center gap-2">
          <input className="input-field py-1.5 text-xs flex-1" placeholder="Label"
            value={addLabel} onChange={(e) => setAddLabel(e.target.value)} />
          <input className="input-field py-1.5 text-xs flex-1" placeholder="URL e.g. /shop"
            value={addHref} onChange={(e) => setAddHref(e.target.value)} />
          <button onClick={add}
            className="btn-outline-gold py-1.5 px-3 text-xs shrink-0">
            <Plus size={13} /> Add
          </button>
        </div>
        {addStatus && (
          <div className="mt-1">
            <SaveStatus status={addStatus} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── about section editor ──────────────────────────────────────────────────────

function AboutSectionEditor({ initial }: { initial?: HomepageSection }) {
  const meta      = (initial?.metadata ?? {}) as Record<string, unknown>;
  const initFeatures = Array.isArray(meta.features)
    ? (meta.features as string[]).join('\n')
    : '';

  const [draft, setDraft] = useState({
    eyebrow:         initial?.eyebrow         ?? 'SINCE 1996',
    title:           initial?.title           ?? 'Premium Pipes Built for Indian Businesses',
    highlightedText: initial?.highlightedText ?? 'Since 1996',
    description:     initial?.description     ?? '',
    ctaText:         initial?.ctaText         ?? 'Learn More',
    ctaLink:         initial?.ctaLink         ?? '/about',
    badgeText:       (meta.badge_text  as string) ?? '28+ Years of Trust',
    imageUrl:        (meta.image_url   as string) ?? '',
    features:        initFeatures,
  });

  const [pending, start]  = useTransition();
  const [status, setStatus] = useState<Status>(null);

  function save() {
    setStatus(null);
    start(async () => {
      const res = await updateAboutSectionAction(draft);
      setStatus(res.ok
        ? { ok: true, msg: 'About section saved.' }
        : { ok: false, msg: 'ok' in res && !res.ok ? res.error : 'Save failed' });
    });
  }

  return (
    <div className="bg-white p-6 shadow-sm space-y-4" style={{ border: '1px solid #f1f1f1' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gold-500" />
          <span className="font-bold text-navy-500 text-sm">About Section Content</span>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={status} />
          <button onClick={save} disabled={pending}
            className="btn-gold py-1.5 px-4 text-xs disabled:opacity-50">
            <Save size={13} /> {pending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="input-label">Eyebrow (small label)</label>
          <input className="input-field" value={draft.eyebrow}
            onChange={(e) => setDraft((d) => ({ ...d, eyebrow: e.target.value }))} />
        </div>
        <div>
          <label className="input-label">Title</label>
          <input className="input-field" value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
        </div>
        <div>
          <label className="input-label">Highlighted word / phrase</label>
          <input className="input-field" value={draft.highlightedText}
            onChange={(e) => setDraft((d) => ({ ...d, highlightedText: e.target.value }))} />
        </div>
      </div>

      <div>
        <label className="input-label">Description</label>
        <textarea className="input-field min-h-[72px]" value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="input-label">Trust Badge Text</label>
          <input className="input-field" value={draft.badgeText} placeholder="28+ Years of Trust"
            onChange={(e) => setDraft((d) => ({ ...d, badgeText: e.target.value }))} />
        </div>
        <div>
          <label className="input-label">Section Image URL (optional)</label>
          <input className="input-field" value={draft.imageUrl} placeholder="https://…"
            onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))} />
        </div>
        <div>
          <label className="input-label">CTA Button Text</label>
          <input className="input-field" value={draft.ctaText}
            onChange={(e) => setDraft((d) => ({ ...d, ctaText: e.target.value }))} />
        </div>
        <div>
          <label className="input-label">CTA Button Link</label>
          <input className="input-field" value={draft.ctaLink}
            onChange={(e) => setDraft((d) => ({ ...d, ctaLink: e.target.value }))} />
        </div>
      </div>

      <div>
        <label className="input-label">Feature bullets — one per line</label>
        <textarea
          className="input-field min-h-[80px] font-mono text-xs"
          value={draft.features}
          onChange={(e) => setDraft((d) => ({ ...d, features: e.target.value }))}
          placeholder="ISI & BIS aligned quality standards&#10;Trusted by 500+ dealers&#10;Supplying across 15+ Indian states"
        />
      </div>
    </div>
  );
}

// ── popup row ─────────────────────────────────────────────────────────────────

function PopupRow({
  popup: initial,
  onDelete,
  onToggle,
}: {
  popup:    SitePopup;
  onDelete: (id: string) => void;
  onToggle: (id: string, val: boolean) => void;
}) {
  const [editing, setEditing]     = useState(false);
  const [draft, setDraft]         = useState(initial);
  const [pending, start]          = useTransition();
  const [status, setStatus]       = useState<Status>(null);
  const [toggling, setToggling]   = useState(false);

  function save() {
    setStatus(null);
    start(async () => {
      const { id, ...patch } = draft;
      const res = await updatePopupAction(id, patch);
      setStatus(res.ok
        ? { ok: true, msg: 'Saved' }
        : { ok: false, msg: 'ok' in res && !res.ok ? res.error : 'Save failed' });
      if (res.ok) setEditing(false);
    });
  }

  async function handleToggle() {
    setToggling(true);
    const res = await togglePopupActiveAction(draft.id, !draft.isActive);
    if (res.ok) {
      const next = !draft.isActive;
      setDraft((d) => ({ ...d, isActive: next }));
      onToggle(draft.id, next);
    }
    setToggling(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete popup "${draft.title}"?`)) return;
    const res = await deletePopupAction(draft.id);
    if (res.ok) onDelete(draft.id);
  }

  return (
    <div className="bg-white shadow-sm overflow-hidden" style={{ border: '1px solid #f1f1f1', borderRadius: 8 }}>
      {/* Summary row */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: draft.isActive ? 'rgba(201,168,76,0.12)' : '#f1f5f9' }}>
          <Bell size={14} style={{ color: draft.isActive ? '#C9A84C' : '#94a3b8' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-navy-500 text-sm truncate">{draft.title}</div>
          <div className="text-xs text-gray-400 truncate">{draft.ctaLink || draft.popupType}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Active toggle */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            title={draft.isActive ? 'Deactivate' : 'Activate'}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded transition-colors disabled:opacity-50"
            style={draft.isActive
              ? { background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }
              : { background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0' }}
          >
            {draft.isActive
              ? <><ToggleRight size={14} /> Active</>
              : <><ToggleLeft  size={14} /> Inactive</>}
          </button>
          <button onClick={() => setEditing((v) => !v)}
            className="p-2 hover:text-blue-500 text-gray-400 transition-colors" title="Edit">
            <Edit2 size={14} />
          </button>
          <button onClick={handleDelete}
            className="p-2 hover:text-red-500 text-gray-300 transition-colors" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Expanded edit form */}
      {editing && (
        <div className="px-5 pb-5 pt-0 space-y-3" style={{ borderTop: '1px solid #f1f5f9' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
            <div>
              <label className="input-label">Title</label>
              <input className="input-field" value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Badge Text</label>
              <input className="input-field" value={draft.badgeText} placeholder="BULK ENQUIRY"
                onChange={(e) => setDraft((d) => ({ ...d, badgeText: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="input-label">Description</label>
            <textarea className="input-field min-h-[60px]" value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
          </div>

          <div>
            <label className="input-label">Image URL (optional)</label>
            <input className="input-field" value={draft.imageUrl} placeholder="https://…"
              onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="input-label">Primary CTA Text</label>
              <input className="input-field" value={draft.ctaText} placeholder="Get a Quote"
                onChange={(e) => setDraft((d) => ({ ...d, ctaText: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Primary CTA Link</label>
              <input className="input-field" value={draft.ctaLink} placeholder="/bulk-enquiry"
                onChange={(e) => setDraft((d) => ({ ...d, ctaLink: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Secondary CTA Text</label>
              <input className="input-field" value={draft.secondaryCtaText} placeholder="Shop Online"
                onChange={(e) => setDraft((d) => ({ ...d, secondaryCtaText: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Secondary CTA Link</label>
              <input className="input-field" value={draft.secondaryCtaLink} placeholder="/shop"
                onChange={(e) => setDraft((d) => ({ ...d, secondaryCtaLink: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="input-label">Type</label>
              <select className="input-field" value={draft.popupType}
                onChange={(e) => setDraft((d) => ({ ...d, popupType: e.target.value as SitePopup['popupType'] }))}>
                <option value="modal">Modal</option>
                <option value="bottom_sheet">Bottom Sheet</option>
                <option value="top_bar">Top Bar</option>
              </select>
            </div>
            <div>
              <label className="input-label">Delay (sec)</label>
              <input className="input-field" type="number" min={0} max={30} value={draft.triggerDelaySeconds}
                onChange={(e) => setDraft((d) => ({ ...d, triggerDelaySeconds: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="input-label">Frequency</label>
              <select className="input-field" value={draft.displayFrequency}
                onChange={(e) => setDraft((d) => ({ ...d, displayFrequency: e.target.value as SitePopup['displayFrequency'] }))}>
                <option value="once_per_session">Once / Session</option>
                <option value="once_per_day">Once / Day</option>
                <option value="always">Always</option>
              </select>
            </div>
            <div>
              <label className="input-label">Order Index</label>
              <input className="input-field" type="number" min={1} value={draft.orderIndex}
                onChange={(e) => setDraft((d) => ({ ...d, orderIndex: Number(e.target.value) }))} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="input-label">Show From (optional)</label>
              <input className="input-field" type="datetime-local" value={draft.startAt?.slice(0, 16) ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, startAt: e.target.value || null }))} />
            </div>
            <div>
              <label className="input-label">Show Until (optional)</label>
              <input className="input-field" type="datetime-local" value={draft.endAt?.slice(0, 16) ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, endAt: e.target.value || null }))} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button onClick={save} disabled={pending}
              className="btn-gold py-1.5 px-5 text-xs disabled:opacity-50">
              <Save size={13} /> {pending ? 'Saving…' : 'Save Popup'}
            </button>
            <button onClick={() => setEditing(false)}
              className="btn-outline-gold py-1.5 px-4 text-xs">Cancel</button>
            <SaveStatus status={status} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── popup manager ─────────────────────────────────────────────────────────────

function PopupManager({ initialPopups }: { initialPopups: SitePopup[] }) {
  const [popups, setPopups]   = useState(initialPopups);
  const [adding, setAdding]   = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  function handleDelete(id: string) {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  }

  function handleToggle(id: string, val: boolean) {
    setPopups((prev) => prev.map((p) => p.id === id ? { ...p, isActive: val } : p));
  }

  async function handleCreate() {
    if (!newTitle.trim()) return;
    setCreating(true);
    const formData = new FormData();
    formData.set('title', newTitle.trim());
    formData.set('cta_text', 'Get a Quote');
    formData.set('cta_link', '/bulk-enquiry');
    formData.set('popup_type', 'modal');
    formData.set('trigger_delay_seconds', '2');
    formData.set('display_frequency', 'once_per_session');
    formData.set('is_active', 'false');
    formData.set('order_index', String(popups.length + 1));

    const res = await createPopupAction(null, formData);
    if (res.ok) {
      // Reload page to get the new popup with DB id
      window.location.reload();
    }
    setCreating(false);
  }

  return (
    <div className="space-y-3">
      {popups.length === 0 && (
        <div className="bg-white p-6 text-center text-sm text-gray-400 shadow-sm" style={{ border: '1px solid #f1f1f1' }}>
          No popups yet. Create one below.
        </div>
      )}

      {popups.map((popup) => (
        <PopupRow
          key={popup.id}
          popup={popup}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      ))}

      {/* Create new */}
      {adding ? (
        <div className="bg-white p-4 shadow-sm flex items-center gap-3" style={{ border: '1px solid #f1f1f1' }}>
          <input className="input-field flex-1 py-1.5 text-sm" placeholder="Popup title e.g. Get Dealer Pricing"
            value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
          <button onClick={handleCreate} disabled={creating || !newTitle.trim()}
            className="btn-gold py-1.5 px-4 text-xs disabled:opacity-50 shrink-0">
            {creating ? 'Creating…' : 'Create'}
          </button>
          <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={16} />
          </button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="w-full btn-outline-gold py-2.5 text-xs">
          <Plus size={14} /> Add New Popup
        </button>
      )}
    </div>
  );
}

// ── contact info card editor ──────────────────────────────────────────────────

function ContactCardEditor({ initial }: { initial: HomepageCard }) {
  const [draft, setDraft] = useState(initial);
  const [pending, start]  = useTransition();
  const [status, setStatus] = useState<Status>(null);

  function save() {
    setStatus(null);
    start(async () => {
      const res = await updateContactCardAction(draft.id, {
        title:   draft.title,
        bullets: draft.bullets,
        ctaLink: draft.ctaLink,
      });
      setStatus(res.ok
        ? { ok: true, msg: 'Saved' }
        : { ok: false, msg: 'ok' in res && !res.ok ? res.error : 'Save failed' });
    });
  }

  return (
    <div className="bg-white p-4 shadow-sm space-y-3" style={{ border: '1px solid #f1f1f1', borderRadius: 8 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{initial.iconName} — {initial.title}</span>
        <div className="flex items-center gap-2">
          <SaveStatus status={status} />
          <button onClick={save} disabled={pending} className="btn-gold py-1 px-3 text-xs disabled:opacity-50">
            <Save size={11} /> {pending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="input-label">Label</label>
          <input className="input-field" value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
        </div>
        <div>
          <label className="input-label">Link (optional — e.g. tel:+91…)</label>
          <input className="input-field" value={draft.ctaLink} placeholder="tel:… or mailto:…"
            onChange={(e) => setDraft((d) => ({ ...d, ctaLink: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="input-label">Lines — one per line (address lines, phone numbers, etc.)</label>
        <textarea
          className="input-field min-h-[64px] font-mono text-xs"
          value={draft.bullets.join('\n')}
          onChange={(e) => setDraft((d) => ({ ...d, bullets: e.target.value.split('\n') }))}
          placeholder="Line 1&#10;Line 2"
        />
      </div>
    </div>
  );
}

// ── contact page editor ───────────────────────────────────────────────────────

function ContactPageEditor({ initial }: { initial?: ContactPageContent }) {
  const heroInit = initial?.hero;
  const [heroDraft, setHeroDraft] = useState({
    eyebrow:     heroInit?.eyebrow     ?? 'GET IN TOUCH',
    title:       heroInit?.title       ?? 'Contact Us',
    description: heroInit?.description ?? '',
    ctaText:     heroInit?.ctaText     ?? 'Send Message',
  });
  const formInit = initial?.form;
  const [formDraft, setFormDraft] = useState({
    title:    formInit?.title    ?? 'Send Us a Message',
    formNote: (formInit?.metadata?.form_note as string) ?? '',
  });

  const [heroPending, startHero] = useTransition();
  const [formPending, startForm] = useTransition();
  const [heroStatus, setHeroStatus] = useState<Status>(null);
  const [formStatus, setFormStatus] = useState<Status>(null);

  function saveHero() {
    setHeroStatus(null);
    startHero(async () => {
      const res = await updateContactSectionAction('contact_page_hero', {
        eyebrow:     heroDraft.eyebrow,
        title:       heroDraft.title,
        description: heroDraft.description,
        ctaText:     heroDraft.ctaText,
      });
      setHeroStatus(res.ok
        ? { ok: true, msg: 'Saved' }
        : { ok: false, msg: 'ok' in res && !res.ok ? res.error : 'Save failed' });
    });
  }

  function saveForm() {
    setFormStatus(null);
    startForm(async () => {
      const res = await updateContactSectionAction('contact_page_form', {
        title:    formDraft.title,
        metadata: { form_note: formDraft.formNote },
      });
      setFormStatus(res.ok
        ? { ok: true, msg: 'Saved' }
        : { ok: false, msg: 'ok' in res && !res.ok ? res.error : 'Save failed' });
    });
  }

  return (
    <div className="space-y-4">
      {/* Hero fields */}
      <div className="bg-white p-5 shadow-sm space-y-3" style={{ border: '1px solid #f1f1f1' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hero Strip</span>
          <div className="flex items-center gap-3">
            <SaveStatus status={heroStatus} />
            <button onClick={saveHero} disabled={heroPending} className="btn-gold py-1.5 px-4 text-xs disabled:opacity-50">
              <Save size={13} /> {heroPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="input-label">Eyebrow Label</label>
            <input className="input-field" value={heroDraft.eyebrow}
              onChange={(e) => setHeroDraft((d) => ({ ...d, eyebrow: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">Page Title</label>
            <input className="input-field" value={heroDraft.title}
              onChange={(e) => setHeroDraft((d) => ({ ...d, title: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="input-label">Sub-description</label>
          <textarea className="input-field min-h-[56px]" value={heroDraft.description}
            onChange={(e) => setHeroDraft((d) => ({ ...d, description: e.target.value }))} />
        </div>
      </div>

      {/* Form heading */}
      <div className="bg-white p-5 shadow-sm space-y-3" style={{ border: '1px solid #f1f1f1' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Form Heading</span>
          <div className="flex items-center gap-3">
            <SaveStatus status={formStatus} />
            <button onClick={saveForm} disabled={formPending} className="btn-gold py-1.5 px-4 text-xs disabled:opacity-50">
              <Save size={13} /> {formPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="input-label">Form Title</label>
            <input className="input-field" value={formDraft.title}
              onChange={(e) => setFormDraft((d) => ({ ...d, title: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">Form Note (shown below title)</label>
            <input className="input-field" value={formDraft.formNote}
              onChange={(e) => setFormDraft((d) => ({ ...d, formNote: e.target.value }))}
              placeholder="e.g. We respond within 1 business day." />
          </div>
        </div>
      </div>

      {/* Contact info cards */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">Contact Info Cards</div>
        {(initial?.infoCards ?? []).map((card) => (
          <ContactCardEditor key={card.id} initial={card} />
        ))}
        {!initial?.infoCards?.length && (
          <p className="text-xs text-gray-400 italic px-1">
            No cards found. Run migration 006 in Supabase to seed defaults.
          </p>
        )}
      </div>
    </div>
  );
}

// ── bulk benefit card editor ──────────────────────────────────────────────────

function BulkBenefitCardEditor({ initial }: { initial: HomepageCard }) {
  const [draft, setDraft] = useState(initial);
  const [pending, start]  = useTransition();
  const [status, setStatus] = useState<Status>(null);

  function save() {
    setStatus(null);
    start(async () => {
      const res = await updateBulkBenefitCardAction(draft.id, {
        title:       draft.title,
        description: draft.description,
        iconName:    draft.iconName,
      });
      setStatus(res.ok
        ? { ok: true, msg: 'Saved' }
        : { ok: false, msg: 'ok' in res && !res.ok ? res.error : 'Save failed' });
    });
  }

  return (
    <div className="bg-white p-4 shadow-sm space-y-3" style={{ border: '1px solid #f1f1f1', borderRadius: 8 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Card: {initial.title}</span>
        <div className="flex items-center gap-2">
          <SaveStatus status={status} />
          <button onClick={save} disabled={pending} className="btn-gold py-1 px-3 text-xs disabled:opacity-50">
            <Save size={11} /> {pending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3">
        <div>
          <label className="input-label">Icon Name (Lucide)</label>
          <input className="input-field font-mono text-xs" value={draft.iconName} placeholder="DollarSign"
            onChange={(e) => setDraft((d) => ({ ...d, iconName: e.target.value }))} />
        </div>
        <div>
          <label className="input-label">Title</label>
          <input className="input-field" value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="input-label">Description</label>
        <textarea className="input-field min-h-[56px]" value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
      </div>
    </div>
  );
}

// ── bulk enquiry page editor ──────────────────────────────────────────────────

function BulkEnquiryPageEditor({ initial }: { initial?: BulkEnquiryPageContent }) {
  const heroInit = initial?.hero;
  const [heroDraft, setHeroDraft] = useState({
    eyebrow:     heroInit?.eyebrow     ?? 'WHOLESALE & DEALER',
    title:       heroInit?.title       ?? 'Bulk Enquiry / Get a Quote',
    description: heroInit?.description ?? '',
  });
  const formInit = initial?.form;
  const [formDraft, setFormDraft] = useState({
    title:    formInit?.title    ?? 'Submit Your Enquiry',
    formNote: (formInit?.metadata?.form_note as string) ?? '',
  });

  const [heroPending, startHero] = useTransition();
  const [formPending, startForm] = useTransition();
  const [heroStatus, setHeroStatus] = useState<Status>(null);
  const [formStatus, setFormStatus] = useState<Status>(null);

  function saveHero() {
    setHeroStatus(null);
    startHero(async () => {
      const res = await updateBulkEnquirySectionAction('bulk_enquiry_hero', {
        eyebrow:     heroDraft.eyebrow,
        title:       heroDraft.title,
        description: heroDraft.description,
      });
      setHeroStatus(res.ok
        ? { ok: true, msg: 'Saved' }
        : { ok: false, msg: 'ok' in res && !res.ok ? res.error : 'Save failed' });
    });
  }

  function saveForm() {
    setFormStatus(null);
    startForm(async () => {
      const res = await updateBulkEnquirySectionAction('bulk_enquiry_form', {
        title:    formDraft.title,
        metadata: { form_note: formDraft.formNote },
      });
      setFormStatus(res.ok
        ? { ok: true, msg: 'Saved' }
        : { ok: false, msg: 'ok' in res && !res.ok ? res.error : 'Save failed' });
    });
  }

  return (
    <div className="space-y-4">
      {/* Hero fields */}
      <div className="bg-white p-5 shadow-sm space-y-3" style={{ border: '1px solid #f1f1f1' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hero Strip</span>
          <div className="flex items-center gap-3">
            <SaveStatus status={heroStatus} />
            <button onClick={saveHero} disabled={heroPending} className="btn-gold py-1.5 px-4 text-xs disabled:opacity-50">
              <Save size={13} /> {heroPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="input-label">Eyebrow Label</label>
            <input className="input-field" value={heroDraft.eyebrow}
              onChange={(e) => setHeroDraft((d) => ({ ...d, eyebrow: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">Page Title</label>
            <input className="input-field" value={heroDraft.title}
              onChange={(e) => setHeroDraft((d) => ({ ...d, title: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="input-label">Sub-description</label>
          <textarea className="input-field min-h-[56px]" value={heroDraft.description}
            onChange={(e) => setHeroDraft((d) => ({ ...d, description: e.target.value }))} />
        </div>
      </div>

      {/* Form heading */}
      <div className="bg-white p-5 shadow-sm space-y-3" style={{ border: '1px solid #f1f1f1' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Form Heading</span>
          <div className="flex items-center gap-3">
            <SaveStatus status={formStatus} />
            <button onClick={saveForm} disabled={formPending} className="btn-gold py-1.5 px-4 text-xs disabled:opacity-50">
              <Save size={13} /> {formPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="input-label">Form Title</label>
            <input className="input-field" value={formDraft.title}
              onChange={(e) => setFormDraft((d) => ({ ...d, title: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">Form Note</label>
            <input className="input-field" value={formDraft.formNote}
              onChange={(e) => setFormDraft((d) => ({ ...d, formNote: e.target.value }))}
              placeholder="e.g. Our team will contact you within 24 hours." />
          </div>
        </div>
      </div>

      {/* Benefit cards */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">Benefit Cards</div>
        {(initial?.benefits ?? []).map((card) => (
          <BulkBenefitCardEditor key={card.id} initial={card} />
        ))}
        {!initial?.benefits?.length && (
          <p className="text-xs text-gray-400 italic px-1">
            No cards found. Run migration 006 in Supabase to seed defaults.
          </p>
        )}
      </div>
    </div>
  );
}

// ── main ContentEditor ────────────────────────────────────────────────────────

export default function ContentEditor({
  initialContent,
  initialAdvantageSection,
  initialOrderingSection,
  initialOrderingCards,
  initialFooterContent,
  initialAboutSection,
  initialPopups,
  initialContactContent,
  initialBulkEnquiryContent,
}: {
  initialContent:            SiteContent;
  initialAdvantageSection:   HomepageSection;
  initialOrderingSection:    HomepageSection;
  initialOrderingCards:      HomepageCard[];
  initialFooterContent:      FooterContent;
  initialAboutSection?:      HomepageSection;
  initialPopups?:            SitePopup[];
  initialContactContent?:    ContactPageContent;
  initialBulkEnquiryContent?: BulkEnquiryPageContent;
}) {
  const [draft, setDraft] = useState<SiteContent>(initialContent);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>(null);
  const savedSnapshot = useRef(JSON.stringify(initialContent));
  const dirty = JSON.stringify(draft) !== savedSnapshot.current;

  // ── footer content state ──
  const [footerDraft, setFooterDraft] = useState({
    brandBlurb:     initialFooterContent.brandBlurb,
    factoryAddress: initialFooterContent.factoryAddress,
    officeAddress:  initialFooterContent.officeAddress,
    phoneNumbers:   initialFooterContent.phoneNumbers.join('\n'),
    email:          initialFooterContent.email,
  });
  const [footerPending, startFooterTransition] = useTransition();
  const [footerStatus, setFooterStatus] = useState<Status>(null);

  // ── grouped footer links state ──
  const quickLinks   = initialFooterContent.links.filter((l) => l.groupKey === 'quick_links');
  const productLinks = initialFooterContent.links.filter((l) => l.groupKey === 'product_links');

  function save() {
    setStatus(null);
    startTransition(async () => {
      const res = await saveContentAction(draft);
      if (res.ok) {
        savedSnapshot.current = JSON.stringify(draft);
        setStatus({ ok: true, msg: 'Saved — changes are live on the website.' });
      } else {
        setStatus({ ok: false, msg: res.error ?? 'Could not save.' });
      }
    });
  }

  function saveFooter() {
    setFooterStatus(null);
    startFooterTransition(async () => {
      const res = await updateFooterContentAction({
        brandBlurb:     footerDraft.brandBlurb,
        factoryAddress: footerDraft.factoryAddress,
        officeAddress:  footerDraft.officeAddress,
        phoneNumbers:   footerDraft.phoneNumbers.split('\n').map((s) => s.trim()).filter(Boolean),
        email:          footerDraft.email,
      });
      setFooterStatus(res.ok
        ? { ok: true, msg: 'Footer content saved.' }
        : { ok: false, msg: 'ok' in res && !res.ok ? res.error : 'Save failed' });
    });
  }

  // ── brand helpers ──
  const setBrand = (field: keyof SiteContent['brand'], value: string) =>
    setDraft((d) => ({ ...d, brand: { ...d.brand, [field]: value } }));

  // ── slide helpers ──
  const setSlide = (i: number, patch: Partial<HeroSlide>) =>
    setDraft((d) => ({ ...d, hero: { slides: d.hero.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) } }));
  const setSlideCta = (i: number, key: 'cta1' | 'cta2', patch: Partial<HeroSlide['cta1']>) =>
    setDraft((d) => ({ ...d, hero: { slides: d.hero.slides.map((s, idx) => (idx === i ? { ...s, [key]: { ...s[key], ...patch } } : s)) } }));
  const addSlide = () =>
    setDraft((d) => ({ ...d, hero: { slides: [...d.hero.slides, { id: Date.now(), headline: 'New headline', subtext: 'Supporting text.', cta1: { label: 'Explore Products', href: '/shop' }, cta2: { label: 'Get a Quote', href: '/enquiry' }, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85', overlay: 'rgba(26,35,64,0.65)' }] } }));
  const removeSlide = (i: number) =>
    setDraft((d) => ({ ...d, hero: { slides: d.hero.slides.filter((_, idx) => idx !== i) } }));

  // ── usp helpers ──
  const setUsp = (i: number, patch: Partial<UspItem>) =>
    setDraft((d) => ({ ...d, usps: d.usps.map((u, idx) => (idx === i ? { ...u, ...patch } : u)) }));
  const addUsp = () =>
    setDraft((d) => ({ ...d, usps: [...d.usps, { icon: 'award', title: 'New feature', description: 'Describe this advantage.' }] }));
  const removeUsp = (i: number) => setDraft((d) => ({ ...d, usps: d.usps.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-8 pb-28">
      {/* Intro */}
      <div className="bg-white p-5 shadow-sm flex items-start gap-3" style={{ border: '1px solid #f1f1f1' }}>
        <ImageIcon size={18} className="text-gold-500 mt-0.5 shrink-0" />
        <p className="text-sm text-gray-600">
          Edit homepage and footer content. Changes to banners, brand info and USP cards go live via the <strong>Save Changes</strong> button below.
          Section headings, ordering cards, and footer sections have individual save buttons.
        </p>
      </div>

      {/* ── HERO SLIDES / TAGLINES ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full" style={{ background: 'var(--color-gold-400)' }} />
            <div>
              <h3 className="font-bold text-navy-500">Homepage Banners &amp; Taglines</h3>
              <p className="text-xs text-gray-400 mt-0.5">The rotating banners at the top of your homepage.</p>
            </div>
          </div>
          <button onClick={addSlide} className="btn-outline-gold py-2 px-4 text-xs rounded-lg"><Plus size={14} /> Add Banner</button>
        </div>

        {draft.hero.slides.map((slide, i) => (
          <div key={String(slide.id)} className="bg-white p-6 shadow-sm" style={{ border: '1px solid #f1f1f1' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Banner {i + 1}</span>
              <button onClick={() => removeSlide(i)} disabled={draft.hero.slides.length <= 1}
                className="text-gray-300 hover:text-red-500 disabled:opacity-30" title={draft.hero.slides.length <= 1 ? 'Keep at least one banner' : 'Remove'}>
                <Trash2 size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="input-label">Primary Tagline (headline)</label>
                <input className="input-field" value={slide.headline} onChange={(e) => setSlide(i, { headline: e.target.value })} />
              </div>
              <div>
                <label className="input-label">Secondary Tagline (subtext)</label>
                <textarea className="input-field min-h-[72px]" value={slide.subtext} onChange={(e) => setSlide(i, { subtext: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="input-label">Button 1 — Label</label><input className="input-field" value={slide.cta1.label} onChange={(e) => setSlideCta(i, 'cta1', { label: e.target.value })} /></div>
                <div><label className="input-label">Button 1 — Link</label><input className="input-field" value={slide.cta1.href} onChange={(e) => setSlideCta(i, 'cta1', { href: e.target.value })} /></div>
                <div><label className="input-label">Button 2 — Label</label><input className="input-field" value={slide.cta2.label} onChange={(e) => setSlideCta(i, 'cta2', { label: e.target.value })} /></div>
                <div><label className="input-label">Button 2 — Link</label><input className="input-field" value={slide.cta2.href} onChange={(e) => setSlideCta(i, 'cta2', { href: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
                <div>
                  <label className="input-label">Background Image URL</label>
                  <input className="input-field" value={slide.image} onChange={(e) => setSlide(i, { image: e.target.value })} placeholder="https://…" />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {slide.image && <img src={slide.image} alt="" className="w-24 h-16 object-cover rounded border border-gray-100" />}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── BRAND & CONTACT ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--color-gold-400)' }} />
          <div>
            <h3 className="font-bold text-navy-500">Brand &amp; Contact Details</h3>
            <p className="text-xs text-gray-400 mt-0.5">Business name and contact info shown across the site.</p>
          </div>
        </div>
        <div className="bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4" style={{ border: '1px solid #f1f1f1' }}>
          <div><label className="input-label">Business Name</label><input className="input-field" value={draft.brand.name} onChange={(e) => setBrand('name', e.target.value)} /></div>
          <div><label className="input-label">Hero Label (small text above headline)</label><input className="input-field" value={draft.brand.heroLabel} onChange={(e) => setBrand('heroLabel', e.target.value)} /></div>
          <div><label className="input-label">Primary Phone</label><input className="input-field" value={draft.brand.phonePrimary} onChange={(e) => setBrand('phonePrimary', e.target.value)} /></div>
          <div><label className="input-label">Secondary Phone</label><input className="input-field" value={draft.brand.phoneSecondary} onChange={(e) => setBrand('phoneSecondary', e.target.value)} /></div>
          <div><label className="input-label">WhatsApp Number</label><input className="input-field" value={draft.brand.whatsapp} onChange={(e) => setBrand('whatsapp', e.target.value)} /></div>
          <div><label className="input-label">Email</label><input className="input-field" value={draft.brand.email} onChange={(e) => setBrand('email', e.target.value)} /></div>
          <div><label className="input-label">Factory Address</label><input className="input-field" value={draft.brand.addressFactory} onChange={(e) => setBrand('addressFactory', e.target.value)} /></div>
          <div><label className="input-label">Office Address</label><input className="input-field" value={draft.brand.addressOffice} onChange={(e) => setBrand('addressOffice', e.target.value)} /></div>
        </div>
      </section>

      {/* ── USP CARDS ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full" style={{ background: 'var(--color-gold-400)' }} />
            <div>
              <h3 className="font-bold text-navy-500">&ldquo;The Modigold Advantage&rdquo; USP Cards</h3>
              <p className="text-xs text-gray-400 mt-0.5">The six feature cards shown below the stats bar.</p>
            </div>
          </div>
          <button onClick={addUsp} className="btn-outline-gold py-2 px-4 text-xs rounded-lg"><Plus size={14} /> Add Card</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {draft.usps.map((usp, i) => (
            <div key={i} className="bg-white p-5 shadow-sm" style={{ border: '1px solid #f1f1f1' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Card {i + 1}</span>
                <button onClick={() => removeUsp(i)} className="text-gray-300 hover:text-red-500"><Trash2 size={15} /></button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-[120px_1fr] gap-3">
                  <div>
                    <label className="input-label">Icon</label>
                    <select className="input-field" value={usp.icon} onChange={(e) => setUsp(i, { icon: e.target.value })}>
                      {USP_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Title</label>
                    <input className="input-field" value={usp.title} onChange={(e) => setUsp(i, { title: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Description</label>
                  <textarea className="input-field min-h-[64px]" value={usp.description} onChange={(e) => setUsp(i, { description: e.target.value })} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--color-gold-400)' }} />
          <div>
            <h3 className="font-bold text-navy-500">About Section</h3>
            <p className="text-xs text-gray-400 mt-0.5">The story / trust section shown below the hero. Features, badge, and CTA editable here.</p>
          </div>
        </div>
        <AboutSectionEditor initial={initialAboutSection} />
      </section>

      {/* ── POPUP MANAGER ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--color-gold-400)' }} />
          <div>
            <h3 className="font-bold text-navy-500">Popup Manager</h3>
            <p className="text-xs text-gray-400 mt-0.5">Create and manage website popups. Only one active popup is shown at a time (highest order index wins).</p>
          </div>
        </div>
        <PopupManager initialPopups={initialPopups ?? []} />
      </section>

      {/* ── CONTACT PAGE ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--color-gold-400)' }} />
          <div>
            <h3 className="font-bold text-navy-500">Contact Page</h3>
            <p className="text-xs text-gray-400 mt-0.5">Hero text, form heading, and contact info cards shown at /contact.</p>
          </div>
        </div>
        <ContactPageEditor initial={initialContactContent} />
      </section>

      {/* ── BULK ENQUIRY PAGE ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--color-gold-400)' }} />
          <div>
            <h3 className="font-bold text-navy-500">Bulk Enquiry Page</h3>
            <p className="text-xs text-gray-400 mt-0.5">Hero text, form heading, and benefit cards shown at /bulk-enquiry.</p>
          </div>
        </div>
        <BulkEnquiryPageEditor initial={initialBulkEnquiryContent} />
      </section>

      {/* ── SECTION HEADINGS ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--color-gold-400)' }} />
          <div>
            <h3 className="font-bold text-navy-500">Section Headings</h3>
            <p className="text-xs text-gray-400 mt-0.5">Eyebrow label, title, and highlighted word for each homepage section.</p>
          </div>
        </div>
        <SectionHeadingEditor label="Modigold Advantage Section" sectionKey="modigold_advantage" initial={initialAdvantageSection} />
        <SectionHeadingEditor label="Flexible Ordering Section" sectionKey="flexible_ordering"  initial={initialOrderingSection} />
      </section>

      {/* ── FLEXIBLE ORDERING CARDS ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--color-gold-400)' }} />
          <div>
            <h3 className="font-bold text-navy-500">Flexible Ordering Cards</h3>
            <p className="text-xs text-gray-400 mt-0.5">The two dark cards in the navy section (Retail + Wholesale).</p>
          </div>
        </div>
        {initialOrderingCards.map((card, i) => (
          <OrderingCardEditor key={card.id} initial={card} cardNum={i + 1} />
        ))}
        {initialOrderingCards.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No cards found. Run migration 004 in Supabase to seed the default cards.
          </p>
        )}
      </section>

      {/* ── FOOTER CONTENT ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--color-gold-400)' }} />
          <div>
            <h3 className="font-bold text-navy-500">Footer Content</h3>
            <p className="text-xs text-gray-400 mt-0.5">Brand blurb and contact details shown at the bottom of every page.</p>
          </div>
        </div>
        <div className="bg-white p-6 shadow-sm space-y-4" style={{ border: '1px solid #f1f1f1' }}>
          <div>
            <label className="input-label">Brand Blurb</label>
            <textarea className="input-field min-h-[72px]" value={footerDraft.brandBlurb}
              onChange={(e) => setFooterDraft((d) => ({ ...d, brandBlurb: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Factory Address</label>
              <input className="input-field" value={footerDraft.factoryAddress}
                onChange={(e) => setFooterDraft((d) => ({ ...d, factoryAddress: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Office Address</label>
              <input className="input-field" value={footerDraft.officeAddress}
                onChange={(e) => setFooterDraft((d) => ({ ...d, officeAddress: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Phone Numbers — one per line</label>
              <textarea className="input-field min-h-[56px] font-mono text-xs" value={footerDraft.phoneNumbers}
                onChange={(e) => setFooterDraft((d) => ({ ...d, phoneNumbers: e.target.value }))}
                placeholder="+91 9960 937 588&#10;+91 8329 369 356" />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input className="input-field" value={footerDraft.email}
                onChange={(e) => setFooterDraft((d) => ({ ...d, email: e.target.value }))} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={saveFooter} disabled={footerPending}
              className="btn-gold py-2.5 px-6 disabled:opacity-50">
              <Save size={15} /> {footerPending ? 'Saving…' : 'Save Footer Content'}
            </button>
            <SaveStatus status={footerStatus} />
          </div>
        </div>
      </section>

      {/* ── FOOTER LINKS ── */}
      <section className="space-y-4">
        <div>
          <h3 className="font-bold text-navy-500">Footer Links</h3>
          <p className="text-xs text-gray-400 mt-0.5">Quick navigation and product category links in the footer columns.</p>
        </div>
        <FooterLinksGroup groupKey="quick_links"   groupTitle="Quick Links" initialLinks={quickLinks} />
        <FooterLinksGroup groupKey="product_links" groupTitle="Products"    initialLinks={productLinks} />
      </section>

      {/* ── STICKY SAVE BAR (for brand / hero / USPs) ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-30 bg-white/95 backdrop-blur px-6 py-3 flex items-center justify-between gap-4" style={{ borderTop: '1px solid #e5e7eb' }}>
        <div className="text-sm min-w-0">
          {status ? (
            <span className={`flex items-center gap-2 ${status.ok ? 'text-emerald-600' : 'text-red-600'}`}>
              {status.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span className="truncate">{status.msg}</span>
            </span>
          ) : dirty ? (
            <span className="text-amber-600">You have unsaved changes to banners / brand / USPs.</span>
          ) : (
            <span className="text-gray-400">All banner &amp; brand changes saved.</span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" target="_blank" className="text-xs text-gold-500 underline flex items-center gap-1">
            View site <ExternalLink size={12} />
          </Link>
          <button onClick={save} disabled={pending || !dirty} className="btn-gold py-2.5 px-6 disabled:opacity-50">
            <Save size={16} /> {pending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
