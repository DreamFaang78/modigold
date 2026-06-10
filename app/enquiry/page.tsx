'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import { Send, CheckCircle } from 'lucide-react';

function EnquiryContent() {
  const params = useSearchParams();
  const preProduct = params.get('product') ?? '';

  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    product: preProduct, category: '', quantity: '', unit: 'pieces',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main>
        <div className="py-16" style={{ background: '#1A2340' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="section-label" style={{ color: '#C9A84C' }}>Wholesale & Dealer</div>
            <h1 className="heading-xl text-white">Bulk Enquiry / Get a Quote</h1>
            <p className="text-white/60 mt-3 max-w-xl">
              Tell us what you need and our sales team will respond with competitive pricing within 24 hours.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Why enquire */}
            <div className="hidden lg:block">
              <h2 className="heading-md mb-6">Why Enquire?</h2>
              <div className="space-y-5">
                {[
                  { icon: '💰', title: 'Wholesale Pricing', desc: 'Competitive rates for bulk quantities. Better margin for dealers.' },
                  { icon: '📦', title: 'Custom Specs', desc: 'Custom pipe lengths, diameters, GSM ratings and colour options.' },
                  { icon: '🚛', title: 'Door Delivery', desc: 'Pan-India logistics. Container loads arranged directly from factory.' },
                  { icon: '⚡', title: '24-Hour Response', desc: 'Our sales team reviews every enquiry within one business day.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 p-4" style={{ border: '1px solid #f1f1f1' }}>
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-bold text-navy-500 text-sm">{item.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="text-center py-20">
                  <CheckCircle size={56} className="mx-auto mb-4" style={{ color: '#C9A84C' }} />
                  <h2 className="heading-md mb-3">Enquiry Submitted!</h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Thank you! Our sales team will contact you within 24 hours with pricing details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="heading-md mb-6">Submit Your Enquiry</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="input-label">Full Name *</label>
                      <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                    </div>
                    <div>
                      <label className="input-label">Phone Number *</label>
                      <input required className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div>
                      <label className="input-label">Email Address *</label>
                      <input required type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
                    </div>
                    <div>
                      <label className="input-label">Company / Business</label>
                      <input className="input-field" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name (optional)" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="input-label">Product Category</label>
                      <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        <option value="">Select category...</option>
                        {CATEGORIES.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Specific Product</label>
                      <select className="input-field" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
                        <option value="">Select product (optional)...</option>
                        {PRODUCTS.map((p) => <option key={p.id} value={p.slug}>{p.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="input-label">Quantity Required *</label>
                      <input required className="input-field" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 500" />
                    </div>
                    <div>
                      <label className="input-label">Unit</label>
                      <select className="input-field" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
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

                  <button type="submit" className="btn-gold w-full justify-center py-4">
                    <Send size={16} /> Submit Enquiry
                  </button>
                  <p className="text-xs text-gray-400 text-center">By submitting, you agree to be contacted by our sales team. No spam, ever.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

export default function EnquiryPage() {
  return <Suspense><EnquiryContent /></Suspense>;
}
