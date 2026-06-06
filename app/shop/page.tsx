'use client';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? 'all';

  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [mode,     setMode]     = useState<'all' | 'buy_online' | 'enquiry'>('all');
  const [sidebar,  setSidebar]  = useState(false);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat  = category === 'all' || p.categorySlug === category;
      const matchMode = mode === 'all' || p.purchaseMode === mode || (mode === 'buy_online' && p.purchaseMode === 'both') || (mode === 'enquiry' && p.purchaseMode === 'both');
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchMode && matchSearch;
    });
  }, [search, category, mode]);

  return (
    <>
      <Header />
      <main>
        {/* Page header */}
        <div className="py-14" style={{ background: '#1A2340' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="section-label" style={{ color: '#C9A84C' }}>Our Products</div>
            <h1 className="heading-xl text-white">Shop All Products</h1>
            <p className="text-white/60 mt-3 max-w-xl">
              Browse our complete range of PVC, UPVC, HDPE pipes, garden hoses, shade nets, tarpaulins and water tanks.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Search + filter bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input-field pl-9"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <button onClick={() => setSidebar(!sidebar)}
              className="flex items-center gap-2 px-4 py-2 border text-sm font-medium transition-colors hover:bg-gray-50 md:hidden"
              style={{ border: '1.5px solid #d1d5db' }}>
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar — desktop */}
            <aside className={`w-60 shrink-0 hidden md:block`}>
              <FilterPanel category={category} setCategory={setCategory} mode={mode} setMode={setMode} />
            </aside>

            {/* Mobile sidebar */}
            {sidebar && (
              <div className="fixed inset-0 z-50 flex md:hidden">
                <div className="bg-black/50 flex-1" onClick={() => setSidebar(false)} />
                <div className="bg-white w-72 p-6 overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-navy-500">Filters</span>
                    <button onClick={() => setSidebar(false)}><X size={20} /></button>
                  </div>
                  <FilterPanel category={category} setCategory={setCategory} mode={mode} setMode={setMode} />
                </div>
              </div>
            )}

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-500 text-sm">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</span>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-xl mb-3">No products found</p>
                  <button onClick={() => { setSearch(''); setCategory('all'); setMode('all'); }}
                    className="text-gold-500 underline text-sm">Clear all filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

function FilterPanel({
  category, setCategory,
  mode, setMode,
}: {
  category: string; setCategory: (v: string) => void;
  mode: string; setMode: (v: 'all' | 'buy_online' | 'enquiry') => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <div className="font-bold text-navy-500 text-sm uppercase tracking-wider mb-4">Category</div>
        <div className="space-y-1.5">
          <FilterChip label="All Categories" active={category === 'all'} onClick={() => setCategory('all')} />
          {CATEGORIES.map((c) => (
            <FilterChip key={c.id} label={c.name} active={category === c.slug} onClick={() => setCategory(c.slug)} />
          ))}
        </div>
      </div>
      <div>
        <div className="font-bold text-navy-500 text-sm uppercase tracking-wider mb-4">Purchase Mode</div>
        <div className="space-y-1.5">
          <FilterChip label="All" active={mode === 'all'} onClick={() => setMode('all')} />
          <FilterChip label="Buy Online" active={mode === 'buy_online'} onClick={() => setMode('buy_online')} />
          <FilterChip label="Enquiry Only" active={mode === 'enquiry'} onClick={() => setMode('enquiry')} />
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full text-left py-2 px-3 text-sm transition-colors rounded"
      style={{
        background: active ? '#fdf8ec' : 'transparent',
        color: active ? '#C9A84C' : '#6b7280',
        fontWeight: active ? 600 : 400,
        borderLeft: active ? '3px solid #C9A84C' : '3px solid transparent',
      }}>
      {label}
    </button>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
