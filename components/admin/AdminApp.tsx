'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare, Tag, Star,
  Settings, LogOut, Plus, Search, Eye, Edit, Trash2,
  TrendingUp, Users, DollarSign, Menu, X, BarChart2, FileText,
} from 'lucide-react';
import AnalyticsSection from '@/components/admin/AnalyticsSection';
import ContentEditor from '@/components/admin/ContentEditor';
import { type Category, type Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { logoutAction } from '@/app/admin/actions';
import { toggleFeaturedAction, toggleStockAction } from '@/app/admin/catalog-actions';
import type { SiteContent } from '@/lib/content/schema';
import type { HomepageSection, HomepageCard, FooterContent, SitePopup, ContactPageContent, BulkEnquiryPageContent } from '@/lib/content/cms-schema';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',     id: 'dashboard' },
  { icon: FileText,        label: 'Site Content',   id: 'content'   },
  { icon: Package,         label: 'Products',       id: 'products'  },
  { icon: ShoppingCart,    label: 'Orders',         id: 'orders'    },
  { icon: MessageSquare,   label: 'Enquiries',      id: 'enquiries' },
  { icon: Tag,             label: 'Coupons',        id: 'coupons'   },
  { icon: Star,            label: 'Reviews',        id: 'reviews'   },
  { icon: BarChart2,       label: 'Analytics',      id: 'analytics' },
  { icon: Settings,        label: 'Settings',       id: 'settings'  },
];

const SAMPLE_ORDERS = [
  { id: 'MG-2024-00891', customer: 'Suresh Patel', date: '03 Jun 2024', total: 1697, status: 'In Transit', payment: 'Prepaid' },
  { id: 'MG-2024-00890', customer: 'Ramesh Ltd', date: '02 Jun 2024', total: 499, status: 'Delivered', payment: 'COD' },
  { id: 'MG-2024-00889', customer: 'Anita Sharma', date: '01 Jun 2024', total: 1199, status: 'Processing', payment: 'Partial COD' },
  { id: 'MG-2024-00888', customer: 'Krishna Farms', date: '31 May 2024', total: 349, status: 'Delivered', payment: 'Prepaid' },
];

const STATUS_COLORS: Record<string, string> = {
  'In Transit': '#3b82f6', 'Delivered': '#10b981', 'Processing': '#f59e0b', 'Cancelled': '#ef4444',
};

export default function AdminApp({
  initialContent,
  initialProducts,
  initialCategories,
  initialAdvantageSection,
  initialOrderingSection,
  initialOrderingCards,
  initialFooterContent,
  initialAboutSection,
  initialPopups,
  initialContactContent,
  initialBulkEnquiryContent,
}: {
  initialContent: SiteContent;
  initialProducts: Product[];
  initialCategories: Category[];
  initialAdvantageSection: HomepageSection;
  initialOrderingSection: HomepageSection;
  initialOrderingCards: HomepageCard[];
  initialFooterContent: FooterContent;
  initialAboutSection?: HomepageSection;
  initialPopups?: SitePopup[];
  initialContactContent?: ContactPageContent;
  initialBulkEnquiryContent?: BulkEnquiryPageContent;
}) {
  const [activeSection, setActiveSection] = useState('content');
  const [sidebarOpen, setSidebarOpen]     = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: '#1A2340' }}
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="relative" style={{ width: 120, height: 40 }}>
            <Image src="https://www.modigold.in/wp-content/uploads/2021/12/Modi-Gold-Logo1-1.png" alt="Modigold" fill className="object-contain brightness-150" />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white"><X size={20} /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ icon: Icon, label, id }) => (
            <button key={id} onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded"
              style={{
                background: activeSection === id ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: activeSection === id ? '#C9A84C' : 'rgba(255,255,255,0.6)',
                borderLeft: activeSection === id ? '3px solid #C9A84C' : '3px solid transparent',
              }}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: '#C9A84C' }}>A</div>
            <div>
              <div className="text-white text-sm font-medium">Admin</div>
              <div className="text-white/40 text-xs">admin@modigold.in</div>
            </div>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="w-full flex items-center gap-2 text-white/40 hover:text-white text-xs transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded hover:bg-gray-100">
              <Menu size={20} />
            </button>
            <h1 className="font-bold text-navy-500 capitalize">{activeSection === 'content' ? 'Site Content' : activeSection}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-gold-500 underline">View Store →</Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeSection === 'dashboard' && <DashboardSection />}
          {activeSection === 'content'   && (
            <ContentEditor
              initialContent={initialContent}
              initialAdvantageSection={initialAdvantageSection}
              initialOrderingSection={initialOrderingSection}
              initialOrderingCards={initialOrderingCards}
              initialFooterContent={initialFooterContent}
              initialAboutSection={initialAboutSection}
              initialPopups={initialPopups}
              initialContactContent={initialContactContent}
              initialBulkEnquiryContent={initialBulkEnquiryContent}
            />
          )}
          {activeSection === 'products'  && <ProductsSection products={initialProducts} categories={initialCategories} />}
          {activeSection === 'orders'    && <OrdersSection />}
          {activeSection === 'enquiries' && <EnquiriesSection />}
          {activeSection === 'coupons'   && <CouponsSection />}
          {activeSection === 'reviews'   && <ReviewsSection />}
          {activeSection === 'analytics' && <AnalyticsSection />}
          {activeSection === 'settings'  && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, change }: { icon: any; label: string; value: string; color: string; change: string }) {
  return (
    <div className="bg-white p-6 shadow-sm" style={{ border: '1px solid #f1f1f1' }}>
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: color + '20' }}>
          <Icon size={22} style={{ color }} />
        </div>
        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
          <TrendingUp size={10} /> {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-navy-500 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>{value}</div>
      <div className="text-gray-400 text-xs uppercase tracking-wider">{label}</div>
    </div>
  );
}

function DashboardSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={DollarSign} label="Revenue (Month)" value="₹1,84,920" color="#C9A84C" change="+12%" />
        <StatCard icon={ShoppingCart} label="Orders (Month)" value="142" color="#3b82f6" change="+8%" />
        <StatCard icon={MessageSquare} label="Enquiries" value="37" color="#f59e0b" change="+24%" />
        <StatCard icon={Users} label="New Customers" value="89" color="#10b981" change="+5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow-sm" style={{ border: '1px solid #f1f1f1' }}>
          <h3 className="font-bold text-navy-500 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {SAMPLE_ORDERS.slice(0, 3).map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #f9fafb' }}>
                <div>
                  <div className="text-sm font-medium text-navy-500">{o.id}</div>
                  <div className="text-xs text-gray-400">{o.customer}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{formatPrice(o.total)}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: STATUS_COLORS[o.status] }}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 shadow-sm" style={{ border: '1px solid #f1f1f1' }}>
          <h3 className="font-bold text-navy-500 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Product', icon: Package, color: '#C9A84C' },
              { label: 'View Orders', icon: ShoppingCart, color: '#3b82f6' },
              { label: 'Enquiries', icon: MessageSquare, color: '#f59e0b' },
              { label: 'Add Coupon', icon: Tag, color: '#10b981' },
            ].map(({ label, icon: Icon, color }) => (
              <button key={label} className="p-4 text-left hover:bg-gray-50 transition-colors" style={{ border: '1px solid #f1f1f1' }}>
                <Icon size={20} style={{ color }} className="mb-2" />
                <div className="text-sm font-medium text-navy-500">{label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsSection({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [search, setSearch]   = useState('');
  const [rows, setRows]       = useState(products);
  const [busy, setBusy]       = useState<string | null>(null); // product id being mutated

  const filtered = rows.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  async function handleToggleFeatured(p: Product) {
    setBusy(p.id);
    const res = await toggleFeaturedAction(p.id, !p.featured);
    if (res.ok) setRows((prev) => prev.map((r) => r.id === p.id ? { ...r, featured: !r.featured } : r));
    setBusy(null);
  }

  async function handleToggleStock(p: Product) {
    setBusy(p.id);
    const res = await toggleStockAction(p.id, !p.inStock);
    if (res.ok) setRows((prev) => prev.map((r) => r.id === p.id ? { ...r, inStock: !r.inStock } : r));
    setBusy(null);
  }

  return (
    <div>
      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <span key={c.id} className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
            {c.name}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{rows.filter(p => p.featured).length} featured · {rows.filter(p => p.inStock).length} in stock</span>
          <button className="btn-gold py-2.5 px-5"><Plus size={16} /> Add Product</button>
        </div>
      </div>

      <div className="bg-white shadow-sm overflow-x-auto" style={{ border: '1px solid #f1f1f1' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f1f1', background: '#f9fafb' }}>
              {['Product', 'Category', 'SKU', 'Mode', 'Price', 'Featured', 'Stock', 'Actions'].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #f9fafb', opacity: busy === p.id ? 0.5 : 1 }}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium text-navy-500 line-clamp-1">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500">{p.category}</td>
                <td className="py-3 px-4 font-mono text-xs text-gray-400">{p.sku}</td>
                <td className="py-3 px-4">
                  <span className={p.purchaseMode === 'buy_online' ? 'badge-buy' : p.purchaseMode === 'enquiry' ? 'badge-enquiry' : 'badge-buy'}>
                    {p.purchaseMode}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium">{p.price ? formatPrice(p.price) : '—'}</td>
                {/* Featured toggle */}
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleFeatured(p)}
                    disabled={busy === p.id}
                    title={p.featured ? 'Remove from homepage' : 'Show on homepage'}
                    className={`text-xs font-bold px-2 py-0.5 rounded transition-colors ${p.featured ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                  >
                    {p.featured ? '★ Yes' : '☆ No'}
                  </button>
                </td>
                {/* Stock toggle */}
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleStock(p)}
                    disabled={busy === p.id}
                    className={`text-xs font-medium transition-colors ${p.inStock ? 'text-emerald-600 hover:text-emerald-800' : 'text-red-400 hover:text-red-600'}`}
                  >
                    {p.inStock ? '● In Stock' : '○ Out'}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:text-gold-500 transition-colors text-gray-400" title="Preview"><Eye size={14} /></button>
                    <button className="p-1.5 hover:text-blue-500 transition-colors text-gray-400" title="Edit"><Edit size={14} /></button>
                    <button className="p-1.5 hover:text-red-500 transition-colors text-gray-400" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          {['All', 'Processing', 'In Transit', 'Delivered'].map((f) => (
            <button key={f} className="px-4 py-2 text-xs font-medium transition-colors"
              style={{ border: '1px solid #e5e7eb' }}>{f}</button>
          ))}
        </div>
        <button className="btn-outline-gold py-2 px-4 text-xs">Export CSV</button>
      </div>

      <div className="bg-white shadow-sm overflow-x-auto" style={{ border: '1px solid #f1f1f1' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f1f1', background: '#f9fafb' }}>
              {['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ORDERS.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #f9fafb' }}>
                <td className="py-3 px-4 font-medium text-navy-500">{o.id}</td>
                <td className="py-3 px-4">{o.customer}</td>
                <td className="py-3 px-4 text-gray-500">{o.date}</td>
                <td className="py-3 px-4 font-bold">{formatPrice(o.total)}</td>
                <td className="py-3 px-4 text-gray-500">{o.payment}</td>
                <td className="py-3 px-4">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: STATUS_COLORS[o.status] }}>
                    {o.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:text-gold-500 text-gray-400"><Eye size={14} /></button>
                    <button className="p-1.5 hover:text-blue-500 text-gray-400"><Edit size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EnquiriesSection() {
  const items = [
    { id: 'ENQ-001', name: 'Rajesh Kumar', product: 'uPVC Casing Pipe 4"', qty: '500 pieces', phone: '+91 9876543210', date: '3 Jun 2024', status: 'New' },
    { id: 'ENQ-002', name: 'Farmers Co-op', product: 'Shade Net 50%', qty: '200 rolls', phone: '+91 9123456789', date: '2 Jun 2024', status: 'Responded' },
  ];

  return (
    <div className="bg-white shadow-sm" style={{ border: '1px solid #f1f1f1' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid #f1f1f1', background: '#f9fafb' }}>
            {['ID', 'Name', 'Product', 'Qty', 'Phone', 'Date', 'Status', 'Action'].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f9fafb' }}>
              <td className="py-3 px-4 font-mono text-xs">{item.id}</td>
              <td className="py-3 px-4 font-medium">{item.name}</td>
              <td className="py-3 px-4 text-gray-600">{item.product}</td>
              <td className="py-3 px-4 text-gray-600">{item.qty}</td>
              <td className="py-3 px-4">{item.phone}</td>
              <td className="py-3 px-4 text-gray-400">{item.date}</td>
              <td className="py-3 px-4">
                <span className={`text-xs font-bold px-2 py-0.5 ${item.status === 'New' ? 'badge-enquiry' : 'badge-buy'}`}>
                  {item.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <button className="text-xs text-gold-500 underline">Mark Handled</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CouponsSection() {
  return (
    <div>
      <div className="flex justify-end mb-5">
        <button className="btn-gold py-2.5 px-5"><Plus size={16} /> Add Coupon</button>
      </div>
      <div className="bg-white p-6 shadow-sm" style={{ border: '1px solid #f1f1f1' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f1f1' }}>
              {['Code', 'Type', 'Value', 'Min Order', 'Usage', 'Expiry', 'Active', 'Actions'].map((h) => (
                <th key={h} className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { code: 'SAVE10', type: 'Percentage', value: '10%', min: '₹500', usage: '12/100', expiry: '31 Dec 2024', active: true },
              { code: 'FLAT50', type: 'Flat', value: '₹50', min: '₹299', usage: '5/50', expiry: '30 Jun 2024', active: true },
              { code: 'FREESHIP', type: 'Free Shipping', value: '—', min: '₹199', usage: '8/∞', expiry: '—', active: false },
            ].map((c) => (
              <tr key={c.code} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f9fafb' }}>
                <td className="py-3 px-3 font-mono font-bold text-navy-500">{c.code}</td>
                <td className="py-3 px-3 text-gray-600">{c.type}</td>
                <td className="py-3 px-3 font-medium">{c.value}</td>
                <td className="py-3 px-3 text-gray-600">{c.min}</td>
                <td className="py-3 px-3 text-gray-600">{c.usage}</td>
                <td className="py-3 px-3 text-gray-400">{c.expiry}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs font-bold px-2 py-0.5 ${c.active ? 'badge-buy' : ''}`}
                    style={!c.active ? { background: '#e5e7eb', color: '#6b7280' } : {}}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-2">
                    <button className="p-1 hover:text-blue-500 text-gray-400"><Edit size={13} /></button>
                    <button className="p-1 hover:text-red-500 text-gray-400"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewsSection() {
  const reviews = [
    { id: 1, product: 'Premium Garden Pipe 12mm', author: 'Suresh P.', rating: 5, text: 'Excellent quality!', status: 'Pending' },
    { id: 2, product: 'Shade Net 50%', author: 'Anita S.', rating: 4, text: 'Good product, fast delivery.', status: 'Approved' },
  ];

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="bg-white p-5 shadow-sm flex items-start gap-5" style={{ border: '1px solid #f1f1f1' }}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-medium text-navy-500">{r.author}</span>
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <span key={i} className={i < r.rating ? 'star' : 'star-empty'} style={{ fontSize: 14 }}>★</span>)}</div>
            </div>
            <div className="text-xs text-gray-400 mb-2">on {r.product}</div>
            <p className="text-sm text-gray-600">{r.text}</p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <span className={`text-xs font-bold px-2 py-0.5 ${r.status === 'Pending' ? 'badge-enquiry' : 'badge-buy'}`}>{r.status}</span>
            {r.status === 'Pending' && <button className="text-xs text-emerald-600 underline">Approve</button>}
            <button className="text-xs text-red-500 underline">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="max-w-2xl space-y-8">
      {[
        { label: 'Commerce', fields: [
          { name: 'COD Advance (₹)', value: '99' },
          { name: 'Free Shipping Above (₹)', value: '999' },
          { name: 'Razorpay Key ID', value: 'rzp_test_••••••••••••••••' },
        ]},
      ].map((group) => (
        <div key={group.label} className="bg-white p-6 shadow-sm" style={{ border: '1px solid #f1f1f1' }}>
          <h3 className="font-bold text-navy-500 mb-5">{group.label}</h3>
          <div className="space-y-4">
            {group.fields.map((f) => (
              <div key={f.name}>
                <label className="input-label">{f.name}</label>
                <input className="input-field" defaultValue={f.value} />
              </div>
            ))}
          </div>
          <button className="btn-gold py-2.5 px-6 mt-5">Save Changes</button>
        </div>
      ))}
      <p className="text-xs text-gray-400">
        Brand name, contact details and homepage text are now managed under <strong>Site Content</strong>.
      </p>
    </div>
  );
}
