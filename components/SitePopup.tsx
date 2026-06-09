'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { SitePopup } from '@/lib/content/cms-schema';

const STORAGE_KEY_PREFIX = 'mg_popup_seen_';

function shouldShow(popup: SitePopup): boolean {
  if (!popup.isActive) return false;

  const now = Date.now();
  if (popup.startAt && new Date(popup.startAt).getTime() > now) return false;
  if (popup.endAt   && new Date(popup.endAt).getTime()   < now) return false;

  const key = STORAGE_KEY_PREFIX + popup.id;

  if (popup.displayFrequency === 'always') return true;

  if (popup.displayFrequency === 'once_per_session') {
    if (typeof sessionStorage !== 'undefined') {
      if (sessionStorage.getItem(key)) return false;
    }
    return true;
  }

  if (popup.displayFrequency === 'once_per_day') {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (stored) {
        const seenDate = new Date(stored).toDateString();
        const today    = new Date().toDateString();
        if (seenDate === today) return false;
      }
    }
    return true;
  }

  return true;
}

function markSeen(popup: SitePopup): void {
  const key = STORAGE_KEY_PREFIX + popup.id;
  if (popup.displayFrequency === 'once_per_session' && typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(key, '1');
  }
  if (popup.displayFrequency === 'once_per_day' && typeof localStorage !== 'undefined') {
    localStorage.setItem(key, new Date().toISOString());
  }
}

export default function SitePopup({ popup }: { popup?: SitePopup | null }) {
  const [open, setOpen]       = useState(false);
  const shouldReduceMotion    = useReducedMotion();

  useEffect(() => {
    if (!popup || !shouldShow(popup)) return;

    const delay = (popup.triggerDelaySeconds ?? 2) * 1000;
    const timer = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(timer);
  }, [popup]);

  function dismiss() {
    if (popup) markSeen(popup);
    setOpen(false);
  }

  if (!popup?.isActive) return null;

  // Animation variants — skip if user prefers reduced motion
  const backdropVariant = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
    exit:    { opacity: 0 },
  };

  const modalVariant = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden:  { opacity: 0, scale: 0.94, y: 20 },
        visible: { opacity: 1, scale: 1,    y: 0,
          transition: { type: 'spring' as const, stiffness: 340, damping: 28 } },
        exit:    { opacity: 0, scale: 0.96, y: 10,
          transition: { duration: 0.18 } },
      };

  // Bottom sheet on mobile (sm and below)
  const sheetVariant = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden:  { opacity: 0, y: '100%' },
        visible: { opacity: 1, y: 0,
          transition: { type: 'spring' as const, stiffness: 320, damping: 30 } },
        exit:    { opacity: 0, y: '100%',
          transition: { duration: 0.22 } },
      };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="popup-backdrop"
            variants={backdropVariant}
            initial="hidden" animate="visible" exit="exit"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-navy-900/50 backdrop-blur-[2px]"
            onClick={dismiss}
            aria-hidden="true"
          />

          {/* Modal — hidden on mobile, bottom sheet takes over */}
          <motion.div
            key="popup-modal"
            role="dialog"
            aria-modal="true"
            aria-label={popup.title}
            variants={modalVariant}
            initial="hidden" animate="visible" exit="exit"
            className="fixed z-[201] inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:top-1/2 sm:w-full sm:max-w-md hidden sm:block"
          >
            <PopupCard popup={popup} onDismiss={dismiss} />
          </motion.div>

          {/* Bottom sheet — visible on mobile only */}
          <motion.div
            key="popup-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={popup.title}
            variants={sheetVariant}
            initial="hidden" animate="visible" exit="exit"
            className="fixed z-[201] bottom-0 left-0 right-0 sm:hidden"
          >
            <PopupCard popup={popup} onDismiss={dismiss} sheet />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── inner card ─────────────────────────────────────────────────────────────────

function PopupCard({
  popup,
  onDismiss,
  sheet = false,
}: {
  popup: SitePopup;
  onDismiss: () => void;
  sheet?: boolean;
}) {
  return (
    <div
      className={`relative bg-white overflow-hidden ${sheet ? 'rounded-t-3xl' : 'rounded-3xl'}`}
      style={{
        boxShadow: '0 24px 64px rgba(26,35,64,0.22), 0 0 0 1px rgba(201,168,76,0.12)',
      }}
    >
      {/* Top gradient border */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: 'linear-gradient(90deg, #C9A84C, #e8be4a, #C9A84C)' }}
      />

      {/* Radial glow in corner */}
      <div
        className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />

      {/* Close button */}
      <button
        onClick={onDismiss}
        aria-label="Close popup"
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        style={{ color: '#9ca3af' }}
      >
        <X size={16} />
      </button>

      <div className="p-7 pt-8">
        {/* Badge */}
        {popup.badgeText && (
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #1A2340 0%, #253060 100%)', boxShadow: '0 4px 12px rgba(26,35,64,0.3)' }}
            >
              <Tag size={14} style={{ color: '#C9A84C' }} />
            </div>
            <span
              className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}
            >
              {popup.badgeText}
            </span>
          </div>
        )}

        {/* Title */}
        <h2
          className="text-xl font-bold text-navy-500 mb-3 leading-snug pr-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {popup.title}
        </h2>

        {/* Description */}
        {popup.description && (
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {popup.description}
          </p>
        )}

        {/* Feature hint */}
        <div
          className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl"
          style={{ background: '#FAF7F0', border: '1px solid rgba(201,168,76,0.12)' }}
        >
          <Sparkles size={14} style={{ color: '#C9A84C', flexShrink: 0 }} />
          <span className="text-xs text-gray-500">
            Response within <strong className="text-navy-500">24 hours</strong> — competitive pricing guaranteed.
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          {popup.ctaText && popup.ctaLink && (
            <Link
              href={popup.ctaLink}
              onClick={onDismiss}
              className="btn-gold rounded-xl justify-center text-center w-full"
              style={{ minHeight: 48 }}
            >
              {popup.ctaText}
            </Link>
          )}
          {popup.secondaryCtaText && popup.secondaryCtaLink && (
            <Link
              href={popup.secondaryCtaLink}
              onClick={onDismiss}
              className="btn-outline-gold rounded-xl justify-center text-center w-full"
              style={{ minHeight: 44 }}
            >
              {popup.secondaryCtaText}
            </Link>
          )}
          <button
            onClick={onDismiss}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors py-1 focus:outline-none focus-visible:underline"
          >
            No thanks, not right now
          </button>
        </div>
      </div>
    </div>
  );
}
