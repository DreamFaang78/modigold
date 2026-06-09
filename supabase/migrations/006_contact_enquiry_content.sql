-- ─── 006_contact_enquiry_content.sql ─────────────────────────────────────────
-- Adds CMS sections + cards for Contact and Bulk Enquiry pages.
-- Safe to run multiple times (ON CONFLICT DO NOTHING / DO UPDATE).
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. homepage_sections rows ───────────────────────────────────────────────

INSERT INTO public.homepage_sections
  (section_key, eyebrow, title, highlighted_text, description, cta_text, cta_link, metadata, is_active, updated_at)
VALUES
  (
    'contact_page_hero',
    'GET IN TOUCH',
    'Contact Us',
    'Contact',
    'Our sales team is available Monday–Saturday, 9am–6pm IST. We typically respond within 2 business hours.',
    'Send Message',
    '/contact#form',
    '{"support_text": "Response within 2 business hours"}'::jsonb,
    true, now()
  ),
  (
    'contact_page_form',
    '',
    'Send Us a Message',
    'Message',
    '',
    'Send Message',
    '',
    '{"form_note": "All fields marked * are required. We respond within 1 business day."}'::jsonb,
    true, now()
  ),
  (
    'contact_info_cards',
    '',
    'Contact Information',
    '',
    '',
    '',
    '',
    '{}'::jsonb,
    true, now()
  ),
  (
    'bulk_enquiry_hero',
    'WHOLESALE & DEALER',
    'Bulk Enquiry / Get a Quote',
    'Bulk',
    'Tell us what you need and our sales team will respond with competitive pricing within 24 hours.',
    'Submit Enquiry',
    '/bulk-enquiry#form',
    '{"support_text": "Response within 24 hours"}'::jsonb,
    true, now()
  ),
  (
    'bulk_enquiry_form',
    '',
    'Submit Your Enquiry',
    'Enquiry',
    '',
    'Submit Enquiry',
    '',
    '{"form_note": "Our team will contact you within 24 hours with pricing details."}'::jsonb,
    true, now()
  ),
  (
    'bulk_enquiry_benefits',
    '',
    'Why Enquire?',
    '',
    '',
    '',
    '',
    '{}'::jsonb,
    true, now()
  )
ON CONFLICT (section_key) DO UPDATE SET
  updated_at = now();

-- ─── 2. Contact info cards (skip if already seeded) ──────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.homepage_cards WHERE section_key = 'contact_info_cards'
  ) THEN
    INSERT INTO public.homepage_cards
      (section_key, badge_text, title, description, icon_name, bullets, cta_text, cta_link, variant, order_index, is_active, updated_at)
    VALUES
      (
        'contact_info_cards', '', 'Factory', '',
        'MapPin',
        '["B-104 MIDC Butibori", "Nagpur, Maharashtra 441122"]'::jsonb,
        '', '', '', 0, true, now()
      ),
      (
        'contact_info_cards', '', 'Office', '',
        'MapPin',
        '["D-106, M.I.D.C., Hingna", "Nagpur – 440016, Maharashtra"]'::jsonb,
        '', '', '', 1, true, now()
      ),
      (
        'contact_info_cards', '', 'Phone', '',
        'Phone',
        '["+91 9960 937 588", "+91 8329 369 356", "+91 9970 703 536"]'::jsonb,
        '', 'tel:+919960937588', '', 2, true, now()
      ),
      (
        'contact_info_cards', '', 'Email', '',
        'Mail',
        '["sales@modigold.in"]'::jsonb,
        '', 'mailto:sales@modigold.in', '', 3, true, now()
      ),
      (
        'contact_info_cards', '', 'Working Hours', '',
        'Clock',
        '["Mon–Sat: 9:00am – 6:00pm", "Sunday: Closed"]'::jsonb,
        '', '', '', 4, true, now()
      );
  END IF;
END $$;

-- ─── 3. Bulk enquiry benefit cards (skip if already seeded) ──────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.homepage_cards WHERE section_key = 'bulk_enquiry_benefits'
  ) THEN
    INSERT INTO public.homepage_cards
      (section_key, badge_text, title, description, icon_name, bullets, cta_text, cta_link, variant, order_index, is_active, updated_at)
    VALUES
      (
        'bulk_enquiry_benefits', '', 'Wholesale Pricing',
        'Competitive rates for bulk quantities. Better margin for dealers and distributors across India.',
        'DollarSign', '[]'::jsonb, '', '', '', 0, true, now()
      ),
      (
        'bulk_enquiry_benefits', '', 'Custom Specifications',
        'Custom pipe lengths, diameters, GSM ratings and colour options available on request.',
        'Settings', '[]'::jsonb, '', '', '', 1, true, now()
      ),
      (
        'bulk_enquiry_benefits', '', 'Door Delivery',
        'Pan-India logistics. Container loads arranged directly from our Butibori factory.',
        'Truck', '[]'::jsonb, '', '', '', 2, true, now()
      ),
      (
        'bulk_enquiry_benefits', '', '24-Hour Response',
        'Our sales team reviews every enquiry within one business day and responds with a quote.',
        'Zap', '[]'::jsonb, '', '', '', 3, true, now()
      );
  END IF;
END $$;
