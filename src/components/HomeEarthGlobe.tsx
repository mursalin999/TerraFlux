import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import { REGIONS, SENSOR_META } from "@/lib/regions";

export interface HomeObservation {
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

interface GlobePoint extends HomeObservation {
  lng: number;
  size: number;
  color: string;
  altitude: number;
}

interface HomeEarthGlobeProps {
  observations: HomeObservation[];
  isLoadingObservations?: boolean;
  observationError?: string | null;
  isPanelOpen?: boolean;
  onSelectObservation?: (obs: HomeObservation | null) => void;
  onLoadingStageChange?: (
    stage: "INITIALIZING EARTH" | "LOADING OBSERVATIONS" | "SYNCING SENSOR LAYERS" | "READY",
  ) => void;
}

/** Compute real subsolar direction vector in Earth local coordinate space from UTC time */
function getSunDirection(): THREE.Vector3 {
  const now = new Date();
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
  // Earth rotates 15 degrees per hour; at 12:00 UTC, the Sun is at longitude 0°
  const subsolarLon = -(utcHours - 12) * 15;

  // Approximate solar declination based on day of the year
  const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const declination = -23.44 * Math.cos((2 * Math.PI * (dayOfYear + 10)) / 365);

  const radLon = (subsolarLon * Math.PI) / 180;
  const radLat = (declination * Math.PI) / 180;

  // Three.js spherical mapping: +Y is North, X-Z is equatorial plane
  return new THREE.Vector3(
    Math.cos(radLat) * Math.sin(radLon),
    Math.sin(radLat),
    Math.cos(radLat) * Math.cos(radLon),
  ).normalize();
}

export default function HomeEarthGlobe({
  observations,
  isLoadingObservations = false,
  observationError,
  isPanelOpen = false,
  onSelectObservation,
  onLoadingStageChange,
}: HomeEarthGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 900 });
  const [isInteracting, setIsInteracting] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Update loading stages
  useEffect(() => {
    if (!onLoadingStageChange) return;
    if (isLoadingObservations) {
      onLoadingStageChange("LOADING OBSERVATIONS");
    } else if (observations.length > 0) {
      onLoadingStageChange("SYNCING SENSOR LAYERS");
      const t = setTimeout(() => {
        onLoadingStageChange("READY");
      }, 150);
      return () => clearTimeout(t);
    } else {
      onLoadingStageChange("READY");
    }
  }, [isLoadingObservations, observations.length, onLoadingStageChange]);

  // Responsive dimensions
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

  // Interaction handlers to pause auto-rotation smoothly
  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const handleInteractionEnd = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 4000);
  }, []);

  // Dynamic cap on points: max 3,000 on mobile, 10,000 on desktop
  const customData = useMemo(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const maxPoints = isMobile ? 3000 : 10000;

    let sampled = observations;
    if (observations.length > maxPoints) {
      const stride = Math.ceil(observations.length / maxPoints);
      sampled = observations.filter((_, i) => i % stride === 0);
    }

    return sampled.map((obs) => {
      const isModis = obs.sensor === "MODIS";
      const baseRadius = isModis ? 0.36 : 0.22;
      const frpScale = obs.frp_mw ? Math.min(1.8, Math.max(0.7, Math.log10(obs.frp_mw + 1))) : 1.0;
      const radius = baseRadius * frpScale;

      return {
        ...obs,
        lat: obs.lat,
        lng: obs.lon,
        size: radius,
        color: isModis ? SENSOR_META.MODIS.color : SENSOR_META.VIIRS.color,
        altitude: 0.007,
      };
    });
  }, [observations]);

  // Create Custom Day/Night blended ShaderMaterial via real sun direction
  const globeMaterial = useMemo(() => {
    try {
      const textureLoader = new THREE.TextureLoader();
      const dayTexture = textureLoader.load("/textures/earth-day.jpg");
      const nightTexture = textureLoader.load("/textures/earth-night.jpg");

      dayTexture.colorSpace = THREE.SRGBColorSpace;
      nightTexture.colorSpace = THREE.SRGBColorSpace;

      const sunDir = getSunDirection();

      return new THREE.ShaderMaterial({
        uniforms: {
          uDayTexture: { value: dayTexture },
          uNightTexture: { value: nightTexture },
          uSunDirection: { value: sunDir },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uDayTexture;
          uniform sampler2D uNightTexture;
          uniform vec3 uSunDirection;
          varying vec2 vUv;
          varying vec3 vNormal;

          void main() {
            vec4 dayColor = texture2D(uDayTexture, vUv);
            vec4 nightColor = texture2D(uNightTexture, vUv);

            float sunDot = dot(normalize(vNormal), normalize(uSunDirection));
            // Atmospheric solar terminator blend
            float dayFactor = smoothstep(-0.14, 0.14, sunDot);

            vec3 dayLit = dayColor.rgb * max(0.16, sunDot * 0.84 + 0.16);
            vec3 nightLit = nightColor.rgb * 1.35;

            vec3 finalColor = mix(nightLit, dayLit, dayFactor);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
      });
    } catch (err) {
      console.warn("ShaderMaterial fallback to basic texture:", err);
      return new THREE.MeshStandardMaterial({
        roughness: 0.8,
        metalness: 0.1,
      });
    }
  }, []);

  // Configure OrbitControls, DevicePixelRatio, and Sparse Starfield
  useEffect(() => {
    if (!globeRef.current) return;

    // Cap devicePixelRatio: 1.5 on mobile, 2.0 on desktop
    const isMobile = window.innerWidth < 768;
    const maxDpr = isMobile ? 1.5 : 2.0;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const renderer = globeRef.current.renderer();
    if (renderer) {
      renderer.setPixelRatio(dpr);
    }

    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = !prefersReducedMotion && !isInteracting && !isPanelOpen;
      controls.autoRotateSpeed = 0.35; // ~0.3 deg/s
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.rotateSpeed = 0.7;
      controls.zoomSpeed = 0.75;
      controls.minDistance = 140; // clamp zoom so Earth never disappears
      controls.maxDistance = 440;
    }

    // Add subtle sparse starfield to the Three.js scene
    const scene = globeRef.current.scene();
    if (scene && !scene.getObjectByName("terraflux-starfield")) {
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 800; // subtle & sparse
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        const r = 320 + Math.random() * 120;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
        starPositions[i + 1] = r * Math.cos(phi);
        starPositions[i + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
      const starMaterial = new THREE.PointsMaterial({
        color: 0x91a0b5,
        size: 1.1,
        transparent: true,
        opacity: 0.45,
        sizeAttenuation: false,
      });
      const starfield = new THREE.Points(starGeometry, starMaterial);
      starfield.name = "terraflux-starfield";
      scene.add(starfield);
    }
  }, [prefersReducedMotion, isInteracting, isPanelOpen]);

  // Sync autoRotate state when interactions or panels change
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = !prefersReducedMotion && !isInteracting && !isPanelOpen;
    }
  }, [prefersReducedMotion, isInteracting, isPanelOpen]);

  // Region preset indicator rings so users can see where stored data lives
  const regionRings = useMemo(() => {
    return REGIONS.map((r) => ({
      lat: r.center[0],
      lng: r.center[1],
      maxR: r.zoom === 7 ? 3.5 : 7.0,
      propagationSpeed: 0,
      repeatPeriod: 0,
      name: r.name,
    }));
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handleInteractionStart}
      onPointerUp={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      className="relative h-full w-full select-none overflow-hidden bg-[#030711]"
    >
      <div className="h-full w-full transition-transform duration-700 ease-out lg:translate-x-[18%]">
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="#030711"
          globeMaterial={globeMaterial}
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor="#4DA3FF"
          atmosphereAltitude={0.08}
          customLayerData={customData}
          customThreeObject={(d: object) => {
            const pt = d as GlobePoint;
            const isModis = pt.sensor === "MODIS";
            const radius = pt.size * 0.45;
            const group = new THREE.Group();

            if (isModis) {
              // MODIS: hollow ring marker (1 km pixel)
              const ringGeo = new THREE.RingGeometry(radius * 0.65, radius, 16);
              const ringMat = new THREE.MeshBasicMaterial({
                color: pt.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
              });
              group.add(new THREE.Mesh(ringGeo, ringMat));
            } else {
              // VIIRS: solid circle marker (375 m pixel)
              const circleGeo = new THREE.CircleGeometry(radius * 0.75, 14);
              const circleMat = new THREE.MeshBasicMaterial({
                color: pt.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.95,
              });
              group.add(new THREE.Mesh(circleGeo, circleMat));
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
              onSelectObservation(d as HomeObservation);
            }
          }}
          ringsData={regionRings}
          ringColor={() => "rgba(145, 160, 181, 0.28)"}
          ringMaxRadius="maxR"
          ringAltitude={0.003}
        />
      </div>

      {/* Empty State Banner when no satellite observations stored */}
      {!isLoadingObservations && observations.length === 0 && !observationError && (
        <div className="pointer-events-none absolute bottom-16 right-6 z-10 max-w-sm rounded border border-border/80 bg-surface/85 px-4 py-2.5 font-mono text-xs text-text-secondary backdrop-blur-md">
          <div className="font-semibold uppercase text-text">NO SATELLITE OBSERVATIONS STORED</div>
          <div className="mt-1 text-[11px] text-text-secondary">
            Preset region rings indicate available coverage areas. Ingest data via the Explore
            console.
          </div>
        </div>
      )}

      {/* Observation Error Alert */}
      {observationError && (
        <div className="pointer-events-none absolute bottom-16 right-6 z-10 max-w-sm rounded border border-critical-red/60 bg-critical-red/10 px-4 py-2.5 font-mono text-xs text-critical-red backdrop-blur-md">
          <div className="font-semibold uppercase">TELEMETRY ACCESS ERROR</div>
          <div className="mt-1 text-[11px] opacity-90">{observationError}</div>
        </div>
      )}
    </div>
  );
}
