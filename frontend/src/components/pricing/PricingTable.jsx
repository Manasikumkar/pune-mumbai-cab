import { useMemo } from "react";
import { BadgeCheck, Briefcase, Info, Users } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { cn } from "../../utils/cn";
import Button from "../ui/Button";

const VEHICLE_IMAGES = {
  sedan: "https://images.pexels.com/photos/9544521/pexels-photo-9544521.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=96&h=64",
  suv: "https://images.pexels.com/photos/17612417/pexels-photo-17612417.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=96&h=64",
  innova: "https://images.pexels.com/photos/30195580/pexels-photo-30195580.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=96&h=64",
  "innova-crysta": "https://images.pexels.com/photos/37029578/pexels-photo-37029578.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=96&h=64",
};

/**
 * Route pricing table. All numbers come from `route.pricing` (API data) —
 * nothing is hardcoded here. Joins each pricing row to its vehicle record.
 *
 * @param {object}   route     Route record from getRouteBySlug()
 * @param {Array}    vehicles  Vehicle records from getVehicles()
 * @param {Function} onBook    (vehicle, tripType) => void
 */
export default function PricingTable({ route, vehicles = [], onBook, className }) {
  const rows = useMemo(
    () =>
      (route?.pricing || [])
        .map((row) => ({ ...row, vehicle: vehicles.find((v) => v.slug === row.vehicleSlug) }))
        .filter((row) => row.vehicle),
    [route, vehicles]
  );

  if (!route || rows.length === 0) return null;

  const routeLabel = `${route.origin} to ${route.destination}`;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 shadow-card md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            {routeLabel} cab fares by vehicle type — one way and round trip
          </caption>
          <thead className="bg-brand-900 text-xs uppercase tracking-wider text-brand-100">
            <tr>
              <th scope="col" className="px-5 py-4 font-semibold">
                Cab type
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Capacity
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                One way
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Round trip
              </th>
              <th scope="col" className="px-5 py-4 text-right font-semibold">
                <span className="sr-only">Book</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map(({ vehicle, oneWayPrice, roundTripPrice }) => (
              <tr key={vehicle.slug} className="transition hover:bg-brand-50/40">
                <th scope="row" className="px-5 py-4 font-normal">
                  <div className="flex items-center gap-3">
                    <img
                      src={(() => { const url = vehicle.image || vehicle.imageUrl; if (!url || url.startsWith('/')) return VEHICLE_IMAGES[vehicle.slug] || ''; return url; })()}
                      alt=""
                      width={72}
                      height={48}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-[72px] rounded-lg object-cover"
                    />
                    <div>
                      <p className="flex items-center gap-2 font-bold text-slate-900">
                        {vehicle.name}
                        {vehicle.isPopular && (
                          <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-700">
                            Popular
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{vehicle.models?.join(" / ") || vehicle.type}</p>
                    </div>
                  </div>
                </th>
                <td className="px-5 py-4 text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-brand-500" aria-hidden="true" />
                    {vehicle.seatingCapacity} seats
                  </span>
                  <span className="ml-3 inline-flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-brand-500" aria-hidden="true" />
                    {vehicle.luggageCapacity} bags
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-lg font-extrabold text-brand-800">{formatCurrency(oneWayPrice, route.currency)}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-lg font-extrabold text-slate-900">{formatCurrency(roundTripPrice, route.currency)}</span>
                  <span className="block text-xs text-slate-500">
                    Save {formatCurrency(oneWayPrice * 2 - roundTripPrice, route.currency)} vs 2× one way
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button size="sm" onClick={() => onBook?.(vehicle, "one-way")}>
                    Book now
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="grid gap-3 md:hidden">
        {rows.map(({ vehicle, oneWayPrice, roundTripPrice }) => (
          <li key={vehicle.slug} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <img
                src={(() => { const url = vehicle.image || vehicle.imageUrl; if (!url || url.startsWith('/')) return VEHICLE_IMAGES[vehicle.slug] || ''; return url; })()}
                alt=""
                width={80}
                height={56}
                loading="lazy"
                decoding="async"
                className="h-14 w-20 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-bold text-slate-900">
                  {vehicle.name}
                  {vehicle.isPopular && (
                    <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase text-accent-700">
                      Popular
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  {vehicle.seatingCapacity} seats · {vehicle.luggageCapacity} bags
                </p>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-brand-50 px-3 py-2">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">One way</dt>
                <dd className="text-lg font-extrabold text-brand-900">{formatCurrency(oneWayPrice, route.currency)}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Round trip</dt>
                <dd className="text-lg font-extrabold text-slate-900">{formatCurrency(roundTripPrice, route.currency)}</dd>
              </div>
            </dl>
            <Button size="sm" fullWidth className="mt-3" onClick={() => onBook?.(vehicle, "one-way")}>
              Book {vehicle.name}
            </Button>
          </li>
        ))}
      </ul>

      {/* Footnote */}
      <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
        <div className="flex gap-2">
          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
          <p>
            <span className="font-semibold text-slate-900">Included:</span> {(route.inclusions || []).join(", ")}.
          </p>
        </div>
        <div className="flex gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
          <p>
            <span className="font-semibold text-slate-900">Extra:</span> {(route.exclusions || []).join(", ")}. Round trip
            includes up to 8 hours / 300 km.
          </p>
        </div>
      </div>
    </div>
  );
}
