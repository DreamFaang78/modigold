'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const MOCK_ORDER = {
  id: 'MG-2024-00891',
  date: '3 June 2024',
  status: 'In Transit',
  awb: 'SHP-10293847',
  carrier: 'Shiprocket Express',
  eta: '6 June 2024',
  items: ['Premium Garden Pipe 12mm × 30m (×2)', 'Heavy Duty Garden Pipe 19mm × 50m (×1)'],
  timeline: [
    { label: 'Order Placed', date: '3 Jun, 10:22 AM', done: true },
    { label: 'Payment Confirmed', date: '3 Jun, 10:23 AM', done: true },
    { label: 'Packed & Dispatched', date: '3 Jun, 3:45 PM', done: true },
    { label: 'In Transit', date: '4 Jun, 9:00 AM', done: true },
    { label: 'Out for Delivery', date: 'Expected 6 Jun', done: false },
    { label: 'Delivered', date: 'Expected 6 Jun', done: false },
  ],
};

export default function TrackOrderPage() {
  const [orderNo, setOrderNo] = useState('');
  const [phone,   setPhone]   = useState('');
  const [result,  setResult]  = useState<typeof MOCK_ORDER | null>(null);
  const [error,   setError]   = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNo === 'MG-2024-00891') { setResult(MOCK_ORDER); setError(''); }
    else { setResult(null); setError('Order not found. Please check your order number and phone.'); }
  };

  return (
    <>
      <Header />
      <main>
        <div className="py-16" style={{ background: '#1A2340' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="section-label" style={{ color: '#C9A84C' }}>Live Tracking</div>
            <h1 className="heading-xl text-white">Track Your Order</h1>
            <p className="text-white/60 mt-3">Enter your order number and mobile number to see live status.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-16">
          <form onSubmit={handleTrack} className="p-8 mb-10" style={{ border: '1px solid #f1f1f1', background: '#FAF7F0' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="input-label">Order Number *</label>
                <input required className="input-field" placeholder="e.g. MG-2024-00891"
                  value={orderNo} onChange={(e) => setOrderNo(e.target.value)} />
              </div>
              <div>
                <label className="input-label">Mobile Number *</label>
                <input required className="input-field" placeholder="+91 XXXXX XXXXX"
                  value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="btn-gold py-3 px-8">
              <Search size={16} /> Track Order
            </button>
            <p className="text-xs text-gray-400 mt-3">Try order number: <button type="button" className="text-gold-500 underline" onClick={() => { setOrderNo('MG-2024-00891'); setPhone('9999999999'); }}>MG-2024-00891</button></p>
          </form>

          {result && (
            <div>
              {/* Order info */}
              <div className="flex flex-wrap gap-6 p-6 mb-8" style={{ border: '1px solid #f1f1f1' }}>
                <div><div className="text-xs text-gray-400 uppercase tracking-wider">Order ID</div><div className="font-bold text-navy-500">{result.id}</div></div>
                <div><div className="text-xs text-gray-400 uppercase tracking-wider">Placed On</div><div className="font-bold text-navy-500">{result.date}</div></div>
                <div><div className="text-xs text-gray-400 uppercase tracking-wider">AWB</div><div className="font-bold text-navy-500">{result.awb}</div></div>
                <div><div className="text-xs text-gray-400 uppercase tracking-wider">Carrier</div><div className="font-bold text-navy-500">{result.carrier}</div></div>
                <div><div className="text-xs text-gray-400 uppercase tracking-wider">Expected</div><div className="font-bold" style={{ color: '#C9A84C' }}>{result.eta}</div></div>
              </div>

              {/* Timeline */}
              <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: '#e5e7eb' }} />
                <div className="space-y-8">
                  {result.timeline.map((item, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                        style={{
                          background: item.done ? '#C9A84C' : '#fff',
                          borderColor: item.done ? '#C9A84C' : '#d1d5db',
                        }}>
                        {item.done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className={`${item.done ? 'text-navy-500' : 'text-gray-400'}`}>
                        <div className="font-semibold text-sm">{item.label}</div>
                        <div className="text-xs mt-0.5">{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="mt-10 p-6" style={{ background: '#FAF7F0', border: '1px solid #f1f1f1' }}>
                <h3 className="font-bold text-navy-500 mb-3">Items in this order</h3>
                <ul className="space-y-2">
                  {result.items.map((item) => (
                    <li key={item} className="text-sm text-gray-600 flex items-center gap-2">
                      <Package size={14} style={{ color: '#C9A84C' }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
