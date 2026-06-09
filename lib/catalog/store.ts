// SERVER-ONLY catalog store. Do not import from Client Components.
// Reads from Supabase when env vars are set; falls back to lib/data.ts otherwise.

import { createSupabaseAdminClient } from '@/lib/supabase';
import { CATEGORIES, PRODUCTS, type Category, type Product } from '@/lib/data';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USE_SUPABASE = Boolean(
  SUPA_URL && SUPA_KEY &&
  !SUPA_URL.includes('your-project') &&
  !SUPA_KEY.includes('your-'),
);

// ── categories ────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  if (!USE_SUPABASE) return CATEGORIES;

  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from('categories')
    .select('id, slug, name, description, image_url, icon_name, order_index')
    .order('order_index', { ascending: true });

  if (error || !data?.length) return CATEGORIES;

  return data.map((r) => ({
    id:           r.id,
    slug:         r.slug,
    name:         r.name,
    description:  r.description ?? '',
    image:        r.image_url   ?? '',
    icon:         r.icon_name   ?? '',
    productCount: 0, // populated separately if needed
  }));
}

// ── products ──────────────────────────────────────────────────────────────────

interface ProductFilter {
  featured?: boolean;
  categorySlug?: string;
}

export async function getProducts(filter: ProductFilter = {}): Promise<Product[]> {
  if (!USE_SUPABASE) {
    let list = PRODUCTS;
    if (filter.featured)      list = list.filter((p) => p.featured);
    if (filter.categorySlug)  list = list.filter((p) => p.categorySlug === filter.categorySlug);
    return list;
  }

  const db = createSupabaseAdminClient();
  let query = db
    .from('products')
    .select('id, slug, name, sku, purchase_mode, price, mrp, bulk_threshold, image_urls, rating, review_count, is_featured, in_stock, description, specs, tags, categories(slug, name)')
    .order('name', { ascending: true });

  if (filter.featured)     query = query.eq('is_featured', true);
  if (filter.categorySlug) {
    // join-filter via the FK relationship
    query = query.eq('categories.slug', filter.categorySlug);
  }

  const { data, error } = await query;
  if (error || !data?.length) {
    let list = PRODUCTS;
    if (filter.featured)     list = list.filter((p) => p.featured);
    if (filter.categorySlug) list = list.filter((p) => p.categorySlug === filter.categorySlug);
    return list;
  }

  return data.map((r) => {
    // Supabase infers the join as an array but for a single FK it's an object or null at runtime.
    const catRaw = r.categories as unknown;
    const cat = (Array.isArray(catRaw) ? catRaw[0] : catRaw) as { slug: string; name: string } | null;
    return {
      id:            r.id,
      slug:          r.slug,
      name:          r.name,
      sku:           r.sku,
      category:      cat?.name        ?? '',
      categorySlug:  cat?.slug        ?? '',
      purchaseMode:  r.purchase_mode  as Product['purchaseMode'],
      price:         r.price          ?? undefined,
      mrp:           r.mrp            ?? undefined,
      bulkThreshold: r.bulk_threshold ?? undefined,
      image:         (r.image_urls as string[])[0] ?? '',
      images:        (r.image_urls as string[])    ?? [],
      rating:        Number(r.rating) ?? 0,
      reviewCount:   r.review_count   ?? 0,
      featured:      r.is_featured    ?? false,
      inStock:       r.in_stock       ?? true,
      description:   r.description    ?? '',
      specs:         (r.specs as Record<string, string>) ?? {},
      tags:          (r.tags as string[]) ?? [],
    };
  });
}

// ── mutations (used by admin server actions) ───────────────────────────────────

export async function toggleProductFeatured(id: string, featured: boolean): Promise<void> {
  if (!USE_SUPABASE) return; // no-op in file mode
  const db = createSupabaseAdminClient();
  const { error } = await db
    .from('products')
    .update({ is_featured: featured, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(`toggleProductFeatured failed: ${error.message}`);
}

export async function toggleProductStock(id: string, inStock: boolean): Promise<void> {
  if (!USE_SUPABASE) return;
  const db = createSupabaseAdminClient();
  const { error } = await db
    .from('products')
    .update({ in_stock: inStock, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(`toggleProductStock failed: ${error.message}`);
}
