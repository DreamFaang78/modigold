'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="py-16" style={{ background: '#1A2340' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="section-label" style={{ color: '#C9A84C' }}>Get in Touch</div>
            <h1 className="heading-xl text-white">Contact Us</h1>
            <p className="text-white/60 mt-3 max-w-xl">Our sales team is available Monday–Saturday, 9am–6pm IST.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Info cards */}
            <div className="space-y-6">
              {[
                {
                  icon: MapPin, label: 'Factory',
                  lines: ['B-104 MIDC Butibori', 'Nagpur, Maharashtra 441122'],
                },
                {
                  icon: MapPin, label: 'Office',
                  lines: ['D-106, M.I.D.C., Hingna', 'Nagpur – 440016, Maharashtra'],
                },
                {
                  icon: Phone, label: 'Phone',
                  lines: ['+91 9960 937 588', '+91 8329 369 356', '+91 9970 703 536'],
                },
                {
                  icon: Mail, label: 'Email',
                  lines: ['sales@modigold.in'],
                },
                {
                  icon: Clock, label: 'Working Hours',
                  lines: ['Mon–Sat: 9:00am – 6:00pm', 'Sunday: Closed'],
                },
              ].map(({ icon: Icon, label, lines }) => (
                <div key={label} className="flex gap-4 p-5" style={{ border: '1px solid #f1f1f1' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: '#fdf8ec' }}>
                    <Icon size={18} style={{ color: '#C9A84C' }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</div>
                    {lines.map((l) => <div key={l} className="text-sm text-navy-500">{l}</div>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">✅</div>
                  <h2 className="heading-md mb-3">Message Sent!</h2>
                  <p className="text-gray-500">Thank you for reaching out. Our team will respond within 1 business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="heading-md mb-6">Send Us a Message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="input-label">Full Name *</label>
                      <input required className="input-field" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="input-label">Phone Number</label>
                      <input className="input-field" value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Email Address *</label>
                    <input required type="email" className="input-field" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="input-label">Subject</label>
                    <input className="input-field" value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="How can we help you?" />
                  </div>
                  <div>
                    <label className="input-label">Message *</label>
                    <textarea required rows={5} className="input-field resize-none" value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your requirements..." />
                  </div>
                  <button type="submit" className="btn-gold w-full justify-center py-4">
                    <Send size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-16">
            <h2 className="heading-md mb-6">Find Us</h2>
            <div className="w-full h-72 flex items-center justify-center text-gray-400 text-sm"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
              <div className="text-center">
                <MapPin size={32} className="mx-auto mb-2" style={{ color: '#C9A84C' }} />
                <p className="font-medium text-navy-500">MIDC Butibori, Nagpur, MH 441122</p>
                <a href="https://maps.google.com/?q=MIDC+Butibori+Nagpur" target="_blank" rel="noopener noreferrer"
                  className="text-gold-500 underline text-sm mt-1 inline-block">
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
