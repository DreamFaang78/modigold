'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, MessageSquare, Menu, X, ChevronDown, Phone, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '@/lib/data';

interface HeaderBrand {
  phonePrimary?: string;
  phoneSecondary?: string;
  email?: string;
  addressFactory?: string;
}

const DEFAULTS: Required<HeaderBrand> = {
  phonePrimary:   '+91 9960 937 588',
  phoneSecondary: '+91 8329 369 356',
  email:          'sales@modigold.in',
  addressFactory: 'Factory: Butibori, Nagpur',
};

export default function Header({ brand }: { brand?: HeaderBrand }) {
  const b = { ...DEFAULTS, ...brand };
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [megaOpen, setMegaOpen]     = useState(false);
  const [cartCount]                 = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-navy-900 text-white/70 text-xs py-2 hidden md:block" style={{ background: '#080d1a' }}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone size={11} />
              <a href={`tel:${b.phonePrimary.replace(/\s/g,'')}`} className="hover:text-gold-400 transition-colors" style={{ color: 'inherit' }}>{b.phonePrimary}</a>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={11} />
              <a href={`tel:${b.phoneSecondary.replace(/\s/g,'')}`} className="hover:text-gold-400 transition-colors" style={{ color: 'inherit' }}>{b.phoneSecondary}</a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`mailto:${b.email}`} className="hover:text-gold-400 transition-colors" style={{ color: 'inherit' }}>{b.email}</a>
            <span className="text-white/30">|</span>
            <span>{b.addressFactory}</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-xl glass-panel' : 'bg-white'
        }`}
        style={scrolled
          ? { borderBottom: '1px solid rgba(201,168,76,0.18)' }
          : { borderBottom: '1px solid rgba(201,168,76,0.08)' }
        }
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-18 py-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div
                className="relative"
                style={{ width: 120, height: 42 }}
              >
                <Image
                  src="https://www.modigold.in/wp-content/uploads/2021/12/Modi-Gold-Logo1-1.png"
                  alt="Modigold Pipes"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 120px, 160px"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/" className="nav-link px-4 py-2 text-sm font-medium text-navy-500 hover:text-gold-400 transition-colors focus-gold rounded">Home</Link>

              {/* Products mega menu trigger */}
              <div className="relative" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
                <button
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-navy-500 hover:text-gold-400 transition-colors"
                >
                  Products <ChevronDown size={14} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega menu */}
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-2xl z-50 w-[680px] rounded-b-xl overflow-hidden"
                      style={{ borderTop: '2px solid var(--color-gold-400)' }}
                    >
                      <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-1">
                        <div className="col-span-2 mb-3 pb-3" style={{ borderBottom: '1px solid #f1f1f1' }}>
                          <span className="section-label" style={{ marginBottom: 0 }}>Product Categories</span>
                        </div>
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug}`}
                            className="flex items-start gap-3 p-3 hover:bg-gold-50 transition-colors rounded group"
                            onClick={() => setMegaOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 icon-glow" style={{ background: 'var(--color-gold-50)' }}>
                              <CategoryIcon name={cat.icon} />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-navy-500 group-hover:text-gold-500 transition-colors">{cat.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-1">{cat.description}</div>
                            </div>
                          </Link>
                        ))}
                        <div className="col-span-2 mt-3 pt-3" style={{ borderTop: '1px solid #f1f1f1' }}>
                          <Link href="/shop" className="btn-gold text-xs py-2 px-5 rounded" onClick={() => setMegaOpen(false)}>
                            View All Products →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/shop" className="px-4 py-2 text-sm font-medium text-navy-500 hover:text-gold-400 transition-colors focus-gold rounded">Shop</Link>
              <Link href="/about" className="px-4 py-2 text-sm font-medium text-navy-500 hover:text-gold-400 transition-colors focus-gold rounded">About</Link>
              <Link href="/contact" className="px-4 py-2 text-sm font-medium text-navy-500 hover:text-gold-400 transition-colors focus-gold rounded">Contact</Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link href="/shop" className="hidden md:flex p-2 text-navy-500 hover:text-gold-400 transition-colors" aria-label="Search">
                <Search size={20} />
              </Link>
              <Link href="/bulk-enquiry" className="hidden sm:flex btn-outline-gold py-2 px-4 text-xs whitespace-nowrap">
                Get a Quote
              </Link>
              <Link href="/cart" className="relative p-2 text-navy-500 hover:text-gold-400 transition-colors" aria-label="Cart">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{ background: '#C9A84C' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                className="lg:hidden p-2 text-navy-500"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden bg-white overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-0 border-t" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
                {[
                  { href: '/',             label: 'Home' },
                  { href: '/shop',         label: 'Shop All Products' },
                  { href: '/about',        label: 'About Us' },
                  { href: '/bulk-enquiry', label: 'Bulk Enquiry / Quote' },
                  { href: '/contact',      label: 'Contact Us' },
                  { href: '/track-order',  label: 'Track Order' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href}
                    className="min-h-[52px] flex items-center px-2 text-navy-500 font-medium border-b text-sm active:bg-gold-50 transition-colors"
                    style={{ borderColor: '#f5f5f5' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}

                <div className="pt-3 pb-1 font-semibold text-[10px] text-gold-400 uppercase tracking-widest px-2">
                  Product Categories
                </div>
                {CATEGORIES.map((cat) => (
                  <Link key={cat.id} href={`/shop?category=${cat.slug}`}
                    className="min-h-[48px] flex items-center px-2 text-sm text-navy-600 border-b active:bg-gold-50 transition-colors"
                    style={{ borderColor: '#f5f5f5' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}

                {/* Mobile CTA — safe-area bottom padding to avoid floating widget overlap */}
                <div
                  className="pt-4 flex gap-3"
                  style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}
                >
                  <Link
                    href="/bulk-enquiry"
                    className="btn-gold rounded-xl flex-1 justify-center text-center text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get a Quote
                  </Link>
                  <a
                    href={`tel:${b.phonePrimary.replace(/\s/g, '')}`}
                    className="btn-outline-gold rounded-xl px-4 flex items-center gap-2 shrink-0 min-w-[80px] justify-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Phone size={15} /> <span className="text-sm">Call</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function CategoryIcon({ name }: { name: string }) {
  const cls = "w-4 h-4 text-gold-500";
  const icons: Record<string, React.ReactElement> = {
    pipe:     <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
    pipeline: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>,
    layers:   <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
    droplets: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /></svg>,
    wave:     <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s2.5-5 5-5 5 10 10 10 5-5 5-5" /></svg>,
    sun:      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
    shield:   <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    cylinder: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7c0-1.657 3.582-3 8-3s8 1.343 8 3v10c0 1.657-3.582 3-8 3s-8-1.343-8-3V7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7c0 1.657 3.582 3 8 3s8-1.343 8-3" /></svg>,
  };
  return icons[name] ?? icons.pipe;
}
