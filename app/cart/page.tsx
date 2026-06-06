'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

const SAMPLE_CART = [
  { ...PRODUCTS[0], qty: 2 },
  { ...PRODUCTS[1], qty: 1 },
];

export default function CartPage() {
  const [items, setItems] = useState(SAMPLE_CART);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) { setItems(items.filter((i) => i.id !== id)); return; }
    setItems(items.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const subtotal = items.reduce((acc, i) => acc + (i.price ?? 0) * i.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total    = subtotal - discount + shipping;

  if (items.length === 0) return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto mb-5" style={{ color: '#C9A84C' }} />
        <h1 className="heading-lg mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some products from our shop to get started.</p>
        <Link href="/shop" className="btn-gold">Browse Products</Link>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );

  return (
    <>
      <Header />
      <main>
        <div className="py-14" style={{ background: '#1A2340' }}>
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="heading-xl text-white">Your Cart</h1>
            <p className="text-white/60 mt-2">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-5" style={{ border: '1px solid #f1f1f1' }}>
                  <div className="relative shrink-0 overflow-hidden" style={{ width: 100, height: 100 }}>
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug}`} className="font-semibold text-navy-500 text-sm hover:text-gold-500 transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <div className="text-xs text-gray-400 mt-1">{item.category}</div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border" style={{ border: '1.5px solid #e5e7eb' }}>
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-1.5 hover:bg-gray-50"><Minus size={12} /></button>
                        <span className="px-4 text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-1.5 hover:bg-gray-50"><Plus size={12} /></button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-navy-500">{formatPrice((item.price ?? 0) * item.qty)}</span>
                        <button onClick={() => updateQty(item.id, 0)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div>
              <div className="p-6 sticky top-24" style={{ border: '1px solid #f1f1f1', background: '#FAF7F0' }}>
                <h2 className="font-bold text-navy-500 mb-5" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.25rem' }}>Order Summary</h2>

                {/* Coupon */}
                <div className="flex gap-2 mb-5">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="input-field pl-8 text-sm py-2" placeholder="Coupon code"
                      value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                  </div>
                  <button
                    onClick={() => { if (coupon === 'SAVE10') setCouponApplied(true); }}
                    className="btn-gold py-2 px-4 text-xs"
                  >Apply</button>
                </div>
                {couponApplied && (
                  <div className="text-sm text-emerald-600 mb-4 flex items-center gap-1.5">
                    ✅ Coupon SAVE10 applied — 10% off!
                  </div>
                )}

                {/* Line items */}
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount (10%)</span>
                      <span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-emerald-600">FREE</span> : formatPrice(shipping)}</span>
                  </div>
                  {shipping === 0 && <div className="text-xs text-emerald-600">✅ Free shipping on orders above ₹999</div>}
                  <div className="flex justify-between font-bold text-navy-500 text-base pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn-gold w-full justify-center py-4">
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
                <Link href="/shop" className="btn-outline-gold w-full justify-center py-3 mt-3" style={{ display: 'flex' }}>
                  Continue Shopping
                </Link>
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
