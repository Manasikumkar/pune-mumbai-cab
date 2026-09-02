import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Animated route map showing Pune → Mumbai on OpenStreetMap via Leaflet.
 * No API key needed — uses free OSM tiles.
 *
 * Props:
 *   className   – extra classes for the wrapper
 *   origin      – { lat, lng, label } (defaults to Pune)
 *   destination – { lat, lng, label } (defaults to Mumbai)
 */
const PUNE = { lat: 18.5204, lng: 73.8567, label: "Pune" };
const MUMBAI = { lat: 19.076, lng: 72.8777, label: "Mumbai" };

// Intermediate waypoints along the Pune–Mumbai Expressway
const ROUTE_POINTS = [
  [18.5204, 73.8567],  // Pune
  [18.6492, 73.7795],  // Hinjewadi
  [18.7437, 73.6535],  // Talegaon
  [18.7589, 73.4071],  // Lonavala
  [18.7612, 73.3583],  // Khandala
  [18.8186, 73.1718],  // Khopoli
  [18.9842, 73.0996],  // Panvel
  [19.0178, 73.0296],  // Vashi
  [19.0596, 72.8862],  // Thane
  [19.076, 72.8777],   // Mumbai
];

export default function RouteMapEmbed({ className, origin = PUNE, destination = MUMBAI }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    async function initMap() {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [18.78, 73.38],
        zoom: 9,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Draw route polyline
      const routeLine = L.polyline(ROUTE_POINTS, {
        color: "#1f7fab",
        weight: 4,
        opacity: 0.8,
        dashArray: "10, 8",
        lineCap: "round",
      }).addTo(map);

      // Origin marker (Pune)
      L.circleMarker([origin.lat, origin.lng], {
        radius: 8,
        fillColor: "#155275",
        color: "#fff",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map).bindPopup(`<b>${origin.label}</b>`);

      // Destination marker (Mumbai)
      L.circleMarker([destination.lat, destination.lng], {
        radius: 8,
        fillColor: "#f97316",
        color: "#fff",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map).bindPopup(`<b>${destination.label}</b>`);

      // Animated car icon moving along the route
      const carIcon = L.divIcon({
        className: "route-car-icon",
        html: `<div style="
          width:32px;height:32px;
          background:#f97316;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 8px rgba(249,115,22,0.5);
          border:3px solid white;
          font-size:16px;
          line-height:1;
        ">🚗</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const carMarker = L.marker(ROUTE_POINTS[0], { icon: carIcon }).addTo(map);

      // Animate along route
      let step = 0;
      const totalSteps = ROUTE_POINTS.length;
      const interval = setInterval(() => {
        if (cancelled) return;
        step = (step + 1) % totalSteps;
        const [lat, lng] = ROUTE_POINTS[step];

        // Calculate rotation
        const prev = ROUTE_POINTS[(step - 1 + totalSteps) % totalSteps];
        const angle = (Math.atan2(lng - prev[1], lat - prev[0]) * 180) / Math.PI;

        carMarker.setLatLng([lat, lng]);
        const el = carMarker.getElement();
        if (el) {
          const inner = el.querySelector("div");
          if (inner) inner.style.transform = `rotate(${-angle}deg)`;
        }
      }, 1200);

      // Delay fitBounds to let map pane render fully
      setTimeout(() => {
        if (!cancelled) {
          map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });
        }
      }, 200);
      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, origin, destination]);

  return (
    <div className={cn("relative overflow-hidden rounded-3xl ring-1 ring-white/15", className)}>
      {/* Map container */}
      <div ref={mapRef} className="h-full w-full min-h-[280px]" />

      {/* Origin label */}
      <div className="absolute left-3 top-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-bold text-brand-800 shadow-md backdrop-blur">
        <MapPin className="h-3.5 w-3.5 text-brand-600" />
        {origin.label}
      </div>

      {/* Destination label */}
      <div className="absolute bottom-3 right-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-bold text-accent-600 shadow-md backdrop-blur">
        <MapPin className="h-3.5 w-3.5 text-accent-500" />
        {destination.label}
      </div>

      {/* Live pulse indicator */}
      <div className="absolute left-3 bottom-3 z-[1000] flex items-center gap-2 rounded-lg bg-brand-800/90 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        Live route
      </div>
    </div>
  );
}
