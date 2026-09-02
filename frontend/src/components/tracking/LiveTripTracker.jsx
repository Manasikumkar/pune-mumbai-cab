import { useEffect, useRef, useState } from "react";
import { Car, Clock, MapPin, Phone, Shield, User } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Mock live trip tracking UI — shows an animated map with driver position,
 * ETA, driver info, and trip status steps. Designed to be swapped with
 * real WebSocket/polling data later.
 *
 * Props:
 *   className
 *   tripStatus   – "assigned" | "picked_up" | "en_route" | "arrived"
 *   pickup       – string
 *   drop         – string
 */
const MOCK_DRIVER = {
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  vehicle: "Toyota Innova Crysta",
  vehicleNo: "MH 12 AB 1234",
  photo: null, // null = show initials
  rating: 4.9,
  trips: 1247,
};

const STATUS_STEPS = [
  { key: "assigned", label: "Driver assigned", icon: User },
  { key: "en_route", label: "Driver en route", icon: Car },
  { key: "picked_up", label: "Picked up", icon: MapPin },
  { key: "arrived", label: "Arrived", icon: MapPin },
];

// Fake route points between two locations
const ANIMATED_ROUTE = [
  [18.5204, 73.8567],
  [18.54, 73.84],
  [18.56, 73.82],
  [18.58, 73.80],
  [18.60, 73.78],
  [18.62, 73.76],
  [18.64, 73.74],
  [18.66, 73.72],
  [18.68, 73.70],
  [18.70, 73.68],
  [18.72, 73.66],
  [18.74, 73.64],
  [18.76, 73.62],
];

export default function LiveTripTracker({
  className,
  tripStatus: initialStatus = "assigned",
  pickup = "Hinjewadi, Pune",
  drop = "Mumbai Airport T2",
}) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [eta, setEta] = useState("3h 15m");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient), [];

  // Simulate status progression
  useEffect(() => {
    const idx = STATUS_STEPS.findIndex((s) => s.key === currentStatus);
    if (idx < STATUS_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStatus(STATUS_STEPS[idx + 1].key);
        if (idx === 0) setEta("2h 50m");
        if (idx === 1) setEta("0m");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStatus]);

  // Initialize map
  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    async function initMap() {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [18.62, 73.74],
        zoom: 10,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      // Route line
      L.polyline(ANIMATED_ROUTE, {
        color: "#1f7fab",
        weight: 3,
        opacity: 0.7,
        dashArray: "6, 6",
      }).addTo(map);

      // Driver car icon
      const carIcon = L.divIcon({
        className: "tracking-car-icon",
        html: `<div style="
          width:36px;height:36px;
          background:linear-gradient(135deg,#f97316,#ea580c);
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 3px 12px rgba(249,115,22,0.5);
          border:3px solid white;
          font-size:18px;
          animation: pulse-ring 2s ease-in-out infinite;
        ">🚗</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const carMarker = L.marker(ANIMATED_ROUTE[0], { icon: carIcon }).addTo(map);

      // Animate car
      let step = 0;
      const interval = setInterval(() => {
        if (cancelled) return;
        step = (step + 1) % ANIMATED_ROUTE.length;
        carMarker.setLatLng(ANIMATED_ROUTE[step]);
      }, 1500);

      // Pickup marker
      L.circleMarker(ANIMATED_ROUTE[0], {
        radius: 6,
        fillColor: "#22c55e",
        color: "#fff",
        weight: 2,
        fillOpacity: 1,
      }).addTo(map);

      // Drop marker
      L.circleMarker(ANIMATED_ROUTE[ANIMATED_ROUTE.length - 1], {
        radius: 6,
        fillColor: "#ef4444",
        color: "#fff",
        weight: 2,
        fillOpacity: 1,
      }).addTo(map);

      setTimeout(() => {
        if (!cancelled) {
          map.fitBounds(L.polyline(ANIMATED_ROUTE).getBounds(), { padding: [40, 40] });
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
  }, [isClient]);

  const activeIdx = STATUS_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className={cn("overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 bg-brand-800 px-5 py-3.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        <h3 className="text-sm font-bold text-white">Live Trip Tracking</h3>
        <span className="ml-auto rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-brand-100">
          ETA: {eta}
        </span>
      </div>

      {/* Map */}
      <div className="h-[220px] w-full">
        <style>{`@keyframes pulse-ring { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }`}</style>
        <div ref={mapRef} className="h-full w-full" />
      </div>

      {/* Status steps */}
      <div className="flex items-center gap-1 px-5 py-3">
        {STATUS_STEPS.map((step, i) => (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                  i <= activeIdx
                    ? "bg-brand-700 text-white"
                    : "bg-slate-100 text-slate-400"
                )}
              >
                <step.icon className="h-4 w-4" />
              </div>
              <span className="mt-1 text-[10px] font-medium text-slate-500">{step.label}</span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-0.5 flex-1 rounded-full transition-colors",
                  i < activeIdx ? "bg-brand-700" : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Driver info card */}
      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">
            {MOCK_DRIVER.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-slate-900">{MOCK_DRIVER.name}</p>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                ★ {MOCK_DRIVER.rating}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {MOCK_DRIVER.vehicle} · {MOCK_DRIVER.vehicleNo} · {MOCK_DRIVER.trips.toLocaleString()} trips
            </p>
          </div>
          <a
            href={`tel:${MOCK_DRIVER.phone.replace(/\s/g, "")}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 transition hover:bg-green-100"
            title="Call driver"
          >
            <Phone className="h-4 w-4" />
          </a>
        </div>

        {/* Route summary */}
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-green-700">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-medium">{pickup}</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-accent-600">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-medium">{drop}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
