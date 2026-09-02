import { Link } from "react-router-dom";
import { ArrowRight, Award, HeartHandshake, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { getCompanyStats } from "../services/api";
import { useAsyncData } from "../hooks/useAsyncData";
import { site } from "../config/site";
import { useBookingModal } from "../context/BookingModalContext";
import { breadcrumbSchema, localBusinessSchema } from "../utils/schema";
import SEO from "../components/seo/SEO";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import LazyImage from "../components/ui/LazyImage";
import SectionHeading from "../components/ui/SectionHeading";
import { Skeleton } from "../components/ui/Skeleton";
import CTABanner from "../components/sections/CTABanner";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
];

const VALUES = [
  { icon: ShieldCheck, title: "Safety before speed", text: "Speed-governed cars, breathalyser checks before night trips and drivers who are rested — we'd rather be ten minutes late than take a risk on the ghats." },
  { icon: HeartHandshake, title: "Honest, fixed pricing", text: "The fare we quote is the fare you pay. Tolls and driver allowance are included; there's no meter, no surge and no return charge." },
  { icon: Award, title: "Drivers we're proud of", text: "Police verification, 5+ years of Expressway experience, a soft-skills course and a monthly rating review. Our top drivers stay for years." },
  { icon: Sparkles, title: "Details matter", text: "Cars are cleaned before every pickup, drivers arrive 10 minutes early, and someone real answers the phone at 3 AM." },
];

const SERVICE_AREAS = [
  { region: "Pune", areas: "Hinjewadi, Wakad, Baner, Aundh, Kothrud, Shivajinagar, Camp, Koregaon Park, Kharadi, Viman Nagar, Hadapsar, Magarpatta, Katraj, Pune Airport" },
  { region: "Pimpri-Chinchwad", areas: "Pimpri, Chinchwad, Nigdi, Akurdi, Ravet, Talegaon, Chakan MIDC" },
  { region: "Mumbai", areas: "Airport T1 & T2, Andheri, Bandra, BKC, Powai, Dadar, Lower Parel, Worli, Colaba, Borivali, Malad" },
  { region: "Navi Mumbai & Thane", areas: "Navi Mumbai Airport, Vashi, Nerul, Belapur, Kharghar, Panvel, Thane, Mulund, Ghodbunder Road" },
  { region: "En route", areas: "Lonavala, Khandala, Khopoli, Talegaon, Karla" },
];

const STORY_IMAGE =
  "https://images.pexels.com/photos/14124346/pexels-photo-14124346.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=800";
const AREA_IMAGE =
  "https://images.pexels.com/photos/990978/pexels-photo-990978.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=700";

export default function AboutPage() {
  const { data: stats } = useAsyncData(() => getCompanyStats(), []);
  const { openBooking } = useBookingModal();

  return (
    <>
      <SEO
        title="About Pune Mumbai Cab | Trusted Intercity Taxi Since 2014"
        description="Pune Mumbai Cab has run fixed-fare intercity taxis between Pune and Mumbai since 2014 — 25,000+ trips, verified drivers, a young fleet and 24×7 human support. Meet the team and see where we operate."
        path="/about"
        schemas={[breadcrumbSchema(BREADCRUMBS), localBusinessSchema()]}
      />

      <section className="bg-slate-50 py-12 sm:py-16" aria-labelledby="about-title">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} className="mb-6" />
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-600">About us</p>
            <h1 id="about-title" className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              The Pune–Mumbai cab company built on one promise: drivers you'd trust with your parents
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              We're a Pune-based team that has done one thing since {site.foundedYear} — move people safely and
              honestly between Pune and Mumbai. No app surge, no bidding, no strangers. Just fixed fares and
              professionals who know every curve of the Expressway.
            </p>
            <Button size="lg" className="mt-6" onClick={() => openBooking()}>
              Book Your Cab
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="story-title">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <LazyImage
            src={STORY_IMAGE}
            alt="Smiling Indian family seated together in the back of a cab, ready for a road trip"
            width={1000}
            height={800}
            wrapperClassName="aspect-[5/4] rounded-3xl shadow-card"
          />
          <div>
            <SectionHeading id="story-title" eyebrow="Our story" title="From one Innova to a fleet of forty" align="left" className="mb-6" />
            <div className="space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                In {site.foundedYear}, founder Santosh Jadhav was driving his own Toyota Innova between Hinjewadi and
                Mumbai Airport for IT professionals who were tired of unreliable pickups and last-minute price hikes.
                His rule was simple: quote a fixed fare, arrive early, drive carefully.
              </p>
              <p>
                Word spread through office WhatsApp groups. Within three years we had twelve cars and a small
                24×7 desk in Hinjewadi. Today the fleet spans sedans, SUVs, Innovas and Innova Crystas, and we've
                completed over 25,000 trips — yet every driver is still onboarded personally by Santosh.
              </p>
              <p>
                We deliberately stayed focused on one corridor. Knowing the Expressway intimately — which exit to
                take on a Friday evening, where the fog sits in December, when the Food Mall queues are shortest —
                is what makes the difference between a ride and a good ride.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission + stats */}
      <section className="bg-brand-950 py-16 text-white sm:py-20" aria-labelledby="mission-title">
        <Container>
          <SectionHeading
            id="mission-title"
            eyebrow="Our mission"
            title="Make the 150 km between Pune and Mumbai the easiest part of your day"
            description="Whether it's a 4 AM flight, a client pitch or a family wedding, you should be able to book in a minute, know the price upfront and relax for three hours."
            light
          />
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {(stats || Array.from({ length: 4 })).map((stat, index) =>
              stat ? (
                <div key={stat.id} className="rounded-2xl bg-white/10 p-6 text-center ring-1 ring-white/10">
                  <dd className="text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</dd>
                  <dt className="mt-1 text-sm text-brand-200">{stat.label}</dt>
                </div>
              ) : (
                <div key={index} className="rounded-2xl bg-white/10 p-6">
                  <Skeleton className="mx-auto h-9 w-24 bg-white/20" />
                  <Skeleton className="mx-auto mt-3 h-3 w-20 bg-white/20" />
                </div>
              )
            )}
          </dl>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="values-title">
        <Container>
          <SectionHeading id="values-title" eyebrow="What we stand for" title="Four things we never compromise on" />
          <ul className="grid gap-6 md:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-5 rounded-2xl border border-slate-200 p-6 shadow-card">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Service area */}
      <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="area-title">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="area-title"
              eyebrow="Service area"
              title="Where we operate"
              description="Doorstep pickup and drop across the entire Pune–Mumbai corridor at one fixed fare."
              align="left"
              className="mb-6"
            />
            <ul className="space-y-3">
              {SERVICE_AREAS.map((item) => (
                <li key={item.region} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-slate-900">{item.region}</h3>
                    <p className="mt-0.5 text-sm text-slate-600">{item.areas}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-600">
              Explore fares for{" "}
              <Link to="/pune-to-mumbai-cab" className="font-semibold text-brand-800 hover:underline">
                Pune to Mumbai
              </Link>{" "}
              and{" "}
              <Link to="/mumbai-to-pune-cab" className="font-semibold text-brand-800 hover:underline">
                Mumbai to Pune
              </Link>
              , or browse{" "}
              <Link to="/fleet" className="font-semibold text-brand-800 hover:underline">
                our fleet
              </Link>
              .
            </p>
          </div>
          <div className="lg:sticky lg:top-28">
            <LazyImage
              src={AREA_IMAGE}
              alt="Night-time highway light trails leading towards a glowing city skyline"
              width={1000}
              height={700}
              wrapperClassName="aspect-[10/7] rounded-3xl shadow-card"
            />
            <address className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm not-italic text-slate-600">
              <p className="font-bold text-slate-900">{site.legalName}</p>
              <p className="mt-1">
                {site.address.street}, {site.address.locality} {site.address.postalCode}, {site.address.region}
              </p>
              <p className="mt-1">Open {site.hours}</p>
            </address>
          </div>
        </Container>
      </section>

      <CTABanner
        title="Twelve years, 25,000 trips, one standard. Ride with us."
        description="Book online, by phone or on WhatsApp — a real person confirms every trip."
      />
    </>
  );
}
