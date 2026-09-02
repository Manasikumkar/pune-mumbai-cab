import { useSearchParams } from "react-router-dom";
import { CalendarCheck, Clock, Mail, MapPin, MessageCircle, Phone, ShieldCheck, UserRoundCheck } from "lucide-react";
import { site, telLink, whatsappLink } from "../config/site";
import { breadcrumbSchema, localBusinessSchema } from "../utils/schema";
import SEO from "../components/seo/SEO";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import Container from "../components/ui/Container";
import BookingForm from "../components/booking/BookingForm";
import CTABanner from "../components/sections/CTABanner";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Contact & Booking", path: "/contact" },
];

const STEPS = [
  { icon: CalendarCheck, title: "Send your request", text: "Fill the form, call or WhatsApp. Takes under a minute." },
  { icon: UserRoundCheck, title: "We confirm the fare & driver", text: "A real person confirms within 15 minutes, 24×7." },
  { icon: ShieldCheck, title: "Driver details 2 hours before", text: "Name, photo, car number and live tracking link on WhatsApp." },
];

const ALLOWED_PARAMS = ["pickup", "drop", "vehicle", "tripType", "travelDate", "passengers"];

export default function ContactPage() {
  const [searchParams] = useSearchParams();

  // Allow deep links like /contact?tripType=round-trip&vehicle=suv to pre-fill the form.
  const defaults = ALLOWED_PARAMS.reduce((acc, key) => {
    const value = searchParams.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});

  const contactCards = [
    { icon: Phone, label: "Call us (24×7)", value: site.phoneDisplay, href: telLink, external: false },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat with the booking desk", href: whatsappLink(), external: true },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}`, external: false },
    {
      icon: MapPin,
      label: "Office",
      value: `${site.address.street}, ${site.address.locality} ${site.address.postalCode}`,
      href: null,
    },
    { icon: Clock, label: "Hours", value: `Open ${site.hours}`, href: null },
  ];

  return (
    <>
      <SEO
        title="Book a Cab or Contact Us | Pune Mumbai Cab — 24×7 Booking Desk"
        description="Book your Pune–Mumbai cab online or call +91 98765 43210. Enquiry form for one-way, round-trip and airport transfers; confirmation within 15 minutes, 24×7 on call and WhatsApp."
        path="/contact"
        schemas={[breadcrumbSchema(BREADCRUMBS), localBusinessSchema()]}
      />

      <section className="bg-slate-50 py-12 sm:py-16" aria-labelledby="contact-title">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} className="mb-6" />
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-600">Contact & booking</p>
            <h1 id="contact-title" className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Book your cab or ask us anything
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Fill in the trip details below and we'll confirm your fixed fare and driver within 15 minutes. Prefer
              to talk? Our Pune desk answers calls and WhatsApp around the clock.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20" aria-labelledby="form-title">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Reach the booking desk</h2>
            <ul className="mt-6 space-y-3">
              {contactCards.map(({ icon: Icon, label, value, href, external }) => {
                const content = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
                      <span className="block break-words text-[15px] font-semibold text-slate-900">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50/40"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <h3 className="mt-10 text-lg font-bold text-slate-900">How booking works</h3>
            <ol className="mt-4 space-y-4">
              {STEPS.map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="flex gap-4">
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="text-sm text-slate-600">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Booking form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <h2 id="form-title" className="text-2xl font-bold text-slate-900">
              Booking & enquiry form
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fields marked <span className="text-accent-600">*</span> are required. No advance payment needed.
            </p>
            <div className="mt-6">
              <BookingForm key={searchParams.toString()} defaultValues={defaults} source="contact-page" />
            </div>
          </div>
        </Container>
      </section>

      <CTABanner
        title="In a hurry? Call or WhatsApp — we confirm in minutes."
        description="Our booking desk in Hinjewadi is staffed 24×7, including holidays."
      />
    </>
  );
}
