import React, { useEffect, useRef, useState, useMemo } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import { type Region, SENSOR_META } from "@/lib/regions";

export interface ObservationPoint {
  lat: number;
  lon: number;
  acq_date: string;
  acq_time: string;
  sensor: string;
  satellite: string;
  resolution_m: number;
  brightness_k: number | null;
  brightness2_k: number | null;
  frp_mw: number | null;
  confidence_tier: string;
  confidence_raw?: string | null;
  day_night: string | null;
}

interface GlobePoint extends ObservationPoint {
  lng: number;
  size: number;
  color: string;
  altitude: number;
}

interface EarthGlobeProps {
  observations: ObservationPoint[];
  selectedRegion?: Region | null;
  selectedObservation?: ObservationPoint | null;
  onSelectObservation?: (obs: ObservationPoint | null) => void;
  showModis?: boolean;
  showViirs?: boolean;
  showHarmonized?: boolean;
}

export default function EarthGlobe({
  observations,
  selectedRegion,
  selectedObservation,
  onSelectObservation,
  showModis = true,
  showViirs = true,
  showHarmonized = true,
}: EarthGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [globeReady, setGlobeReady] = useState(false);

  // Resize handling
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

  // Filter observations based on active layer toggles
  const filteredObservations = useMemo(() => {
    return observations.filter((obs) => {
      if (obs.sensor === "MODIS" && !showModis) return false;
      if (obs.sensor === "VIIRS" && !showViirs) return false;
      return true;
    });
  }, [observations, showModis, showViirs]);

  // Points data prepared for react-globe.gl custom layer
  const customData = useMemo(() => {
    return filteredObservations.map((obs) => {
      const isModis = obs.sensor === "MODIS";
      const baseRadius = isModis ? 0.38 : 0.22;
      const frpScale = obs.frp_mw ? Math.min(1.8, Math.max(0.7, Math.log10(obs.frp_mw + 1))) : 1.0;
      const radius = baseRadius * frpScale;

      const isSelected =
        selectedObservation &&
        selectedObservation.lat === obs.lat &&
        selectedObservation.lon === obs.lon &&
        selectedObservation.acq_time === obs.acq_time &&
        selectedObservation.sensor === obs.sensor;

      return {
        ...obs,
        lat: obs.lat,
        lng: obs.lon,
        size: radius,
        color: isSelected ? "#56D6C9" : isModis ? SENSOR_META.MODIS.color : SENSOR_META.VIIRS.color,
        altitude: isSelected ? 0.025 : 0.008,
      };
    });
  }, [filteredObservations, selectedObservation]);

  // Animate camera on region change
  useEffect(() => {
    if (!globeRef.current || !selectedRegion) return;
    const [lat, lng] = selectedRegion.center;
    // Map zoom to altitude: zoom 7 -> alt 0.6, zoom 4 -> alt 1.5
    const altitude = Math.max(0.35, 2.5 - selectedRegion.zoom * 0.28);
    globeRef.current.pointOfView({ lat, lng, altitude }, 1400);
  }, [selectedRegion]);

  // On globe mount, set initial viewpoint & controls
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.7;
      controls.zoomSpeed = 0.8;
      controls.minDistance = 120;
      controls.maxDistance = 500;
    }
    setGlobeReady(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none overflow-hidden bg-[#030711]"
    >
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#030711"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#4DA3FF"
        atmosphereAltitude={0.16}
        customLayerData={customData}
        customThreeObject={(d: object) => {
          const pt = d as GlobePoint;
          const isModis = pt.sensor === "MODIS";
          const radius = pt.size * 0.45;

          const group = new THREE.Group();

          if (isModis) {
            // MODIS: hollow ring marker (1 km pixel representation)
            const ringGeo = new THREE.RingGeometry(radius * 0.65, radius, 16);
            const ringMat = new THREE.MeshBasicMaterial({
              color: pt.color,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.9,
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            group.add(ringMesh);
          } else {
            // VIIRS: solid circle marker (375 m pixel representation)
            const circleGeo = new THREE.CircleGeometry(radius * 0.75, 14);
            const circleMat = new THREE.MeshBasicMaterial({
              color: pt.color,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.95,
            });
            const circleMesh = new THREE.Mesh(circleGeo, circleMat);
            group.add(circleMesh);
          }

          return group;
        }}
        customThreeObjectUpdate={(obj: THREE.Object3D, d: object) => {
          const pt = d as GlobePoint;
          const coords = globeRef.current?.getCoords(pt.lat, pt.lng, pt.altitude);
          if (coords) {
            Object.assign(obj.position, coords);
          }
        }}
        onCustomLayerClick={(d: object) => {
          if (onSelectObservation) {
            onSelectObservation(d as ObservationPoint);
          }
        }}
      />

      {/* Earth HUD Graticule & Calibration Overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 font-mono text-[10px] text-text-secondary sm:p-6">
        <div className="flex items-start justify-between">
          <div className="rounded border border-border/80 bg-surface/80 px-2.5 py-1.5 backdrop-blur-md">
            <span className="text-text-secondary">PROJECTION:</span>{" "}
            <span className="font-semibold text-text">WGS 84 / 3D GEOID</span>
            <div className="mt-0.5 text-[9px] text-text-secondary/70">
              COORDINATES: GEODETIC DEGREES
            </div>
          </div>
          {selectedRegion && (
            <div className="rounded border border-border/80 bg-surface/80 px-2.5 py-1.5 text-right backdrop-blur-md">
              <span className="text-text-secondary">TARGET:</span>{" "}
              <span className="font-semibold uppercase text-text">{selectedRegion.name}</span>
              <div className="mt-0.5 text-[9px] text-text-secondary/70">
                BBOX: {selectedRegion.bbox}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3 rounded border border-border/80 bg-surface/80 px-3 py-1.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full border border-data-blue bg-transparent" />
              <span className="text-text">MODIS (1 km ring)</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-thermal-orange" />
              <span className="text-text">VIIRS (375 m solid)</span>
            </div>
          </div>
          <div className="hidden rounded border border-border/80 bg-surface/80 px-2.5 py-1.5 text-right sm:block backdrop-blur-md">
            <span className="text-text-secondary">OBSERVATIONS LOADED:</span>{" "}
            <span className="font-semibold text-data-blue">{filteredObservations.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
