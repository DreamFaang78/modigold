'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import HeroSlider from '@/components/HeroSlider';
import StatCounters from '@/components/StatCounter';
import ProductCard from '@/components/ProductCard';
import { TESTIMONIALS, type Category, type Product } from '@/lib/data';
import type { SiteContent } from '@/lib/content/schema';
import type { HomepageSection, HomepageCard, FooterContent } from '@/lib/content/cms-schema';
import { Star, ArrowRight, CheckCircle, Award, Truck, Tag, Clock, Leaf, Headphones, ShieldCheck } from 'lucide-react';
import FloatingDecorIcons from '@/components/ui/FloatingDecorIcons';

export default function HomeView({
  content,
  categories,
  featuredProducts,
  advantageSection,
  orderingSection,
  orderingCards,
  footerContent,
  aboutSection,
}: {
  content: SiteContent;
  categories: Category[];
  featuredProducts: Product[];
  advantageSection: HomepageSection;
  orderingSection: HomepageSection;
  orderingCards: HomepageCard[];
  footerContent: FooterContent;
  aboutSection?: HomepageSection;
}) {
  const featured = featuredProducts;

  const fadeUpVariant = {
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <>
      <Header brand={content.brand} />
      <main>
        {/* HERO */}
        <HeroSlider slides={content.hero.slides} label={content.brand.heroLabel} />

        {/* ABOUT TEASER — dynamic via aboutSection CMS */}
        {(() => {
          const ab = aboutSection;
          const meta = (ab?.metadata ?? {}) as Record<string, unknown>;
          const features = Array.isArray(meta.features)
            ? (meta.features as string[])
            : ['ISI & BIS aligned quality standards', 'Trusted by 500+ dealers', 'Supplying across 15+ Indian states'];
          const badgeText  = (meta.badge_text  as string) || '28+ Years of Trust';
          const imageUrl   = (meta.image_url   as string) || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=85';
          const eyebrow    = ab?.eyebrow || 'SINCE 1996';
          const title      = ab?.title || 'Premium Pipes Built for Indian Businesses';
          const highlighted = ab?.highlightedText || 'Since 1996';
          const description = ab?.description || 'Manufacturing premium PVC, UPVC, and HDPE pipes with trusted quality, strong dealer relationships, and pan-India reach.';
          const ctaText    = ab?.ctaText || 'Our Story';
          const ctaLink    = ab?.ctaLink || '/about';

          // Build display title: wrap highlighted text in colored em
          const displayTitle = highlighted && title.includes(highlighted)
            ? title.replace(
                highlighted,
                `<em style="color:var(--color-gold-400);font-style:italic">${highlighted}</em>`,
              )
            : title;

          return (
            <motion.section
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
              variants={fadeUpVariant}
              className="py-20 md:py-24 relative overflow-hidden" style={{ background: '#FAF7F0' }}
            >
              {/* Subtle radial glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 80% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)' }} />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                  {/* Text column */}
                  <div>
                    <div className="section-label">{eyebrow}</div>

                    {/* Badge pill */}
                    {badgeText && (
                      <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full"
                        style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
                        <ShieldCheck size={13} style={{ color: '#C9A84C' }} />
                        <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#C9A84C' }}>
                          {badgeText}
                        </span>
                      </div>
                    )}

                    <h2
                      className="heading-lg mb-5"
                      dangerouslySetInnerHTML={{ __html: displayTitle }}
                    />

                    <p className="text-gray-600 leading-relaxed mb-6 md:text-lg">{description}</p>

                    {/* Feature pills */}
                    {features.length > 0 && (
                      <div className="flex flex-col gap-2.5 mb-8">
                        {features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl group"
                            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: 'rgba(201,168,76,0.12)' }}>
                              <CheckCircle size={13} style={{ color: '#C9A84C' }} />
                            </div>
                            <span className="text-sm text-navy-500 font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8 py-5"
                      style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      {[['1996', 'Founded'], ['500+', 'Dealers'], ['15+', 'States']].map(([val, label]) => (
                        <div key={label}>
                          <div className="text-3xl font-bold gold-gradient-text" style={{ fontFamily: 'var(--font-playfair)' }}>{val}</div>
                          <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">{label}</div>
                        </div>
                      ))}
                    </div>

                    <Link href={ctaLink} className="btn-navy rounded shadow-lg hover:-translate-y-1 transition-transform">
                      {ctaText} <ArrowRight size={16} />
                    </Link>
                  </div>

                  {/* Image column */}
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ paddingTop: '85%' }}>
                      <Image
                        src={imageUrl || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=85'}
                        alt="Modigold Factory"
                        fill className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                    </div>
                    <div className="absolute -bottom-8 -left-8 p-8 rounded-xl shadow-2xl hidden md:block z-10"
                      style={{ background: 'var(--color-navy-500)' }}>
                      <div className="text-5xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-gold-400)' }}>ISI</div>
                      <div className="text-white text-xs font-bold uppercase tracking-widest mt-2 opacity-80">Certified Quality</div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-32 h-32 hidden md:block rounded-tr-2xl"
                      style={{ border: '4px solid var(--color-gold-400)', borderLeft: 'none', borderBottom: 'none' }} />
                  </div>
                </div>
              </div>
            </motion.section>
          );
        })()}

        {/* CATEGORIES GRID */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-24 bg-white"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div variants={fadeUpVariant} className="text-center mb-16">
              <div className="section-label justify-center">What We Make</div>
              <h2 className="heading-lg">
                Product{' '}<em style={{ color: 'var(--color-gold-400)', fontStyle: 'italic' }}>Categories</em>
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto md:text-lg">
                Eight product lines covering agriculture, construction, home and industrial applications.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat) => (
                <motion.div key={cat.id} variants={fadeUpVariant} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <Link href={`/shop?category=${cat.slug}`} className="hover-gold-glow group block rounded-2xl overflow-hidden shadow-lg" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="relative overflow-hidden" style={{ paddingTop: '85%' }}>
                      <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                        <div className="text-white font-bold text-sm md:text-base leading-tight mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                          {cat.name}
                        </div>
                        <div className="text-gold-200 text-xs font-semibold uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity duration-300">{cat.productCount} products</div>
                      </div>
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full glass-panel flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-3 group-hover:translate-x-0">
                        <ArrowRight size={14} className="text-white" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* STATS */}
        <StatCounters />

        {/* WHY MODIGOLD — dynamic from advantageSection + content.usps */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-24" style={{ background: '#FAF7F0' }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div variants={fadeUpVariant} className="text-center mb-16">
              <div className="section-label justify-center">{advantageSection.eyebrow}</div>
              <h2 className="heading-lg">
                {advantageSection.title}{' '}
                <em style={{ color: 'var(--color-gold-400)', fontStyle: 'italic' }}>{advantageSection.highlightedText}</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {content.usps.map((usp, i) => (
                <motion.div
                  key={usp.title}
                  variants={fadeUpVariant}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  custom={i}
                  className="bg-white p-7 md:p-8 rounded-2xl group hover-gold-glow relative overflow-hidden"
                  style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
                >
                  {/* Decorative corner blob */}
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-bl-full -mr-8 -mt-8 opacity-40 transition-transform duration-500 group-hover:scale-125" style={{ background: 'var(--color-gold-50)' }} />
                  <div className="relative z-10">
                    {/* Premium icon tile */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, #1A2340 0%, #253060 100%)',
                        boxShadow: '0 8px 24px rgba(26,35,64,0.25)',
                      }}
                    >
                      <USPIcon name={usp.icon} />
                    </div>
                    <h3 className="font-bold text-navy-500 mb-3 text-lg md:text-xl" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {usp.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{usp.description}</p>
                  </div>
                  {/* Gold bottom sweep on hover */}
                  <div className="absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full" style={{ background: 'var(--color-gold-400)' }} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FEATURED PRODUCTS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10 md:mb-12">
              <div>
                <div className="section-label">Handpicked for You</div>
                <h2 className="heading-lg">Featured <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Products</em></h2>
              </div>
              <Link href="/shop" className="btn-outline-gold hidden md:flex">View All <ArrowRight size={16} /></Link>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
            >
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
            <div className="text-center mt-10 md:hidden">
              <Link href="/shop" className="btn-outline-gold">View All Products</Link>
            </div>
          </div>
        </section>

        {/* HYBRID MODEL — dynamic from orderingSection + orderingCards */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-24 relative overflow-hidden" style={{ background: 'var(--color-navy-500)' }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[70%] rounded-full bg-gold-400/5 blur-[120px]" />
            <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[70%] rounded-full bg-navy-400/10 blur-[120px]" />
          </div>

          {/* Floating decorative icons */}
          <FloatingDecorIcons variant="ordering" />

          <div className="relative max-w-5xl mx-auto px-6 z-10">
            <motion.div variants={fadeUpVariant} className="text-center mb-16">
              <div className="section-label justify-center" style={{ color: 'var(--color-gold-400)' }}>
                {orderingSection.eyebrow}
              </div>
              <h2 className="heading-lg text-white">
                {orderingSection.title}{' '}
                <em style={{ color: 'var(--color-gold-400)' }}>{orderingSection.highlightedText}</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {orderingCards.map((card) => (
                <motion.div
                  key={card.id}
                  variants={fadeUpVariant}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="p-7 md:p-10 rounded-3xl glass-panel-dark relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_24px_48px_rgba(201,168,76,0.12)]"
                >
                  {/* Top accent stripe */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                    style={{ background: card.variant === 'retail' ? '#10b981' : 'var(--color-gold-400)' }}
                  />
                  {/* Corner radial glow */}
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-bl-full pointer-events-none opacity-10"
                    style={{ background: card.variant === 'retail' ? '#10b981' : 'var(--color-gold-400)' }}
                  />
                  <div className="relative">
                    <div className={`${card.variant === 'retail' ? 'badge-buy' : 'badge-enquiry'} mb-6 text-xs py-1.5 px-4 rounded-full shadow-sm inline-block font-bold tracking-wider`}>
                      {card.badgeText}
                    </div>
                    <h3 className="text-white font-bold text-2xl mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {card.title}
                    </h3>
                    <p className="text-white/70 text-sm md:text-base leading-relaxed mb-7">{card.description}</p>
                    <ul className="space-y-3 mb-8">
                      {card.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-3 text-white/80 text-sm">
                          <CheckCircle
                            size={16}
                            style={{ color: card.variant === 'retail' ? '#10b981' : 'var(--color-gold-400)' }}
                            className="shrink-0 drop-shadow-md"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={card.ctaLink}
                      className={card.variant === 'retail' ? 'btn-gold rounded' : 'btn-outline-gold rounded'}
                    >
                      {card.ctaText}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* TESTIMONIALS */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="py-20 md:py-24"
          style={{ background: '#FAF7F0' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div variants={fadeUpVariant} className="text-center mb-12 md:mb-16">
              <div className="section-label justify-center">Customer Reviews</div>
              <h2 className="heading-lg">What Our <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Customers Say</em></h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {TESTIMONIALS.map((t) => (
                <motion.div
                  key={t.id}
                  variants={fadeUpVariant}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl hover-gold-glow group relative overflow-hidden flex flex-col"
                  style={{
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 4px 20px rgba(26,35,64,0.05)',
                  }}
                >
                  {/* Top gold accent stripe */}
                  <div className="h-[3px] w-full rounded-t-2xl"
                    style={{ background: 'linear-gradient(90deg, #C9A84C 0%, #e8be4a 50%, #C9A84C 100%)' }} />

                  <div className="p-7 md:p-8 flex flex-col flex-1">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                      ))}
                    </div>

                    {/* Quote mark with subtle circle bg */}
                    <div className="relative mb-4">
                      <div
                        className="absolute -top-1 -left-1 w-9 h-9 rounded-full opacity-60"
                        style={{ background: 'rgba(201,168,76,0.08)' }}
                      />
                      <span
                        className="relative text-4xl leading-none select-none font-bold"
                        style={{ color: '#C9A84C', fontFamily: 'Georgia, serif', lineHeight: 1, opacity: 0.9 }}
                      >
                        &ldquo;
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">{t.text}</p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md"
                        style={{ background: 'linear-gradient(135deg, #1A2340 0%, #253060 100%)' }}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <div className="font-bold text-navy-500 text-sm">{t.name}</div>
                        <div className="text-gray-400 text-xs">{t.role}</div>
                      </div>
                      {/* Verified badge */}
                      <div className="ml-auto">
                        <CheckCircle size={14} className="text-emerald-400 opacity-70" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA BANNER */}
        <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#C9A84C' }}>
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
          </div>
          {/* Edge darkening */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(26,35,64,0.15) 0%, transparent 30%, transparent 70%, rgba(26,35,64,0.15) 100%)' }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="heading-lg text-white mb-4" style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
              Ready to Order? Let&apos;s Talk.
            </h2>
            <p className="text-white/85 text-base md:text-lg mb-8 md:mb-10 max-w-xl mx-auto">
              Whether you need one garden pipe or a container load of uPVC pipes — our team is ready.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center">
              <Link href="/shop" className="btn-navy w-full sm:w-auto justify-center">Browse Products</Link>
              <Link href="/enquiry" className="btn-outline-white w-full sm:w-auto justify-center">Get Bulk Quote</Link>
              <a href={`tel:${content.brand.phonePrimary.replace(/\s/g, '')}`} className="btn-outline-white w-full sm:w-auto justify-center">
                📞 Call Us Now
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer brand={content.brand} footerContent={footerContent} />
      <FloatingButtons />
    </>
  );
}

function USPIcon({ name }: { name: string }) {
  const style = { color: 'white' };
  const icons: Record<string, React.ReactElement> = {
    award: <Award size={26} style={style} />, truck: <Truck size={26} style={style} />,
    tag: <Tag size={26} style={style} />, clock: <Clock size={26} style={style} />,
    leaf: <Leaf size={26} style={style} />, headphones: <Headphones size={26} style={style} />,
  };
  return icons[name] ?? <CheckCircle size={26} style={style} />;
}
