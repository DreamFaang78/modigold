'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Send, CheckCircle, DollarSign, Settings, Truck, Zap, Shield, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import type { BulkEnquiryPageContent } from '@/lib/content/cms-schema';
import FloatingDecorIcons from '@/components/ui/FloatingDecorIcons';

// ── icon map ──────────────────────────────────────────────────────────────────

const BENEFIT_ICON_MAP: Record<string, React.ElementType> = {
  DollarSign, Settings, Truck, Zap, Shield, CheckCircle,
};

function BenefitIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = BENEFIT_ICON_MAP[name] ?? CheckCircle;
  return <Icon size={size} style={{ color: '#C9A84C' }} />;
}

// ── hero strip ────────────────────────────────────────────────────────────────

function BulkHero({ content }: { content: BulkEnquiryPageContent['hero'] }) {
  const reduced = useReducedMotion();
  const supportText = (content.metadata?.support_text as string) ?? 'Response within 24 hours';

  return (
    <div
      className="relative overflow-hidden py-8 sm:py-20"
      style={{ background: 'linear-gradient(135deg, #0d1425 0%, #1A2340 55%, #1e2d50 100%)' }}
    >
      {/* Mesh pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)', transform: 'translate(15%, -20%)' }}
      />

      {/* Floating decorative icons */}
      <FloatingDecorIcons variant="bulk" />

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
          <div
            className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full mb-5"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#e8be4a' }}
          >
            <Zap size={13} />
            {supportText}
          </div>

          <div>
            <a href="#bulk-enquiry-form" className="btn-gold rounded-xl w-full sm:w-auto justify-center sm:hidden">
              Fill Enquiry Form <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── benefit card ──────────────────────────────────────────────────────────────

function BenefitCard({
  card,
  index,
}: {
  card: BulkEnquiryPageContent['benefits'][number];
  index: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' as const }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background: 'white',
        border: '1px solid rgba(201,168,76,0.12)',
        boxShadow: '0 2px 12px rgba(26,35,64,0.06)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, #C9A84C, #e8be4a, #C9A84C)' }} />

      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: 'linear-gradient(135deg, #1A2340 0%, #253060 100%)', boxShadow: '0 4px 10px rgba(26,35,64,0.25)' }}
      >
        <BenefitIcon name={card.iconName} size={18} />
      </div>

      <h3 className="font-bold text-navy-500 text-sm mb-1.5">{card.title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed">{card.description}</p>
    </motion.div>
  );
}

// ── enquiry form ──────────────────────────────────────────────────────────────

function EnquiryFormInner({ formSection }: { formSection: BulkEnquiryPageContent['form'] }) {
  const params = useSearchParams();
  const preProduct = params.get('product') ?? '';

  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    product: preProduct, category: '', quantity: '', unit: 'pieces',
    message: '',
  });
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
          Enquiry Submitted!
        </h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          {formNote || 'Thank you! Our sales team will contact you within 24 hours with pricing details.'}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm text-gold-500 hover:text-gold-600 underline transition-colors"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{ background: 'white', border: '1px solid rgba(201,168,76,0.12)', boxShadow: '0 4px 24px rgba(26,35,64,0.08)' }}
    >
      <div className="h-[3px]"
        style={{ background: 'linear-gradient(90deg, #1A2340, #C9A84C 50%, #1A2340)' }} />

      <form onSubmit={handleSubmit} className="px-4 py-6 sm:p-8 space-y-5" id="form">
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
              placeholder="Your name" />
          </div>
          <div>
            <label className="input-label">Phone Number *</label>
            <input required className="input-field focus-gold rounded-lg" value={form.phone} type="tel"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 XXXXX XXXXX" />
          </div>
          <div>
            <label className="input-label">Email Address *</label>
            <input required type="email" className="input-field focus-gold rounded-lg" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@company.com" />
          </div>
          <div>
            <label className="input-label">Company / Business</label>
            <input className="input-field focus-gold rounded-lg" value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Company name (optional)" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Product Category</label>
            <select className="input-field focus-gold rounded-lg" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category…</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Specific Product</label>
            <select className="input-field focus-gold rounded-lg" value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}>
              <option value="">Select product (optional)…</option>
              {PRODUCTS.map((p) => <option key={p.id} value={p.slug}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Quantity Required *</label>
            <input required className="input-field focus-gold rounded-lg" value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="e.g. 500" />
          </div>
          <div>
            <label className="input-label">Unit</label>
            <select className="input-field focus-gold rounded-lg" value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}>
              <option value="pieces">Pieces</option>
              <option value="metres">Metres</option>
              <option value="kg">Kilograms</option>
              <option value="rolls">Rolls</option>
              <option value="bundles">Bundles</option>
              <option value="container">Containers</option>
            </select>
          </div>
        </div>

        <div>
          <label className="input-label">Additional Requirements</label>
          <textarea rows={4} className="input-field resize-none" value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Pipe diameter, thickness, colour, delivery state, timeline, etc." />
        </div>

        <button type="submit" className="btn-gold w-full justify-center py-4 text-sm font-semibold rounded-xl gap-2">
          <Send size={16} /> Submit Enquiry
        </button>
        <p className="text-xs text-gray-400 text-center">
          By submitting, you agree to be contacted by our sales team. No spam, ever.
        </p>
      </form>
    </div>
  );
}

// ── trust strip ───────────────────────────────────────────────────────────────

function TrustStrip() {
  const items = [
    { icon: Shield,       text: 'Verified B2B Supplier' },
    { icon: CheckCircle,  text: 'ISI/BIS Quality' },
    { icon: Truck,        text: 'Pan-India Delivery' },
    { icon: Zap,          text: '24-hr Response' },
  ];

  return (
    <div
      className="mt-8 rounded-2xl p-5"
      style={{ background: 'linear-gradient(135deg, #0d1425, #1A2340)', border: '1px solid rgba(201,168,76,0.15)' }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5">
            <Icon size={16} style={{ color: '#C9A84C', flexShrink: 0 }} />
            <span className="text-white/70 text-xs font-medium">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── main export ───────────────────────────────────────────────────────────────

function BulkEnquiryContent({ content }: { content: BulkEnquiryPageContent }) {
  return (
    <>
      <BulkHero content={content.hero} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-16 w-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] lg:grid-rows-[auto_auto] gap-8 lg:gap-12">

          {/* Form — mobile: 1st, desktop: top-right */}
          <div id="bulk-enquiry-form" className="order-1 lg:order-none lg:col-start-2 lg:row-start-1 w-full max-w-full scroll-mt-[88px] md:scroll-mt-[110px]">
            <Suspense fallback={<div className="h-96 bg-gray-50 rounded-3xl animate-pulse" />}>
              <EnquiryFormInner formSection={content.form} />
            </Suspense>
          </div>

          {/* Why Enquire benefit cards — mobile: 2nd, desktop: top-left */}
          <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1">
            <h2 className="text-lg font-bold text-navy-500 mb-5">Why Enquire With Us?</h2>
            <div className="space-y-4">
              {content.benefits.filter((c) => c.isActive).map((card, i) => (
                <BenefitCard key={card.id} card={card} index={i} />
              ))}
            </div>
          </div>

          {/* Trust strip — mobile: 3rd, desktop: bottom-right */}
          <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-2">
            <TrustStrip />
          </div>

          {/* Call CTA — mobile: 4th, desktop: bottom-left */}
          <div
            className="order-4 lg:order-none lg:col-start-1 lg:row-start-2 rounded-2xl p-5 h-fit"
            style={{ background: '#f9fafb', border: '1px solid rgba(201,168,76,0.1)' }}
          >
            <p className="text-xs text-gray-500 mb-3 font-medium">Just want to talk?</p>
            <a
              href="tel:+919960937588"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: '#C9A84C' }}
            >
              <ArrowRight size={14} /> +91 9960 937 588
            </a>
            <div className="text-xs text-gray-400 mt-1">Mon–Sat, 9am–6pm IST</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BulkEnquiryView({ content }: { content: BulkEnquiryPageContent }) {
  return <BulkEnquiryContent content={content} />;
}
