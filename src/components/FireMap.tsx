// Browser-only map module — imported lazily (React.lazy) behind <ClientOnly>.
// Never import this module statically from a route.
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import { SENSOR_META } from "@/lib/regions";

export interface MapDetection {
  lat: number;
  lon: number;
  acq_date: string;
  acq_time: string;
  sensor: "MODIS" | "VIIRS";
  satellite: string;
  resolution_m: number;
  brightness_k: number | null;
  frp_mw: number | null;
  confidence_tier: "low" | "nominal" | "high";
  day_night: "D" | "N" | null;
}

function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const MAX_MARKERS = 5000;

export default function FireMap({
  detections,
  center,
  zoom,
  onSelectObservation,
}: {
  detections: MapDetection[];
  center: [number, number];
  zoom: number;
  onSelectObservation?: (obs: MapDetection) => void;
}) {
  const shown =
    detections.length > MAX_MARKERS
      ? detections.filter((_, i) => i % Math.ceil(detections.length / MAX_MARKERS) === 0)
      : detections;

  const cartoKey =
    typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env.VITE_CARTO_KEY as string) ||
        (import.meta.env.VITE_CARTO_API_KEY as string) ||
        ""
      : "";

  // If a Carto key is supplied, use the clean authenticated raster tiles; otherwise default to dark_all
  const tileUrl = cartoKey
    ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full bg-[#030711]"
        scrollWheelZoom
        attributionControl={false}
      >
        <Recenter center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />
        {shown.map((d, i) => {
          const isModis = d.sensor === "MODIS";
          const meta = SENSOR_META[d.sensor];
          const frpScale = d.frp_mw ? Math.min(2.0, Math.max(0.7, Math.log10(d.frp_mw + 1))) : 1.0;
          const radius = isModis ? 5 * frpScale : 3 * frpScale;

          return (
            <CircleMarker
              key={`${d.sensor}-${d.satellite}-${d.acq_date}-${d.acq_time}-${d.lat}-${d.lon}-${i}`}
              center={[d.lat, d.lon]}
              radius={radius}
              eventHandlers={{
                click: () => onSelectObservation?.(d),
              }}
              pathOptions={{
                color: meta.color,
                fillColor: meta.color,
                // MODIS = hollow ring (low fill opacity), VIIRS = solid marker
                fillOpacity: isModis
                  ? 0.15
                  : d.confidence_tier === "high"
                    ? 0.95
                    : d.confidence_tier === "nominal"
                      ? 0.7
                      : 0.4,
                weight: isModis ? 2 : 1,
                opacity: 0.95,
              }}
            >
              <Popup>
                <div className="font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-1 font-mono text-[10px] text-text-secondary uppercase">
                    <span>OBSERVATION</span>
                    <span className="font-semibold text-text">{d.sensor}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div>
                      <span className="font-mono text-[10px] text-text-secondary uppercase">
                        COORDINATES:
                      </span>{" "}
                      <span className="font-mono text-text">
                        {d.lat.toFixed(4)}, {d.lon.toFixed(4)}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-text-secondary uppercase">
                        ORBITAL ALTITUDE:
                      </span>{" "}
                      <span className="font-semibold text-text">
                        {d.sensor === "MODIS" ? "705 km (Polar EOS)" : "824 km (Polar JPSS)"}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-text-secondary uppercase">
                        PLATFORM:
                      </span>{" "}
                      <span className="text-text">{d.satellite}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-text-secondary uppercase">
                        ACQUISITION:
                      </span>{" "}
                      <span className="font-mono text-text">
                        {d.acq_date} {d.acq_time} UTC (
                        {d.day_night === "N"
                          ? "NIGHT"
                          : d.day_night === "D"
                            ? "DAY"
                            : "Not available"}
                        )
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-text-secondary uppercase">
                        RESOLUTION:
                      </span>{" "}
                      <span className="text-text">{d.resolution_m} m pixel</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-text-secondary uppercase">
                        BRIGHTNESS:
                      </span>{" "}
                      <span className="font-mono text-text">
                        {d.brightness_k != null
                          ? `${d.brightness_k.toFixed(1)} K`
                          : "Not available"}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-text-secondary uppercase">
                        FRP:
                      </span>{" "}
                      <span className="font-mono text-text">
                        {d.frp_mw != null ? `${d.frp_mw.toFixed(1)} MW` : "Not available"}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-text-secondary uppercase">
                        CONFIDENCE:
                      </span>{" "}
                      <span className="font-semibold uppercase text-text">{d.confidence_tier}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="pointer-events-none absolute bottom-1.5 right-2 z-[400] font-mono text-[9px] text-text-secondary/70">
        CARTO / NASA FIRMS
      </div>
    </div>
  );
}
