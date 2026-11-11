-- Run this SQL in the Supabase SQL editor before using the new map query.
-- It returns one bounded, aggregated response for map marks, counts, daily timeline,
-- coverage, overlap cell-days, and all four grid sensitivity rates.

create index if not exists fire_detections_map_bbox_date_idx
  on public.fire_detections (acq_date, lat, lon, sensor);

create or replace function public.spatial_detection_bundle(
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
    and (p_confidence is null or fd.confidence_tier = any(p_confidence))
), map_filtered as materialized (
  select * from filtered
  where acq_date between coalesce(p_map_from_date, p_from_date) and coalesce(p_map_to_date, p_to_date)
), map_grid as (
  select greatest(0.15, sqrt(((p_east - p_west) * (p_north - p_south) * 2) / 2500.0)) as cell_size
), cells as (
  select
    sensor,
    (floor(lat / map_grid.cell_size) * map_grid.cell_size)::double precision as cell_lat,
    (floor(lon / map_grid.cell_size) * map_grid.cell_size)::double precision as cell_lon,
    map_grid.cell_size::double precision as cell_size,
    count(*)::bigint as observation_count,
    count(distinct acq_date)::bigint as cell_days,
    sum(coalesce(frp_mw, 0))::double precision as frp_sum,
    max(frp_mw)::double precision as max_frp
  from map_filtered cross join map_grid
  group by sensor, map_grid.cell_size, floor(lat / map_grid.cell_size), floor(lon / map_grid.cell_size)
), daily as (
  select acq_date as date,
    count(*) filter (where sensor = 'MODIS')::bigint as modis,
    count(*) filter (where sensor = 'VIIRS')::bigint as viirs
  from filtered
  group by acq_date
), sensor_cell_days as (
  select sensor, sum(cell_days)::bigint as cell_days
  from (
    select sensor, floor(lat / 0.15), floor(lon / 0.15), count(distinct acq_date)::bigint as cell_days
    from filtered group by sensor, floor(lat / 0.15), floor(lon / 0.15)
  ) bins group by sensor
), by_day_cell as (
  select acq_date,
    floor(lat / 0.15)::bigint as lat_cell,
    floor(lon / 0.15)::bigint as lon_cell,
    bool_or(sensor = 'MODIS') as has_modis,
    bool_or(sensor = 'VIIRS') as has_viirs
  from filtered
  group by acq_date, floor(lat / 0.15), floor(lon / 0.15)
), sensitivity as (
  select sizes.cell_size,
    coalesce(
      count(*) filter (where grouped.has_modis and grouped.has_viirs)::double precision
        / nullif(count(*), 0), 0
    ) as agreement_rate
  from unnest(array[0.05, 0.10, 0.15, 0.25]::double precision[]) as sizes(cell_size)
  left join lateral (
    select floor(lat / sizes.cell_size)::bigint as lat_cell,
      floor(lon / sizes.cell_size)::bigint as lon_cell,
      bool_or(sensor = 'MODIS') as has_modis,
      bool_or(sensor = 'VIIRS') as has_viirs
    from filtered
    group by acq_date, floor(lat / sizes.cell_size), floor(lon / sizes.cell_size)
  ) grouped on true
  group by sizes.cell_size
), overlap as (
  select
    count(*) filter (where has_modis and has_viirs)::bigint as both_cell_days,
    count(*) filter (where has_modis and not has_viirs)::bigint as modis_only_cell_days,
    count(*) filter (where has_viirs and not has_modis)::bigint as viirs_only_cell_days
  from by_day_cell
), overlap_months as (
  select count(*)::integer as complete_months
  from (
    select date_trunc('month', acq_date)::date as month
    from filtered
    group by 1
    having bool_or(sensor = 'MODIS') and bool_or(sensor = 'VIIRS')
      and (date_trunc('month', acq_date)::date <> date_trunc('month', p_from_date)::date or extract(day from p_from_date) = 1)
      and (date_trunc('month', acq_date)::date <> date_trunc('month', p_to_date)::date or p_to_date = (date_trunc('month', p_to_date) + interval '1 month - 1 day')::date)
  ) shared
), totals as (
  select
    count(*) filter (where sensor = 'MODIS')::bigint as modis,
    count(*) filter (where sensor = 'VIIRS')::bigint as viirs,
    min(acq_date) as first_date,
    max(acq_date) as last_date,
    count(distinct acq_date)::integer as active_days
  from filtered
), map_totals as (
  select
    count(*) filter (where sensor = 'MODIS')::bigint as modis,
    count(*) filter (where sensor = 'VIIRS')::bigint as viirs
  from map_filtered
)
select jsonb_build_object(
  'cells', coalesce((select jsonb_agg(to_jsonb(c) order by c.sensor, c.cell_lat, c.cell_lon) from cells c), '[]'::jsonb),
  'counts', jsonb_build_array(
    jsonb_build_object('sensor','MODIS','matching_records',mt.modis),
    jsonb_build_object('sensor','VIIRS','matching_records',mt.viirs)
  ),
  'days', coalesce((select jsonb_agg(to_jsonb(d) order by d.date) from daily d), '[]'::jsonb),
  'sensor_cell_days', coalesce((select jsonb_object_agg(sensor, cell_days) from sensor_cell_days), '{}'::jsonb),
  'coverage', jsonb_build_object('first_date',t.first_date,'last_date',t.last_date,'active_days',t.active_days),
  'overlap', (select to_jsonb(o) || jsonb_build_object('overlap_months', om.complete_months, 'raw_ratio', t.viirs::double precision / nullif(t.modis, 0)) from overlap o cross join overlap_months om),
  'sensitivity', coalesce((select jsonb_agg(to_jsonb(s) order by s.cell_size) from sensitivity s), '[]'::jsonb)
)
from totals t cross join map_totals mt;
$fn$;

grant execute on function public.spatial_detection_bundle(double precision,double precision,double precision,double precision,date,date,text[],date,date) to anon, authenticated, service_role;
