'use client';
import React, { useEffect, useRef, useState } from 'react';

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  icon: string;
}

function useCountUp(target: number, duration = 2000, trigger: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger || target === 0) { setCount(target); return; }
    const start = performance.now();
    const step = (now: number) => {
      const pct = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setCount(Math.floor(eased * target));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, trigger]);

  return count;
}

function SingleStat({ value, suffix = '', label, icon }: StatCounterProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const count  = useCountUp(value, 2000, triggered);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const icons: Record<string, React.ReactElement> = {
    award:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8"><circle cx="12" cy="8" r="6"/><path strokeLinecap="round" strokeLinejoin="round" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    users:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>,
    map:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  };

  return (
    <div ref={ref} className="text-center px-4">
      <div className="flex justify-center mb-3" style={{ color: '#C9A84C' }}>
        {icons[icon] ?? icons.award}
      </div>
      <div
        className="text-5xl font-bold mb-1"
        style={{ fontFamily: 'var(--font-playfair)', color: '#C9A84C' }}
      >
        {value === 0 ? '✓' : `${count}${suffix}`}
      </div>
      <div className="text-white/70 text-sm uppercase tracking-widest font-medium">{label}</div>
    </div>
  );
}

export default function StatCounters() {
  return (
    <section className="py-16" style={{ background: '#1A2340' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <SingleStat value={28} suffix="+" label="Years of Excellence" icon="award" />
          <SingleStat value={500} suffix="+" label="Dealers Associated" icon="users" />
          <SingleStat value={15} suffix="+" label="States Presence" icon="map" />
          <SingleStat value={0} suffix="" label="Zero Complaints" icon="shield" />
        </div>
      </div>
    </section>
  );
}
