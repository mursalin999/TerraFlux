import { useQuery } from "@tanstack/react-query";
import { getAreaCoverage } from "@/lib/firelens.functions";
import type { Bbox } from "@/lib/custom-area";

export function AreaCoverageNotice({ bbox }: { bbox: Bbox }) {
  const query = useQuery({ queryKey: ["area-coverage", bbox], queryFn: () => getAreaCoverage({ data: bbox }), staleTime: 300000 });
  if (query.isLoading) return <p className="mt-3 text-[11px] text-text-secondary">Checking stored coverage…</p>;
  const rows = query.data ?? [];
  const available = rows.filter((row) => row.first_date && row.last_date);
  if (!available.length) return <p className="mt-3 text-[11px] text-anomaly-amber" role="status">No stored detections for this area. Stored data is available in the preset regions when their coverage badges show a date range.</p>;
  return <div className="mt-3 rounded border border-agreement-teal/30 bg-agreement-teal/5 p-2 text-[11px] text-text-secondary" role="status"><div className="font-mono uppercase tracking-wider text-agreement-teal">Stored coverage for this area</div>{available.map((row) => <div key={row.sensor} className="mt-1"><span className="font-semibold text-text">{row.sensor}</span> {row.first_date?.slice(0, 7)} to {row.last_date?.slice(0, 7)}</div>)}</div>;
}
