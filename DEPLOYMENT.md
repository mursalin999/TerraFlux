# Deploying TerraFlux outside Lovable (Vercel)

TerraFlux is a **TanStack Start full-stack app**, not a static SPA. It has a
server side (the NASA FIRMS pulls and database writes), so it must be deployed
as a server app — no `index.html` rewrite needed.

## Vercel project settings

- Framework preset: **Other** (`vercel.json` sets `framework: null`)
- Build command: `npm run build`
- Output: Vercel Build Output API (`.vercel/output`) — produced automatically
  by Nitro's `vercel` preset, which is selected in `vite.config.ts` whenever
  the `VERCEL` environment variable is present.
- Do **not** add an SPA rewrite — routing is handled by the server build.

## Environment variables

Set these in Vercel → Settings → Environment Variables (all environments):

| Name                            | Purpose                                                     |
| ------------------------------- | ----------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | Database URL, read in the browser                           |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public read key, read in the browser                        |
| `VITE_SUPABASE_PROJECT_ID`      | Project id used by the generated client                     |
| `SUPABASE_URL`                  | Same URL, for server-side code                              |
| `SUPABASE_PUBLISHABLE_KEY`      | Same public key, for server-side reads                      |
| `FIRMS_MAP_KEY`                 | NASA FIRMS MAP_KEY — server only, never sent to the browser |
| `FIRELENS_INGEST_TOKEN`         | Token that authorises storing new detections                |

`SUPABASE_SERVICE_ROLE_KEY` is **not** required. When it is absent, writes go
through the token-gated `public.ingest_fire_detections` database function,
which rejects any call without the correct `FIRELENS_INGEST_TOKEN`.

## Security notes

- Reads are public by design (row-level security allows anonymous `select`).
- Writes are impossible without the ingest token, which only exists in the
  server environment.
- Rotate the token by updating `firelens_private.app_config` in the database
  and the `FIRELENS_INGEST_TOKEN` variable in Vercel.
