import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, MessageSquare, Star, Search } from 'lucide-react';
import type { Product } from '@/lib/data';
import { formatPrice, discount } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
  const isOnline  = product.purchaseMode === 'buy_online' || product.purchaseMode === 'both';
  const isEnquiry = product.purchaseMode === 'enquiry'    || product.purchaseMode === 'both';

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white flex flex-col h-full rounded-2xl overflow-hidden relative card-shimmer"
      style={{
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Gold top accent on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ background: 'var(--color-gold-400)' }}
      />
      {/* Image with Action Overlay */}
      <div className="relative overflow-hidden bg-gray-50" style={{ paddingTop: '75%' }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.purchaseMode === 'buy_online' && <span className="badge-buy rounded shadow-sm">Buy Online</span>}
          {product.purchaseMode === 'enquiry'    && <span className="badge-enquiry rounded shadow-sm">Enquiry</span>}
          {product.purchaseMode === 'both'       && <><span className="badge-buy rounded shadow-sm">Buy Online</span><span className="badge-enquiry rounded shadow-sm">Bulk Quote</span></>}
        </div>
        {product.mrp && product.price && (
          <div
            className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #e8be4a)',
              boxShadow: '0 3px 10px rgba(201,168,76,0.4)',
            }}
          >
            -{discount(product.price, product.mrp)}%
          </div>
        )}

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-navy-900/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-10">
          <Link
            href={`/product/${product.slug}`}
            className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 w-12 h-12 rounded-full flex items-center justify-center text-white"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            <Search size={18} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[11px] text-gold-500 font-bold uppercase tracking-widest mb-1.5">{product.category}</div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-navy-600 text-sm md:text-base leading-snug mb-2 group-hover:text-gold-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mb-5 mt-auto">
          {isOnline && product.price ? (
            <div className="flex items-baseline gap-2.5">
              <span className="text-lg md:text-xl font-bold text-navy-500">{formatPrice(product.price)}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm text-gray-400 line-through decoration-gray-300">{formatPrice(product.mrp)}</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-amber-600 font-bold text-sm">Price on Request</span>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex gap-2.5">
          {isOnline && (
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'var(--color-navy-500)' }}>
              <ShoppingCart size={14} /> Add
            </button>
          )}
          {isEnquiry && !isOnline && (
            <Link href={`/enquiry?product=${product.slug}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'var(--color-gold-400)' }}>
              <MessageSquare size={14} /> Quote
            </Link>
          )}
          {isOnline && isEnquiry && (
            <Link href={`/enquiry?product=${product.slug}`}
              className="px-4 flex items-center justify-center rounded text-gold-500 transition-colors hover:bg-gold-50"
              style={{ border: '2px solid var(--color-gold-400)' }}>
              <MessageSquare size={16} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
