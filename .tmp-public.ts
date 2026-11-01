import { publicServerClient } from "./src/lib/supabase-public.server";
const sb = publicServerClient();
for (const sensor of ["MODIS", "VIIRS"]) { const { count, error } = await sb.from("fire_detections").select("id", { count: "exact", head: true }).eq("sensor", sensor); console.log(JSON.stringify({ sensor, count, error: error?.message ?? null })); }
