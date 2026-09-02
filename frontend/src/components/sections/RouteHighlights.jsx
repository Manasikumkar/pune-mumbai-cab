import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Milestone, Receipt } from "lucide-react";
import { formatCurrency, formatDistance } from "../../utils/formatters";
import Container from "../ui/Container";
import LazyImage from "../ui/LazyImage";
import SectionHeading from "../ui/SectionHeading";
import { CardSkeleton, ErrorState } from "../ui/Skeleton";

/** Two big route cards (Pune→Mumbai, Mumbai→Pune) driven by getRoutes(). */
export default function RouteHighlights({ routes, loading, error, onRetry }) {
  return (
    <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="routes-title">
      <Container>
        <SectionHeading
          id="routes-title"
          eyebrow="Popular routes"
          title="Pune → Mumbai and Mumbai → Pune, priced upfront"
          description="Both directions run all day, every day. Pick your route to see per-vehicle fares, pickup points and route-specific FAQs."
        />

        {error && <ErrorState message="Couldn't load routes." onRetry={onRetry} />}

        <div className="grid gap-6 lg:grid-cols-2">
          {loading && (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          )}
          {routes?.map((route) => (
            <article
              key={route.id}
              className="group grid overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card transition hover:shadow-card-hover sm:grid-cols-[48%_1fr]"
            >
              <LazyImage
                src={(() => { const url = route.image; if (!url || url.startsWith('/')) return 'https://images.pexels.com/photos/33898148/pexels-photo-33898148.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800'; return url; })()}
                alt={route.imageAlt || `${route.origin} to ${route.destination} route`}
                width={1200}
                height={800}
                wrapperClassName="aspect-[16/10] sm:aspect-auto sm:h-full"
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="flex flex-col p-6 sm:p-7">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {route.origin} <span className="text-accent-500">→</span> {route.destination}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{route.shortDescription}</p>

                <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <Milestone className="h-3.5 w-3.5" aria-hidden="true" /> Distance
                    </dt>
                    <dd className="mt-1 font-bold text-slate-900">{formatDistance(route.distance, route.distanceUnit)}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Time
                    </dt>
                    <dd className="mt-1 font-bold text-slate-900">{route.travelTime}</dd>
                  </div>
                  <div className="rounded-xl bg-brand-50 p-3">
                    <dt className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                      <Receipt className="h-3.5 w-3.5" aria-hidden="true" /> From
                    </dt>
                    <dd className="mt-1 font-extrabold text-brand-900">{formatCurrency(route.oneWayPrice, route.currency)}</dd>
                  </div>
                </dl>

                <Link
                  to={`/${route.slug}`}
                  className="mt-6 inline-flex items-center gap-2 self-start rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
                >
                  {route.name} fares & details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
