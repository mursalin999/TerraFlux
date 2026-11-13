import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Satellite } from "lucide-react";
import { REGIONS, getRegion } from "@/lib/regions";
import { backfillFireData, fetchFireData } from "@/lib/firelens.functions";

interface NasaFirmsFetcherProps {
  initialRegionId?: string;
  initialStartDate?: string;
  initialEndDate?: string;
  initialBbox?: string;
}

type FetchStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; stored: number }
  | { kind: "error"; message: string };

function dateValue(offsetDays: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function NasaFirmsFetcher({
  initialRegionId = REGIONS[0]!.id,
  initialStartDate = dateValue(-3),
  initialEndDate = dateValue(0),
  initialBbox,
}: NasaFirmsFetcherProps) {
  const [regionId, setRegionId] = useState(initialRegionId);
  const [bbox] = useState(initialBbox ?? getRegion(initialRegionId).bbox);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [mapKey, setMapKey] = useState("");
  const [status, setStatus] = useState<FetchStatus>({ kind: "idle" });
  const runBackfill = useServerFn(backfillFireData);
  const runFetch = useServerFn(fetchFireData);
  const queryClient = useQueryClient();
  const region = getRegion(regionId);
  const activeBbox = regionId === "custom" ? bbox : region.bbox;

  const refreshData = async () => {
    if (!startDate || !endDate) {
      setStatus({ kind: "error", message: "Choose both dates." });
      return;
    }
    if (startDate > endDate) {
      setStatus({ kind: "error", message: "Start date must be on or before end date." });
      return;
    }

    setStatus({ kind: "loading" });
    try {
      const result = await runBackfill({
        data: { bbox: activeBbox, start_date: startDate, end_date: endDate, map_key: mapKey.trim() || undefined },
      });
      await queryClient.invalidateQueries();
      setStatus({ kind: "success", stored: result.stored });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "NASA FIRMS fetch failed.",
      });
    }
  };

  const fetchRecent = async () => {
    setStatus({ kind: "loading" });
    try {
      const result = await runFetch({ data: { bbox: activeBbox, days: 3, map_key: mapKey.trim() || undefined } });
      await queryClient.invalidateQueries();
      setStatus({ kind: "success", stored: result.stored });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "NASA FIRMS fetch failed.",
      });
    }
  };

  return (
    <details id="nasa-firms-ingest" className="rounded-lg border border-border bg-surface shadow-sm" open={false}>
      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text sm:px-5">
        <span>DATA PULL</span>
        <span className="text-text-secondary">NASA FIRMS</span>
      </summary>
      <section
        className="border-t border-border p-4 sm:p-5"
        aria-labelledby="nasa-firms-fetcher-title"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-data-blue">
              <Satellite className="h-3.5 w-3.5" aria-hidden="true" />
              NASA FIRMS DATA INGEST
            </div>
            <h2
              id="nasa-firms-fetcher-title"
              className="mt-1 font-headline text-lg font-semibold text-text"
            >
              Fetch observations for any date range
            </h2>
            <p className="mt-1 max-w-2xl font-mono text-[11px] leading-relaxed text-text-secondary">
              Pull MODIS and VIIRS records directly from NASA FIRMS and make them available across
              the globe, calendar, and comparison views.
            </p>
          </div>
          <span className="rounded border border-agreement-teal/40 bg-agreement-teal/10 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-agreement-teal">
            MODIS + VIIRS
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_1fr_1fr_minmax(12rem,1.2fr)_auto] sm:items-end">
          <label className="flex flex-col gap-1 font-mono text-[11px] uppercase tracking-wider text-text-secondary">
            Region
            <select
              value={regionId}
              onChange={(event) => setRegionId(event.target.value)}
              className="min-h-11 rounded border border-border bg-bg px-2.5 text-xs normal-case tracking-normal text-text focus:border-data-blue focus:outline-none"
            >
              <option value="custom">Custom area from page</option>
              {REGIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 font-mono text-[11px] uppercase tracking-wider text-text-secondary">
            From
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="min-h-11 rounded border border-border bg-bg px-2.5 text-xs text-text focus:border-data-blue focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-[11px] uppercase tracking-wider text-text-secondary">
            To
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="min-h-11 rounded border border-border bg-bg px-2.5 text-xs text-text focus:border-data-blue focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-[11px] uppercase tracking-wider text-text-secondary">
            NASA FIRMS MAP_KEY
            <input
              type="password"
              autoComplete="off"
              value={mapKey}
              onChange={(event) => setMapKey(event.target.value)}
              placeholder="Optional if server key is set"
              className="min-h-11 rounded border border-border bg-bg px-2.5 text-xs normal-case tracking-normal text-text focus:border-data-blue focus:outline-none"
              aria-describedby="firms-map-key-help"
            />
          </label>
          <button
            type="button"
            onClick={refreshData}
            disabled={status.kind === "loading"}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-data-blue px-4 font-mono text-xs font-semibold text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={status.kind === "loading" ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"}
              aria-hidden="true"
            />
            FETCH DATE RANGE
          </button>
        </div>

        <p id="firms-map-key-help" className="mt-2 font-mono text-[10px] leading-relaxed text-text-secondary">
          Paste your personal MAP_KEY or leave blank to use the server key. The key is sent only with this request and is not saved. Get one from{" "}
          <a className="underline underline-offset-2 hover:text-text" href="https://firms.modaps.eosdis.nasa.gov/api/area/" target="_blank" rel="noreferrer">NASA FIRMS</a>.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-text-secondary">
          <button
            type="button"
            onClick={fetchRecent}
            disabled={status.kind === "loading"}
            className="underline underline-offset-2 hover:text-text disabled:opacity-50"
          >
            Fetch latest 3 days instead
          </button>
          <span aria-live="polite">
            {status.kind === "loading" && "Contacting NASA FIRMS and storing observations…"}
            {status.kind === "success" && (
              <span className="text-agreement-teal">
                Fetch complete: {status.stored.toLocaleString()} records stored.
              </span>
            )}
            {status.kind === "error" && <span className="text-critical-red">{status.message}</span>}
            {status.kind === "idle" && "Fetched records are shared by every data view."}
          </span>
        </div>
      </section>
    </details>
  );
}

export default NasaFirmsFetcher;
