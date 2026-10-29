import { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import { REGIONS } from "@/lib/regions";
import { getImportSummary, importArchiveBatch, PRODUCT } from "@/lib/admin-import.functions";

type ProductKey = keyof typeof PRODUCT;
type Progress = { read: number; inside: number; inserted: number; updated: number; skipped: number; rejected: number; elapsed: number; errors: string[] };
const initial: Progress = { read: 0, inside: 0, inserted: 0, updated: 0, skipped: 0, rejected: 0, elapsed: 0, errors: [] };

export function AdminImportForm() {
  const [password, setPassword] = useState("");
  const [productKey, setProductKey] = useState<ProductKey>("MODIS_TERRA");
  const [regionId, setRegionId] = useState("bangladesh");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(initial);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [summary, setSummary] = useState<Array<{ product: string; year: number; rows: number; firstDate: string; lastDate: string }>>([]);
  const abortRef = useRef(false);
  const pauseRef = useRef(false);
  const startedRef = useRef(0);
  const rowsRef = useRef<Record<string, string>[]>([]);

  const loadSummary = async () => { if (!password) return; try { setSummary(await getImportSummary({ data: { password } })); } catch (error) { setProgress((p) => ({ ...p, errors: [...p.errors, error instanceof Error ? error.message : String(error)] })); } };
  useEffect(() => { void loadSummary(); }, []);

  const setPause = (value: boolean) => { pauseRef.current = value; setPaused(value); };
  const processBatch = async (batch: Record<string, string>[]) => {
    while (pauseRef.current && !abortRef.current) await new Promise((resolve) => setTimeout(resolve, 250));
    if (abortRef.current || batch.length === 0) return;
    const result = await importArchiveBatch({ data: { password, rows: batch, productKey, processing: /NRT$/i.test(batch[0]?.version ?? "") ? "NRT" : "SP", sourceFileName: file?.name ?? "unknown.csv", regionId } });
    setProgress((p) => ({ ...p, inside: p.inside + result.inside, inserted: p.inserted + (result.inserted ?? 0), updated: p.updated + (result.updated ?? 0), skipped: p.skipped + (result.skipped ?? 0), elapsed: Date.now() - startedRef.current }));
  };

  const start = () => {
    if (!file || !password) return;
    abortRef.current = false; setPause(false); setRunning(true); setProgress(initial); startedRef.current = Date.now(); rowsRef.current = [];
    Papa.parse<Record<string, string>>(file, {
      header: true, worker: true, chunkSize: 1024 * 1024,
      chunk: async (result, parser) => {
        parser.pause();
        if (progress.read === 0) {
          const headers = Object.keys(result.data[0] ?? {}).map((key) => key.toLowerCase());
          const expected = headers.includes("brightness") ? "MODIS" : headers.includes("bright_ti4") ? "VIIRS" : "UNKNOWN";
          if ((productKey.startsWith("MODIS") && expected !== "MODIS") || (productKey.startsWith("VIIRS") && expected !== "VIIRS")) { parser.abort(); setProgress((p) => ({ ...p, errors: [...p.errors, `This file looks like ${expected}, but you chose ${PRODUCT[productKey].label}.`] })); setRunning(false); return; }
        }
        setProgress((p) => ({ ...p, read: p.read + result.data.length }));
        try { await processBatch(result.data); } catch (error) { setProgress((p) => ({ ...p, rejected: p.rejected + result.data.length, errors: [...p.errors, error instanceof Error ? error.message : String(error)] })); }
        parser.resume();
      },
      complete: async () => { setRunning(false); setPause(false); await loadSummary(); },
      error: (error) => { setRunning(false); setProgress((p) => ({ ...p, errors: [...p.errors, error.message] })); },
    });
  };
  const cancel = () => { abortRef.current = true; setPause(false); setRunning(false); };
  const percent = file?.size ? Math.min(100, Math.round((progress.read / Math.max(progress.read, 1)) * 100)) : 0;
  const stats = useMemo(() => Object.entries(progress).filter(([key]) => key !== "errors"), [progress]);

  return <main className="mx-auto min-h-screen max-w-3xl bg-background px-4 py-8 text-text"><div className="space-y-6"><header><p className="font-mono text-xs uppercase tracking-[0.2em] text-agreement-teal">Private archive intake</p><h1 className="mt-2 text-2xl font-semibold">FIRMS CSV import</h1><p className="mt-2 text-sm text-text-secondary">Rows are read in browser chunks and written only after server-side password verification.</p></header>
    <section className="space-y-4 rounded border border-border bg-surface/70 p-4"><label className="block text-sm">Admin password<input className="mt-2 min-h-11 w-full rounded border border-border bg-background px-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><label className="block text-sm">CSV archive<input className="mt-2 min-h-11 w-full rounded border border-border bg-background px-3" type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Product<select className="mt-2 min-h-11 w-full rounded border border-border bg-background px-3" value={productKey} onChange={(e) => setProductKey(e.target.value as ProductKey)}>{Object.entries(PRODUCT).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label><label className="text-sm">Region<select className="mt-2 min-h-11 w-full rounded border border-border bg-background px-3" value={regionId} onChange={(e) => setRegionId(e.target.value)}>{REGIONS.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}</select></label></div><div className="flex flex-wrap gap-3"><button className="min-h-11 rounded bg-agreement-teal px-4 text-sm font-semibold text-background disabled:opacity-50" disabled={!file || !password || running} onClick={start}>Import</button><button className="min-h-11 rounded border border-border px-4 text-sm" disabled={!running} onClick={() => setPause(!paused)}>{paused ? "Resume" : "Pause"}</button><button className="min-h-11 rounded border border-critical-red px-4 text-sm text-critical-red" disabled={!running} onClick={cancel}>Cancel</button></div><progress className="h-3 w-full" value={percent} max="100" /><div className="grid grid-cols-2 gap-2 font-mono text-xs text-text-secondary sm:grid-cols-4">{stats.map(([key, value]) => <div key={key}><span className="text-text">{key}</span>: {String(value)}</div>)}</div>{progress.errors.length > 0 && <ul className="space-y-1 text-sm text-critical-red">{progress.errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}</ul>}</section>
    <section className="rounded border border-border bg-surface/70 p-4"><h2 className="text-sm font-semibold uppercase tracking-wider">Imported archive summary</h2><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[580px] text-left text-sm"><thead><tr className="border-b border-border text-text-secondary"><th className="p-2">Product</th><th className="p-2">Year</th><th className="p-2">Rows</th><th className="p-2">First</th><th className="p-2">Last</th></tr></thead><tbody>{summary.map((row) => <tr className="border-b border-border/50" key={`${row.product}-${row.year}`}><td className="p-2">{row.product}</td><td className="p-2">{row.year}</td><td className="p-2">{row.rows.toLocaleString()}</td><td className="p-2">{row.firstDate}</td><td className="p-2">{row.lastDate}</td></tr>)}</tbody></table></div></section></div></main>;
}
