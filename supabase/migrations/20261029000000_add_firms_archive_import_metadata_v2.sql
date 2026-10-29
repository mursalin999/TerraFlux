alter table public.fire_detections add column if not exists product text;
alter table public.fire_detections add column if not exists processing text;
alter table public.fire_detections add column if not exists source_file_name text;

create index if not exists fire_detections_product_year_idx
  on public.fire_detections (product, acq_date);

create or replace function public.firms_archive_summary()
returns table(product text, year integer, rows bigint, first_date date, last_date date)
language sql security definer set search_path = public as $fn$
  select fd.product, extract(year from fd.acq_date)::integer, count(*)::bigint,
    min(fd.acq_date), max(fd.acq_date)
  from public.fire_detections fd
  where fd.product is not null
  group by fd.product, extract(year from fd.acq_date)::integer
  order by extract(year from fd.acq_date)::integer desc, fd.product;
$fn$;

revoke all on function public.firms_archive_summary() from public;
grant execute on function public.firms_archive_summary() to service_role;
