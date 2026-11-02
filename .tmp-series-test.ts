import { publicServerClient } from "./src/lib/supabase-public.server";
const sb = publicServerClient();
for (const fn of ["monthly_series", "daily_series"]) {
  const { data, error } = await sb.rpc(fn, { p_west: 88, p_south: 20.5, p_east: 92.7, p_north: 26.6, p_from_date: "2020-01-01", p_to_date: "2026-11-02" });
  console.log(JSON.stringify({ fn, rows: data?.length ?? 0, nonzero: data?.filter((row: { raw_detections: number }) => row.raw_detections > 0).length ?? 0, error: error?.message ?? null }));
}
