'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ContactPageContent } from '@/lib/content/cms-schema';
import FloatingDecorIcons from '@/components/ui/FloatingDecorIcons';

// ── icon map ──────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  MapPin, Phone, Mail, Clock,
};

function CardIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name] ?? MapPin;
  return <Icon size={size} style={{ color: '#C9A84C' }} />;
}

// ── hero strip ────────────────────────────────────────────────────────────────

function ContactHero({ content }: { content: ContactPageContent['hero'] }) {
  const reduced = useReducedMotion();
  const supportText = (content.metadata?.support_text as string) ?? 'Response within 2 business hours';

  return (
    <div
      className="relative overflow-hidden py-16 sm:py-20"
      style={{ background: 'linear-gradient(135deg, #0d1425 0%, #1A2340 55%, #1e2d50 100%)' }}
    >
      {/* Mesh lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }}
      />

      {/* Floating decorative icons */}
      <FloatingDecorIcons variant="contact" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
        >
          {content.eyebrow && (
            <div
              className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}
            >
              {content.eyebrow}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}>
            {content.title}
          </h1>
          {content.description && (
            <p className="text-white/60 text-sm sm:text-base max-w-xl leading-relaxed mb-6">
              {content.description}
            </p>
          )}
          {/* Support badge */}
          <div
            className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#e8be4a' }}
          >
            <CheckCircle size={13} />
            {supportText}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── contact info card ─────────────────────────────────────────────────────────

function InfoCard({
  card,
  index,
}: {
  card: ContactPageContent['infoCards'][number];
  index: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' as const }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'white',
        border: '1px solid rgba(201,168,76,0.12)',
        boxShadow: '0 2px 12px rgba(26,35,64,0.06)',
      }}
    >
      {/* Top gold border */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, #C9A84C, #e8be4a, #C9A84C)' }} />

      <div className="flex gap-4 p-4 sm:p-5 pt-5 sm:pt-6">
        {/* Icon tile */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #1A2340 0%, #253060 100%)', boxShadow: '0 4px 10px rgba(26,35,64,0.25)' }}
        >
          <CardIcon name={card.iconName} size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">{card.title}</div>
          {card.bullets.map((line, i) => (
            card.ctaLink && i === 0 ? (
              <a key={i} href={card.ctaLink}
                className="text-sm text-navy-500 hover:text-gold-500 transition-colors block font-medium">
                {line}
              </a>
            ) : (
              <div key={i} className="text-sm text-navy-600">{line}</div>
            )
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── contact form ──────────────────────────────────────────────────────────────

function ContactForm({ formSection }: { formSection: ContactPageContent['form'] }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const formNote = (formSection.metadata?.form_note as string) ?? '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="text-center py-16 px-6 rounded-3xl"
        style={{ background: 'white', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 4px 24px rgba(26,35,64,0.08)' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'linear-gradient(135deg, #1A2340, #253060)' }}
        >
          <CheckCircle size={28} style={{ color: '#C9A84C' }} />
        </div>
        <h2 className="text-2xl font-bold text-navy-500 mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          Message Sent!
        </h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Thank you for reaching out. Our team will respond within 1 business day.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
          className="mt-6 text-sm text-gold-500 hover:text-gold-600 underline transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'white',
        border: '1px solid rgba(201,168,76,0.12)',
        boxShadow: '0 4px 24px rgba(26,35,64,0.08)',
      }}
    >
      {/* Top border */}
      <div className="h-[3px]"
        style={{ background: 'linear-gradient(90deg, #1A2340, #C9A84C 50%, #1A2340)' }} />

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5" id="form">
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-navy-500 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
            {formSection.title}
          </h2>
          {formNote && <p className="text-xs text-gray-400 mt-1">{formNote}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Full Name *</label>
            <input required className="input-field focus-gold rounded-lg" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name" />
          </div>
          <div>
            <label className="input-label">Phone Number</label>
            <input className="input-field focus-gold rounded-lg" value={form.phone} type="tel"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>

        <div>
          <label className="input-label">Email Address *</label>
          <input required type="email" className="input-field focus-gold rounded-lg" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com" />
        </div>

        <div>
          <label className="input-label">Subject</label>
          <input className="input-field focus-gold rounded-lg" value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="How can we help you?" />
        </div>

        <div>
          <label className="input-label">Message *</label>
          <textarea required rows={5} className="input-field focus-gold resize-none rounded-lg" value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Tell us about your requirements…" />
        </div>

        <button type="submit" className="btn-gold w-full justify-center py-4 text-sm font-semibold rounded-xl gap-2 shadow-md hover:shadow-lg">
          <Send size={16} /> Send Message
        </button>

        {/* Trust note */}
        <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
          <CheckCircle size={12} className="text-emerald-400" />
          Your information is secure and will never be shared.
        </p>
      </form>
    </div>
  );
}

// ── map placeholder ───────────────────────────────────────────────────────────

function MapSection() {
  return (
    <div className="mt-12 sm:mt-16">
      <h2 className="text-xl sm:text-2xl font-bold text-navy-500 mb-5" style={{ fontFamily: 'var(--font-playfair)' }}>
        Find Us
      </h2>
      <div
        className="w-full rounded-2xl flex items-center justify-center py-14"
        style={{ background: '#f9fafb', border: '1px solid rgba(201,168,76,0.12)' }}
      >
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #1A2340, #253060)', boxShadow: '0 6px 16px rgba(26,35,64,0.25)' }}
          >
            <MapPin size={24} style={{ color: '#C9A84C' }} />
          </div>
          <p className="font-semibold text-navy-500 mb-1">MIDC Butibori, Nagpur, MH 441122</p>
          <a
            href="https://maps.google.com/?q=MIDC+Butibori+Nagpur"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm mt-2 font-medium transition-colors hover:text-gold-600"
            style={{ color: '#C9A84C' }}
          >
            Open in Google Maps <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── main export ───────────────────────────────────────────────────────────────

export default function ContactView({ content }: { content: ContactPageContent }) {
  return (
    <>
      <ContactHero content={content.hero} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12">

          {/* Info column */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-navy-500 mb-2">Contact Information</h2>
            {content.infoCards.filter((c) => c.isActive).map((card, i) => (
              <InfoCard key={card.id} card={card} index={i} />
            ))}

            {/* Bulk enquiry CTA */}
            <div
              className="mt-6 rounded-2xl p-5 text-center"
              style={{ background: 'linear-gradient(135deg, #1A2340 0%, #253060 100%)' }}
            >
              <p className="text-white/70 text-xs mb-3 leading-relaxed">
                Looking for wholesale pricing or bulk orders?
              </p>
              <Link
                href="/bulk-enquiry"
                className="btn-gold rounded-xl w-full justify-center text-sm"
              >
                Get Bulk Quote <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Form column */}
          <ContactForm formSection={content.form} />
        </div>

        <MapSection />
      </div>
    </>
  );
}
