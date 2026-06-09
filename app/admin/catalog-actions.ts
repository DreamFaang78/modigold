'use server';

import { revalidatePath } from 'next/cache';
import { isAuthed } from '@/lib/auth';
import { toggleProductFeatured, toggleProductStock } from '@/lib/catalog/store';

async function guard() {
  if (!(await isAuthed())) throw new Error('Unauthorized');
}

export async function toggleFeaturedAction(
  id: string,
  featured: boolean,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await guard();
    await toggleProductFeatured(id, featured);
    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function toggleStockAction(
  id: string,
  inStock: boolean,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await guard();
    await toggleProductStock(id, inStock);
    revalidatePath('/shop');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed' };
  }
}
