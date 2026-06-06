'use client';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useState } from 'react';
import {
  TrendingUp, TrendingDown, IndianRupee, ShoppingBag,
  Users, Eye, ChevronDown, ArrowUpRight, ArrowDownRight,
  Package, Monitor, Smartphone, Tablet,
} from 'lucide-react';

/* ── Mock data ── */
const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 312000, orders: 84, enquiries: 18 },
  { month: 'Feb', revenue: 428000, orders: 102, enquiries: 24 },
  { month: 'Mar', revenue: 541000, orders: 118, enquiries: 31 },
  { month: 'Apr', revenue: 673000, orders: 139, enquiries: 27 },
  { month: 'May', revenue: 847000, orders: 158, enquiries: 42 },
  { month: 'Jun', revenue: 920000, orders: 172, enquiries: 38 },
];

const WEEKLY_REVENUE = [
  { month: 'Mon', revenue: 52000, orders: 14 },
  { month: 'Tue', revenue: 68000, orders: 19 },
  { month: 'Wed', revenue: 43000, orders: 11 },
  { month: 'Thu', revenue: 91000, orders: 26 },
  { month: 'Fri', revenue: 115000, orders: 31 },
  { month: 'Sat', revenue: 138000, orders: 37 },
  { month: 'Sun', revenue: 79000, orders: 22 },
];

const FUNNEL = [
  { label: 'Page Views',       value: 12450, pct: 100 },
  { label: 'Product Views',    value: 4828,  pct: 38.7 },
  { label: 'Add to Cart',      value: 1248,  pct: 9.9 },
  { label: 'Checkout Started', value: 688,   pct: 5.4 },
  { label: 'Orders Placed',    value: 412,   pct: 3.3 },
];

const TOP_PRODUCTS = [
  { rank: 1, name: 'Premium Garden Pipe 12mm × 30m',   units: 412, revenue: 205388, stock: 240, trend: 'up'   },
  { rank: 2, name: 'Garden Pipe + Spray Nozzle Set',   units: 245, revenue: 85505,  stock: 180, trend: 'up'   },
  { rank: 3, name: 'PVC Suction Hose 2" (per metre)',  units: 188, revenue: 33840,  stock: 96,  trend: 'down' },
  { rank: 4, name: 'Heavy Duty Garden Pipe 19mm × 50m',units: 112, revenue: 134288, stock: 58,  trend: 'up'   },
  { rank: 5, name: 'uPVC Casing Pipe 4" (ISI Marked)', units: 87,  revenue: 0,      stock: 320, trend: 'up'   },
];

const CATEGORY_PIX = [
  { name: 'Garden Hoses',   value: 38, color: '#C9A84C' },
  { name: 'PVC/UPVC Pipes', value: 27, color: '#1A2340' },
  { name: 'HDPE Pipes',     value: 15, color: '#3b82f6' },
  { name: 'Shade Nets',     value: 10, color: '#10b981' },
  { name: 'Others',         value: 10, color: '#d1d5db' },
];

const DEVICES = [
  { label: 'Mobile',  pct: 82.4, icon: Smartphone, color: '#C9A84C' },
  { label: 'Desktop', pct: 15.1, icon: Monitor,    color: '#1A2340' },
  { label: 'Tablet',  pct: 2.5,  icon: Tablet,     color: '#3b82f6' },
];

const GEO = [
  { state: 'Maharashtra', orders: 184, pct: 44.7 },
  { state: 'Gujarat',     orders: 92,  pct: 22.3 },
  { state: 'Madhya Pradesh', orders: 56, pct: 13.6 },
  { state: 'Rajasthan',   orders: 38,  pct: 9.2  },
  { state: 'Uttar Pradesh', orders: 42, pct: 10.2 },
];

const ORDER_STATUS = [
  { name: 'Delivered',   value: 68, color: '#10b981' },
  { name: 'In Transit',  value: 18, color: '#3b82f6' },
  { name: 'Processing',  value: 10, color: '#f59e0b' },
  { name: 'Cancelled',   value: 4,  color: '#ef4444' },
];

/* ── Helpers ── */
function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}
function num(n: number) {
  return n.toLocaleString('en-IN');
}

/* ── Custom tooltip ── */
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-xl px-4 py-3 text-xs" style={{ border: '1px solid #f1f1f1', minWidth: 140 }}>
      <div className="font-bold text-navy-500 mb-2">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-semibold">
            {p.dataKey === 'revenue' ? fmt(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Stat card ── */
function KpiCard({
  label, value, sub, change, positive, prefix = '',
}: {
  label: string; value: string; sub?: string; change: string; positive: boolean; prefix?: string;
}) {
  return (
    <div className="bg-white p-6 flex flex-col gap-3" style={{ border: '1px solid #f1f1f1' }}>
      <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</div>
      <div className="text-3xl font-bold text-navy-500" style={{ fontFamily: 'var(--font-playfair)' }}>
        {prefix}{value}
      </div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
      <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
        {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {change} vs last period
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function AnalyticsSection() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const [chartView, setChartView] = useState<'revenue' | 'orders'>('revenue');

  const data = period === 'monthly' ? MONTHLY_REVENUE : WEEKLY_REVENUE;

  return (
    <div className="space-y-6">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-500" style={{ fontFamily: 'var(--font-playfair)' }}>
            Analytics Console
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Monitor real-time sales pipelines, checkout conversion ratios, and catalog performance.
          </p>
        </div>
        <div className="flex gap-2">
          {(['weekly', 'monthly'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-4 py-2 text-xs font-semibold capitalize transition-all"
              style={{
                background: period === p ? '#1A2340' : '#fff',
                color: period === p ? '#fff' : '#6b7280',
                border: '1px solid #e5e7eb',
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total Sales Revenue" value="₹8,47,000" change="+24.5%" positive={true} />
        <KpiCard label="Conversion Rate"    value="3.31%"     change="+1.2%"  positive={true} />
        <KpiCard label="Avg. Order Value"   value="₹2,002"    change="-2.5%"  positive={false} />
        <KpiCard label="Storefront Visits"  value="12,450"    change="+18.2%" positive={true} />
      </div>

      {/* Main chart + funnel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Revenue / Orders trend */}
        <div className="xl:col-span-2 bg-white p-6" style={{ border: '1px solid #f1f1f1' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-bold text-navy-500" style={{ fontFamily: 'var(--font-playfair)' }}>
                {chartView === 'revenue' ? 'Sales Revenue Trend' : 'Orders Trend'}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{period === 'monthly' ? 'Year to date' : 'Last 7 days'}</div>
            </div>
            <div className="flex gap-1">
              {(['revenue', 'orders'] as const).map((v) => (
                <button key={v} onClick={() => setChartView(v)}
                  className="px-3 py-1.5 text-xs font-medium capitalize transition-all"
                  style={{
                    background: chartView === v ? '#C9A84C' : '#f9fafb',
                    color: chartView === v ? '#fff' : '#6b7280',
                    border: '1px solid #e5e7eb',
                  }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1A2340" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A2340" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={chartView === 'revenue' ? fmt : undefined} />
              <Tooltip content={<RevenueTooltip />} />
              {chartView === 'revenue' ? (
                <Area type="monotone" dataKey="revenue" name="Revenue"
                  stroke="#C9A84C" strokeWidth={2.5} fill="url(#colorRevenue)"
                  dot={{ fill: '#C9A84C', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#C9A84C' }} />
              ) : (
                <Area type="monotone" dataKey="orders" name="Orders"
                  stroke="#1A2340" strokeWidth={2.5} fill="url(#colorOrders)"
                  dot={{ fill: '#1A2340', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#1A2340' }} />
              )}
            </AreaChart>
          </ResponsiveContainer>

          {/* Mini summary below chart */}
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5" style={{ borderTop: '1px solid #f1f1f1' }}>
            {[
              { label: 'Total Revenue',  value: '₹32.1L', change: '+24.5%', up: true },
              { label: 'Total Orders',   value: '773',     change: '+18.2%', up: true },
              { label: 'Avg. Enquiries', value: '30/mo',   change: '+8.4%',  up: true },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xs text-gray-400">{s.label}</div>
                <div className="text-lg font-bold text-navy-500 mt-0.5">{s.value}</div>
                <div className={`text-xs font-medium ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>{s.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Storefront funnel */}
        <div className="bg-white p-6" style={{ border: '1px solid #f1f1f1' }}>
          <div className="font-bold text-navy-500 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
            Storefront Funnel
          </div>
          <div className="text-xs text-gray-400 mb-6">Last 30 days</div>

          <div className="space-y-4">
            {FUNNEL.map((step, i) => (
              <div key={step.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-600">{step.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-navy-500">{num(step.value)}</span>
                    <span className="text-xs text-gray-400">({step.pct}%)</span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${step.pct}%`,
                      background: i === 0 ? '#1A2340' : i === 4 ? '#C9A84C' : `rgba(201,168,76,${0.4 + i * 0.15})`,
                    }}
                  />
                </div>
                {i < FUNNEL.length - 1 && (
                  <div className="text-right text-xs text-gray-300 mt-0.5">
                    ↓ {((FUNNEL[i + 1].value / step.value) * 100).toFixed(1)}% drop-off
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Conversion summary */}
          <div className="mt-6 p-4 rounded" style={{ background: '#fdf8ec' }}>
            <div className="text-xs text-gray-500 mb-1">Overall Conversion</div>
            <div className="text-2xl font-bold" style={{ color: '#C9A84C', fontFamily: 'var(--font-playfair)' }}>3.31%</div>
            <div className="text-xs text-emerald-600 mt-0.5">+1.2% vs last period</div>
          </div>
        </div>
      </div>

      {/* Top products + Category share */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Top selling products */}
        <div className="xl:col-span-2 bg-white p-6" style={{ border: '1px solid #f1f1f1' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="font-bold text-navy-500" style={{ fontFamily: 'var(--font-playfair)' }}>
              Top Selling Products
            </div>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f1f1' }}>
                  {['Rank', 'Product Name', 'Units Sold', 'Revenue', 'Stock', 'Trend'].map((h) => (
                    <th key={h} className="text-left py-2 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS.map((p) => (
                  <tr key={p.rank} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td className="py-3 px-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: p.rank === 1 ? '#C9A84C' : p.rank === 2 ? '#9ca3af' : '#d1d5db', display: 'inline-flex' }}>
                        {p.rank}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium text-navy-500 max-w-[220px] truncate">{p.name}</td>
                    <td className="py-3 px-2 font-bold">{p.units}</td>
                    <td className="py-3 px-2 font-bold">{p.revenue > 0 ? fmt(p.revenue) : <span className="text-amber-500 text-xs">Enquiry</span>}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-medium ${p.stock < 100 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {p.stock} left
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {p.trend === 'up'
                        ? <TrendingUp size={16} className="text-emerald-500" />
                        : <TrendingDown size={16} className="text-red-400" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category revenue share */}
        <div className="bg-white p-6" style={{ border: '1px solid #f1f1f1' }}>
          <div className="font-bold text-navy-500 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
            Revenue by Category
          </div>
          <div className="text-xs text-gray-400 mb-4">Last 30 days</div>

          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={CATEGORY_PIX} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" stroke="none">
                {CATEGORY_PIX.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2 mt-2">
            {CATEGORY_PIX.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-xs text-gray-600">{c.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
                    <div className="h-full rounded-full" style={{ width: `${c.value}%`, background: c.color }} />
                  </div>
                  <span className="text-xs font-bold text-navy-500 w-8 text-right">{c.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device + Geo + Order status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Device traffic */}
        <div className="bg-white p-6" style={{ border: '1px solid #f1f1f1' }}>
          <div className="font-bold text-navy-500 mb-5" style={{ fontFamily: 'var(--font-playfair)' }}>
            Device Traffic
          </div>
          <div className="space-y-5">
            {DEVICES.map(({ label, pct, icon: Icon, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={15} style={{ color }} />
                    <span className="text-sm font-medium text-gray-600">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-navy-500">{pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid #f1f1f1' }}>
            <div className="text-xs text-gray-400 mb-1">Primary audience</div>
            <div className="text-sm font-bold text-navy-500">Mobile-first users</div>
            <div className="text-xs text-gray-500 mt-0.5">82% on mobile — optimize for low-end Android</div>
          </div>
        </div>

        {/* Geographic */}
        <div className="bg-white p-6" style={{ border: '1px solid #f1f1f1' }}>
          <div className="font-bold text-navy-500 mb-5" style={{ fontFamily: 'var(--font-playfair)' }}>
            Top States
          </div>
          <div className="space-y-4">
            {GEO.map((g, i) => (
              <div key={g.state}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-700">{g.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{g.orders} orders</span>
                    <span className="text-xs font-bold text-navy-500">{g.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${g.pct}%`, background: i === 0 ? '#C9A84C' : '#1A2340', opacity: 1 - i * 0.15 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="bg-white p-6" style={{ border: '1px solid #f1f1f1' }}>
          <div className="font-bold text-navy-500 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
            Order Status
          </div>
          <div className="text-xs text-gray-400 mb-4">Last 30 days</div>

          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={ORDER_STATUS} cx="50%" cy="50%" outerRadius={70} dataKey="value" stroke="none">
                {ORDER_STATUS.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {ORDER_STATUS.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-xs text-gray-600">{s.name}</span>
                <span className="text-xs font-bold text-navy-500 ml-auto">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly bar chart: Revenue vs Enquiries */}
      <div className="bg-white p-6" style={{ border: '1px solid #f1f1f1' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-bold text-navy-500" style={{ fontFamily: 'var(--font-playfair)' }}>
              Revenue vs Enquiries — Monthly Comparison
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Retail sales vs bulk enquiry volume side by side</div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: '#C9A84C' }} /><span className="text-gray-500">Revenue</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: '#1A2340' }} /><span className="text-gray-500">Enquiries</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY_REVENUE} barGap={4} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={fmt} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<RevenueTooltip />} />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#C9A84C" radius={[3, 3, 0, 0]} maxBarSize={40} />
            <Bar yAxisId="right" dataKey="enquiries" name="Enquiries" fill="#1A2340" radius={[3, 3, 0, 0]} maxBarSize={20} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
