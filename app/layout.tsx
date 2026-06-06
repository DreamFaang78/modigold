import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Modigold Pipes Pvt Ltd — Premium PVC, UPVC & HDPE Pipes',
    template: '%s | Modigold Pipes',
  },
  description:
    '28+ years of manufacturing excellence. PVC/UPVC pipes, garden hoses, shade nets, tarpaulins and water tanks. Trusted by 500+ dealers across 15+ Indian states.',
  keywords: ['PVC pipes', 'UPVC pipes', 'HDPE pipes', 'garden hose', 'shade net', 'tarpaulin', 'water tank', 'Nagpur', 'Modigold'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Modigold Pipes Pvt Ltd',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
