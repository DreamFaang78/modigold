# Site Content CMS — Setup (Requirement #3)

Lets the client edit homepage **taglines, banners, brand details, and "Why Choose Us" cards**
from the admin dashboard — changes go live instantly. No code, no redeploy.

## How it works

- Public pages read content via `getContent()` (server-side) and fall back to the
  built-in defaults in `lib/data.ts` if nothing has been edited yet.
- The admin **Site Content** tab (`/admin` → *Site Content*) edits a draft and saves it
  through a protected Server Action.
- Storage is chosen automatically:
  | Environment | Driver | Persists? |
  |---|---|---|
  | No Supabase env set | local file `.data/site-content.json` | ✅ locally, ❌ on serverless |
  | Supabase env set | Supabase Postgres (REST) | ✅ everywhere (production) |

## Local testing (works right now, zero setup)

1. `npm run dev`
2. Open `http://localhost:3000/admin`
3. Login password: **`modigold-admin`** (dev fallback).
4. Edit a tagline → **Save Changes** → open `/` to see it live.

## Production setup (₹0 — Supabase free tier)

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query →** paste `supabase/schema.sql` → **Run**.
3. **Project Settings → API**, copy the values into your env (`.env.local` / Vercel):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...        # "service_role" secret key
   ADMIN_PASSWORD=<a strong password>
   SESSION_SECRET=<long random string>     # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   > `SUPABASE_SERVICE_ROLE_KEY` is server-only — never expose it to the browser.
4. Redeploy. The admin editor now persists to Supabase across all visitors and deploys.

## Security notes

- Admin login is a real HMAC-signed, httpOnly session cookie (replaces the old
  "any email/password works" demo).
- Every save re-checks authorization on the server (Server Actions are directly reachable).
- Set a strong `ADMIN_PASSWORD` and a unique `SESSION_SECRET` before going live.

## What's editable now vs. next

**Now:** hero banners (primary + secondary taglines, CTAs, image), brand & contact details,
"Why Choose Us" cards.
**Next (same pattern):** wire `brand`/contact into Header & Footer, make Stats, Categories,
Testimonials, and per-page (About/Contact) text editable, and add image upload via Supabase Storage.
