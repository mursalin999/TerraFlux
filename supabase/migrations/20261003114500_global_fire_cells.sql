-- Migration: Create public.global_fire_cells table and upsert function
-- Stores aggregated grid cells for worldwide satellite fire observations
-- (counts per sensor, max FRP, date), while keeping point-level records in fire_detections
-- exclusively for preset regions.

CREATE TABLE IF NOT EXISTS public.global_fire_cells (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cell_id text NOT NULL,
  lat double precision NOT NULL,
  lon double precision NOT NULL,
  acq_date date NOT NULL,
  modis_count integer NOT NULL DEFAULT 0,
  viirs_count integer NOT NULL DEFAULT 0,
  total_count integer NOT NULL DEFAULT 0,
  max_frp double precision,
  mean_frp double precision,
  max_brightness_k double precision,
  strong_agreement boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'global_fire_cells_unique_cell_date'
  ) THEN
    ALTER TABLE public.global_fire_cells
      ADD CONSTRAINT global_fire_cells_unique_cell_date
      UNIQUE (cell_id, acq_date);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS global_fire_cells_acq_date_idx ON public.global_fire_cells (acq_date);
CREATE INDEX IF NOT EXISTS global_fire_cells_coords_idx ON public.global_fire_cells (lat, lon);

GRANT SELECT ON public.global_fire_cells TO anon, authenticated;
GRANT ALL ON public.global_fire_cells TO service_role;

ALTER TABLE public.global_fire_cells ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Global fire cells are publicly readable' AND tablename = 'global_fire_cells'
  ) THEN
    CREATE POLICY "Global fire cells are publicly readable"
      ON public.global_fire_cells FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;

-- Idempotent server-side upsert function for global grid batches
CREATE OR REPLACE FUNCTION public.upsert_global_fire_cells(_rows jsonb)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted integer;
BEGIN
  WITH incoming AS (
    SELECT * FROM jsonb_to_recordset(_rows) AS x(
      cell_id text,
      lat double precision,
      lon double precision,
      acq_date date,
      modis_count integer,
      viirs_count integer,
      total_count integer,
      max_frp double precision,
      mean_frp double precision,
      max_brightness_k double precision,
      strong_agreement boolean
    )
  ), ups AS (
    INSERT INTO public.global_fire_cells (
      cell_id, lat, lon, acq_date, modis_count, viirs_count, total_count,
      max_frp, mean_frp, max_brightness_k, strong_agreement, updated_at
    )
    SELECT cell_id, lat, lon, acq_date, modis_count, viirs_count, total_count,
           max_frp, mean_frp, max_brightness_k, strong_agreement, now()
    FROM incoming
    ON CONFLICT (cell_id, acq_date) DO UPDATE SET
      modis_count = EXCLUDED.modis_count,
      viirs_count = EXCLUDED.viirs_count,
      total_count = EXCLUDED.total_count,
      max_frp = GREATEST(global_fire_cells.max_frp, EXCLUDED.max_frp),
      mean_frp = COALESCE(EXCLUDED.mean_frp, global_fire_cells.mean_frp),
      max_brightness_k = GREATEST(global_fire_cells.max_brightness_k, EXCLUDED.max_brightness_k),
      strong_agreement = (EXCLUDED.strong_agreement OR (EXCLUDED.modis_count > 0 AND EXCLUDED.viirs_count > 0)),
      updated_at = now()
    RETURNING 1
  )
  SELECT count(*) INTO inserted FROM ups;

  RETURN inserted;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_global_fire_cells(jsonb) TO service_role;
