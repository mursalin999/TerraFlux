alter table public.fire_detections add column if not exists product text;
alter table public.fire_detections add column if not exists processing text;
alter table public.fire_detections add column if not exists source_file_name text;

create index if not exists fire_detections_product_year_idx
  on public.fire_detections (product, acq_date);

-- The import RPC is deployed separately through the Supabase migration tool.
