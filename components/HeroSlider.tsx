'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SLIDES } from '@/lib/data';

export default function HeroSlider() {
  const [current, setCurrent]  = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 700);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="relative h-[92vh] min-h-[540px] max-h-[820px] overflow-hidden">
      {/* Images */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image src={s.image} alt={s.headline} fill className="object-cover" priority={i === 0} />
          <div className="absolute inset-0" style={{ background: s.overlay }} />
        </div>
      ))}

      {/* Diagonal bottom clip */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-10" style={{ background: 'white', clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px" style={{ background: '#C9A84C' }} />
              <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">
                Modigold Pipes Pvt Ltd
              </span>
            </div>

            <h1
              key={slide.id}
              className="text-white mb-6 animate-fade-up"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              {slide.headline}
            </h1>
            <p className="text-white/80 text-lg mb-10 leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {slide.subtext}
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Link href={slide.cta1.href} className="btn-gold">{slide.cta1.label}</Link>
              <Link href={slide.cta2.href} className="btn-outline-white">{slide.cta2.label}</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={prev} aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}
      >
        <ChevronLeft size={22} color="white" />
      </button>
      <button onClick={next} aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}
      >
        <ChevronRight size={22} color="white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`slider-dot ${i === current ? 'active' : ''}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-8 right-6 z-10 hidden lg:flex gap-6">
        {[
          ['28+', 'Years'],
          ['500+', 'Dealers'],
          ['15+', 'States'],
        ].map(([val, label]) => (
          <div key={label} className="text-right">
            <div className="text-2xl font-bold" style={{ color: '#C9A84C', fontFamily: 'var(--font-playfair)' }}>{val}</div>
            <div className="text-white/60 text-xs uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
