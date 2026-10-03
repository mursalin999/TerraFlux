import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { X } from "lucide-react";
import { SENSOR_META } from "@/lib/regions";
import { CalendarHeatmap, type DayCount } from "@/components/CalendarHeatmap";

type Scale = "daily" | "weekly" | "monthly";
type Series = "MODIS" | "VIIRS" | "COMBINED";

function percentile(value: number, values: number[]) {
  if (!values.length) return 0;
  return Math.round((values.filter((item) => item <= value).length / values.length) * 100);
}

function aggregate(days: DayCount[], scale: Scale) {
  if (scale === "daily") return days;
  const buckets = new Map<string, DayCount>();
  for (const day of days) {
    const date = new Date(`${day.date}T00:00:00Z`);
    const key = scale === "monthly" ? day.date.slice(0, 7) : (() => {
      const monday = new Date(date);
      monday.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
      return monday.toISOString().slice(0, 10);
    })();
    const current = buckets.get(key) ?? { date: key, modis: 0, viirs: 0 };
    current.modis += day.modis;
    current.viirs += day.viirs;
    buckets.set(key, current);
  }
  return [...buckets.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function ActivityTimeline({ days, onSelectDate }: { days: DayCount[]; onSelectDate?: (date: string) => void }) {
  const [scale, setScale] = useState<Scale>("daily");
  const [series, setSeries] = useState<Series>("COMBINED");
  const [heatmap, setHeatmap] = useState(false);
  const [hovered, setHovered] = useState<DayCount | null>(null);
  const grouped = useMemo(() => aggregate(days, scale), [days, scale]);
  const chartData = grouped.map((day) => ({ ...day, combined: day.modis + day.viirs, label: scale === "monthly" ? day.date : day.date.slice(5) }));
  const values = chartData.map((day) => series === "MODIS" ? day.modis : series === "VIIRS" ? day.viirs : day.combined);
  const active = hovered ?? grouped[grouped.length - 1];
  const activeValue = active ? series === "MODIS" ? active.modis : series === "VIIRS" ? active.viirs : active.modis + active.viirs : 0;
  const baselineLimited = days.length < 14;

  return <section className="rounded-lg border border-border bg-surface p-4 sm:p-5" aria-label="Thermal activity timeline">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono text-[10px] tracking-[0.2em] text-data-blue">THERMAL ACTIVITY OVER TIME</p><h2 className="mt-1 font-headline text-lg font-semibold text-text">When did the landscape change?</h2></div><div className="flex flex-wrap gap-1" role="tablist" aria-label="Timeline scale">{(["daily", "weekly", "monthly"] as Scale[]).map((item) => <button key={item} type="button" role="tab" aria-selected={scale === item} onClick={() => setScale(item)} className={`rounded border px-2.5 py-1.5 font-mono text-[10px] uppercase ${scale === item ? "border-data-blue bg-data-blue/15 text-data-blue" : "border-border text-text-secondary"}`}>{item}</button>)}</div></div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-1" role="tablist" aria-label="Timeline series">{(["MODIS", "VIIRS", "COMBINED"] as Series[]).map((item) => <button key={item} type="button" role="tab" aria-selected={series === item} onClick={() => setSeries(item)} className={`rounded px-2 py-1 font-mono text-[10px] ${series === item ? "bg-surface-elevated text-text" : "text-text-secondary"}`}>{item}</button>)}</div><button type="button" onClick={() => setHeatmap(!heatmap)} className="font-mono text-[10px] uppercase tracking-wider text-text-secondary hover:text-text">{heatmap ? "SHOW TIMELINE" : "SHOW CALENDAR HEATMAP"}</button></div>
    {heatmap ? <div className="mt-4 overflow-x-auto"><CalendarHeatmap days={days} startDate={days[0]?.date ?? "2020-01-01"} endDate={days[days.length - 1]?.date ?? "2020-01-01"} mode={series === "COMBINED" ? "combined" : series} /></div> : <div className="mt-3 h-64 min-w-[560px] overflow-x-auto"><ResponsiveContainer width="100%" height="100%" minWidth={560}><AreaChart data={chartData} onMouseMove={(state) => { const item = state?.activePayload?.[0]?.payload as DayCount | undefined; if (item) setHovered(item); }} onClick={(state) => { const item = state?.activePayload?.[0]?.payload as DayCount | undefined; if (item?.date) onSelectDate?.(item.date); }} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}><defs><linearGradient id="activityAmber" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--anomaly-amber)" stopOpacity=".38" /><stop offset="95%" stopColor="var(--anomaly-amber)" stopOpacity="0" /></linearGradient></defs><CartesianGrid stroke="rgba(145,160,181,.12)" strokeDasharray="3 3" /><XAxis dataKey="label" stroke="#91a0b5" fontFamily="DM Mono" fontSize={10} tickLine={false} interval="preserveStartEnd" /><YAxis stroke="#91a0b5" fontFamily="DM Mono" fontSize={10} tickLine={false} allowDecimals={false} /><Tooltip content={({ active: open, payload }) => { if (!open || !payload?.[0]) return null; const item = payload[0].payload as DayCount; const value = series === "MODIS" ? item.modis : series === "VIIRS" ? item.viirs : item.modis + item.viirs; return <div className="rounded border border-border bg-surface-elevated p-2 font-mono text-[10px] text-text"><div>{item.date}</div><div className="mt-1 text-anomaly-amber">{value.toLocaleString()} detections · {percentile(value, values)}th percentile</div></div>; }} /><Area type="monotone" dataKey={series === "MODIS" ? "modis" : series === "VIIRS" ? "viirs" : "combined"} stroke={series === "MODIS" ? SENSOR_META.MODIS.color : series === "VIIRS" ? SENSOR_META.VIIRS.color : "var(--anomaly-amber)"} fill="url(#activityAmber)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>}
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 font-mono text-[10px] text-text-secondary"><span>{active?.date ?? "No period selected"} · {activeValue.toLocaleString()} observations · {percentile(activeValue, values)}th percentile</span>{baselineLimited && <span className="text-anomaly-amber">BASELINE LIMITED: {days.length} days stored</span>}</div>
  </section>;
}

export function ActivityAnalysis({ date, days, onClose, onFlyTo }: { date: string; days: DayCount[]; onClose: () => void; onFlyTo?: () => void }) {
  const selected = days.find((day) => day.date === date) ?? { date, modis: 0, viirs: 0 };
  const total = selected.modis + selected.viirs;
  const rank = percentile(total, days.map((day) => day.modis + day.viirs));
  const fields = [["HISTORICAL PERCENTILE", `${rank}th`], ["MODIS ACTIVITY", selected.modis.toLocaleString()], ["VIIRS ACTIVITY", selected.viirs.toLocaleString()], ["CROSS-SENSOR AGREEMENT", selected.modis && selected.viirs ? "MODERATE" : "LIMITED"], ["EVIDENCE STRENGTH", total > 10 ? "ELEVATED" : "LIMITED"], ["SPATIAL CONCENTRATION", "Selected region"], ["FRP SUMMARY", "Stored per observation"]];
  return <div className="fixed inset-0 z-50 flex justify-end bg-bg/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Analysis for ${date}`}><button type="button" aria-label="Close analysis" onClick={onClose} className="absolute inset-0 cursor-default" /><aside className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-border bg-surface shadow-2xl"><header className="flex items-start justify-between border-b border-border p-5"><div><p className="font-mono text-[10px] tracking-[.2em] text-anomaly-amber">WHY WAS THIS DAY UNUSUAL?</p><h2 className="mt-1 font-headline text-2xl font-semibold text-text">{date}</h2><p className="mt-1 font-mono text-xs text-text-secondary">Fixed-template analysis from stored observations.</p></div><button type="button" aria-label="Close" onClick={onClose} className="rounded p-1 text-text-secondary hover:text-text"><X /></button></header><div className="flex flex-col gap-5 p-5"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{fields.map(([label, value]) => <div key={label} className="rounded border border-border bg-surface-elevated p-3"><div className="font-mono text-[9px] tracking-wider text-text-secondary">{label}</div><div className="mt-2 font-mono text-sm text-text">{value}</div></div>)}</div>{days.length < 14 && <p className="rounded border border-anomaly-amber/40 bg-anomaly-amber/10 p-3 font-mono text-xs text-anomaly-amber">BASELINE LIMITED: {days.length} days stored</p>}<p className="font-mono text-sm leading-relaxed text-text">This day ranks in the {rank}th percentile of {days.length} days in the selected window. VIIRS recorded {selected.viirs} detections and MODIS {selected.modis}.</p><p className="font-mono text-xs leading-relaxed text-text-secondary">Satellite detections are thermal observations. They provide evidence for analysis but do not confirm a ground fire.</p><div className="flex h-48 items-center justify-center rounded border border-border bg-bg font-mono text-[10px] text-text-secondary">MINI MAP · {total.toLocaleString()} detections in selected region</div><button type="button" onClick={onFlyTo} className="rounded border border-data-blue/50 bg-data-blue/10 px-3 py-2 font-mono text-xs text-data-blue">FLY MAIN GLOBE TO THIS DAY</button></div></aside></div>;
}

export default ActivityTimeline;
