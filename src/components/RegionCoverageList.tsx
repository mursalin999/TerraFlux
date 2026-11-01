import { useQueries } from "@tanstack/react-query";
import { getAreaCoverage } from "@/lib/firelens.functions";
import { REGIONS, parseBbox } from "@/lib/regions";

export function RegionCoverageList() {
  const queries = useQueries({ queries: REGIONS.map((region) => ({ queryKey: ["region-coverage", region.id], queryFn: () => getAreaCoverage({ data: parseBbox(region.bbox) }), staleTime: 900000 })) });
  return <div className="mt-4 space-y-2" aria-label="Stored coverage by region">{REGIONS.map((region, index) => { const rows = queries[index]?.data ?? []; return <div key={region.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-2 text-xs"><span className="font-semibold text-text">{region.name}</span><span className="text-text-secondary">{rows.filter((row) => row.first_date && row.last_date && row.detections > 0).map((row) => `${row.sensor} ${row.first_date?.slice(0, 7)}–${row.last_date?.slice(0, 7)}`).join(" · ") || "No stored coverage"}</span></div>; })}</div>;
}
