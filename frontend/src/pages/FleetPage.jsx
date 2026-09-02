import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Check, Users } from "lucide-react";
import { getVehicles } from "../services/api";
import { useAsyncData } from "../hooks/useAsyncData";
import { useBookingModal } from "../context/BookingModalContext";
import { breadcrumbSchema, fleetItemListSchema } from "../utils/schema";
import { formatCurrency } from "../utils/formatters";
import SEO from "../components/seo/SEO";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import SectionHeading from "../components/ui/SectionHeading";
import { CardSkeleton, ErrorState } from "../components/ui/Skeleton";
import VehicleCard from "../components/fleet/VehicleCard";
import CTABanner from "../components/sections/CTABanner";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Our Fleet", path: "/fleet" },
];

const CHOOSING_GUIDE = [
  { title: "Travelling alone or as a couple?", text: "A Sedan is the best value. Two large suitcases fit in the boot with cabin bags on the rear seat." },
  { title: "Family of five or six?", text: "Choose the SUV. Everyone gets a seat belt, the third row folds for extra luggage, and it rides the ghat section smoothly." },
  { title: "Seven people or lots of luggage?", text: "The Toyota Innova is the Expressway workhorse — seven seats plus four large bags without anyone feeling cramped." },
  { title: "Client meeting or airport transfer?", text: "Book the Innova Crysta. Captain seats, dual-zone AC, a uniformed chauffeur and a cabin quiet enough for calls." },
];

const STANDARDS = [
  "Every car is under 5 years old and serviced every 30 days",
  "Interiors are vacuumed and sanitised before each trip",
  "Functional seat belts for every seat, including the third row",
  "GPS tracked with a live link you can share",
  "First-aid kit, umbrella and phone chargers on board",
  "Commercial permits, insurance and fitness certificates current",
];

export default function FleetPage() {
  const { data: vehicles, loading, error, refetch } = useAsyncData(() => getVehicles(), []);
  const { openBooking } = useBookingModal();

  return (
    <>
      <SEO
        title="Our Fleet | Sedan, SUV, Innova & Innova Crysta Cabs for Pune–Mumbai"
        description="Compare Pune Mumbai Cab's fleet: 4-seat sedans from ₹2,499, 6-seat SUVs, 7-seat Toyota Innova and premium Innova Crysta. Seating, luggage space and fixed fares side by side."
        path="/fleet"
        schemas={[breadcrumbSchema(BREADCRUMBS), fleetItemListSchema(vehicles || [])]}
      />

      <section className="bg-slate-50 py-12 sm:py-16" aria-labelledby="fleet-page-title">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} className="mb-6" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-600">Our fleet</p>
              <h1 id="fleet-page-title" className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Sedan, SUV, Innova and Innova Crysta cabs for Pune–Mumbai
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Four vehicle classes, one standard: young, well-kept cars driven by verified professionals. Prices
                shown are fixed one-way fares between Pune and Mumbai with tolls included.
              </p>
            </div>
            <Button size="lg" onClick={() => openBooking()} className="shrink-0">
              Book Your Cab
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Vehicle cards */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="vehicles-title">
        <Container>
          <h2 id="vehicles-title" className="sr-only">
            Available vehicles
          </h2>
          {error && <ErrorState message="Couldn't load the fleet." onRetry={refetch} />}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {loading && Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
            {vehicles?.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                detailed
                onBook={(v) => openBooking({ vehicle: v.slug })}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="compare-title">
        <Container>
          <SectionHeading
            id="compare-title"
            eyebrow="Side by side"
            title="Compare cabs at a glance"
            description="Fares are for a one-way Pune ⇄ Mumbai trip and include Expressway tolls and driver allowance. 5% GST extra."
          />
          {vehicles && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
              <table className="w-full min-w-[640px] text-left text-sm">
                <caption className="sr-only">Vehicle comparison: seats, luggage, best use and fares</caption>
                <thead className="bg-brand-900 text-xs uppercase tracking-wider text-brand-100">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold">Vehicle</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Seats</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Luggage</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Best for</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Pune ⇄ Mumbai</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Outstation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-brand-50/40">
                      <th scope="row" className="px-5 py-4 font-bold text-slate-900">
                        {v.name}
                        <span className="block text-xs font-normal text-slate-500">{v.models?.join(" / ") || v.type}</span>
                      </th>
                      <td className="px-5 py-4 text-slate-700">
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-brand-500" aria-hidden="true" />
                          {v.seatingCapacity}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-brand-500" aria-hidden="true" />
                          {v.luggageCapacity} bags
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-700">{v.bestFor}</td>
                      <td className="px-5 py-4 text-lg font-extrabold text-brand-800">{formatCurrency(v.price, v.currency)}</td>
                      <td className="px-5 py-4 text-slate-700">₹{v.pricePerKm}/km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Container>
      </section>

      {/* Choosing guide + standards */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="guide-title">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="guide-title"
              eyebrow="Not sure?"
              title="Which cab should I choose?"
              align="left"
              className="mb-6"
            />
            <ul className="space-y-4">
              {CHOOSING_GUIDE.map((item) => (
                <li key={item.title} className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow="Fleet standards"
              title="What every car in our fleet must pass"
              align="left"
              className="mb-6"
            />
            <ul className="space-y-3">
              {STANDARDS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-slate-600">
              See route-specific fares on{" "}
              <Link to="/pune-to-mumbai-cab" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
                Pune to Mumbai
              </Link>{" "}
              and{" "}
              <Link to="/mumbai-to-pune-cab" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
                Mumbai to Pune
              </Link>
              , or{" "}
              <Link to="/contact" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
                ask us
              </Link>{" "}
              for a custom quote.
            </p>
          </div>
        </Container>
      </section>

      <CTABanner
        title="Found your cab? Lock in today's fixed fare."
        description="Tell us the date and pickup point — we'll confirm the exact car and driver before your trip."
      />
    </>
  );
}
