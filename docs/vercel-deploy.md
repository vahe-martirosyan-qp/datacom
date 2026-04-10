# Deploy on Vercel (site + API)

This app is a single **Next.js 14** project: public pages, admin UI, and REST handlers under `/api/*` all deploy together as one Vercel project. There is no separate backend service.

## 1. Database (required)

Use a hosted PostgreSQL instance reachable from the internet, for example:

- [Neon](https://neon.tech) (integrates with Vercel)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- Supabase, Railway, etc.

Copy the connection string as **`DATABASE_URL`** in the Vercel project (Production + Preview if needed).

### Schema migrations (automatic on Vercel)

The repo includes Prisma migrations under `prisma/migrations/`. On Vercel, the **`vercel-build`** script runs:

`prisma migrate deploy` → `prisma generate` → `next build`

So tables are created or updated on each deploy as long as `DATABASE_URL` is set for the build.

Locally, apply the same migrations anytime:

```bash
pnpm db:deploy
# same as: prisma migrate deploy
```

**If you already created tables with `db push` only** (no migration history), either use a fresh database for production or baseline with Prisma’s docs for existing databases; otherwise `migrate deploy` may conflict with existing objects.

If the database is **empty** after migrations, the app **seeds** CMS content from built-in seeds on the first request (see `ensureContentStoreHydrated` in `contentStore`). You can also run `pnpm db:import` locally against that database to push a full snapshot.

## 2. Vercel project

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In [Vercel](https://vercel.com) → **Add New Project** → import the repo.
3. **Framework Preset:** Next.js (default).
4. **Install Command:** `pnpm install` (already set in `vercel.json`; Vercel also reads `packageManager` from `package.json`).
5. **Build Command:** leave default so Vercel uses the **`vercel-build`** script when present (`prisma migrate deploy`, then `next build`). Do not override with plain `next build` unless you run migrations another way.

## 3. Environment variables

Add these for **Production** (and **Preview** if you want previews to work with a real DB):

| Name | Notes |
|------|--------|
| `DATABASE_URL` | PostgreSQL URL (`?sslmode=require` if your host requires SSL). |
| `JWT_SECRET` | Long random string (≥ 32 chars). |
| `JWT_REFRESH_SECRET` | Different long random string. |
| `ADMIN_LOGIN` | Admin username for `/admin/login`. |
| `ADMIN_PASSWORD` | Admin password. |
| `BLOB_READ_WRITE_TOKEN` | **Required on Vercel** for admin image uploads (see below). |

See `.env.example` for descriptions.

### Image uploads on Vercel

Serverless functions have a **read-only** filesystem (except `/tmp`), so files cannot be saved under `public/uploads` like in local Docker.

1. In Vercel: **Storage** → **Blob** → create a store.
2. Link it to the project and add **`BLOB_READ_WRITE_TOKEN`** to the project environment variables.

Without this token on Vercel, `/api/admin/upload` returns `503` with an explanatory message. Locally, uploads still go to `public/uploads/…`.

## 4. After deploy

- Open the production URL → public site (`/[lang]`).
- Admin: `https://<your-domain>/admin/login`.
- Optional: assign a custom domain under **Project → Settings → Domains**.

## 5. Connection pooling (Neon / PgBouncer)

If your host gives a **pooled** URL for the app and a **direct** URL for schema changes, use the **pooled** URL as `DATABASE_URL` on Vercel (build + runtime). For `pnpm db:migrate` / `migrate dev` from your laptop, use the **direct** URL when the provider recommends it (Neon documents this as “pooled” vs “direct”).

## 6. Troubleshooting

### “Database not connected” on Vercel

1. **Check the health endpoint** after deploy: `https://YOUR_DOMAIN/api/health/db`  
   - If you see `DATABASE_URL is not set` → the variable is missing for **this** deployment environment.

2. **Vercel → Project → Settings → Environment Variables**  
   - Name must be exactly **`DATABASE_URL`** (no typo).  
   - Enable it for **Production** (and **Preview** if you test preview URLs).  
   - After changing vars, **Redeploy** (env is baked in at build for some steps; runtime always needs it for API routes).

3. **Neon: use the pooled connection string** for Vercel (hostname usually contains `-pooler`). Keep `sslmode=require`.

4. **Prisma + Neon pooler:** append to the query string (if not already there):  
   `&pgbouncer=true`  
   Example:  
   `.../neondb?sslmode=require&pgbouncer=true`  
   This avoids prepared-statement issues with transaction pooling.

5. If the URL includes **`channel_binding=require`** and connections still fail, try removing that parameter (some clients disagree with it).

6. **Build failed on `migrate deploy`:** `DATABASE_URL` must also be available **during the build** on Vercel (same env var). Check the failed deployment’s **Build Logs**.

### Other

- **Uploads fail:** add **Blob** and `BLOB_READ_WRITE_TOKEN`.
- **`next/image` blocked domains:** add patterns in `next.config.mjs` under `images.remotePatterns` for any new external image hosts.
