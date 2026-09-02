import { getCompanyStats, getFAQs, getRoutes } from "../services/api";
import { useAsyncData } from "../hooks/useAsyncData";
import { faqPageSchema, localBusinessSchema, websiteSchema } from "../utils/schema";
import SEO from "../components/seo/SEO";
import Hero from "../components/sections/Hero";
import ServicesOverview from "../components/sections/ServicesOverview";
import RouteHighlights from "../components/sections/RouteHighlights";
import FleetPreview from "../components/sections/FleetPreview";
import LiveTripTracker from "../components/tracking/LiveTripTracker";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import FAQPreview from "../components/sections/FAQPreview";
import CTABanner from "../components/sections/CTABanner";
import Container from "../components/ui/Container";
import SectionHeading from "../components/ui/SectionHeading";

export default function HomePage() {
  const routesQuery = useAsyncData(() => getRoutes(), []);
  const statsQuery = useAsyncData(() => getCompanyStats(), []);
  const faqsQuery = useAsyncData(() => getFAQs({ routeSlug: "general", limit: 5 }), []);

  return (
    <>
      <SEO
        title="Pune to Mumbai Cab | Fixed-Fare Taxi from ₹2,499, Tolls Included"
        description="Book a reliable Pune to Mumbai or Mumbai to Pune cab. One-way & round-trip taxis with fixed fares from ₹2,499, tolls included, verified drivers, airport transfers, 24×7."
        path="/"
        schemas={[localBusinessSchema(), websiteSchema(), faqPageSchema(faqsQuery.data || [])]}
      />

      <Hero routes={routesQuery.data} stats={statsQuery.data} />
      <ServicesOverview />
      <RouteHighlights
        routes={routesQuery.data}
        loading={routesQuery.loading}
        error={routesQuery.error}
        onRetry={routesQuery.refetch}
      />
      <FleetPreview bookingDefaults={{ pickup: "Pune", drop: "Mumbai" }} />

      {/* Live tracking demo section */}
      <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="tracking-title">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="tracking-title"
              eyebrow="Live tracking"
              title="Know exactly where your cab is — in real time"
              description="Every trip comes with live GPS tracking you can share with family or your office. Watch your driver approach on the map, see the ETA update, and get instant notifications."
              align="left"
              className="mb-6"
            />
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-700">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Real-time map</p>
                  <p className="text-sm text-slate-600">See your driver's exact location and route on a live map</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Share with family</p>
                  <p className="text-sm text-slate-600">Send a live tracking link to anyone — no app needed</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <span className="h-2 w-2 rounded-full bg-accent-500" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Flight tracking</p>
                  <p className="text-sm text-slate-600">For airport pickups, we track your flight and adjust automatically</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="lg:sticky lg:top-28">
            <LiveTripTracker pickup="Hinjewadi, Pune" drop="Mumbai Airport T2" />
          </div>
        </Container>
      </section>

      <WhyChooseUs />
      <TestimonialsSection limit={6} />
      <FAQPreview
        faqs={faqsQuery.data}
        loading={faqsQuery.loading}
        error={faqsQuery.error}
        onRetry={faqsQuery.refetch}
        title="Pune Mumbai cab — frequently asked questions"
        description="Everything first-time riders ask us about fares, tolls, cancellations and payments."
      />
      <CTABanner bookingDefaults={{ pickup: "Pune", drop: "Mumbai" }} />
    </>
  );
}
