-- TerraFlux spatial summaries, version 2. Run this whole file in the Supabase SQL editor (safe to run again).
-- The website calls these functions one calendar year at a time, so each call stays inside the database time limit.
-- Map cells are capped at roughly 2,500 per response. Comparison scans fire_detections once,
-- then derives all sensitivity grids from the grouped 0.05-degree cell-days.

create or replace function public.spatial_map_bundle(
  p_west double precision,
  p_south double precision,
  p_east double precision,
  p_north double precision,
  p_from_date date,
  p_to_date date,
  p_confidence text[] default null,
  p_map_from_date date default null,
  p_map_to_date date default null
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $fn$
with filtered as materialized (
  select fd.lat, fd.lon, fd.acq_date, fd.sensor, fd.frp_mw
  from public.fire_detections fd
  where fd.lon between p_west and p_east
    and fd.lat between p_south and p_north
    and fd.acq_date between p_from_date and p_to_date
    and fd.sensor in ('MODIS', 'VIIRS')
    and (p_confidence is null or fd.confidence_tier = any(p_confidence))
), map_filtered as materialized (
  select *
  from filtered
  where acq_date between coalesce(p_map_from_date, p_from_date)
    and coalesce(p_map_to_date, p_to_date)
), map_cell_size as (
  select greatest(
    0.15,
    sqrt(((p_east - p_west) * (p_north - p_south) * 2) / 2500.0)
  ) as cell_size
), cells as (
  select
    mf.sensor,
    (floor(mf.lat / mcs.cell_size) * mcs.cell_size)::double precision as cell_lat,
    (floor(mf.lon / mcs.cell_size) * mcs.cell_size)::double precision as cell_lon,
    mcs.cell_size::double precision as cell_size,
    count(*)::bigint as observation_count,
    count(distinct mf.acq_date)::bigint as cell_days,
    sum(coalesce(mf.frp_mw, 0))::double precision as frp_sum,
    max(mf.frp_mw)::double precision as max_frp
  from map_filtered mf
  cross join map_cell_size mcs
  group by mf.sensor, mcs.cell_size, floor(mf.lat / mcs.cell_size), floor(mf.lon / mcs.cell_size)
), daily as (
  select
    acq_date as date,
    count(*) filter (where sensor = 'MODIS')::bigint as modis,
    count(*) filter (where sensor = 'VIIRS')::bigint as viirs
  from filtered
  group by acq_date
), totals as (
  select
    count(*) filter (where sensor = 'MODIS')::bigint as modis,
    count(*) filter (where sensor = 'VIIRS')::bigint as viirs,
    min(acq_date) as first_date,
    max(acq_date) as last_date,
    count(distinct acq_date)::integer as active_days
  from filtered
)
select jsonb_build_object(
  'cells', coalesce((
    select jsonb_agg(to_jsonb(c) order by c.sensor, c.cell_lat, c.cell_lon)
    from cells c
  ), '[]'::jsonb),
  'counts', jsonb_build_array(
    jsonb_build_object('sensor', 'MODIS', 'matching_records', t.modis),
    jsonb_build_object('sensor', 'VIIRS', 'matching_records', t.viirs)
  ),
  'days', coalesce((
    select jsonb_agg(to_jsonb(d) order by d.date)
    from daily d
  ), '[]'::jsonb),
  'coverage', jsonb_build_object(
    'first_date', t.first_date,
    'last_date', t.last_date,
    'active_days', t.active_days
  )
)
from totals t;
$fn$;

grant execute on function public.spatial_map_bundle(double precision, double precision, double precision, double precision, date, date, text[], date, date)
  to anon, authenticated, service_role;

create or replace function public.spatial_compare_bundle(
  p_west double precision,
  p_south double precision,
  p_east double precision,
  p_north double precision,
  p_from_date date,
  p_to_date date,
  p_confidence text[] default null
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $fn$
with filtered as materialized (
  select fd.lat, fd.lon, fd.acq_date, fd.sensor
  from public.fire_detections fd
  where fd.lon between p_west and p_east
    and fd.lat between p_south and p_north
    and fd.acq_date between p_from_date and p_to_date
    and fd.sensor in ('MODIS', 'VIIRS')
    and (p_confidence is null or fd.confidence_tier = any(p_confidence))
), fine as materialized (
  select
    acq_date,
    floor(lat / 0.05)::bigint as fine_lat,
    floor(lon / 0.05)::bigint as fine_lon,
    count(*) filter (where sensor = 'MODIS')::bigint as modis_count,
    count(*) filter (where sensor = 'VIIRS')::bigint as viirs_count,
    bool_or(sensor = 'MODIS') as has_modis,
    bool_or(sensor = 'VIIRS') as has_viirs
  from filtered
  group by acq_date, floor(lat / 0.05), floor(lon / 0.05)
), daily as (
  select
    acq_date as date,
    sum(modis_count)::bigint as modis,
    sum(viirs_count)::bigint as viirs
  from fine
  group by acq_date
), totals as (
  select
    coalesce(sum(modis_count), 0)::bigint as modis,
    coalesce(sum(viirs_count), 0)::bigint as viirs,
    min(acq_date) as first_date,
    max(acq_date) as last_date,
    count(distinct acq_date)::integer as active_days
  from fine
), grid_015 as (
  select
    acq_date,
    floor(fine_lat::numeric / 3)::bigint as lat_cell,
    floor(fine_lon::numeric / 3)::bigint as lon_cell,
    bool_or(has_modis) as has_modis,
    bool_or(has_viirs) as has_viirs
  from fine
  group by acq_date, floor(fine_lat::numeric / 3), floor(fine_lon::numeric / 3)
), sensor_cell_days as (
  select
    count(*) filter (where has_modis)::bigint as modis,
    count(*) filter (where has_viirs)::bigint as viirs
  from grid_015
), overlap as (
  select
    count(*) filter (where has_modis and has_viirs)::bigint as both_cell_days,
    count(*) filter (where has_modis and not has_viirs)::bigint as modis_only_cell_days,
    count(*) filter (where has_viirs and not has_modis)::bigint as viirs_only_cell_days
  from grid_015
), month_presence as (
  select
    date_trunc('month', acq_date)::date as month,
    bool_or(has_modis) as has_modis,
    bool_or(has_viirs) as has_viirs
  from fine
  group by date_trunc('month', acq_date)
), overlap_months as (
  select count(*)::integer as complete_months
  from month_presence
  where has_modis and has_viirs
    and (month <> date_trunc('month', p_from_date)::date or p_from_date = date_trunc('month', p_from_date)::date)
    and (month <> date_trunc('month', p_to_date)::date or p_to_date = (date_trunc('month', p_to_date) + interval '1 month - 1 day')::date)
), sizes(cell_size, divisor) as (
  values
    (0.05::double precision, 1),
    (0.10::double precision, 2),
    (0.15::double precision, 3),
    (0.25::double precision, 5)
), sensitivity_cells as (
  select
    sizes.cell_size,
    fine.acq_date,
    floor(fine.fine_lat::numeric / sizes.divisor)::bigint as lat_cell,
    floor(fine.fine_lon::numeric / sizes.divisor)::bigint as lon_cell,
    bool_or(fine.has_modis) as has_modis,
    bool_or(fine.has_viirs) as has_viirs
  from fine
  cross join sizes
  group by sizes.cell_size, sizes.divisor, fine.acq_date,
    floor(fine.fine_lat::numeric / sizes.divisor),
    floor(fine.fine_lon::numeric / sizes.divisor)
), sensitivity as (
  select
    cell_size,
    count(*) filter (where has_modis and has_viirs)::bigint as both_cell_days,
    count(*)::bigint as total_cell_days,
    coalesce(
      count(*) filter (where has_modis and has_viirs)::double precision / nullif(count(*), 0),
      0
    ) as agreement_rate
  from sensitivity_cells
  group by cell_size
)
select jsonb_build_object(
  'counts', jsonb_build_array(
    jsonb_build_object('sensor', 'MODIS', 'matching_records', t.modis),
    jsonb_build_object('sensor', 'VIIRS', 'matching_records', t.viirs)
  ),
  'days', coalesce((
    select jsonb_agg(to_jsonb(d) order by d.date)
    from daily d
  ), '[]'::jsonb),
  'sensor_cell_days', jsonb_build_object(
    'MODIS', scd.modis,
    'VIIRS', scd.viirs
  ),
  'coverage', jsonb_build_object(
    'first_date', t.first_date,
    'last_date', t.last_date,
    'active_days', t.active_days
  ),
  'overlap', jsonb_build_object(
    'both_cell_days', o.both_cell_days,
    'modis_only_cell_days', o.modis_only_cell_days,
    'viirs_only_cell_days', o.viirs_only_cell_days,
    'overlap_months', om.complete_months,
    'raw_ratio', t.viirs::double precision / nullif(t.modis, 0)
  ),
  'sensitivity', coalesce((
    select jsonb_agg(to_jsonb(s) order by s.cell_size)
    from sensitivity s
  ), '[]'::jsonb)
)
from totals t
cross join sensor_cell_days scd
cross join overlap o
cross join overlap_months om;
$fn$;

grant execute on function public.spatial_compare_bundle(double precision, double precision, double precision, double precision, date, date, text[])
  to anon, authenticated, service_role;

-- Optional index (apply separately only if query plans show it is needed):
-- create index if not exists fire_detections_map_bbox_date_idx
--   on public.fire_detections (acq_date, lat, lon, sensor);
