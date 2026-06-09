// SERVER-ONLY admin session via Supabase Auth.
// Do not import from Client Components.

import { createSupabaseServerClient } from '@/lib/supabase';

export async function isAuthed(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user !== null;
}
