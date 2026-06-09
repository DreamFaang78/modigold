// Pure decorative accent icons — server component, CSS-animated, zero JS overhead.
// Parent must have: position: relative; overflow: hidden;
// CSS animation handled by globals.css .floating-icon + @keyframes floatY.
// prefers-reduced-motion kills animations globally via the existing media rule.

import { Sparkles, Package, Truck, ShieldCheck, BadgeCheck, Star, Leaf } from 'lucide-react';
import type { CSSProperties } from 'react';

type Variant = 'hero' | 'ordering' | 'contact' | 'bulk';

interface DecorItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any;
  size: number;
  delay: string;
  dur: string;
  css: CSSProperties;
}

// All icons land in the visual "breathing room" of each section —
// kept to the right half on hero (content is left), scattered on dark sections.
const SETS: Record<Variant, DecorItem[]> = {
  hero: [
    { Icon: Sparkles,    size: 15, delay: '0s',   dur: '7s',  css: { top: '20%',    right: '10%', opacity: 0.22 } },
    { Icon: ShieldCheck, size: 17, delay: '2s',   dur: '9s',  css: { top: '55%',    right: '5%',  opacity: 0.14 } },
    { Icon: Star,        size: 12, delay: '0.7s', dur: '6s',  css: { top: '33%',    right: '23%', opacity: 0.12 } },
    { Icon: Package,     size: 16, delay: '2.4s', dur: '8s',  css: { bottom: '26%', right: '14%', opacity: 0.11 } },
    { Icon: BadgeCheck,  size: 13, delay: '3.8s', dur: '11s', css: { top: '13%',    right: '34%', opacity: 0.09 } },
  ],
  ordering: [
    { Icon: Sparkles,    size: 15, delay: '0s',   dur: '8s',  css: { top: '18%',    right: '7%',  opacity: 0.18 } },
    { Icon: Truck,       size: 17, delay: '2.2s', dur: '7s',  css: { bottom: '20%', right: '10%', opacity: 0.12 } },
    { Icon: Star,        size: 12, delay: '1.1s', dur: '9s',  css: { top: '45%',    left: '5%',   opacity: 0.10 } },
    { Icon: Leaf,        size: 13, delay: '3.2s', dur: '10s', css: { bottom: '30%', left: '8%',   opacity: 0.09 } },
  ],
  contact: [
    { Icon: Sparkles,    size: 15, delay: '0s',   dur: '7s',  css: { top: '22%',    right: '10%', opacity: 0.20 } },
    { Icon: ShieldCheck, size: 17, delay: '1.6s', dur: '9s',  css: { bottom: '26%', right: '7%',  opacity: 0.13 } },
    { Icon: Star,        size: 12, delay: '0.9s', dur: '8s',  css: { top: '56%',    right: '21%', opacity: 0.09 } },
  ],
  bulk: [
    { Icon: Sparkles,    size: 15, delay: '0s',   dur: '7s',  css: { top: '22%',    right: '10%', opacity: 0.20 } },
    { Icon: Truck,       size: 17, delay: '1.6s', dur: '9s',  css: { bottom: '26%', right: '7%',  opacity: 0.13 } },
    { Icon: BadgeCheck,  size: 14, delay: '0.9s', dur: '8s',  css: { top: '56%',    right: '21%', opacity: 0.10 } },
    { Icon: Star,        size: 12, delay: '2.8s', dur: '11s', css: { top: '16%',    right: '31%', opacity: 0.08 } },
  ],
};

export default function FloatingDecorIcons({ variant = 'hero' }: { variant?: Variant }) {
  const items = SETS[variant];

  return (
    // hidden on mobile, shown sm+ to keep small screens clean
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block"
      aria-hidden="true"
    >
      {items.map(({ Icon, size, delay, dur, css }, i) => (
        <div
          key={i}
          className="floating-icon"
          style={{
            ...css,
            animationDuration: dur,
            animationDelay: delay,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(201,168,76,0.09)',
              border: '1px solid rgba(201,168,76,0.2)',
            }}
          >
            <Icon size={size} style={{ color: '#C9A84C' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
