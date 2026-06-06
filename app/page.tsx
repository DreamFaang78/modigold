import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import HeroSlider from '@/components/HeroSlider';
import StatCounters from '@/components/StatCounter';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, PRODUCTS, TESTIMONIALS, USPS } from '@/lib/data';
import { Star, ArrowRight, CheckCircle, Award, Truck, Tag, Clock, Leaf, Headphones } from 'lucide-react';

export default function HomePage() {
  const featured = PRODUCTS.filter((p) => p.featured);

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <HeroSlider />

        {/* ABOUT TEASER */}
        <section className="py-20" style={{ background: '#FAF7F0' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="section-label">Our Story</div>
                <h2 className="heading-lg mb-6">
                  28 Years of{' '}
                  <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Manufacturing</em>{' '}
                  Excellence
                </h2>
                <p className="text-gray-600 leading-relaxed mb-5">
                  Founded in 1996 by <strong>Mr. Rajendra Bansal</strong> in the industrial heartland of Nagpur,
                  Modigold Pipes Pvt Ltd has grown from a regional manufacturer to a pan-India supplier trusted
                  by 500+ dealers, farmers, contractors and builders.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Our MIDC Butibori factory operates with state-of-the-art extrusion lines, producing PVC, UPVC,
                  HDPE pipes, garden hoses, shade nets, tarpaulins and water tanks — all to BIS/ISI standards.
                </p>
                <div className="grid grid-cols-3 gap-6 mb-8 py-6" style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                  {[['1996', 'Founded'], ['500+', 'Dealers'], ['15+', 'States']].map(([val, label]) => (
                    <div key={label}>
                      <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#C9A84C' }}>{val}</div>
                      <div className="text-gray-500 text-sm uppercase tracking-wider">{label}</div>
                    </div>
                  ))}
                </div>
                <Link href="/about" className="btn-navy">Our Story <ArrowRight size={16} /></Link>
              </div>

              <div className="relative">
                <div className="relative overflow-hidden" style={{ paddingTop: '80%' }}>
                  <Image
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=85"
                    alt="Modigold Factory"
                    fill className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 p-6 shadow-2xl hidden md:block" style={{ background: '#1A2340' }}>
                  <div className="text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#C9A84C' }}>ISI</div>
                  <div className="text-white text-xs uppercase tracking-widest mt-1">Certified</div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 hidden md:block" style={{ border: '3px solid #C9A84C', borderLeft: 'none', borderBottom: 'none' }} />
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES GRID */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="section-label justify-center">What We Make</div>
              <h2 className="heading-lg">
                Product{' '}<em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Categories</em>
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                Eight product lines covering agriculture, construction, home and industrial applications.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {CATEGORIES.map((cat) => (
                <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="card-hover group block">
                  <div className="relative overflow-hidden" style={{ paddingTop: '70%' }}>
                    <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to top, rgba(26,35,64,0.85) 0%, rgba(26,35,64,0.2) 60%, transparent 100%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {cat.name}
                      </div>
                      <div className="text-white/60 text-xs mt-0.5">{cat.productCount} products</div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 scale-x-0 group-hover:scale-x-100" style={{ background: '#C9A84C' }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <StatCounters />

        {/* WHY MODIGOLD */}
        <section className="py-20" style={{ background: '#FAF7F0' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="section-label justify-center">Why Choose Us</div>
              <h2 className="heading-lg">The Modigold <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Advantage</em></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {USPS.map((usp) => (
                <div key={usp.title} className="bg-white p-8 card-hover group" style={{ border: '1px solid #f1f1f1' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: '#fdf8ec' }}>
                    <USPIcon name={usp.icon} />
                  </div>
                  <h3 className="font-bold text-navy-500 mb-3" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.125rem' }}>
                    {usp.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{usp.description}</p>
                  <div className="mt-5 h-0.5 w-8 transition-all duration-300 group-hover:w-full" style={{ background: '#C9A84C' }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="section-label">Handpicked for You</div>
                <h2 className="heading-lg">Featured <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Products</em></h2>
              </div>
              <Link href="/shop" className="btn-outline-gold hidden md:flex">View All <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10 md:hidden">
              <Link href="/shop" className="btn-outline-gold">View All Products</Link>
            </div>
          </div>
        </section>

        {/* HYBRID MODEL */}
        <section className="py-16" style={{ background: '#1A2340' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="section-label justify-center" style={{ color: '#C9A84C' }}>Flexible Ordering</div>
              <h2 className="heading-lg text-white">
                Buy Retail or Order Bulk — <em style={{ color: '#C9A84C' }}>Your Choice</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  badge: 'badge-buy', badgeLabel: 'Buy Online',
                  title: 'Retail Purchase',
                  desc: 'Add to cart, pay via Razorpay (UPI, card, netbanking, wallets), and get delivered to your door. Available for garden pipes, spray nozzles and small SKUs.',
                  features: ['Fixed retail price visible', 'Add to Cart + Instant Checkout', 'Prepaid, Partial COD, or Full COD', 'Live shipment tracking'],
                  iconColor: '#10b981', cta: { label: 'Shop Now', href: '/shop', cls: 'btn-gold' },
                },
                {
                  badge: 'badge-enquiry', badgeLabel: 'Bulk Enquiry',
                  title: 'Wholesale / Dealer',
                  desc: 'For container loads, dealer purchases, or custom specs — submit an enquiry and our sales team will respond with competitive pricing within 24 hours.',
                  features: ['Custom quantity & spec requests', 'Dealer & wholesale pricing', 'Dedicated sales support', 'Pan-India logistics network'],
                  iconColor: '#C9A84C', cta: { label: 'Get a Quote', href: '/enquiry', cls: 'btn-outline-gold' },
                },
              ].map((item) => (
                <div key={item.title} className="p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <div className={item.badge + ' mb-5 text-sm py-1 px-3 inline-block'}>{item.badgeLabel}</div>
                  <h3 className="text-white font-bold text-xl mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">{item.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-white/70 text-sm">
                        <CheckCircle size={14} style={{ color: item.iconColor }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={item.cta.href} className={item.cta.cls}>{item.cta.label}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20" style={{ background: '#FAF7F0' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="section-label justify-center">Customer Reviews</div>
              <h2 className="heading-lg">What Our <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Customers Say</em></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="bg-white p-8 card-hover" style={{ border: '1px solid #f1f1f1' }}>
                  <div className="flex mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < t.rating ? 'star' : 'star-empty'} fill={i < t.rating ? '#f59e0b' : 'none'} />
                    ))}
                  </div>
                  <div className="text-5xl leading-none mb-4" style={{ color: '#C9A84C', fontFamily: 'Georgia, serif' }}>"</div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 -mt-6">{t.text}</p>
                  <div className="flex items-center gap-3" style={{ borderTop: '1px solid #f1f1f1', paddingTop: '1.25rem' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: '#1A2340' }}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-bold text-navy-500 text-sm">{t.name}</div>
                      <div className="text-gray-400 text-xs">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="relative py-20 overflow-hidden" style={{ background: '#C9A84C' }}>
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
          </div>
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h2 className="heading-lg text-white mb-4">Ready to Order? Let&apos;s Talk.</h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Whether you need one garden pipe or a container load of uPVC pipes — our team is ready.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/shop" className="btn-navy">Browse Products</Link>
              <Link href="/enquiry" className="btn-outline-white">Get Bulk Quote</Link>
              <a href="tel:+919960937588" className="btn-outline-white">📞 Call Us Now</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}

function USPIcon({ name }: { name: string }) {
  const style = { color: '#C9A84C' };
  const icons: Record<string, React.ReactElement> = {
    award: <Award size={28} style={style} />, truck: <Truck size={28} style={style} />,
    tag: <Tag size={28} style={style} />, clock: <Clock size={28} style={style} />,
    leaf: <Leaf size={28} style={style} />, headphones: <Headphones size={28} style={style} />,
  };
  return icons[name] ?? <CheckCircle size={28} style={style} />;
}
