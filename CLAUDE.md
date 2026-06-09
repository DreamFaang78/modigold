1. Project Overview

Project Name: Modigold E-commerce Website
Core Functionality: A modern corporate and e-commerce platform designed for product showcasing, customer interaction, and administrative management. The site features a comprehensive set of pages including home, shop, product detail, about, contact, bulk enquiry, cart, checkout, and order tracking. An admin dashboard provides tools for managing products, orders, enquiries, coupons, reviews, and analytics.

2. Technical Stack & Environment

Category
Component
Details
Frontend Framework
Next.js 16
Utilizes the App Router for server components and client components.
Language
TypeScript
Strict typing enforced for robust development.
Styling
TailwindCSS v4
Utility-first CSS framework for rapid UI development.
Design System
Fonts: Playfair Display, DM Sans
Primary Colors: Gold (#C9A84C), Navy (#1A2340)
Database, Auth, Storage
Supabase (Free Tier)
PostgreSQL database, JWT-based authentication, S3-compatible object storage.
Hosting
Vercel (Free Tier)
Optimized for Next.js deployments, serverless functions.
Security & CDN
Cloudflare (Free Plan)
DDoS protection, WAF, Universal SSL, Bot Fight Mode, Rate Limiting, Turnstile for forms.
Package Manager
npm / yarn / pnpm / bun
(As per package.json and user preference)




3. Current Project State & Architecture

The project is an initial Next.js 16 build. Key architectural characteristics include:

•
Content Management: All dynamic content (e.g., primary/secondary taglines, hero slider data, statistical counters, USP cards, product listings) is currently hardcoded within lib/data.ts. This file acts as the single source of truth for all display content.

•
Admin Dashboard: The /admin route currently hosts a client-side demonstration dashboard. Authentication is simulated (accepts any credentials), and there is no persistent backend for content modification. The dashboard structure includes sections for Products, Orders, Enquiries, Coupons, Reviews, Analytics, and Settings.

•
Data Flow: Frontend components directly import and consume data from lib/data.ts. There is no current API layer for content retrieval.

•
Deployment: The application is deployable to Vercel, as indicated by the next.config.ts and project structure.

4. Requirement #3: Shopify-like Admin CMS Implementation

Goal: To transform the hardcoded content system into a dynamic, database-driven Content Management System accessible via the /admin dashboard, mimicking the ease of use found in platforms like Shopify for key content elements. This must be achieved within a ₹0/month recurring cost budget, leveraging free tiers of Vercel, Cloudflare, and Supabase.

Scope: Focus on enabling editing for high-value, frequently updated content. This includes:

•
Primary and secondary taglines

•
Hero slider content (text, images, CTAs)

•
USP cards and statistical numbers

•
Site information (phone, address, social links)

•
Featured products (on/off toggles, basic product data)

Out of Scope: A full drag-and-drop page builder or pixel-level editing of every UI element is explicitly not part of this requirement due to budget and time constraints.

4.1. Detailed Implementation Steps

1.
Supabase Setup:

•
Initialize a new Supabase project.

•
Create necessary tables and define their schemas (see Section 4.2).

•
Configure Row Level Security (RLS) to restrict access to admin users only.

•
Set up Supabase Storage buckets for image uploads.



2.
Authentication Integration:

•
Replace the fake /admin login with Supabase Auth.

•
Implement server-side authentication checks for all admin routes and actions.

•
Ensure secure handling of user sessions.



3.
Content Migration & API Layer:

•
Migrate initial hardcoded data from lib/data.ts to the new Supabase tables.

•
Develop server components or API routes (Next.js Route Handlers) to fetch and update content from Supabase.

•
Implement instant revalidation mechanisms (e.g., revalidatePath, revalidateTag) to reflect content changes on the public site immediately.



4.
Admin Dashboard Development:

•
Modify app/admin/page.tsx to display editable forms for the specified content types.

•
Integrate Supabase client-side SDK for form submissions and data mutations.

•
Implement image upload functionality within the admin forms, utilizing Supabase Storage.



5.
Public Site Integration:

•
Update relevant public-facing components (e.g., HeroSlider, HomeView, app/page.tsx) to consume data from the new Supabase API layer instead of lib/data.ts.



4.2. Supabase Schema Definitions

Below are the proposed Supabase table schemas. Claude should use these definitions precisely.

Table: site_settings

•
Purpose: Stores global site configurations like logo, brand name, contact info.

Column Name
Data Type
Constraints
Description
id
UUID
PRIMARY KEY, DEFAULT gen_random_uuid()
Unique identifier for the settings record.
brand_name
TEXT
NOT NULL
The primary brand name of the website.
logo_url
TEXT
NULLABLE
URL to the site logo, stored in Supabase Storage.
phone_number
TEXT
NULLABLE
Contact phone number.
email_address
TEXT
NULLABLE
Contact email address.
address
TEXT
NULLABLE
Physical address.
social_links
JSONB
NULLABLE
JSON object for social media links (e.g., { "facebook": "url", "instagram": "url" }).
updated_at
TIMESTAMP WITH TIME ZONE
DEFAULT now()
Timestamp of the last update.




Table: hero_slides

•
Purpose: Manages content for the homepage hero slider.

Column Name
Data Type
Constraints
Description
id
UUID
PRIMARY KEY, DEFAULT gen_random_uuid()
Unique identifier for each slide.
primary_tagline
TEXT
NOT NULL
Main headline for the slide.
secondary_tagline
TEXT
NULLABLE
Sub-headline or descriptive text.
cta_text
TEXT
NULLABLE
Call-to-action button text.
cta_link
TEXT
NULLABLE
URL for the CTA button.
image_url
TEXT
NOT NULL
URL to the slide background image, stored in Supabase Storage.
order_index
INTEGER
NOT NULL, UNIQUE
Display order of the slide.
is_active
BOOLEAN
DEFAULT TRUE
Whether the slide is currently active.
updated_at
TIMESTAMP WITH TIME ZONE
DEFAULT now()
Timestamp of the last update.




Table: usps

•
Purpose: Stores Unique Selling Proposition cards.

Column Name
Data Type
Constraints
Description
id
UUID
PRIMARY KEY, DEFAULT gen_random_uuid()
Unique identifier for each USP.
title
TEXT
NOT NULL
Title of the USP card.
description
TEXT
NULLABLE
Detailed description.
icon_name
TEXT
NULLABLE
Name of an icon (e.g., from a UI library).
order_index
INTEGER
NOT NULL, UNIQUE
Display order.
updated_at
TIMESTAMP WITH TIME ZONE
DEFAULT now()
Timestamp of the last update.




Table: stats

•
Purpose: Stores numerical statistics for display.

Column Name
Data Type
Constraints
Description
id
UUID
PRIMARY KEY, DEFAULT gen_random_uuid()
Unique identifier for each stat.
label
TEXT
NOT NULL
Text label for the statistic (e.g., "Happy Customers").
value
NUMERIC
NOT NULL
Numerical value of the statistic.
prefix
TEXT
NULLABLE
Optional prefix (e.g., "$").
suffix
TEXT
NULLABLE
Optional suffix (e.g., "+", "%").
order_index
INTEGER
NOT NULL, UNIQUE
Display order.
updated_at
TIMESTAMP WITH TIME ZONE
DEFAULT now()
Timestamp of the last update.




Table: products

•
Purpose: Stores product information. (Simplified for initial CMS scope)

Column Name
Data Type
Constraints
Description
id
UUID
PRIMARY KEY, DEFAULT gen_random_uuid()
Unique identifier for each product.
name
TEXT
NOT NULL
Product name.
description
TEXT
NULLABLE
Product description.
price
NUMERIC
NOT NULL
Product price.
image_urls
TEXT[]
NULLABLE
Array of image URLs for the product.
is_featured
BOOLEAN
DEFAULT FALSE
Whether the product is featured on the homepage.
updated_at
TIMESTAMP WITH TIME ZONE
DEFAULT now()
Timestamp of the last update.




4.3. Project Structure Map

This outlines the relevant directories and files. Claude should prioritize these when making changes.

Plain Text


modigold/
├── .claude/                  # Claude-specific configuration (e.g., repomix, codesight configs)
├── app/
│   ├── (auth)/
│   │   └── login/            # Admin login page (to be integrated with Supabase Auth)
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard main page (to be updated for CMS forms)
│   ├── api/
│   │   └── content/          # New API routes for Supabase content interaction (e.g., GET, POST, PUT, DELETE)
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage (to be updated to fetch content from Supabase)
├── components/
│   ├── HeroSlider.tsx        # Component for hero section (to be updated for Supabase data)
│   ├── HomeView.tsx          # Homepage body component (to be updated for Supabase data)
│   └── ... (other UI components)
├── lib/
│   ├── data.ts               # CURRENTLY HARDCODED DATA (TO BE REPLACED BY SUPABASE FETCHING)
│   ├── supabase.ts           # NEW: Supabase client initialization and helper functions
│   └── utils.ts              # General utility functions
├── public/
│   └── ... (static assets)
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies
├── tailwind.config.ts        # TailwindCSS configuration
├── tsconfig.json             # TypeScript configuration
└── CLAUDE.md                 # This detailed reference file



5. Coding Standards & Best Practices

•
TypeScript First: All new code and modifications must strictly adhere to TypeScript best practices, including explicit typing for all functions, variables, and component props.

•
Functional Components: Prefer functional React components with hooks.

•
Atomic Design Principles: Maintain a clear separation of concerns. Components should be small, reusable, and focused on a single responsibility.

•
Error Handling: Implement robust error handling for all Supabase interactions and API calls.

•
Security: Adhere to Next.js security best practices, especially for server components and API routes (e.g., input validation, proper authentication checks).

•
Performance: Optimize image loading (using next/image), data fetching, and component rendering for fast page loads and smooth user experience.

•
Readability: Write clean, well-commented, and self-documenting code.

6. Token Efficiency Guidelines for Claude

To maximize efficiency and minimize token costs, Claude should strictly follow these directives:

•
Prioritize CLAUDE.md: Always refer to this document first for project context, architecture, and specific requirements. Do not ask for clarification on information already present here.

•
Use /compact Aggressively: After any significant output, planning phase, or code generation, use /compact to summarize the conversation history. This is crucial for keeping the context window lean.

•
Never Re-paste Outputs: Do not re-paste previous Claude outputs into new prompts. Instead, reference them by task number or specific file/line numbers.

•
Scope Sessions: Dedicate each Claude Code session to a single, well-defined sub-task of Requirement #3. If a new, unrelated task arises, start a fresh session.

•
File-Specific Instructions: Provide highly specific instructions, targeting particular files or functions. Avoid vague or open-ended requests that require broad repository scans.

•
Model Selection: Default to Sonnet for all coding tasks, refactoring, and minor architectural decisions. Only switch to Opus for high-level architectural planning, complex problem-solving, or when Sonnet explicitly struggles with a task.

•
repomix / codesight: Assume these tools are configured and used for initial repository ingestion. Do not request full file contents unless absolutely necessary for a specific modification not covered by this CLAUDE.md.

•
AGENTS.md: Acknowledge and respect the AGENTS.md file, especially regarding Next.js 16 breaking changes. Do not re-read it unless explicitly instructed.

