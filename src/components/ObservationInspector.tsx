import { useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import type { ObservationPoint } from "@/components/EarthGlobe";

type Field = { label: string; value: string };

const unavailable = "Not available";
const format = (value: number | null | undefined, suffix = "") => value == null ? unavailable : `${value}${suffix}`;

function FieldList({ fields }: { fields: Field[] }) {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-3">{fields.map((field) => <div key={field.label} className="min-w-0"><dt className="font-mono text-[9px] tracking-[0.12em] text-text-secondary">{field.label}</dt><dd className="mt-0.5 truncate font-mono text-xs text-text">{field.value}</dd></div>)}</div>;
}

function Story({ observation, onClose }: { observation: ObservationPoint; onClose: () => void }) {
  const steps = [
    { title: "OBSERVED", detail: `${observation.acq_date} · ${observation.acq_time} UTC · ${observation.lat.toFixed(4)}, ${observation.lon.toFixed(4)}` },
    { title: "MODIS / VIIRS", detail: `${observation.sensor} detected this thermal anomaly at ${observation.resolution_m} m native resolution.` },
    { title: "COMMON GRID", detail: "Aligned to the existing TerraFlux analytical grid for cross-sensor comparison." },
    { title: "CROSS-SENSOR AGREEMENT", detail: unavailable },
    { title: "HISTORICAL CONTEXT", detail: unavailable },
    { title: "TERRAFLUX INTERPRETATION", detail: `A ${observation.sensor} observation with ${observation.confidence_tier} confidence and ${format(observation.frp_mw, " MW")} FRP was recorded at this location. This is a satellite-detected thermal anomaly, not a confirmed ground fire.` },
  ];
  return <div className="fixed inset-0 z-50 flex justify-end bg-bg/30 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label="Detection story"><button type="button" aria-label="Close detection story" onClick={onClose} className="absolute inset-0 cursor-default" /><aside className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-2xl"><header className="flex items-start justify-between border-b border-border px-5 py-5"><div><p className="font-mono text-[10px] tracking-[0.2em] text-data-blue">TERRАFLUX / STORY</p><h2 className="mt-1 font-headline text-xl font-semibold text-text">Detection story</h2><p className="mt-1 font-mono text-[10px] text-text-secondary">Fixed-template interpretation · source trace</p></div><button type="button" aria-label="Close" onClick={onClose} className="rounded p-1 text-text-secondary hover:bg-surface-elevated hover:text-text"><X /></button></header><ol className="flex flex-1 flex-col gap-0 overflow-y-auto px-5 py-5">{steps.map((step, index) => <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0 motion-safe:animate-in motion-safe:fade-in" style={{ animationDelay: `${index * 150}ms` }}><div className="relative flex flex-col items-center"><span className="z-10 flex size-6 items-center justify-center rounded-full border border-data-blue/60 bg-surface text-data-blue"><Check data-icon="inline-start" /></span>{index < steps.length - 1 && <span className="absolute top-6 h-full w-px bg-border" />}</div><div className="min-w-0"><h3 className="font-mono text-[10px] font-semibold tracking-[0.16em] text-text">{step.title}</h3><p className="mt-1 font-mono text-xs leading-relaxed text-text-secondary">{step.detail}</p></div></li>)}</ol></aside></div>;
}

export function ObservationInspector({ observation, onClose }: { observation: ObservationPoint | null; onClose: () => void }) {
  const [storyOpen, setStoryOpen] = useState(false);
  if (!observation) return null;
  const sourceFields: Field[] = [
    { label: "LATITUDE", value: observation.lat.toFixed(4) }, { label: "LONGITUDE", value: observation.lon.toFixed(4) },
    { label: "ACQUISITION DATE", value: observation.acq_date }, { label: "ACQUISITION TIME (UTC)", value: observation.acq_time },
    { label: "SENSOR", value: observation.sensor }, { label: "PLATFORM", value: observation.satellite },
    { label: "NATIVE RESOLUTION", value: format(observation.resolution_m, " m") }, { label: "FRP", value: format(observation.frp_mw, " MW") },
    { label: "BRIGHTNESS", value: format(observation.brightness_k, " K") }, { label: "CONFIDENCE", value: observation.confidence_tier.toUpperCase() },
  ];
  const derivedFields: Field[] = [{ label: "HISTORICAL PERCENTILE", value: unavailable }, { label: "CROSS-SENSOR AGREEMENT", value: unavailable }, { label: "EVIDENCE STRENGTH", value: unavailable }];
  const content = <div className="flex flex-col gap-5 p-4"><div><p className="mb-3 font-mono text-[9px] tracking-[0.18em] text-text-secondary">SOURCE DATA · NASA FIRMS</p><dl><FieldList fields={sourceFields} /></dl></div><div className="border-t border-border pt-4"><p className="mb-3 font-mono text-[9px] tracking-[0.18em] text-text-secondary">TERRAFLUX-DERIVED</p><dl><FieldList fields={derivedFields} /></dl></div><button type="button" onClick={() => setStoryOpen(true)} className="flex items-center justify-between rounded border border-data-blue/50 bg-data-blue/10 px-3 py-2.5 font-mono text-[11px] font-semibold tracking-wider text-data-blue hover:bg-data-blue/20">DETECTION STORY <ArrowRight data-icon="inline-end" /></button></div>;
  return <><aside className="fixed right-3 top-24 z-30 hidden w-[340px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-border bg-surface/95 shadow-2xl backdrop-blur-md lg:block" aria-label="Observation inspector"><div className="flex items-center justify-between border-b border-border px-4 py-3"><div><p className="font-mono text-[10px] tracking-[0.18em] text-data-blue">OBSERVATION</p><p className="mt-0.5 font-mono text-[9px] text-text-secondary">{observation.sensor} · {observation.acq_date}</p></div><button type="button" aria-label="Close observation inspector" onClick={onClose} className="rounded p-1 text-text-secondary hover:bg-surface-elevated hover:text-text"><X /></button></div>{content}</aside><div className="fixed inset-x-0 bottom-0 z-40 max-h-[85vh] overflow-y-auto rounded-t-xl border border-border bg-surface text-text shadow-2xl lg:hidden"><div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" /><div className="flex items-center justify-between px-4 pb-1 pt-4"><div><p className="font-mono text-sm tracking-wider">OBSERVATION</p><p className="font-mono text-[10px] text-text-secondary">{observation.sensor} · {observation.acq_date}</p></div><button type="button" aria-label="Close observation inspector" onClick={onClose} className="rounded p-1 text-text-secondary hover:bg-surface-elevated hover:text-text"><X /></button></div>{content}</div>{storyOpen && <Story observation={observation} onClose={() => setStoryOpen(false)} />}</>;
}

export default ObservationInspector;
