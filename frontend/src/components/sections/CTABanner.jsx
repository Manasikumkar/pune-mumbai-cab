import { MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { site, telLink, whatsappLink } from "../../config/site";
import { useBookingModal } from "../../context/BookingModalContext";
import Button from "../ui/Button";
import Container from "../ui/Container";

const CTA_BG =
  "https://images.pexels.com/photos/36377043/pexels-photo-36377043.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=600";

/**
 * Conversion banner shown at the bottom of every page.
 * `bookingDefaults` pre-fills the modal (e.g. { pickup: "Mumbai", drop: "Pune" }).
 */
export default function CTABanner({
  title = "Ready to ride? Book your Pune–Mumbai cab in 60 seconds.",
  description = "Fixed fares with tolls included, verified drivers and on-time pickups — 24×7, 365 days.",
  bookingDefaults = {},
  headingLevel: Heading = "h2",
}) {
  const { openBooking } = useBookingModal();

  return (
    <section aria-labelledby="cta-banner-title" className="relative overflow-hidden">
      {/* Background image */}
      <img
        src={CTA_BG}
        alt=""
        width={1920}
        height={600}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
      />
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-brand-900/85"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 20%, rgba(63,158,199,0.6), transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(249,115,22,0.45), transparent 50%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/15">
            <ShieldCheck className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
            No advance payment · Free cancellation up to 6 hours before pickup
          </p>
          <Heading id="cta-banner-title" className="text-3xl font-extrabold text-white sm:text-4xl">
            {title}
          </Heading>
          <p className="mt-3 text-base text-brand-100 sm:text-lg">{description}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
          <Button size="lg" onClick={() => openBooking(bookingDefaults)}>
            Book Your Cab
          </Button>
          <Button size="lg" variant="outline-white" href={telLink}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            {site.phoneDisplay}
          </Button>
          <Button size="lg" variant="whatsapp" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </Button>
        </div>
      </Container>
    </section>
  );
}
