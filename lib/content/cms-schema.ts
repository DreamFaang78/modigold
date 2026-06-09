// Pure data types for the extended CMS (homepage sections, cards, footer).
// No server imports — safe to use in both server and client code.

import { CATEGORIES } from '@/lib/data';

// ── homepage section ──────────────────────────────────────────────────────────

export interface HomepageSection {
  sectionKey:      string;
  eyebrow:         string;
  title:           string;
  highlightedText: string;
  description:     string;
  ctaText:         string;
  ctaLink:         string;
  metadata:        Record<string, unknown>;
  isActive:        boolean;
}

// ── homepage card (flexible ordering, etc.) ───────────────────────────────────

export interface HomepageCard {
  id:          string;
  sectionKey:  string;
  badgeText:   string;
  title:       string;
  description: string;
  iconName:    string;
  bullets:     string[];
  ctaText:     string;
  ctaLink:     string;
  variant:     string; // 'retail' | 'wholesale' | ''
  orderIndex:  number;
  isActive:    boolean;
}

// ── footer ────────────────────────────────────────────────────────────────────

export interface FooterLinkGroup {
  id:         string;
  groupKey:   string;
  groupTitle: string;
  orderIndex: number;
  isActive:   boolean;
}

export interface FooterLink {
  id:         string;
  groupKey:   string;
  label:      string;
  href:       string;
  orderIndex: number;
  isActive:   boolean;
}

export interface FooterContent {
  brandBlurb:     string;
  factoryAddress: string;
  officeAddress:  string;
  phoneNumbers:   string[];
  email:          string;
  linkGroups:     FooterLinkGroup[];
  links:          FooterLink[];
}

// ── contact / bulk enquiry page content ──────────────────────────────────────

export interface ContactPageContent {
  hero:      HomepageSection;
  form:      HomepageSection;
  infoCards: HomepageCard[];
}

export interface BulkEnquiryPageContent {
  hero:     HomepageSection;
  form:     HomepageSection;
  benefits: HomepageCard[];
}

// ── site popup ────────────────────────────────────────────────────────────────

export interface SitePopup {
  id:                   string;
  title:                string;
  description:          string;
  badgeText:            string;
  imageUrl:             string;
  ctaText:              string;
  ctaLink:              string;
  secondaryCtaText:     string;
  secondaryCtaLink:     string;
  popupType:            'modal' | 'bottom_sheet' | 'top_bar';
  triggerDelaySeconds:  number;
  displayFrequency:     'always' | 'once_per_session' | 'once_per_day';
  startAt:              string | null;
  endAt:                string | null;
  isActive:             boolean;
  orderIndex:           number;
}

// ── defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_POPUP: SitePopup = {
  id:                  'default',
  title:               'Get Dealer Pricing',
  description:         'Submit your requirement and our team will share competitive pricing within 24 hours.',
  badgeText:           'BULK ENQUIRY',
  imageUrl:            '',
  ctaText:             'Get a Quote',
  ctaLink:             '/bulk-enquiry',
  secondaryCtaText:    'Shop Online',
  secondaryCtaLink:    '/shop',
  popupType:           'modal',
  triggerDelaySeconds: 2,
  displayFrequency:    'once_per_session',
  startAt:             null,
  endAt:               null,
  isActive:            false,
  orderIndex:          1,
};

export const DEFAULT_ABOUT_SECTION: HomepageSection = {
  sectionKey:      'about_main',
  eyebrow:         'SINCE 1996',
  title:           'Premium Pipes Built for Indian Businesses',
  highlightedText: 'Since 1996',
  description:     'Manufacturing premium PVC, UPVC, and HDPE pipes with trusted quality, strong dealer relationships, and pan-India reach.',
  ctaText:         'Learn More',
  ctaLink:         '/about',
  metadata: {
    image_url:  '',
    badge_text: '28+ Years of Trust',
    features: [
      'ISI & BIS aligned quality standards',
      'Trusted by 500+ dealers',
      'Supplying across 15+ Indian states',
    ],
  },
  isActive: true,
};

export const DEFAULT_CONTACT_HERO: HomepageSection = {
  sectionKey:      'contact_page_hero',
  eyebrow:         'GET IN TOUCH',
  title:           'Contact Us',
  highlightedText: 'Contact',
  description:     'Our sales team is available Monday–Saturday, 9am–6pm IST.',
  ctaText:         'Send Message',
  ctaLink:         '/contact#form',
  metadata:        { support_text: 'Response within 2 business hours' },
  isActive:        true,
};

export const DEFAULT_CONTACT_FORM_SECTION: HomepageSection = {
  sectionKey:      'contact_page_form',
  eyebrow:         '',
  title:           'Send Us a Message',
  highlightedText: 'Message',
  description:     '',
  ctaText:         'Send Message',
  ctaLink:         '',
  metadata:        { form_note: 'All fields marked * are required. We respond within 1 business day.' },
  isActive:        true,
};

export const DEFAULT_CONTACT_INFO_CARDS: HomepageCard[] = [
  { id: 'cic-0', sectionKey: 'contact_info_cards', badgeText: '', title: 'Factory',       description: '', iconName: 'MapPin', bullets: ['B-104 MIDC Butibori', 'Nagpur, Maharashtra 441122'],      ctaText: '', ctaLink: '',                        variant: '', orderIndex: 0, isActive: true },
  { id: 'cic-1', sectionKey: 'contact_info_cards', badgeText: '', title: 'Office',        description: '', iconName: 'MapPin', bullets: ['D-106, M.I.D.C., Hingna', 'Nagpur – 440016, Maharashtra'], ctaText: '', ctaLink: '',                        variant: '', orderIndex: 1, isActive: true },
  { id: 'cic-2', sectionKey: 'contact_info_cards', badgeText: '', title: 'Phone',         description: '', iconName: 'Phone',  bullets: ['+91 9960 937 588', '+91 8329 369 356'],                   ctaText: '', ctaLink: 'tel:+919960937588',        variant: '', orderIndex: 2, isActive: true },
  { id: 'cic-3', sectionKey: 'contact_info_cards', badgeText: '', title: 'Email',         description: '', iconName: 'Mail',   bullets: ['sales@modigold.in'],                                       ctaText: '', ctaLink: 'mailto:sales@modigold.in', variant: '', orderIndex: 3, isActive: true },
  { id: 'cic-4', sectionKey: 'contact_info_cards', badgeText: '', title: 'Working Hours', description: '', iconName: 'Clock',  bullets: ['Mon–Sat: 9:00am – 6:00pm', 'Sunday: Closed'],              ctaText: '', ctaLink: '',                        variant: '', orderIndex: 4, isActive: true },
];

export const DEFAULT_BULK_HERO: HomepageSection = {
  sectionKey:      'bulk_enquiry_hero',
  eyebrow:         'WHOLESALE & DEALER',
  title:           'Bulk Enquiry / Get a Quote',
  highlightedText: 'Bulk',
  description:     'Tell us what you need and our sales team will respond with competitive pricing within 24 hours.',
  ctaText:         'Submit Enquiry',
  ctaLink:         '/bulk-enquiry#form',
  metadata:        { support_text: 'Response within 24 hours' },
  isActive:        true,
};

export const DEFAULT_BULK_FORM_SECTION: HomepageSection = {
  sectionKey:      'bulk_enquiry_form',
  eyebrow:         '',
  title:           'Submit Your Enquiry',
  highlightedText: 'Enquiry',
  description:     '',
  ctaText:         'Submit Enquiry',
  ctaLink:         '',
  metadata:        { form_note: 'Our team will contact you within 24 hours with pricing details.' },
  isActive:        true,
};

export const DEFAULT_BULK_BENEFIT_CARDS: HomepageCard[] = [
  { id: 'bb-0', sectionKey: 'bulk_enquiry_benefits', badgeText: '', title: 'Wholesale Pricing',     description: 'Competitive rates for bulk quantities. Better margin for dealers.', iconName: 'DollarSign', bullets: [], ctaText: '', ctaLink: '', variant: '', orderIndex: 0, isActive: true },
  { id: 'bb-1', sectionKey: 'bulk_enquiry_benefits', badgeText: '', title: 'Custom Specifications', description: 'Custom pipe lengths, diameters, GSM ratings and colour options.',       iconName: 'Settings',    bullets: [], ctaText: '', ctaLink: '', variant: '', orderIndex: 1, isActive: true },
  { id: 'bb-2', sectionKey: 'bulk_enquiry_benefits', badgeText: '', title: 'Door Delivery',         description: 'Pan-India logistics. Container loads from factory.',                    iconName: 'Truck',       bullets: [], ctaText: '', ctaLink: '', variant: '', orderIndex: 2, isActive: true },
  { id: 'bb-3', sectionKey: 'bulk_enquiry_benefits', badgeText: '', title: '24-Hour Response',      description: 'Our sales team reviews every enquiry within one business day.',          iconName: 'Zap',         bullets: [], ctaText: '', ctaLink: '', variant: '', orderIndex: 3, isActive: true },
];

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  DEFAULT_ABOUT_SECTION,
  {
    sectionKey:      'modigold_advantage',
    eyebrow:         'WHY CHOOSE US',
    title:           'The Modigold',
    highlightedText: 'Advantage',
    description:     '',
    ctaText:         '',
    ctaLink:         '',
    metadata:        {},
    isActive:        true,
  },
  {
    sectionKey:      'flexible_ordering',
    eyebrow:         'FLEXIBLE ORDERING',
    title:           'Buy Retail or Order Bulk —',
    highlightedText: 'Your Choice',
    description:     '',
    ctaText:         '',
    ctaLink:         '',
    metadata:        {},
    isActive:        true,
  },
];

export const DEFAULT_ORDERING_CARDS: HomepageCard[] = [
  {
    id:          'default-retail',
    sectionKey:  'flexible_ordering',
    badgeText:   'BUY ONLINE',
    title:       'Retail Purchase',
    description: 'Add to cart, pay via Razorpay (UPI, card, netbanking, wallets), and get delivered to your door. Available for garden pipes, spray nozzles and small SKUs.',
    iconName:    '',
    bullets:     [
      'Fixed retail price visible',
      'Add to Cart + Instant Checkout',
      'Prepaid, Partial COD, or Full COD',
      'Live shipment tracking',
    ],
    ctaText:    'SHOP NOW',
    ctaLink:    '/shop',
    variant:    'retail',
    orderIndex: 0,
    isActive:   true,
  },
  {
    id:          'default-wholesale',
    sectionKey:  'flexible_ordering',
    badgeText:   'BULK ENQUIRY',
    title:       'Wholesale / Dealer',
    description: 'For container loads, dealer purchases, or custom specs — submit an enquiry and our sales team will respond with competitive pricing within 24 hours.',
    iconName:    '',
    bullets:     [
      'Custom quantity & spec requests',
      'Dealer & wholesale pricing',
      'Dedicated sales support',
      'Pan-India logistics network',
    ],
    ctaText:    'GET A QUOTE',
    ctaLink:    '/enquiry',
    variant:    'wholesale',
    orderIndex: 1,
    isActive:   true,
  },
];

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  brandBlurb:     'Manufacturing premium PVC, UPVC, and HDPE pipes since 1996. Trusted by 500+ dealers across 15+ Indian states.',
  factoryAddress: 'B-104 MIDC Butibori, Nagpur, MH 441122',
  officeAddress:  'D-106, M.I.D.C., Hingna, Nagpur – 440016',
  phoneNumbers:   ['+91 9960 937 588', '+91 8329 369 356'],
  email:          'sales@modigold.in',
  linkGroups: [
    { id: 'dg-ql', groupKey: 'quick_links',   groupTitle: 'Quick Links', orderIndex: 0, isActive: true },
    { id: 'dg-pl', groupKey: 'product_links', groupTitle: 'Products',    orderIndex: 1, isActive: true },
  ],
  links: [
    { id: 'ql-0', groupKey: 'quick_links', label: 'Home',         href: '/',             orderIndex: 0, isActive: true },
    { id: 'ql-1', groupKey: 'quick_links', label: 'About Us',     href: '/about',        orderIndex: 1, isActive: true },
    { id: 'ql-2', groupKey: 'quick_links', label: 'Shop',         href: '/shop',         orderIndex: 2, isActive: true },
    { id: 'ql-3', groupKey: 'quick_links', label: 'Bulk Enquiry', href: '/bulk-enquiry', orderIndex: 3, isActive: true },
    { id: 'ql-4', groupKey: 'quick_links', label: 'Track Order',  href: '/track-order',  orderIndex: 4, isActive: true },
    { id: 'ql-5', groupKey: 'quick_links', label: 'Contact Us',   href: '/contact',      orderIndex: 5, isActive: true },
    { id: 'ql-6', groupKey: 'quick_links', label: 'Admin Login',  href: '/admin',        orderIndex: 6, isActive: true },
    ...CATEGORIES.map((cat, i) => ({
      id:         `pl-${i}`,
      groupKey:   'product_links',
      label:      cat.name,
      href:       `/shop?category=${cat.slug}`,
      orderIndex: i,
      isActive:   true,
    })),
  ],
};
