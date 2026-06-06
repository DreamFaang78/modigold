export type PurchaseMode = 'buy_online' | 'enquiry' | 'both';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  sku: string;
  purchaseMode: PurchaseMode;
  price?: number;
  mrp?: number;
  bulkThreshold?: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  inStock: boolean;
  description: string;
  specs: Record<string, string>;
  tags: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1', slug: 'pvc-upvc-pipes', name: 'PVC / UPVC Pipes',
    description: 'uPVC casing, column, pressure & well casing pipes for agriculture and construction',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    icon: 'pipe', productCount: 12,
  },
  {
    id: 'cat-2', slug: 'hdpe-pipes', name: 'HDPE Pipes',
    description: 'High density polyethylene pipes for water supply, irrigation and sewerage systems',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    icon: 'pipeline', productCount: 8,
  },
  {
    id: 'cat-3', slug: 'ld-ldpe-pipes', name: 'LD / LDPE Pipes & Sheets',
    description: 'Lightweight low-density polyethylene pipes and barsati waterproof sheets',
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&q=80',
    icon: 'layers', productCount: 6,
  },
  {
    id: 'cat-4', slug: 'garden-hoses', name: 'Garden Hoses & Pipes',
    description: 'Flexible, durable garden hoses and pipes for home & farm irrigation',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    icon: 'droplets', productCount: 10,
  },
  {
    id: 'cat-5', slug: 'suction-hoses', name: 'Suction & Delivery Hoses',
    description: 'PVC suction and delivery hose pipes for pumps, agriculture and industry',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    icon: 'wave', productCount: 7,
  },
  {
    id: 'cat-6', slug: 'shade-nets', name: 'Shade Nets',
    description: 'HDPE shade nets for greenhouses, agriculture, construction and sun protection',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80',
    icon: 'sun', productCount: 5,
  },
  {
    id: 'cat-7', slug: 'tarpaulins', name: 'Tarpaulins',
    description: 'Heavy-duty cross-laminated tarpaulins for agriculture, construction and storage',
    image: 'https://images.unsplash.com/photo-1558618047-f4e3b0e10e87?w=600&q=80',
    icon: 'shield', productCount: 4,
  },
  {
    id: 'cat-8', slug: 'water-tanks', name: 'Water Tanks',
    description: 'BIS certified food-grade water storage tanks for home, farm and industrial use',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80',
    icon: 'cylinder', productCount: 6,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p-01', slug: 'garden-pipe-12mm-30m', name: 'Premium Garden Pipe 12mm × 30m',
    category: 'Garden Hoses & Pipes', categorySlug: 'garden-hoses',
    sku: 'MG-GH-001', purchaseMode: 'buy_online', price: 499, mrp: 649,
    bulkThreshold: 50,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80&sat=-30',
    ],
    rating: 4.5, reviewCount: 128, featured: true, inStock: true,
    description: 'Modigold Premium Garden Pipe is manufactured from food-grade PVC compound, UV stabilised for outdoor durability. Ideal for home gardens, farms, and nurseries. Kink-resistant design ensures consistent water flow.',
    specs: { 'Diameter': '12mm', 'Length': '30 metres', 'Material': 'Food-grade PVC', 'Working Pressure': '4 kg/cm²', 'Burst Pressure': '12 kg/cm²', 'Color': 'Green' },
    tags: ['garden', 'hose', 'irrigation', 'home'],
  },
  {
    id: 'p-02', slug: 'garden-pipe-19mm-50m', name: 'Heavy Duty Garden Pipe 19mm × 50m',
    category: 'Garden Hoses & Pipes', categorySlug: 'garden-hoses',
    sku: 'MG-GH-002', purchaseMode: 'both', price: 1199, mrp: 1499,
    bulkThreshold: 20,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&sat=20',
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80&sat=20'],
    rating: 4.7, reviewCount: 84, featured: true, inStock: true,
    description: 'Our 19mm heavy-duty garden pipe is engineered for farms and large gardens requiring high-volume water flow. 3-layer construction with reinforced braiding.',
    specs: { 'Diameter': '19mm', 'Length': '50 metres', 'Material': 'PVC (3-layer)', 'Working Pressure': '6 kg/cm²', 'Color': 'Green/Blue' },
    tags: ['garden', 'hose', 'farm', 'heavy-duty'],
  },
  {
    id: 'p-03', slug: 'upvc-casing-pipe-4in', name: 'uPVC Casing Pipe 4" (ISI Marked)',
    category: 'PVC / UPVC Pipes', categorySlug: 'pvc-upvc-pipes',
    sku: 'MG-UP-001', purchaseMode: 'enquiry',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'],
    rating: 4.8, reviewCount: 56, featured: true, inStock: true,
    description: 'ISI-certified uPVC well casing pipes designed for borewell and tube well applications. Manufactured to IS:12818 standard with precision threading for leak-proof joints.',
    specs: { 'Diameter': '4 inch (100mm)', 'Length': '3 metres/piece', 'Material': 'uPVC', 'Standard': 'IS:12818', 'Wall Thickness': '5.5mm', 'Color': 'Cream/White' },
    tags: ['borewell', 'casing', 'upvc', 'isi'],
  },
  {
    id: 'p-04', slug: 'hdpe-pipe-63mm', name: 'HDPE Pipe PN6 63mm',
    category: 'HDPE Pipes', categorySlug: 'hdpe-pipes',
    sku: 'MG-HD-001', purchaseMode: 'enquiry',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    rating: 4.6, reviewCount: 43, featured: false, inStock: true,
    description: 'High-density polyethylene pipes conforming to IS:4984. Ideal for potable water supply, sewerage, and irrigation. Available in straight lengths and coils.',
    specs: { 'Diameter': '63mm OD', 'Pressure Rating': 'PN6 (6 kg/cm²)', 'Material': 'HDPE (PE100)', 'Standard': 'IS:4984', 'Color': 'Black with blue stripes', 'Length': '6m/12m/coil' },
    tags: ['hdpe', 'irrigation', 'water supply'],
  },
  {
    id: 'p-05', slug: 'shade-net-50pc-green', name: 'Shade Net 50% Green (Agricultural)',
    category: 'Shade Nets', categorySlug: 'shade-nets',
    sku: 'MG-SN-001', purchaseMode: 'enquiry',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80'],
    rating: 4.4, reviewCount: 39, featured: true, inStock: true,
    description: 'HDPE mono filament shade net providing 50% light filtration. UV-stabilised for 5+ years outdoor life. Ideal for vegetables, flowers, nurseries and poultry farms.',
    specs: { 'Shade %': '50%', 'Material': 'HDPE Mono Filament', 'UV Stabilised': 'Yes (5+ years)', 'Width': 'Up to 4 metres', 'Color': 'Green', 'GSM': '40–45 GSM' },
    tags: ['shade net', 'agriculture', 'greenhouse', 'nursery'],
  },
  {
    id: 'p-06', slug: 'pvc-suction-hose-2in', name: 'PVC Suction Hose 2" (per metre)',
    category: 'Suction & Delivery Hoses', categorySlug: 'suction-hoses',
    sku: 'MG-SH-001', purchaseMode: 'both', price: 180, mrp: 220,
    bulkThreshold: 100,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&hue=200',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&hue=200'],
    rating: 4.5, reviewCount: 67, featured: false, inStock: true,
    description: 'Heavy-duty PVC suction hose with rigid PVC helix reinforcement. Flexible even at low temperatures. Ideal for pump suction in agriculture, construction and industry.',
    specs: { 'Bore': '2 inch (50mm)', 'Material': 'PVC + PVC Helix', 'Working Pressure': 'Vacuum rated', 'Temperature': '-10°C to +60°C', 'Color': 'Clear/Transparent' },
    tags: ['suction hose', 'pump', 'agriculture', 'pvc'],
  },
  {
    id: 'p-07', slug: 'tarpaulin-12x15ft-blue', name: 'Cross Laminated Tarpaulin 12×15 ft',
    category: 'Tarpaulins', categorySlug: 'tarpaulins',
    sku: 'MG-TP-001', purchaseMode: 'enquiry',
    image: 'https://images.unsplash.com/photo-1558618047-f4e3b0e10e87?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1558618047-f4e3b0e10e87?w=800&q=80'],
    rating: 4.3, reviewCount: 29, featured: false, inStock: true,
    description: 'Cross-laminated tarpaulins manufactured from HDPE fabric coated with LDPE on both sides. Waterproof, UV resistant, and tear-proof. Used in agriculture, construction and storage.',
    specs: { 'Size': '12 × 15 ft', 'Material': 'HDPE + LDPE laminated', 'GSM': '90–150 GSM', 'UV Stabilised': 'Yes', 'Color': 'Blue/Silver', 'Grommets': 'Heavy-duty every 1m' },
    tags: ['tarpaulin', 'waterproof', 'agriculture', 'construction'],
  },
  {
    id: 'p-08', slug: 'water-tank-500l', name: 'Water Storage Tank 500 Litre',
    category: 'Water Tanks', categorySlug: 'water-tanks',
    sku: 'MG-WT-001', purchaseMode: 'enquiry',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80'],
    rating: 4.7, reviewCount: 112, featured: true, inStock: true,
    description: 'BIS-certified triple-layer food-grade water storage tanks. UV-stabilised outer layer, anti-bacterial inner layer. Suitable for overhead and underground installation.',
    specs: { 'Capacity': '500 Litres', 'Layers': '3 (UV + insulation + food-grade)', 'Standard': 'IS:12701 (BIS Certified)', 'Material': 'Food-grade polyethylene', 'Color': 'Black/White', 'Warranty': '5 Years' },
    tags: ['water tank', 'storage', 'bis certified', 'food grade'],
  },
  {
    id: 'p-09', slug: 'garden-pipe-spray-nozzle-set', name: 'Garden Pipe + Spray Nozzle Set',
    category: 'Garden Hoses & Pipes', categorySlug: 'garden-hoses',
    sku: 'MG-GH-010', purchaseMode: 'buy_online', price: 349, mrp: 449,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&bri=10',
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80&bri=10'],
    rating: 4.2, reviewCount: 203, featured: false, inStock: true,
    description: '15-metre garden pipe bundled with a 7-pattern adjustable spray nozzle. Perfect home garden combo.',
    specs: { 'Pipe Length': '15 metres', 'Pipe Dia': '12mm', 'Nozzle Patterns': '7 modes', 'Connector': 'Quick-release brass' },
    tags: ['garden', 'nozzle', 'combo', 'home'],
  },
  {
    id: 'p-10', slug: 'upvc-column-pipe-1-25in', name: 'uPVC Column Pipe 1¼" (ISI)',
    category: 'PVC / UPVC Pipes', categorySlug: 'pvc-upvc-pipes',
    sku: 'MG-UP-010', purchaseMode: 'enquiry',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&sat=-20',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&sat=-20'],
    rating: 4.6, reviewCount: 88, featured: false, inStock: true,
    description: 'ISI-certified uPVC column pipes for submersible pump applications. Available in 3m and 6m lengths with threaded joints.',
    specs: { 'Bore': '1¼ inch', 'Standard': 'IS:12818', 'Length': '3m / 6m', 'Thread': 'BSP standard' },
    tags: ['column pipe', 'submersible', 'upvc'],
  },
];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Suresh Patel',
    role: 'Farm Owner, Nashik',
    rating: 5,
    text: 'I have been using Modigold garden pipes for 3 seasons. The quality is unmatched — no cracking even under full sun. Dealer support is excellent.',
    initials: 'SP',
  },
  {
    id: 't2',
    name: 'Ramesh Contractors',
    role: 'Civil Contractor, Nagpur',
    rating: 5,
    text: 'We source uPVC casing pipes exclusively from Modigold for all our borewell projects. ISI mark and consistent quality give us confidence.',
    initials: 'RC',
  },
  {
    id: 't3',
    name: 'Anita Sharma',
    role: 'Nursery Owner, Pune',
    rating: 4,
    text: 'The shade nets are durable and do exactly what they promise. The team helped me select the right GSM for my plants. Very helpful.',
    initials: 'AS',
  },
];

export const SLIDES = [
  {
    id: 1,
    headline: '28 Years of Manufacturing Excellence',
    subtext: 'From Nagpur to pan-India — trusted by 500+ dealers, farmers, and builders across 15+ states.',
    cta1: { label: 'Explore Products', href: '/shop' },
    cta2: { label: 'Get a Quote', href: '/enquiry' },
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85',
    overlay: 'rgba(26,35,64,0.72)',
  },
  {
    id: 2,
    headline: 'Nurture Your Farm with Quality Shade Nets',
    subtext: 'UV-stabilised HDPE shade nets designed for Indian climates. Available in 25% to 90% shade density.',
    cta1: { label: 'View Shade Nets', href: '/shop?category=shade-nets' },
    cta2: { label: 'Request a Quote', href: '/enquiry' },
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1800&q=85',
    overlay: 'rgba(26,35,64,0.60)',
  },
  {
    id: 3,
    headline: 'Premium Garden Pipes, Delivered to Your Door',
    subtext: 'Buy retail online or enquire for bulk — flexible pricing for every scale of order.',
    cta1: { label: 'Shop Garden Pipes', href: '/shop?category=garden-hoses' },
    cta2: { label: 'Bulk Enquiry', href: '/enquiry' },
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1800&q=85',
    overlay: 'rgba(26,35,64,0.55)',
  },
];

export const STATS = [
  { label: 'Years of Excellence', value: 28, suffix: '+', icon: 'award' },
  { label: 'Dealers Associated', value: 500, suffix: '+', icon: 'users' },
  { label: 'States Presence', value: 15, suffix: '+', icon: 'map' },
  { label: 'Zero Complaints', value: 0, suffix: '', icon: 'shield' },
];

export const USPS = [
  { icon: 'award', title: 'ISI & BIS Certified', description: 'All products manufactured to BIS/ISI standards. Quality you can trust on every pipe and fitting.' },
  { icon: 'truck', title: 'Pan-India Delivery', description: 'Seamless logistics to 15+ states. Dealer network ensures stock close to your location.' },
  { icon: 'tag', title: 'Transparent Bulk Pricing', description: 'No hidden charges. Wholesale and dealer pricing with flexible MOQ for every business size.' },
  { icon: 'clock', title: '28 Years of Trust', description: 'Founded in 1996 by Mr. Rajendra Bansal. Three decades of consistent quality and customer service.' },
  { icon: 'leaf', title: 'Eco-Friendly Manufacturing', description: 'MIDC Nagpur facility follows responsible manufacturing. Recyclable materials across product lines.' },
  { icon: 'headphones', title: 'Dedicated Support', description: 'Sales team available 6 days a week. Technical guidance on product selection included.' },
];
