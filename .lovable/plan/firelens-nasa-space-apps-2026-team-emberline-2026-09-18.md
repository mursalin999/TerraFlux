# FireLens — NASA Space Apps 2026 (Team Emberline)

One Earth. Two satellites. One clearer picture. A scientific web app that harmonizes MODIS and VIIRS fire detections from NASA FIRMS into a single burning-activity calendar for any selected region.

## Decisions (from your answers)

- FIRMS key: you paste it here; I store it as the server-only secret `FIRMS_MAP_KEY`
- Seed data: build seeds a real ~12-month history for the Bangladesh preset so map and calendar show data immediately
- Pull trigger: a "Load / refresh data" button on the Explore page
- Map: Leaflet + OpenStreetMap tiles (free, no key)

## Backend (Lovable Cloud)

**Migration — `fire_detections` table**

- Columns exactly as specified: lat, lon, acq_date, acq_time, sensor, satellite, resolution_m, brightness_k, brightness2_k, frp_mw, confidence_tier, confidence_raw, day_night, created_at
- Unique constraint on (lat, lon, acq_date, acq_time, sensor, satellite); indexes on acq_date and (lat, lon)
- GRANTs + RLS: public read (`anon` SELECT), writes only through the server (service role)

**Server functions (this stack uses TanStack server functions instead of Supabase edge functions — same server-only guarantees)**

- `fetchFireData({ bbox, days (max 5), date? })` — calls FIRMS CSV API twice (MODIS_NRT + VIIRS_NOAA20_NRT), parses CSV, harmonizes rows, upserts into `fire_detections`, returns rows + counts. Rejects `days > 5`.
- `backfillFireData({ bbox, start_date, end_date })` — splits the range into ≤5-day windows, processes them sequentially (stays well inside FIRMS's rate limits), upserts each window, returns chunks processed and rows upserted.
- Harmonization mapping:
  - MODIS: brightness → brightness_k, bright_t31 → brightness2_k, numeric confidence 0–100 bucketed into low/nominal/high (code comment noting cutoffs are a rough estimate, not an official NASA definition), satellite 'A'/'T', resolution 1000
  - VIIRS: bright_ti4 → brightness_k, bright_ti5 → brightness2_k, low/nominal/high mapped directly, satellites 'N'/'N20'/'N21', resolution 375
  - confidence_raw always preserved; FIRMS_MAP_KEY read only inside server handlers
- Shared helpers: `src/lib/firms.server.ts` (CSV parse, bbox validation, harmonize, upsert via supabaseAdmin); client-facing wrappers in `src/lib/firelens.functions.ts`

**Seeding**: after the migration and once the key is stored, run a backfill for the Bangladesh bbox covering roughly the past 12 months so Explore/Calendar open with real data.

## Frontend (Leaflet, scientific-visualization aesthetic)

- **Home** (`/`) — FireLens branding (team Emberline), tagline, one plain paragraph on what harmonizing MODIS+VIIRS means, CTA to Explore
- **Explore** (`/explore`) — region preset selector (Bangladesh, India, Amazon, Australia, California with sensible bboxes), date range picker, confidence filter (low/nominal/high), "Load / refresh data" button calling fetch/backfill, Leaflet map with MODIS vs VIIRS points visually distinguished (distinct color + marker size reflecting 1 km vs 375 m resolution); clear error/empty states, never fabricated data
- **Burning Activity Calendar** (`/calendar`) — GitHub-style contribution heatmap of detection counts per day for the selected region, with a sensor toggle; subtle fade-in animation on cells
- **Sensor Comparison** (`/compare`) — MODIS-only / VIIRS-only / harmonized toggle over the map and a daily-count chart, plus a short note on why they disagree (resolution, revisit times)
- **About / Data & Limitations** (`/about`) — plain-language notes: thermal anomalies ≠ confirmed fires; resolution, confidence, cloud cover, sun glint, duplicate-pass caveats
- Shared: slim top nav, region/date state carried via URL search params so pages stay consistent

**Design direction**: near-black ink on warm off-white paper, one ember accent (deep orange) reserved for fire data, strong grotesque display type + mono for coordinates/figures, generous whitespace, thin rules instead of card stacks. Map popups use the same restrained system. No gradients, no glows.

## Build order

1. Enable Lovable Cloud → migration (schema, grants, RLS)
2. Store `FIRMS_MAP_KEY` (once you paste it) → firms.server.ts + both server functions
3. Seed Bangladesh backfill, verify row counts
4. Frontend: Home → Explore (map + filters + pull button) → Calendar → Compare → About
5. Per-route head metadata; verify build + live pull in the preview

## What I need from you

Your NASA FIRMS MAP_KEY (paste it in chat — I'll store it as a server-only secret; it never reaches the frontend). If you'd rather build first, everything up to the live data pull can be done while you fetch it.
