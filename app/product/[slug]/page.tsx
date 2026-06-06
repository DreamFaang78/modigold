'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/lib/data';
import { formatPrice, discount } from '@/lib/utils';
import { ShoppingCart, MessageSquare, Star, ChevronRight, Minus, Plus, Package, Truck, Shield } from 'lucide-react';
import { use } from 'react';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  return (
    <ProductDetail product={product} related={related} />
  );
}

function ProductDetail({ product, related }: { product: (typeof PRODUCTS)[0]; related: typeof PRODUCTS }) {
  const [qty,       setQty]       = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const isOnline  = product.purchaseMode === 'buy_online' || product.purchaseMode === 'both';
  const isEnquiry = product.purchaseMode === 'enquiry'    || product.purchaseMode === 'both';
  const showBulkCta = isOnline && product.bulkThreshold && qty >= product.bulkThreshold;

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="py-3 border-b" style={{ borderColor: '#f1f1f1' }}>
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-1.5 text-xs text-gray-500">
              <Link href="/" className="hover:text-gold-500">Home</Link>
              <ChevronRight size={12} />
              <Link href="/shop" className="hover:text-gold-500">Shop</Link>
              <ChevronRight size={12} />
              <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-gold-500">{product.category}</Link>
              <ChevronRight size={12} />
              <span className="text-navy-500 font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

            {/* Gallery */}
            <div>
              <div className="relative overflow-hidden mb-4" style={{ paddingTop: '75%' }}>
                <Image
                  src={product.images[activeImg] ?? product.image}
                  alt={product.name}
                  fill className="object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img: string, i: number) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className="relative overflow-hidden transition-all"
                      style={{
                        width: 72, paddingTop: 72,
                        border: activeImg === i ? '2px solid #C9A84C' : '2px solid transparent',
                      }}>
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#C9A84C' }}>{product.category}</div>
              <h1 className="heading-md mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'} className={i < Math.floor(product.rating) ? 'star' : 'star-empty'} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="py-5 mb-5" style={{ borderTop: '1px solid #f1f1f1', borderBottom: '1px solid #f1f1f1' }}>
                {isOnline && product.price ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#1A2340' }}>
                      {formatPrice(product.price)}
                    </span>
                    {product.mrp && product.mrp > product.price && (
                      <>
                        <span className="text-lg text-gray-400 line-through">{formatPrice(product.mrp)}</span>
                        <span className="badge-buy text-sm">{discount(product.price, product.mrp)}% OFF</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-amber-600 font-semibold text-lg mb-1">Price on Request</div>
                    <p className="text-gray-500 text-sm">Submit an enquiry for bulk / wholesale pricing</p>
                  </div>
                )}
              </div>

              {/* SKU */}
              <p className="text-xs text-gray-400 mb-5">SKU: <span className="font-medium text-gray-600">{product.sku}</span></p>

              {/* Qty + CTA */}
              {isOnline && (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <label className="input-label">Quantity</label>
                    <div className="flex items-center border" style={{ border: '1.5px solid #d1d5db' }}>
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 hover:bg-gray-50 transition-colors"><Minus size={14} /></button>
                      <span className="px-5 text-sm font-medium min-w-[3rem] text-center">{qty}</span>
                      <button onClick={() => setQty(qty + 1)} className="p-2.5 hover:bg-gray-50 transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>

                  {showBulkCta && (
                    <div className="flex items-center gap-2 p-3 mb-4 text-sm rounded" style={{ background: '#fdf8ec', border: '1px solid #C9A84C' }}>
                      <MessageSquare size={14} style={{ color: '#C9A84C' }} />
                      <span className="text-navy-500">Ordering {product.bulkThreshold}+ units?</span>
                      <Link href={`/enquiry?product=${product.slug}`} className="font-semibold underline" style={{ color: '#C9A84C' }}>Get bulk pricing</Link>
                    </div>
                  )}

                  <button className="btn-gold w-full justify-center mb-3 py-4">
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </>
              )}

              {isEnquiry && (
                <Link href={`/enquiry?product=${product.slug}`} className="btn-outline-gold w-full justify-center py-4 mb-3" style={{ display: 'flex' }}>
                  <MessageSquare size={18} /> Request a Quote
                </Link>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: Shield, label: 'ISI Certified' },
                  { icon: Truck, label: 'Pan-India Delivery' },
                  { icon: Package, label: 'Secure Packaging' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="text-center p-3" style={{ background: '#f9fafb' }}>
                    <Icon size={20} className="mx-auto mb-1" style={{ color: '#C9A84C' }} />
                    <div className="text-xs text-gray-500 font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex gap-0" style={{ borderBottom: '2px solid #f1f1f1' }}>
              {(['description', 'specs', 'reviews'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-6 py-3 text-sm font-semibold capitalize transition-colors"
                  style={{
                    borderBottom: activeTab === tab ? '2px solid #C9A84C' : '2px solid transparent',
                    color: activeTab === tab ? '#C9A84C' : '#6b7280',
                    marginBottom: -2,
                  }}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose max-w-3xl">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="max-w-2xl">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specs).map(([key, val], i) => (
                        <tr key={key} style={{ background: i % 2 === 0 ? '#f9fafb' : '#fff' }}>
                          <td className="py-3 px-4 font-semibold text-navy-500 w-2/5">{key}</td>
                          <td className="py-3 px-4 text-gray-600">{val as string}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#C9A84C' }}>{product.rating}</div>
                      <div className="flex justify-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'} className={i < Math.floor(product.rating) ? 'star' : 'star-empty'} />
                        ))}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{product.reviewCount} reviews</div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">Be the first to write a review for this product.</p>
                </div>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="heading-md mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => <ProductCard key={p.id} product={p} />)}
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
