import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { CheckCircle } from 'lucide-react';

const TIMELINE = [
  { year: '1996', title: 'Company Founded', desc: 'Mr. Rajendra Bansal establishes Modigold Pipes Pvt Ltd in Nagpur, Maharashtra, starting with PVC pipe manufacturing.' },
  { year: '2001', title: 'ISI Certification', desc: 'Awarded ISI certification for uPVC casing and column pipes, cementing trust with agricultural and construction clients.' },
  { year: '2006', title: 'HDPE & Garden Hose Launch', desc: 'Expanded product line to include HDPE pipes and the now-popular Modigold garden hose range.' },
  { year: '2010', title: 'MIDC Butibori Factory', desc: 'Inaugurated a modern manufacturing facility at MIDC Butibori, Nagpur with advanced extrusion lines.' },
  { year: '2015', title: 'Shade Nets & Tarpaulins', desc: 'Diversified into agri-protection products — shade nets and cross-laminated tarpaulins for the farming community.' },
  { year: '2020', title: 'Water Tanks Division', desc: 'Launched BIS-certified triple-layer water storage tanks, completing a full agri-plumbing product suite.' },
  { year: '2024', title: '28 Years & 500+ Dealers', desc: 'Celebrating nearly three decades of quality manufacturing with a nationwide dealer network of 500+ partners.' },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="relative py-24 overflow-hidden" style={{ background: '#1A2340' }}>
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80"
            alt="Modigold Factory"
            fill className="object-cover opacity-20"
          />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="section-label" style={{ color: '#C9A84C' }}>Our Heritage</div>
            <h1 className="heading-xl text-white max-w-2xl">
              Building India&apos;s{' '}
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Water Infrastructure</em>{' '}
              Since 1996
            </h1>
            <p className="text-white/60 mt-5 max-w-xl text-lg">
              From a single factory in Nagpur to a pan-India presence — the Modigold story is one of consistency, quality and trust.
            </p>
          </div>
        </div>

        {/* Founder story */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="section-label">The Founder</div>
                <h2 className="heading-lg mb-6">Mr. Rajendra Bansal</h2>
                <p className="text-gray-600 leading-relaxed mb-5">
                  With a vision to supply high-quality, affordable plumbing solutions to Indian farmers and builders, Mr. Rajendra Bansal founded Modigold Pipes Pvt Ltd in 1996 in Nagpur — the geographical centre of India.
                </p>
                <p className="text-gray-600 leading-relaxed mb-5">
                  His founding principle was simple: <em>"Every product that leaves our factory must perform better than the customer expects."</em> That ethos has guided every hiring decision, every machine investment, and every product launch over 28 years.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Today, Modigold serves 500+ dealers across 15+ states, with a product range spanning PVC/UPVC pipes, HDPE pipes, garden hoses, shade nets, tarpaulins and water tanks.
                </p>
                <div className="space-y-3">
                  {['ISI & BIS Certified manufacturer', 'Zero customer complaints track record', 'Pan-India dealer network since 2001', 'State-of-the-art MIDC Butibori facility'].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <CheckCircle size={16} style={{ color: '#C9A84C' }} />
                      <span className="text-gray-600 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="relative overflow-hidden" style={{ paddingTop: '100%' }}>
                  <Image
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=85"
                    alt="Factory"
                    fill className="object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20" style={{ border: '3px solid #C9A84C', borderLeft: 'none', borderBottom: 'none' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20" style={{ background: '#FAF7F0' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="section-label justify-center">Our Journey</div>
              <h2 className="heading-lg">28 Years of <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Milestones</em></h2>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px" style={{ background: '#e5e7eb' }} />
              <div className="space-y-12">
                {TIMELINE.map((item, i) => (
                  <div key={item.year} className={`relative flex ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-start`}>
                    {/* Dot */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 mt-1"
                      style={{ background: '#C9A84C', borderColor: '#fff', boxShadow: '0 0 0 4px #C9A84C40' }} />
                    {/* Spacer for desktop alternate layout */}
                    <div className="hidden md:block flex-1" />
                    {/* Card */}
                    <div className="flex-1 ml-14 md:ml-0">
                      <div className="bg-white p-6 shadow-sm card-hover" style={{ border: '1px solid #f1f1f1' }}>
                        <div className="text-sm font-bold mb-1" style={{ color: '#C9A84C' }}>{item.year}</div>
                        <h3 className="font-bold text-navy-500 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{item.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Factory section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-4">
                {[
                  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80',
                  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
                  'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=500&q=80',
                  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80&sat=-30',
                ].map((src, i) => (
                  <div key={i} className="relative overflow-hidden" style={{ paddingTop: '80%' }}>
                    <Image src={src} alt="Facility" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="section-label">Our Facility</div>
                <h2 className="heading-lg mb-6">State-of-the-Art <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Manufacturing</em></h2>
                <p className="text-gray-600 leading-relaxed mb-5">
                  Our primary manufacturing facility at MIDC Butibori, Nagpur spans over 50,000 sq ft and houses modern PVC, UPVC, and HDPE extrusion lines imported from leading European and Taiwanese manufacturers.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Every batch goes through multi-point quality checks — from raw material testing to finished product inspection — before leaving the factory floor.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['50,000 sq ft', 'Factory Area'],
                    ['12+', 'Extrusion Lines'],
                    ['200+', 'Employees'],
                    ['BIS/ISI', 'Certified'],
                  ].map(([val, label]) => (
                    <div key={label} className="p-4" style={{ background: '#FAF7F0', border: '1px solid #e5e7eb' }}>
                      <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#C9A84C' }}>{val}</div>
                      <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
