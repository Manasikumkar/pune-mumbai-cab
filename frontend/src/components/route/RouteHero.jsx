import { ArrowRight, Phone } from "lucide-react";
import { site, telLink } from "../../config/site";
import { useBookingModal } from "../../context/BookingModalContext";
import Breadcrumbs from "../ui/Breadcrumbs";
import Button from "../ui/Button";
import Container from "../ui/Container";
import LazyImage from "../ui/LazyImage";
import RouteQuickFacts from "./RouteQuickFacts";

/**
 * Page header for route landing pages. Contains the page's single <h1>.
 */
export default function RouteHero({ route, breadcrumbs, title, intro, badge, image, imageAlt }) {
  const { openBooking } = useBookingModal();
  const bookingDefaults = route ? { pickup: route.origin, drop: route.destination } : {};

  return (
    <section className="relative overflow-hidden bg-brand-950 text-white" aria-labelledby="route-title">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 10% 10%, rgba(63,158,199,0.5), transparent 50%), radial-gradient(ellipse at 90% 90%, rgba(249,115,22,0.35), transparent 45%)",
        }}
        aria-hidden="true"
      />
      <Container className="relative grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
        <div>
          <Breadcrumbs items={breadcrumbs} light className="mb-6" />
          {badge && (
            <p className="inline-flex items-center rounded-full bg-accent-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-300 ring-1 ring-accent-400/30">
              {badge}
            </p>
          )}
          <h1 id="route-title" className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">{intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => openBooking(bookingDefaults)}>
              Book Your Cab
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline-white" href={telLink}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              {site.phoneDisplay}
            </Button>
          </div>
          <RouteQuickFacts route={route} className="mt-10" />
        </div>
        <LazyImage
          src={image || route?.image || (route?.slug === 'mumbai-to-pune-cab' ? 'https://images.pexels.com/photos/33350001/pexels-photo-33350001.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800' : 'https://images.pexels.com/photos/33898148/pexels-photo-33898148.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800')}
          alt={imageAlt || route?.imageAlt || 'Pune Mumbai Expressway route'}
          width={1200}
          height={800}
          priority
          wrapperClassName="aspect-[4/3] rounded-3xl shadow-2xl ring-1 ring-white/10 lg:aspect-[5/4]"
        />
      </Container>
    </section>
  );
}
