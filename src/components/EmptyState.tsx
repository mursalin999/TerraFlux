import React from "react";
import { AlertCircle, Database, Satellite, Flame, RefreshCw } from "lucide-react";

export type EmptyStateType =
  "no_observations" | "historical_unavailable" | "viirs_unavailable" | "firms_error" | "custom";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

const PRESETS: Record<
  EmptyStateType,
  { title: string; description: string; icon: React.ElementType }
> = {
  no_observations: {
    title: "No satellite observations found for this selection.",
    description:
      "No MODIS or VIIRS thermal anomalies were recorded within the selected spatial bounding box and date window.",
    icon: Satellite,
  },
  historical_unavailable: {
    title: "Historical comparison unavailable.",
    description:
      "Insufficient baseline history stored for this temporal window. Select another date range or run an ingestion backfill.",
    icon: Database,
  },
  viirs_unavailable: {
    title: "VIIRS observations unavailable for this period.",
    description:
      "VIIRS (Suomi-NPP / NOAA-20) data stream returned no records for this interval. MODIS observations may still be accessible.",
    icon: Flame,
  },
  firms_error: {
    title: "NASA FIRMS data could not be retrieved.",
    description:
      "The connection to the NASA FIRMS near-real-time API was interrupted or timed out. Check network connectivity or retry.",
    icon: AlertCircle,
  },
  custom: {
    title: "No data available",
    description: "No observational data exists for the current query parameters.",
    icon: AlertCircle,
  },
};

export function EmptyState({
  type = "no_observations",
  title,
  description,
  onRetry,
  className = "",
}: EmptyStateProps) {
  const preset = PRESETS[type];
  const Icon = preset.icon;
  const displayTitle = title ?? preset.title;
  const displayDesc = description ?? preset.description;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center rounded-lg border border-border/70 bg-surface/60 p-8 text-center font-mono backdrop-blur-sm ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-elevated text-text-secondary">
        <Icon className="h-6 w-6 stroke-[1.5]" />
      </div>

      <h3 className="mt-4 font-headline text-base font-semibold text-text">{displayTitle}</h3>

      <p className="mt-2 max-w-md text-xs leading-relaxed text-text-secondary">{displayDesc}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded border border-data-blue/50 bg-data-blue/10 px-4 py-2 text-xs font-semibold text-data-blue transition-colors hover:border-data-blue hover:bg-data-blue/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>RETRY PULL</span>
        </button>
      )}
    </div>
  );
}

export default EmptyState;
