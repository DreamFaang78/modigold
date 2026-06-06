import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, MessageSquare, Star } from 'lucide-react';
import type { Product } from '@/lib/data';
import { formatPrice, discount } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
  const isOnline  = product.purchaseMode === 'buy_online' || product.purchaseMode === 'both';
  const isEnquiry = product.purchaseMode === 'enquiry'    || product.purchaseMode === 'both';

  return (
    <div className="card-hover group bg-white flex flex-col h-full" style={{ border: '1px solid #f1f1f1' }}>
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden" style={{ paddingTop: '65%' }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.purchaseMode === 'buy_online' && <span className="badge-buy">Buy Online</span>}
          {product.purchaseMode === 'enquiry'    && <span className="badge-enquiry">Enquiry</span>}
          {product.purchaseMode === 'both'       && <><span className="badge-buy">Buy Online</span><span className="badge-enquiry">Bulk Quote</span></>}
        </div>
        {product.mrp && product.price && (
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: '#C9A84C' }}>
            -{discount(product.price, product.mrp)}%
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-gold-500 font-semibold uppercase tracking-wider mb-1">{product.category}</div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-navy-500 text-sm leading-snug mb-2 group-hover:text-gold-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} className={i < Math.floor(product.rating) ? 'star' : 'star-empty'} fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mb-4 mt-auto">
          {isOnline && product.price ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-navy-500">{formatPrice(product.price)}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.mrp)}</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-amber-600 font-semibold text-sm">Price on Request</span>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex gap-2">
          {isOnline && (
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5"
              style={{ background: '#1A2340' }}>
              <ShoppingCart size={13} /> Add to Cart
            </button>
          )}
          {isEnquiry && !isOnline && (
            <Link href={`/enquiry?product=${product.slug}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5"
              style={{ background: '#C9A84C' }}>
              <MessageSquare size={13} /> Get a Quote
            </Link>
          )}
          {isOnline && isEnquiry && (
            <Link href={`/enquiry?product=${product.slug}`}
              className="px-3 flex items-center justify-center text-gold-500 border transition-colors hover:bg-gold-50"
              style={{ border: '1px solid #C9A84C' }}>
              <MessageSquare size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
