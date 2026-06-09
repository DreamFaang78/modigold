// Supabase client helpers — server (cookie-based), browser (anon), and admin (service-role).
// Server client is used in Server Components, Route Handlers, and Server Actions.
// Browser client is used in Client Components.
// Admin client bypasses RLS — use only in trusted server contexts (store, actions).

import { createServerClient, createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Server-side Supabase client. Call inside async Server Components / Actions. */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll may be called from a Server Component where mutation is not
          // allowed — safe to ignore; the middleware refreshes the session.
        }
      },
    },
  });
}

/** Browser-side Supabase client. Call inside Client Components. */
export function createSupabaseBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Service-role Supabase client — bypasses RLS.
 * Use only in trusted server contexts (Server Actions, Route Handlers, store).
 * Never expose to the browser.
 */
export function createSupabaseAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false },
  });
}
