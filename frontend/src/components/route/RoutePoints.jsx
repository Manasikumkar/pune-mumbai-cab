import { MapPin, Navigation } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";

/**
 * Pickup & drop points for a route (two lists from route.pickupPoints / dropPoints).
 * Headings: H2 for the section, H3 for each list.
 */
export default function RoutePoints({ route, eyebrow, title, description, pickupTitle, dropTitle, id = "pickup-points" }) {
  if (!route) return null;
  return (
    <section id={id} className="scroll-mt-24 bg-slate-50 py-16 sm:py-20" aria-labelledby={`${id}-title`}>
      <Container>
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              {pickupTitle || `Pickup points in ${route.origin}`}
            </h3>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {(route.pickupPoints || []).map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <Navigation className="h-5 w-5" aria-hidden="true" />
              </span>
              {dropTitle || `Drop points in ${route.destination}`}
            </h3>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {(route.dropPoints || []).map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't see your area? We cover every address in {route.origin} and {route.destination} at the same fixed
          fare — just type it in the booking form.
        </p>
      </Container>
    </section>
  );
}
