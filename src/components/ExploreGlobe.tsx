import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import { type Region, SENSOR_META, parseBbox } from "@/lib/regions";
import { type GridCell } from "@/lib/analyticalGrid";
import { type ObservationPoint } from "@/components/EarthGlobe";

export type ExploreViewMode = "NATIVE" | "COMMON GRID" | "HARMONIZED" | "ANOMALY" | "AGREEMENT";
export type SensorFilterMode = "MODIS" | "VIIRS" | "HARMONIZED";

interface ExploreGlobeProps {
  observations: ObservationPoint[];
  gridCells: GridCell[];
  selectedRegion: Region;
  activeSensor: SensorFilterMode;
  activeView: ExploreViewMode;
  selectedObservation: ObservationPoint | null;
  selectedCell: GridCell | null;
  onSelectObservation: (obs: ObservationPoint | null) => void;
  onSelectCell: (cell: GridCell | null) => void;
}

interface RenderPoint extends ObservationPoint {
  lng: number;
  size: number;
  color: string;
  opacity: number;
  altitude: number;
}

interface GlobePolygonItem {
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  cell?: GridCell;
  capColor: string;
  strokeColor: string;
  altitude: number;
}

// Shared unit geometries to prevent per-point buffer allocations on mobile
const SHARED_RING_GEO = new THREE.RingGeometry(0.65, 1.0, 16);
const SHARED_CIRCLE_GEO = new THREE.CircleGeometry(0.75, 14);

export default function ExploreGlobe({
  observations,
  gridCells,
  selectedRegion,
  activeSensor,
  activeView,
  selectedObservation,
  selectedCell,
  onSelectObservation,
  onSelectCell,
}: ExploreGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 700 });
  const [cameraAltitude, setCameraAltitude] = useState(1.0);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Smooth fly-to when selectedRegion changes
  useEffect(() => {
    if (!globeRef.current || !selectedRegion) return;
    const [lat, lng] = selectedRegion.center;
    const targetAlt = Math.max(0.35, 2.4 - selectedRegion.zoom * 0.28);
    globeRef.current.pointOfView({ lat, lng, altitude: targetAlt }, 1200);
    setCameraAltitude(targetAlt);
  }, [selectedRegion]);

  // Configure OrbitControls & DPR
  useEffect(() => {
    if (!globeRef.current) return;
    const renderer = globeRef.current.renderer();
    if (renderer) {
      const isMobile = window.innerWidth < 768;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0));
    }

    const controls = globeRef.current.controls();
    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.75;
      controls.zoomSpeed = 0.8;
      controls.minDistance = 120;
      controls.maxDistance = 460;
    }
  }, []);

  // Keyboard navigation controls for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!globeRef.current) return;
    const pov = globeRef.current.pointOfView();

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        globeRef.current.pointOfView({ ...pov, lng: pov.lng - 6 }, 250);
        break;
      case "ArrowRight":
        e.preventDefault();
        globeRef.current.pointOfView({ ...pov, lng: pov.lng + 6 }, 250);
        break;
      case "ArrowUp":
        e.preventDefault();
        globeRef.current.pointOfView({ ...pov, lat: Math.min(85, pov.lat + 5) }, 250);
        break;
      case "ArrowDown":
        e.preventDefault();
        globeRef.current.pointOfView({ ...pov, lat: Math.max(-85, pov.lat - 5) }, 250);
        break;
      case "+":
      case "=":
        e.preventDefault();
        globeRef.current.pointOfView({ ...pov, altitude: Math.max(0.2, pov.altitude * 0.85) }, 250);
        setCameraAltitude((prev) => Math.max(0.2, prev * 0.85));
        break;
      case "-":
      case "_":
        e.preventDefault();
        globeRef.current.pointOfView({ ...pov, altitude: Math.min(2.5, pov.altitude * 1.15) }, 250);
        setCameraAltitude((prev) => Math.min(2.5, prev * 1.15));
        break;
    }
  }, []);

  // Filter observations based on activeSensor (MODIS | VIIRS | HARMONIZED)
  const filteredObservations = useMemo(() => {
    if (activeSensor === "MODIS") {
      return observations.filter((o) => o.sensor === "MODIS");
    }
    if (activeSensor === "VIIRS") {
      return observations.filter((o) => o.sensor === "VIIRS");
    }
    return observations; // HARMONIZED includes both
  }, [observations, activeSensor]);

  // Points preparation with sensor styling, FRP scaling, and view adaptation
  const customPoints = useMemo(() => {
    // Hide individual points in pure COMMON GRID view to let the analytical grid shine
    if (activeView === "COMMON GRID") return [];

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const pointsToRender = isMobile ? filteredObservations.slice(0, 1500) : filteredObservations;

    return pointsToRender.map((obs) => {
      const isModis = obs.sensor === "MODIS";
      const baseRadius = isModis ? 0.36 : 0.22;
      const frpScale = obs.frp_mw ? Math.min(1.8, Math.max(0.7, Math.log10(obs.frp_mw + 1))) : 1.0;
      const radius = baseRadius * frpScale;

      const isSelected =
        selectedObservation &&
        selectedObservation.lat === obs.lat &&
        selectedObservation.lon === obs.lon &&
        selectedObservation.acq_time === obs.acq_time &&
        selectedObservation.sensor === obs.sensor;

      let color = isModis ? SENSOR_META.MODIS.color : SENSOR_META.VIIRS.color;
      let opacity = 0.9;

      if (activeView === "HARMONIZED" || activeSensor === "HARMONIZED") {
        // In harmonized mode: white-to-amber highlight
        color = obs.confidence_tier === "high" ? "#FFB547" : "#F4F7FA";
        opacity = 0.95;
      } else if (activeView === "ANOMALY") {
        // Anomaly highlight in amber
        color = obs.frp_mw && obs.frp_mw > 50 ? "#FFB547" : "#91A0B5";
        opacity = obs.frp_mw && obs.frp_mw > 50 ? 1.0 : 0.4;
      } else if (activeView === "AGREEMENT") {
        color = "#56D6C9"; // agreement teal
        opacity = 0.85;
      }

      if (isSelected) {
        color = "#FFFFFF";
        opacity = 1.0;
      }

      return {
        ...obs,
        lat: obs.lat,
        lng: obs.lon,
        size: radius,
        color,
        opacity,
        altitude: isSelected ? 0.02 : 0.007,
      };
    });
  }, [filteredObservations, activeView, activeSensor, selectedObservation]);

  // Analytical Grid GeoJSON polygons for COMMON GRID, HARMONIZED, ANOMALY, and AGREEMENT views
  const gridPolygons = useMemo(() => {
    // In NATIVE view, the grid is hidden unless HARMONIZED is active
    if (activeView === "NATIVE" && activeSensor !== "HARMONIZED") {
      return [];
    }

    return gridCells.map((cell) => {
      const { west, south, east, north } = cell.bounds;
      const isSelected = selectedCell && selectedCell.id === cell.id;

      let capColor = "rgba(11, 23, 40, 0.4)";
      let strokeColor = "rgba(145, 160, 181, 0.25)";

      if (activeView === "COMMON GRID") {
        // Shaded by detection count
        const ratio = Math.min(1.0, cell.totalCount / 30);
        capColor = `rgba(77, 163, 255, ${0.15 + ratio * 0.65})`;
        strokeColor = `rgba(77, 163, 255, ${0.3 + ratio * 0.5})`;
      } else if (activeView === "HARMONIZED" || activeSensor === "HARMONIZED") {
        // Derived harmonized layer in white-to-amber
        const intensity = cell.harmonizedIntensity;
        capColor = `rgba(255, 181, 71, ${0.2 + intensity * 0.6})`;
        strokeColor = `rgba(255, 181, 71, ${0.4 + intensity * 0.5})`;
      } else if (activeView === "ANOMALY") {
        // Anomaly cells in --anomaly-amber (#FFB547)
        if (cell.isAnomaly) {
          capColor = "rgba(255, 181, 71, 0.75)";
          strokeColor = "rgba(255, 181, 71, 0.95)";
        } else if (cell.anomalyPercentile >= 80) {
          capColor = "rgba(255, 181, 71, 0.35)";
          strokeColor = "rgba(255, 181, 71, 0.6)";
        } else {
          capColor = "rgba(11, 23, 40, 0.2)";
          strokeColor = "rgba(145, 160, 181, 0.15)";
        }
      } else if (activeView === "AGREEMENT") {
        // Cross-sensor agreement in --agreement-teal (#56D6C9)
        if (cell.agreementLevel === "STRONG") {
          capColor = "rgba(86, 214, 201, 0.7)";
          strokeColor = "rgba(86, 214, 201, 0.95)";
        } else if (cell.agreementLevel === "MODERATE") {
          capColor = "rgba(86, 214, 201, 0.4)";
          strokeColor = "rgba(86, 214, 201, 0.65)";
        } else if (cell.agreementLevel === "LIMITED") {
          capColor = "rgba(145, 160, 181, 0.22)";
          strokeColor = "rgba(145, 160, 181, 0.45)";
        } else {
          capColor = "rgba(11, 23, 40, 0.15)";
          strokeColor = "rgba(145, 160, 181, 0.18)";
        }
      }

      if (isSelected) {
        strokeColor = "#FFFFFF";
        capColor = "rgba(255, 255, 255, 0.5)";
      }

      return {
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [west, south],
              [east, south],
              [east, north],
              [west, north],
              [west, south],
            ],
          ],
        },
        cell,
        capColor,
        strokeColor,
        altitude: isSelected ? 0.012 : 0.004,
      };
    });
  }, [gridCells, activeView, activeSensor, selectedCell]);

  // Selected region geodetic boundary polygon outline
  const regionPolygon = useMemo(() => {
    if (!selectedRegion) return [];
    const { west, south, east, north } = parseBbox(selectedRegion.bbox);
    return [
      {
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [west, south],
              [east, south],
              [east, north],
              [west, north],
              [west, south],
            ],
          ],
        },
        strokeColor: "#4DA3FF",
        capColor: "rgba(77, 163, 255, 0.03)",
        altitude: 0.002,
      },
    ];
  }, [selectedRegion]);

  // Combine region outline with analytical grid polygons
  const allPolygons = useMemo(() => {
    return [...gridPolygons, ...regionPolygon];
  }, [gridPolygons, regionPolygon]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="3D Terrestrial Globe Workspace. Use arrow keys to rotate, plus and minus keys to zoom."
      className="relative h-full w-full select-none overflow-hidden bg-[#030711] focus:outline-none focus:ring-1 focus:ring-data-blue/50"
    >
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#030711"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#4DA3FF"
        atmosphereAltitude={0.08}
        // Custom Layer for Observations (MODIS ring vs VIIRS circle with animation scaling)
        customLayerData={customPoints}
        customThreeObject={(d: object) => {
          const pt = d as RenderPoint;
          const isModis = pt.sensor === "MODIS";
          const radius = pt.size * 0.45;
          const group = new THREE.Group();

          const mat = new THREE.MeshBasicMaterial({
            color: pt.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: pt.opacity,
          });

          const mesh = new THREE.Mesh(isModis ? SHARED_RING_GEO : SHARED_CIRCLE_GEO, mat);
          mesh.scale.set(radius, radius, 1);
          group.add(mesh);

          // Add invisible hit sphere to guarantee click registration on small dots
          const hitGeo = new THREE.SphereGeometry(Math.max(0.5, radius * 1.6), 8, 8);
          const hitMat = new THREE.MeshBasicMaterial({ visible: false });
          group.add(new THREE.Mesh(hitGeo, hitMat));

          return group;
        }}
        customThreeObjectUpdate={(obj: THREE.Object3D, d: object) => {
          const pt = d as RenderPoint;
          const coords = globeRef.current?.getCoords(pt.lat, pt.lng, pt.altitude);
          if (coords) {
            Object.assign(obj.position, coords);
          }
        }}
        customLayerLabel={(d: object) => {
          const pt = d as RenderPoint;
          const isModis = pt.sensor === "MODIS";
          const orbitAlt = isModis ? "705 km (Polar EOS)" : "824 km (Polar JPSS)";
          const frp = pt.frp_mw != null ? `${pt.frp_mw.toFixed(1)} MW` : "N/A";
          const temp = pt.brightness_k != null ? `${pt.brightness_k.toFixed(1)} K` : "N/A";
          return `<div style="background: rgba(3,7,17,0.95); border: 1px solid #1e293b; padding: 6px 10px; border-radius: 6px; font-family: monospace; font-size: 11px; color: #f1f5f9; box-shadow: 0 4px 14px rgba(0,0,0,0.6);">
            <div style="font-weight: bold; color: ${pt.color};">${pt.sensor} · ${pt.satellite}</div>
            <div>Altitude: ${orbitAlt} · Resolution: ${pt.resolution_m} m</div>
            <div>FRP: ${frp} · Brightness: ${temp}</div>
            <div style="color: #94a3b8; font-size: 10px; margin-top: 2px;">Click to inspect complete telemetry</div>
          </div>`;
        }}
        onCustomLayerClick={(d: object) => {
          onSelectObservation(d as ObservationPoint);
        }}
        // Analytical Grid & Region Boundary Polygons
        polygonsData={allPolygons}
        polygonGeoJsonGeometry={(d: object) => (d as GlobePolygonItem).geometry}
        polygonCapColor={(d: object) => (d as GlobePolygonItem).capColor}
        polygonSideColor={() => "rgba(0, 0, 0, 0)"}
        polygonStrokeColor={(d: object) => (d as GlobePolygonItem).strokeColor}
        polygonAltitude={(d: object) => (d as GlobePolygonItem).altitude}
        onPolygonClick={(d: object) => {
          const item = d as GlobePolygonItem;
          if (item.cell) {
            onSelectCell(item.cell);
          }
        }}
      />

      {/* Floating View Calibration HUD (bottom right) */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-20 hidden items-center gap-3 rounded border border-border/80 bg-surface/85 px-3 py-1.5 font-mono text-[10px] text-text-secondary backdrop-blur-md sm:flex">
        <span>PROJECTION: WGS 84</span>
        <span>·</span>
        <span>GRID CELL: 0.15° (~16.5 km)</span>
        <span>·</span>
        <span>ALTITUDE: {cameraAltitude.toFixed(2)}</span>
      </div>
    </div>
  );
}
