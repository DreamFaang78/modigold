'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeroSlide } from '@/lib/content/schema';
import FloatingDecorIcons from '@/components/ui/FloatingDecorIcons';

export default function HeroSlider({
  slides,
  label = 'Modigold Pipes Pvt Ltd',
}: {
  slides: HeroSlide[];
  label?: string;
}) {
  const [current, setCurrent]  = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 700);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[92vh] min-h-[560px] max-h-[820px] overflow-hidden">
      {/* Images with Framer Motion Parallax effect */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' as const }}
          className="absolute inset-0 z-0"
        >
          <Image src={slide.image} alt={slide.headline} fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: slide.overlay }} />
        </motion.div>
      </AnimatePresence>

      {/* Subtle content-side radial glow */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 18% 55%, rgba(201,168,76,0.09) 0%, transparent 65%)' }}
      />

      {/* Floating decorative icons — right side, desktop only */}
      <div className="absolute inset-0 z-[2]">
        <FloatingDecorIcons variant="hero" />
      </div>

      {/* Diagonal bottom clip */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-10" style={{ background: 'white', clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px" style={{ background: '#C9A84C' }} />
              <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">
                {label}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
                }}
              >
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  className="text-white mb-6"
                  style={{
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  {slide.headline}
                </motion.h1>
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed max-w-xl"
                >
                  {slide.subtext}
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
                  }}
                  className="flex flex-wrap gap-3 sm:gap-4"
                >
                  <Link href={slide.cta1.href} className="btn-gold rounded shadow-lg">{slide.cta1.label}</Link>
                  <Link href={slide.cta2.href} className="btn-outline-white rounded">{slide.cta2.label}</Link>
                </motion.div>

                {/* Mobile stats — visible below 768px */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' as const } }
                  }}
                  className="flex gap-6 mt-8 md:hidden"
                >
                  {[['28+', 'Years'], ['500+', 'Dealers'], ['15+', 'States']].map(([val, lbl]) => (
                    <div key={lbl}>
                      <div className="text-xl font-bold" style={{ color: '#C9A84C', fontFamily: 'var(--font-playfair)' }}>{val}</div>
                      <div className="text-white/60 text-xs uppercase tracking-wider">{lbl}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Arrows — bottom-anchored on mobile, mid on desktop */}
      <button onClick={prev} aria-label="Previous"
        className="absolute left-4 bottom-28 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.28)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        <ChevronLeft size={20} color="white" />
      </button>
      <button onClick={next} aria-label="Next"
        className="absolute right-4 bottom-28 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.28)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        <ChevronRight size={20} color="white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`slider-dot ${i === current ? 'active' : ''}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Stats bar — desktop only */}
      <div className="absolute bottom-8 right-6 z-10 hidden md:flex gap-8">
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

      {/* Slide progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] z-20 bg-white/10">
        <div
          key={`pb-${current}`}
          className="h-full"
          style={{
            background: 'var(--color-gold-400)',
            animation: 'heroProgress 6s linear forwards',
          }}
        />
      </div>
    </section>
  );
}
