'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { Shield, CreditCard, Truck, Banknote, ChevronRight, Lock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const ORDER_TOTAL = 1697;

const PAYMENT_MODES = [
  {
    id: 'prepaid',
    icon: CreditCard,
    label: 'Pay Online (Prepaid)',
    desc: 'Pay full amount now via UPI, card, netbanking or wallet. Safest option.',
    badge: 'Recommended',
  },
  {
    id: 'partial_cod',
    icon: Banknote,
    label: 'Partial COD',
    desc: `Pay ₹99 advance now to confirm order. Remaining ${formatPrice(ORDER_TOTAL - 99)} paid as Cash on Delivery.`,
    badge: null,
  },
  {
    id: 'cod',
    icon: Truck,
    label: 'Full Cash on Delivery',
    desc: 'Pay full amount in cash when your order arrives.',
    badge: null,
  },
];

export default function CheckoutPage() {
  const [payMode,   setPayMode]   = useState('prepaid');
  const [step,      setStep]      = useState(1);
  const [address, setAddress] = useState({
    name: '', phone: '', email: '', line1: '', line2: '', city: '', state: '', pincode: '',
  });

  const handlePlaceOrder = () => {
    setStep(3); // mock success
  };

  if (step === 3) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="heading-lg mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-3">Your order <strong>#MG-2024-00891</strong> has been confirmed.</p>
          <p className="text-gray-500 mb-8">A confirmation email has been sent to your registered email address.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/track-order" className="btn-gold">Track Order</Link>
            <Link href="/shop" className="btn-outline-gold">Continue Shopping</Link>
          </div>
        </main>
        <Footer />
        <FloatingButtons />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <div className="py-14" style={{ background: '#1A2340' }}>
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="heading-xl text-white">Checkout</h1>
            {/* Steps */}
            <div className="flex items-center gap-3 mt-5">
              {['Delivery Address', 'Payment'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: step > i + 1 || step === i + 1 ? '#C9A84C' : 'rgba(255,255,255,0.2)', color: '#fff' }}>
                    {i + 1}
                  </div>
                  <span className={`text-sm ${step === i + 1 ? 'text-white' : 'text-white/50'}`}>{s}</span>
                  {i < 1 && <ChevronRight size={14} className="text-white/30" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div>
                  <h2 className="heading-md mb-6">Delivery Address</h2>
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="input-label">Full Name *</label>
                        <input required className="input-field" value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                          placeholder="Recipient name" />
                      </div>
                      <div>
                        <label className="input-label">Phone *</label>
                        <input required className="input-field" value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Email (for updates)</label>
                      <input type="email" className="input-field" value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                        placeholder="you@email.com" />
                    </div>
                    <div>
                      <label className="input-label">Address Line 1 *</label>
                      <input required className="input-field" value={address.line1}
                        onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                        placeholder="House/Plot number, Street name" />
                    </div>
                    <div>
                      <label className="input-label">Address Line 2</label>
                      <input className="input-field" value={address.line2}
                        onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                        placeholder="Area, Landmark (optional)" />
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      <div>
                        <label className="input-label">City *</label>
                        <input required className="input-field" value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                      </div>
                      <div>
                        <label className="input-label">State *</label>
                        <input required className="input-field" value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                      </div>
                      <div>
                        <label className="input-label">Pincode *</label>
                        <input required className="input-field" value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                      </div>
                    </div>
                    <button onClick={() => setStep(2)} className="btn-gold py-4 px-8">Continue to Payment <ChevronRight size={16} /></button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="heading-md mb-6">Select Payment Method</h2>
                  <div className="space-y-4 mb-8">
                    {PAYMENT_MODES.map((mode) => (
                      <button key={mode.id} onClick={() => setPayMode(mode.id)}
                        className="w-full text-left p-5 transition-all"
                        style={{
                          border: `2px solid ${payMode === mode.id ? '#C9A84C' : '#e5e7eb'}`,
                          background: payMode === mode.id ? '#fdf8ec' : '#fff',
                        }}>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: payMode === mode.id ? '#C9A84C' : '#f3f4f6' }}>
                            <mode.icon size={18} color={payMode === mode.id ? '#fff' : '#6b7280'} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-navy-500">{mode.label}</span>
                              {mode.badge && (
                                <span className="badge-buy text-xs">{mode.badge}</span>
                              )}
                            </div>
                            <p className="text-gray-500 text-sm mt-0.5">{mode.desc}</p>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                            style={{ borderColor: payMode === mode.id ? '#C9A84C' : '#d1d5db' }}>
                            {payMode === mode.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C9A84C' }} />}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                    <Lock size={12} />
                    <span>All payments are secured with 256-bit SSL encryption. Powered by Razorpay.</span>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="btn-outline-gold py-3 px-6">← Back</button>
                    <button onClick={handlePlaceOrder} className="btn-gold py-4 px-8 flex-1 justify-center">
                      <Lock size={16} />
                      {payMode === 'cod' ? 'Place Order (COD)' : payMode === 'partial_cod' ? `Pay ₹99 & Place Order` : `Pay ${formatPrice(ORDER_TOTAL)} & Place Order`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div>
              <div className="p-6 sticky top-24" style={{ border: '1px solid #f1f1f1', background: '#FAF7F0' }}>
                <h3 className="font-bold text-navy-500 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal (3 items)</span><span>{formatPrice(ORDER_TOTAL)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-emerald-600">FREE</span></div>
                  <div className="flex justify-between text-gray-600"><span>Taxes (GST)</span><span>Included</span></div>
                  <div className="flex justify-between font-bold text-navy-500 text-base pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>
                    <span>Total</span><span>{formatPrice(ORDER_TOTAL)}</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs text-emerald-600">
                  <Shield size={12} /> Secure & encrypted checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
