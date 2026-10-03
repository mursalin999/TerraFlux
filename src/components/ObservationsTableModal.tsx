import React, { useState, useMemo } from "react";
import { X, Search, ArrowUpDown, Download } from "lucide-react";
import { type ObservationPoint } from "@/components/EarthGlobe";
import { SENSOR_META } from "@/lib/regions";

interface ObservationsTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  observations: ObservationPoint[];
  regionName: string;
}

export function ObservationsTableModal({
  isOpen,
  onClose,
  observations,
  regionName,
}: ObservationsTableModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"acq_date" | "frp_mw" | "brightness_k">("acq_date");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const filtered = useMemo(() => {
    return observations.filter((obs) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        obs.sensor.toLowerCase().includes(term) ||
        obs.satellite.toLowerCase().includes(term) ||
        obs.acq_date.includes(term) ||
        obs.confidence_tier.toLowerCase().includes(term) ||
        obs.lat.toFixed(3).includes(term) ||
        obs.lon.toFixed(3).includes(term)
      );
    });
  }, [observations, searchTerm]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const va = a[sortField];
      const vb = b[sortField];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "string" && typeof vb === "string") {
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortAsc ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
  }, [filtered, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  if (!isOpen) return null;

  const toggleSort = (field: "acq_date" | "frp_mw" | "brightness_k") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCsv = () => {
    if (observations.length === 0) return;
    const headers = [
      "latitude",
      "longitude",
      "acq_date",
      "acq_time",
      "sensor",
      "satellite",
      "resolution_m",
      "brightness_k",
      "frp_mw",
      "confidence_tier",
      "day_night",
    ];
    const rows = observations.map((o) => [
      o.lat,
      o.lon,
      o.acq_date,
      o.acq_time,
      o.sensor,
      o.satellite,
      o.resolution_m,
      o.brightness_k ?? "",
      o.frp_mw ?? "",
      o.confidence_tier,
      o.day_night ?? "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `terraflux_${regionName.toLowerCase()}_observations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="table-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 p-4 backdrop-blur-md"
    >
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-lg border border-border bg-surface shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 id="table-modal-title" className="font-headline text-lg font-semibold text-text">
              Observation Register — {regionName}
            </h2>
            <p className="font-mono text-xs text-text-secondary">
              Total {observations.length.toLocaleString()} satellite radiometric anomalies in
              current filter window.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportCsv}
              className="flex items-center gap-1.5 rounded border border-border bg-surface-elevated px-3 py-1.5 font-mono text-xs text-text hover:bg-border"
            >
              <Download className="h-3.5 w-3.5" />
              <span>EXPORT CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close table view"
              className="rounded p-1 text-text-secondary hover:bg-surface-elevated hover:text-text"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3 border-b border-border bg-surface-elevated/40 px-6 py-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-secondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by sensor, satellite, date, coordinates, or tier…"
              className="w-full rounded border border-border bg-surface py-1.5 pl-9 pr-3 font-mono text-xs text-text placeholder:text-text-secondary/60 focus:border-data-blue focus:outline-none"
            />
          </div>
          <span className="font-mono text-xs text-text-secondary">
            SHOWING {sorted.length} RECORDS
          </span>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto px-6 py-2">
          {sorted.length === 0 ? (
            <div className="py-16 text-center font-mono text-xs text-text-secondary">
              No observation records match your search criteria.
            </div>
          ) : (
            <table className="w-full text-left font-mono text-xs">
              <thead className="sticky top-0 border-b border-border bg-surface text-[11px] text-text-secondary uppercase">
                <tr>
                  <th
                    className="cursor-pointer py-3 pr-4 hover:text-text"
                    onClick={() => toggleSort("acq_date")}
                  >
                    <div className="flex items-center gap-1">
                      <span>ACQUISITION</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">COORDINATES</th>
                  <th className="py-3 px-4">SENSOR</th>
                  <th className="py-3 px-4">PLATFORM</th>
                  <th className="py-3 px-4">RESOLUTION</th>
                  <th
                    className="cursor-pointer py-3 px-4 hover:text-text"
                    onClick={() => toggleSort("frp_mw")}
                  >
                    <div className="flex items-center gap-1">
                      <span>FRP (MW)</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer py-3 px-4 hover:text-text"
                    onClick={() => toggleSort("brightness_k")}
                  >
                    <div className="flex items-center gap-1">
                      <span>BRIGHTNESS</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 pl-4">CONFIDENCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {currentPageRows.map((obs, idx) => (
                  <tr key={idx} className="hover:bg-surface-elevated/60">
                    <td className="py-2.5 pr-4 text-text">
                      {obs.acq_date} {obs.acq_time} UTC ({obs.day_night === "D" ? "DAY" : "NIGHT"})
                    </td>
                    <td className="py-2.5 px-4 text-text-secondary">
                      {obs.lat.toFixed(4)}, {obs.lon.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className="inline-flex items-center gap-1 font-semibold"
                        style={{
                          color:
                            obs.sensor === "MODIS"
                              ? SENSOR_META.MODIS.color
                              : SENSOR_META.VIIRS.color,
                        }}
                      >
                        {obs.sensor}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-text">{obs.satellite}</td>
                    <td className="py-2.5 px-4 text-text-secondary">{obs.resolution_m} m</td>
                    <td className="py-2.5 px-4 font-semibold text-text">
                      {obs.frp_mw != null ? `${obs.frp_mw.toFixed(1)} MW` : "Not available"}
                    </td>
                    <td className="py-2.5 px-4 text-text-secondary">
                      {obs.brightness_k != null
                        ? `${obs.brightness_k.toFixed(1)} K`
                        : "Not available"}
                    </td>
                    <td className="py-2.5 pl-4 uppercase">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          obs.confidence_tier === "high"
                            ? "bg-data-blue/20 text-data-blue"
                            : obs.confidence_tier === "nominal"
                              ? "bg-surface-elevated text-text"
                              : "bg-surface text-text-secondary"
                        }`}
                      >
                        {obs.confidence_tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Pagination Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3 font-mono text-xs text-text-secondary">
          <div>
            PAGE {page} OF {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded border border-border bg-surface px-3 py-1 text-text disabled:opacity-40"
            >
              PREVIOUS
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded border border-border bg-surface px-3 py-1 text-text disabled:opacity-40"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
