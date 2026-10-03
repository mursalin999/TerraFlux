CREATE TABLE public.fire_detections (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lat double precision NOT NULL,
  lon double precision NOT NULL,
  acq_date date NOT NULL,
  acq_time text NOT NULL,
  sensor text NOT NULL CHECK (sensor IN ('MODIS','VIIRS')),
  satellite text NOT NULL,
  resolution_m integer NOT NULL,
  brightness_k double precision,
  brightness2_k double precision,
  frp_mw double precision,
  confidence_tier text NOT NULL CHECK (confidence_tier IN ('low','nominal','high')),
  confidence_raw text,
  day_night text CHECK (day_night IN ('D','N')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fire_detections
  ADD CONSTRAINT fire_detections_unique_observation
  UNIQUE (lat, lon, acq_date, acq_time, sensor, satellite);

CREATE INDEX fire_detections_acq_date_idx ON public.fire_detections (acq_date);
CREATE INDEX fire_detections_lat_lon_idx ON public.fire_detections (lat, lon);

GRANT SELECT ON public.fire_detections TO anon;
GRANT SELECT ON public.fire_detections TO authenticated;
GRANT ALL ON public.fire_detections TO service_role;

ALTER TABLE public.fire_detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fire detections are publicly readable"
  ON public.fire_detections FOR SELECT TO anon, authenticated USING (true);