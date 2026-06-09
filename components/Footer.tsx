'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/data';
import { DEFAULT_FOOTER_CONTENT, type FooterContent } from '@/lib/content/cms-schema';

interface FooterBrand {
  phonePrimary?: string;
  phoneSecondary?: string;
  email?: string;
  addressFactory?: string;
  addressOffice?: string;
}

const BRAND_DEFAULTS: Required<FooterBrand> = {
  phonePrimary:   '+91 9960 937 588',
  phoneSecondary: '+91 8329 369 356',
  email:          'sales@modigold.in',
  addressFactory: 'B-104 MIDC Butibori, Nagpur, MH 441122',
  addressOffice:  'D-106, M.I.D.C., Hingna, Nagpur – 440016',
};

// Hardcoded fallback link lists (used when footerContent is not provided)
const FALLBACK_QUICK_LINKS = [
  { href: '/',             label: 'Home' },
  { href: '/about',        label: 'About Us' },
  { href: '/shop',         label: 'Shop' },
  { href: '/enquiry',      label: 'Bulk Enquiry' },
  { href: '/track-order',  label: 'Track Order' },
  { href: '/contact',      label: 'Contact Us' },
  { href: '/admin',        label: 'Admin Login' },
];

export default function Footer({
  brand,
  footerContent,
}: {
  brand?: FooterBrand;
  footerContent?: FooterContent;
}) {
  const b = { ...BRAND_DEFAULTS, ...brand };

  // Dynamic or fallback values
  const brandBlurb     = footerContent?.brandBlurb     ?? DEFAULT_FOOTER_CONTENT.brandBlurb;
  const factoryAddress = footerContent?.factoryAddress ?? b.addressFactory;
  const officeAddress  = footerContent?.officeAddress  ?? b.addressOffice;
  const phoneNumbers   = footerContent?.phoneNumbers   ?? [b.phonePrimary, b.phoneSecondary];
  const email          = footerContent?.email          ?? b.email;

  const quickLinks = footerContent
    ? footerContent.links.filter((l) => l.groupKey === 'quick_links' && l.isActive)
    : FALLBACK_QUICK_LINKS.map((l, i) => ({ ...l, id: `ql-${i}`, groupKey: 'quick_links', orderIndex: i, isActive: true }));

  const productLinks = footerContent
    ? footerContent.links.filter((l) => l.groupKey === 'product_links' && l.isActive)
    : CATEGORIES.map((cat, i) => ({
        id: `pl-${i}`,
        groupKey: 'product_links',
        label: cat.name,
        href: `/shop?category=${cat.slug}`,
        orderIndex: i,
        isActive: true,
      }));

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer>
      {/* Main footer */}
      <div style={{ background: '#111930' }} className="text-white">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}
          className="max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Col 1: Brand */}
            <motion.div variants={itemVariants}>
              <div className="relative mb-5" style={{ width: 150, height: 50 }}>
                <Image
                  src="https://www.modigold.in/wp-content/uploads/2021/12/Modi-Gold-Logo1-1.png"
                  alt="Modigold Pipes"
                  fill className="object-contain brightness-150"
                />
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">{brandBlurb}</p>
              <div className="flex gap-3 flex-wrap">
                {[
                  { href: '#', label: 'Facebook',  svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="#C9A84C"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                  { href: '#', label: 'Instagram', svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#C9A84C" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                  { href: '#', label: 'YouTube',   svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#C9A84C" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#C9A84C" stroke="none" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg> },
                  { href: '#', label: 'LinkedIn',  svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="#C9A84C"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg> },
                ].map(({ href, label, svg }) => (
                  <a key={label} href={href} aria-label={label}
                    className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center transition-all hover:-translate-y-1 active:scale-95"
                    style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}
                  >
                    {svg}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Col 2: Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A84C' }}>Quick Links</h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.id ?? link.href}>
                    <Link href={link.href} className="text-white/60 hover:text-gold-400 text-sm transition-colors flex items-center gap-2">
                      <span style={{ color: '#C9A84C' }}>›</span> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Col 3: Products */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A84C' }}>Products</h3>
              <ul className="space-y-2.5">
                {productLinks.map((link) => (
                  <li key={link.id ?? link.href}>
                    <Link href={link.href} className="text-white/60 hover:text-gold-400 text-sm transition-colors flex items-center gap-2">
                      <span style={{ color: '#C9A84C' }}>›</span> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Col 4: Contact */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A84C' }}>Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPin size={15} className="shrink-0 mt-1" style={{ color: '#C9A84C' }} />
                  <div>
                    <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Factory</div>
                    <span className="text-white/60 text-sm">{factoryAddress}</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin size={15} className="shrink-0 mt-1" style={{ color: '#C9A84C' }} />
                  <div>
                    <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Office</div>
                    <span className="text-white/60 text-sm">{officeAddress}</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone size={15} className="shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
                  <div className="text-sm text-white/60">
                    {phoneNumbers.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-gold-400 block">{phone}</a>
                    ))}
                  </div>
                </li>
                <li className="flex gap-3">
                  <Mail size={15} className="shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
                  <a href={`mailto:${email}`} className="text-white/60 hover:text-gold-400 text-sm">{email}</a>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: '#080d1a', borderTop: '1px solid rgba(201,168,76,0.15)' }} className="text-white/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-center md:text-left" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))' }}>
          <span>© {new Date().getFullYear()} Modigold Pipes Pvt Ltd. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {[
              ['Privacy Policy', '/privacy-policy'],
              ['Terms & Conditions', '/terms'],
              ['Shipping Policy', '/shipping-policy'],
              ['Refund Policy', '/refund-policy'],
              ['Cancellation Policy', '/cancellation-policy'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-gold-400 transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
