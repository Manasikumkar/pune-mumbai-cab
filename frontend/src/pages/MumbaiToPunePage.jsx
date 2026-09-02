import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, FileText, Moon, PlaneLanding, Radar, Timer, UserRoundCheck } from "lucide-react";
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

const SLUG = "mumbai-to-pune-cab";
const PATH = `/${SLUG}`;

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Mumbai to Pune Cab", path: PATH },
];

const PICKUP_STEPS = [
  { icon: PlaneLanding, title: "Share your flight number", text: "Add it in the booking form or on WhatsApp. That's all we need — no need to update us if the flight is late." },
  { icon: Radar, title: "We track your flight live", text: "Your driver's dispatch time adjusts automatically to the actual landing time, so nobody waits unnecessarily." },
  { icon: UserRoundCheck, title: "Meet at the arrivals pickup", text: "T2: P7 pickup zone. T1: Gate 1 arrivals. Your driver holds a name placard and helps with luggage." },
  { icon: Timer, title: "45 minutes free waiting", text: "Immigration and baggage take time — the first 45 minutes after landing are on us." },
];

const BUSINESS_DESTINATIONS = [
  { name: "Hinjewadi IT Park", time: "≈ 3 h 15 m from BOM" },
  { name: "Baner / Balewadi High Street", time: "≈ 3 h 20 m" },
  { name: "Kharadi — EON & World Trade Center", time: "≈ 3 h 45 m" },
  { name: "Magarpatta & Hadapsar", time: "≈ 3 h 40 m" },
  { name: "Talawade & Chakan MIDC", time: "≈ 3 h" },
  { name: "Koregaon Park & Camp hotels", time: "≈ 3 h 35 m" },
];

const BUSINESS_IMAGE =
  "https://images.pexels.com/photos/8425027/pexels-photo-8425027.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=750";
const NIGHT_IMAGE =
  "https://images.pexels.com/photos/13074008/pexels-photo-13074008.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=750";

export default function MumbaiToPunePage() {
  const routeQuery = useAsyncData(() => getRouteBySlug(SLUG), []);
  const vehiclesQuery = useAsyncData(() => getVehicles(), []);
  const faqsQuery = useAsyncData(() => getFAQs({ routeSlug: SLUG }), []);
  const { openBooking } = useBookingModal();

  const route = routeQuery.data;
  const vehicles = vehiclesQuery.data || [];
  const bookingDefaults = { pickup: "Mumbai", drop: "Pune" };

  const schemas = [
    breadcrumbSchema(BREADCRUMBS),
    route &&
      serviceSchema({
        name: "Mumbai to Pune Cab Service",
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
        title="Mumbai to Pune Cab | Airport Pickup & Business Taxi, Fixed Fare"
        description="Mumbai to Pune cab with flight-tracked airport pickups at T1, T2 & NMIA. Fixed fares from ₹2,499 incl. tolls, GST invoices for corporate travel, drops to Hinjewadi, Kharadi & all of Pune."
        path={PATH}
        image={route?.image}
        schemas={schemas}
      />

      <RouteHero
        route={route}
        breadcrumbs={BREADCRUMBS}
        badge="Airport & business travel"
        title="Mumbai to Pune Cab — Airport Pickups and Business Travel at a Fixed Fare"
        intro="Land at Mumbai Airport, walk out to a placard-holding driver and be in Hinjewadi before your first meeting. Fixed fares from any Mumbai, Navi Mumbai or Thane address to any Pune address — with GST invoices, flight tracking and 45 minutes of free waiting."
      />

      {routeQuery.error && (
        <Container className="py-16">
          <ErrorState message="We couldn't load this route right now." onRetry={routeQuery.refetch} />
        </Container>
      )}

      {/* Airport pickup process — unique angle */}
      <section id="airport" className="scroll-mt-24 bg-white py-16 sm:py-20" aria-labelledby="airport-title">
        <Container>
          <SectionHeading
            id="airport-title"
            eyebrow="Mumbai Airport to Pune"
            title="How an airport pickup works — four simple steps"
            description={route?.airport?.note || "Flight-tracked airport pickups at T1, T2 & NMIA."}
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PICKUP_STEPS.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <span className="absolute right-5 top-5 text-4xl font-black text-slate-100" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
          {route && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Terminals covered:</span>{" "}
                {route.airport?.terminals?.join(" · ")} · Navi Mumbai International Airport (NMIA)
              </p>
              <Button onClick={() => openBooking({ pickup: `Mumbai Airport (${route.airport?.code || 'BOM'})`, drop: "Pune" })}>
                Book an airport pickup
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20" aria-labelledby="pricing-title">
        <Container>
          <SectionHeading
            id="pricing-title"
            eyebrow="Transparent pricing"
            title="Mumbai to Pune cab fares by vehicle"
            description="The same fixed fare from Colaba, Thane or Kharghar to anywhere in Pune. Airport pickups add a small parking & meet-and-greet fee."
          />
          {(routeQuery.loading || vehiclesQuery.loading) && (
            <div className="grid gap-4 md:grid-cols-2">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          )}
          {vehiclesQuery.error && <ErrorState message="Couldn't load vehicle pricing." onRetry={vehiclesQuery.refetch} />}
          {route && vehicles.length > 0 && (
            <>
              <PricingTable
                route={route}
                vehicles={vehicles}
                onBook={(vehicle, tripType) => openBooking({ ...bookingDefaults, vehicle: vehicle.slug, tripType })}
              />
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Optional add-ons</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                  {(route.surcharges || []).map((item) => (
                    <li key={item.label} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="font-bold text-slate-900">
                        {item.amount === 0 ? "Free" : `+${formatCurrency(item.amount, route.currency)}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </Container>
      </section>

      {/* Business travel — unique angle */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="business-title">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <LazyImage
            src={BUSINESS_IMAGE}
            alt="Chauffeur holding the car door open for a business traveller outside a modern office"
            width={1000}
            height={750}
            wrapperClassName="aspect-[4/3] rounded-3xl shadow-card"
          />
          <div>
            <SectionHeading
              id="business-title"
              eyebrow="For business travellers"
              title="Built for the Mumbai–Pune corporate commute"
              description="Half of our Mumbai to Pune bookings are consultants, sales teams and founders heading to Pune's IT parks. Here's what they rely on."
              align="left"
              className="mb-6"
            />
            <ul className="space-y-4">
              {[
                { icon: FileText, title: "GST invoices & monthly billing", text: "Share your GSTIN once. Get a compliant invoice per trip or one consolidated statement per month." },
                { icon: Briefcase, title: "A cabin you can work in", text: "Quiet Innova Crysta with captain seats, charging ports and a driver who won't take calls on speaker." },
                { icon: Moon, title: "Red-eye friendly", text: "Land at 1 AM and still get a fresh, breathalyser-checked driver. Night surcharge is a flat ₹300." },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-slate-500">
              Typical door-to-door time from Mumbai Airport
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {BUSINESS_DESTINATIONS.map((dest) => (
                <li key={dest.name} className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">{dest.name}</span> · {dest.time}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* The drive */}
      <section className="bg-brand-950 py-16 text-white sm:py-20" aria-labelledby="drive-title">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="drive-title"
              eyebrow="The route"
              title="The drive from Mumbai to Pune"
              align="left"
              light
              className="mb-6"
            />
            {routeQuery.loading && <TextSkeleton lines={6} className="opacity-40" />}
            {route && (
              <>
                <p className="leading-relaxed text-brand-100">{route.description}</p>
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  {(route.highlights || []).map((item) => (
                    <div key={item.label} className="rounded-xl bg-white/10 p-4 ring-1 ring-white/10">
                      <dt className="text-xs font-semibold uppercase tracking-wider text-brand-200">{item.label}</dt>
                      <dd className="mt-1 text-sm font-semibold text-white">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>
          <LazyImage
            src={NIGHT_IMAGE}
            alt="Bandra–Worli Sea Link illuminated at night, on the way out of Mumbai towards the Expressway"
            width={1000}
            height={750}
            wrapperClassName="aspect-[4/3] rounded-3xl shadow-2xl ring-1 ring-white/10"
          />
        </Container>
      </section>

      {/* Pickup / drop points */}
      <RoutePoints
        route={route}
        eyebrow="Coverage"
        title="Pickup across Mumbai, Navi Mumbai & Thane — drop anywhere in Pune"
        description="Starting from Kharghar or Panvel? You skip 30–40 minutes of city traffic at the same fixed fare."
        pickupTitle="Pickup points in Mumbai, Navi Mumbai & Thane"
        dropTitle="Drop points in Pune & PCMC"
      />

      {/* FAQs */}
      <FAQPreview
        id="route-faq-title"
        className="bg-white"
        faqs={faqsQuery.data}
        loading={faqsQuery.loading}
        error={faqsQuery.error}
        onRetry={faqsQuery.refetch}
        eyebrow="Route FAQs"
        title="Mumbai to Pune cab — your questions answered"
        description="Airport meeting points, delayed flights, GST invoices and same-day round trips."
      />

      {/* Internal links */}
      <section className="bg-slate-50 py-14" aria-labelledby="related-title">
        <Container>
          <h2 id="related-title" className="text-2xl font-bold text-slate-900">
            You might also need
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { to: "/pune-to-mumbai-cab", title: "Pune to Mumbai cab", text: "Return leg, airport drops from Pune and the best time to leave." },
              { to: "/fleet", title: "See the full fleet", text: "Pick the Innova Crysta for meetings or an SUV for the team." },
              { to: "/about", title: "Why travellers trust us", text: "Our story, driver standards and the areas we serve." },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:bg-brand-50/40"
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
        title="Landing in Mumbai? Your Pune cab can be waiting at arrivals."
        description="Flight-tracked pickups at T1, T2 and NMIA. Fixed fare, GST invoice, 45 minutes free waiting."
        bookingDefaults={bookingDefaults}
      />
    </>
  );
}
