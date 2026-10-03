import { REGIONS, CONFIDENCE_TIERS, type ConfidenceTier } from "@/lib/regions";

export interface FireFilters {
  regionId: string;
  startDate: string;
  endDate: string;
  confidence: ConfidenceTier[];
  sensors?: ("MODIS" | "VIIRS")[];
}

export function defaultFilters(): FireFilters {
  const end = new Date();
  const start = new Date();
  start.setUTCFullYear(start.getUTCFullYear() - 1);
  return {
    regionId: REGIONS[0]!.id,
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    confidence: [...CONFIDENCE_TIERS],
    sensors: ["MODIS", "VIIRS"],
  };
}

export function RegionSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 lg:w-full">
      <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
        TARGET REGION
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-border bg-surface px-3 py-2 font-mono text-xs text-text focus:border-data-blue focus:outline-none lg:w-full"
      >
        {REGIONS.map((r) => (
          <option key={r.id} value={r.id} className="bg-surface text-text">
            {r.name} ({r.bbox})
          </option>
        ))}
      </select>
    </label>
  );
}

export function DateRangeInputs({
  startDate,
  endDate,
  onStart,
  onEnd,
}: {
  startDate: string;
  endDate: string;
  onStart: (d: string) => void;
  onEnd: (d: string) => void;
}) {
  return (
    <div className="flex gap-3 lg:grid lg:w-full lg:grid-cols-1">
      <label className="flex flex-col gap-1 lg:w-full">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
          ACQUISITION START
        </span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStart(e.target.value)}
          className="rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text focus:border-data-blue focus:outline-none lg:w-full"
        />
      </label>
      <label className="flex flex-col gap-1 lg:w-full">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
          ACQUISITION END
        </span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEnd(e.target.value)}
          className="rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text focus:border-data-blue focus:outline-none lg:w-full"
        />
      </label>
    </div>
  );
}

export function ConfidenceFilter({
  value,
  onChange,
}: {
  value: ConfidenceTier[];
  onChange: (tiers: ConfidenceTier[]) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
        CONFIDENCE TIER
      </legend>
      <div className="flex gap-1.5">
        {CONFIDENCE_TIERS.map((tier) => {
          const active = value.includes(tier);
          return (
            <button
              key={tier}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? value.filter((t) => t !== tier) : [...value, tier])}
              className={`rounded border px-2.5 py-1 font-mono text-xs uppercase tracking-wider transition-colors ${
                active
                  ? "border-data-blue bg-surface-elevated text-data-blue font-semibold"
                  : "border-border bg-surface text-text-secondary hover:text-text"
              }`}
            >
              {tier}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
