create schema if not exists firelens_private;
revoke all on schema firelens_private from anon, authenticated;

create table if not exists firelens_private.app_config (
  key text primary key,
  value text not null
);
alter table firelens_private.app_config enable row level security;

insert into firelens_private.app_config (key, value)
values ('ingest_token', 'YabDHEF92eotZ4I9VMlzGiXfRY8Hzz9q')
on conflict (key) do update set value = excluded.value;

create or replace function public.ingest_fire_detections(_token text, _rows jsonb)
returns integer
language plpgsql
security definer
set search_path = public, firelens_private
as $$
declare
  expected text;
  inserted integer;
begin
  select value into expected from firelens_private.app_config where key = 'ingest_token';
  if expected is null or _token is null or _token <> expected then
    raise exception 'invalid ingest token';
  end if;

  with incoming as (
    select * from jsonb_to_recordset(_rows) as x(
      lat double precision,
      lon double precision,
      acq_date date,
      acq_time text,
      sensor text,
      satellite text,
      resolution_m integer,
      brightness_k double precision,
      brightness2_k double precision,
      frp_mw double precision,
      confidence_tier text,
      confidence_raw text,
      day_night text
    )
  ), ins as (
    insert into public.fire_detections (
      lat, lon, acq_date, acq_time, sensor, satellite, resolution_m,
      brightness_k, brightness2_k, frp_mw, confidence_tier, confidence_raw, day_night
    )
    select lat, lon, acq_date, acq_time, sensor, satellite, resolution_m,
           brightness_k, brightness2_k, frp_mw, confidence_tier, confidence_raw, day_night
    from incoming
    on conflict (lat, lon, acq_date, acq_time, sensor, satellite) do nothing
    returning 1
  )
  select count(*) into inserted from ins;

  return inserted;
end;
$$;

revoke all on function public.ingest_fire_detections(text, jsonb) from public;
grant execute on function public.ingest_fire_detections(text, jsonb) to anon, authenticated, service_role;