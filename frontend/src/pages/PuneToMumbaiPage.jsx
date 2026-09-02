import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Plane, Sunrise, TrainFront } from "lucide-react";
import { getFAQs, getRouteBySlug, getVehicles } from "../services/api";
import { useAsyncData } from "../hooks/useAsyncData";
import { useBookingModal } from "../context/BookingModalContext";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "../utils/schema";
import { formatCurrency } from "../utils/formatters";
import SEO from "../components/seo/SEO";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import LazyImage from "../components/ui/LazyImage";
import SectionHeading from "../components/ui/SectionHeading";
import { CardSkeleton, ErrorState, TextSkeleton } from "../components/ui/Skeleton";
import RouteHero from "../components/route/RouteHero";
import RoutePoints from "../components/route/RoutePoints";
import PricingTable from "../components/pricing/PricingTable";
import FAQPreview from "../components/sections/FAQPreview";
import CTABanner from "../components/sections/CTABanner";

const SLUG = "pune-to-mumbai-cab";
const PATH = `/${SLUG}`;

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Pune to Mumbai Cab", path: PATH },
];

const DEPARTURE_WINDOWS = [
  { window: "4 AM – 6 AM", duration: "2 h 45 m – 3 h", note: "Fastest run of the day; ideal for morning flights from Mumbai." },
  { window: "6 AM – 9 AM", duration: "3 h – 3 h 30 m", note: "Slow exit from Hinjewadi / Wakad during office hours." },
  { window: "9 AM – 4 PM", duration: "3 h – 3 h 30 m", note: "Smooth Expressway; expect slower trucks on the Bhor Ghat descent." },
  { window: "4 PM – 8 PM", duration: "3 h 30 m – 4 h 30 m", note: "Mumbai entry at Sion / Chembur / Airoli is congested." },
  { window: "8 PM – Midnight", duration: "3 h – 3 h 30 m", note: "Quiet roads; ₹300 night surcharge applies after 11 PM." },
];

const PUNE_IMAGE =
  "https://images.pexels.com/photos/34234571/pexels-photo-34234571.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=750";

export default function PuneToMumbaiPage() {
  const routeQuery = useAsyncData(() => getRouteBySlug(SLUG), []);
  const vehiclesQuery = useAsyncData(() => getVehicles(), []);
  const faqsQuery = useAsyncData(() => getFAQs({ routeSlug: SLUG }), []);
  const { openBooking } = useBookingModal();

  const route = routeQuery.data;
  const vehicles = vehiclesQuery.data || [];
  const bookingDefaults = { pickup: "Pune", drop: "Mumbai" };

  const schemas = [
    breadcrumbSchema(BREADCRUMBS),
    route &&
      serviceSchema({
        name: "Pune to Mumbai Cab Service",
        description: route.shortDescription,
        path: PATH,
        origin: route.origin,
        destination: route.destination,
        price: route.oneWayPrice,
        offers: (route.pricing || []).map((p) => ({
          name: `${vehicles.find((v) => v.slug === p.vehicleSlug)?.name || p.vehicleSlug} — one way`,
          price: p.oneWayPrice,
        })),
      }),
    faqPageSchema(faqsQuery.data || []),
  ];

  return (
    <>
      <SEO
        title="Pune to Mumbai Cab | One Way Taxi from ₹2,499, Tolls Included"
        description="Pune to Mumbai cab at a fixed fare: 150 km in 3–3.5 hrs via the Expressway. Sedan, SUV, Innova & Crysta. Doorstep pickup in Pune, Mumbai airport drop at no extra cost. Book 24×7."
        path={PATH}
        image={route?.image}
        schemas={schemas}
      />

      <RouteHero
        route={route}
        breadcrumbs={BREADCRUMBS}
        badge="Most booked route"
        title="Pune to Mumbai Cab — Fixed-Fare One Way & Round Trip Taxi"
        intro="Leave from any address in Pune or Pimpri-Chinchwad and reach Mumbai, Navi Mumbai, Thane or the airport in a clean AC cab with a verified driver. One honest price with Expressway tolls included — and no return fare on one-way trips."
      />

      {routeQuery.error && (
        <Container className="py-16">
          <ErrorState message="We couldn't load this route right now." onRetry={routeQuery.refetch} />
        </Container>
      )}

      {/* About the drive */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="drive-title">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="drive-title"
              eyebrow="The route"
              title="What the Pune to Mumbai drive looks like"
              align="left"
              className="mb-6"
            />
            {routeQuery.loading && <TextSkeleton lines={6} />}
            {route && (
              <>
                <p className="text-base leading-relaxed text-slate-600">{route.description}</p>
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  {(route.highlights || []).map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.label}</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>
          <LazyImage
            src={PUNE_IMAGE}
            alt="Shaniwar Wada fort in central Pune, a common pickup landmark for Pune to Mumbai cabs"
            width={1000}
            height={750}
            wrapperClassName="aspect-[4/3] rounded-3xl shadow-card"
          />
        </Container>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20" aria-labelledby="pricing-title">
        <Container>
          <SectionHeading
            id="pricing-title"
            eyebrow="Transparent pricing"
            title="Pune to Mumbai cab fares by vehicle"
            description="Fixed fares for any Pune address to any Mumbai address. Round trips include up to 8 hours / 300 km with the same driver."
          />
          {(routeQuery.loading || vehiclesQuery.loading) && (
            <div className="grid gap-4 md:grid-cols-2">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          )}
          {vehiclesQuery.error && <ErrorState message="Couldn't load vehicle pricing." onRetry={vehiclesQuery.refetch} />}
          {route && vehicles.length > 0 && (
            <PricingTable
              route={route}
              vehicles={vehicles}
              onBook={(vehicle, tripType) => openBooking({ ...bookingDefaults, vehicle: vehicle.slug, tripType })}
            />
          )}
        </Container>
      </section>

      {/* Best time to leave — unique content */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="timing-title">
        <Container className="max-w-5xl">
          <SectionHeading
            id="timing-title"
            eyebrow="Local knowledge"
            title="When should you leave Pune?"
            description="Twelve years of trip logs, summarised. Times are door-to-door for a Hinjewadi or Kothrud pickup to Andheri or BKC."
          />
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-card">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Typical Pune to Mumbai travel time by departure window</caption>
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Departure from Pune
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Typical time
                  </th>
                  <th scope="col" className="hidden px-5 py-3.5 font-semibold sm:table-cell">
                    What to expect
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {DEPARTURE_WINDOWS.map((row) => (
                  <tr key={row.window}>
                    <th scope="row" className="px-5 py-3.5 font-semibold text-slate-900">
                      <span className="inline-flex items-center gap-2">
                        <Sunrise className="h-4 w-4 text-accent-500" aria-hidden="true" />
                        {row.window}
                      </span>
                      <span className="mt-1 block text-xs font-normal text-slate-500 sm:hidden">{row.note}</span>
                    </th>
                    <td className="px-5 py-3.5 font-bold text-brand-800">{row.duration}</td>
                    <td className="hidden px-5 py-3.5 text-slate-600 sm:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Friday evenings, monsoon weekends and long-weekend Sundays: add 45–60 minutes. We'll suggest a departure
            time when you book.
          </p>
        </Container>
      </section>

      {/* Pickup / drop points */}
      <RoutePoints
        route={route}
        eyebrow="Coverage"
        title="Pickup anywhere in Pune, drop anywhere in Mumbai"
        description="Same fixed fare whether you start in Hinjewadi or Hadapsar, and whether you're headed to Colaba or Thane."
      />

      {/* Airport option */}
      <section id="airport" className="scroll-mt-24 bg-white py-16 sm:py-20" aria-labelledby="airport-title">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl bg-brand-900 p-8 text-white">
            <Plane className="h-10 w-10 text-accent-400" aria-hidden="true" />
            <h2 id="airport-title" className="mt-4 text-3xl font-extrabold text-white">
              Pune to Mumbai Airport cab — no extra charge for T1 or T2
            </h2>
            {routeQuery.loading && <TextSkeleton lines={4} className="mt-5 opacity-40" />}
            {route && (
              <>
                <p className="mt-4 text-brand-100">{route.airport?.note}</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {(route.airport?.terminals || []).map((terminal) => (
                    <li key={terminal} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                      {terminal}
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                    Navi Mumbai International Airport (NMIA) drops at the same fare
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                    Departure-forecourt drop with luggage assistance
                  </li>
                </ul>
                <Button
                  className="mt-7"
                  onClick={() => openBooking({ pickup: "Pune", drop: `Mumbai Airport (${route.airport?.code || 'BOM'})` })}
                >
                  Book an airport drop from {formatCurrency(route.oneWayPrice, route.currency)}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Also popular from Pune</h3>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { icon: TrainFront, title: "Cruise terminal & CST", text: "Direct drops to the Mumbai International Cruise Terminal at Ballard Pier and CST station." },
                { icon: Plane, title: "Pune Airport pickups", text: "Landing at PNQ and heading to Mumbai? We pick up from the Lohegaon arrivals lane." },
                { icon: CheckCircle2, title: "Hospital visits", text: "Tata Memorial, Hinduja, Lilavati and Kokilaben — courteous drivers, wheelchair-friendly SUVs on request." },
                { icon: CheckCircle2, title: "Weekend getaways", text: "Round trips to Alibaug, Lonavala or Mumbai with the same driver and up to 8 hours of local use." },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="rounded-2xl border border-slate-200 p-5">
                  <Icon className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  <h4 className="mt-3 font-bold text-slate-900">{title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <FAQPreview
        id="route-faq-title"
        className="bg-slate-50"
        faqs={faqsQuery.data}
        loading={faqsQuery.loading}
        error={faqsQuery.error}
        onRetry={faqsQuery.refetch}
        eyebrow="Route FAQs"
        title="Pune to Mumbai cab — your questions answered"
        description="Specific to this route: timings, airport drops, Lonavala stops and night travel."
      />

      {/* Internal links */}
      <section className="bg-white py-14" aria-labelledby="related-title">
        <Container>
          <h2 id="related-title" className="text-2xl font-bold text-slate-900">
            Plan the rest of your trip
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { to: "/mumbai-to-pune-cab", title: "Mumbai to Pune cab", text: "Coming back? Fixed fares and airport pickups in the other direction." },
              { to: "/fleet", title: "Compare our fleet", text: "Sedan vs SUV vs Innova Crysta — seats, luggage and prices side by side." },
              { to: "/contact", title: "Talk to us", text: "Custom itineraries, corporate accounts or a quick question — we're 24×7." },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 p-5 transition hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <span className="font-bold text-brand-800">{link.title}</span>
                  <span className="mt-1 flex-1 text-sm text-slate-600">{link.text}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-900">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CTABanner
        title="Book your Pune to Mumbai cab now — fixed fare, tolls included."
        description="Doorstep pickup anywhere in Pune. Confirmation on WhatsApp within 15 minutes."
        bookingDefaults={bookingDefaults}
      />
    </>
  );
}
