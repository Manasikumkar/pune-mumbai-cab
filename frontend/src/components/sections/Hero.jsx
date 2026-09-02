import { Link } from "react-router-dom";
import { ArrowRight, BadgeIndianRupee, Clock3, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { site, telLink } from "../../config/site";
import { useBookingModal } from "../../context/BookingModalContext";
import { formatCurrency, formatDistance } from "../../utils/formatters";
import Button from "../ui/Button";
import Container from "../ui/Container";
import { Skeleton } from "../ui/Skeleton";
import RouteMapEmbed from "../map/RouteMapEmbed";

const HERO_IMAGE =
  "https://images.pexels.com/photos/33898148/pexels-photo-33898148.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1080";

/**
 * Home hero. `routes` and `stats` come from the API (via HomePage) so every
 * number shown here stays in sync with the pricing tables.
 */
export default function Hero({ routes, stats }) {
  const { openBooking } = useBookingModal();

  return (
    <section className="relative isolate overflow-hidden bg-brand-950 text-white" aria-labelledby="hero-title">
      <img
        src={HERO_IMAGE}
        alt="Mumbai–Pune Expressway curving through the misty Sahyadri hills"
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="sync"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950/95 via-brand-950/80 to-brand-900/40"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-brand-950 to-transparent" aria-hidden="true" />

      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
        <div className="max-w-2xl animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-brand-50 ring-1 ring-white/20 backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-accent-400" aria-hidden="true" />
            Pune ⇄ Mumbai · Fixed fares · Tolls included · 24×7
          </p>
          <h1 id="hero-title" className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Pune to Mumbai Cab Service <span className="text-accent-400">You Can Set Your Watch By</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-brand-100 sm:text-xl">
            Doorstep pickup anywhere in Pune or Mumbai, verified drivers, clean AC cars and one honest price with
            no return fare on one-way trips. Airport transfers, business travel and family round trips — done
            right since {site.foundedYear}.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => openBooking({ pickup: "Pune", drop: "Mumbai" })}>
              Book Your Cab
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline-white" href={telLink}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {site.phoneDisplay}
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {(stats || Array.from({ length: 4 })).map((stat, index) =>
              stat ? (
                <div key={stat.id}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-brand-200">{stat.label}</dt>
                  <dd className="mt-1 text-2xl font-extrabold text-white">{stat.value}</dd>
                </div>
              ) : (
                <div key={index}>
                  <Skeleton className="h-3 w-20 bg-white/20" />
                  <Skeleton className="mt-2 h-7 w-16 bg-white/20" />
                </div>
              )
            )}
          </dl>
        </div>

        {/* Right column: Live fare card + Map */}
        <div className="space-y-4 [animation-delay:120ms] animate-fade-up">
          {/* Live route map */}
          <RouteMapEmbed className="h-[240px] sm:h-[280px]" />

          {/* Live fare card — data-driven */}
          <aside
            className="rounded-3xl bg-white/10 p-1.5 ring-1 ring-white/20 backdrop-blur-md"
            aria-label="Starting fares"
          >
            <div className="rounded-[1.25rem] bg-white p-5 text-slate-900 shadow-2xl sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Today's fixed fares</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  4.8 rated
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {(routes || Array.from({ length: 2 })).map((route, index) =>
                  route ? (
                    <li key={route.id}>
                      <Link
                        to={`/${route.slug}`}
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50/50"
                      >
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 font-bold text-slate-900">
                            <MapPin className="h-4 w-4 text-accent-500" aria-hidden="true" />
                            {route.origin} → {route.destination}
                          </p>
                          <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                              {route.travelTime}
                            </span>
                            <span>{formatDistance(route.distance, route.distanceUnit)}</span>
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">From</p>
                          <p className="text-xl font-extrabold text-brand-800">
                            {formatCurrency(route.oneWayPrice, route.currency)}
                          </p>
                        </div>
                        <ArrowRight
                          className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ) : (
                    <li key={index} className="rounded-2xl border border-slate-200 p-4">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="mt-2 h-3 w-28" />
                    </li>
                  )
                )}
              </ul>
              <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                <BadgeIndianRupee className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                One-way sedan fare, all tolls & driver allowance included. 5% GST extra. No hidden charges.
              </p>
              <Button fullWidth className="mt-4" onClick={() => openBooking()}>
                Get instant confirmation
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
