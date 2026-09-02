import { Link } from "react-router-dom";
import { CarTaxiFront, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { navLinks, site, telLink, whatsappLink } from "../../config/site";
import Container from "../ui/Container";

/* Brand glyphs (lucide no longer ships brand icons) */
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4V14h2.8v8h3.3z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const popularRoutes = [
  { label: "Pune to Mumbai Cab", to: "/pune-to-mumbai-cab" },
  { label: "Mumbai to Pune Cab", to: "/mumbai-to-pune-cab" },
  { label: "Pune to Mumbai Airport Drop", to: "/pune-to-mumbai-cab#airport" },
  { label: "Mumbai Airport to Pune Pickup", to: "/mumbai-to-pune-cab#airport" },
  { label: "Hinjewadi to Mumbai Taxi", to: "/pune-to-mumbai-cab#pickup-points" },
  { label: "Innova Crysta Pune–Mumbai", to: "/fleet" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-brand-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5" aria-label={`${site.name} — home`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <CarTaxiFront className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold text-white">Pune Mumbai Cab</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-brand-200">
            Fixed-fare intercity taxis between Pune and Mumbai since {site.foundedYear}. Verified drivers, clean
            cars and honest pricing — tolls included, no return fare on one-way trips.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        <nav aria-labelledby="footer-quick-links">
          <h2 id="footer-quick-links" className="text-sm font-bold uppercase tracking-wider text-white">
            Quick links
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-brand-200 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-routes">
          <h2 id="footer-routes" className="text-sm font-bold uppercase tracking-wider text-white">
            Popular routes
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {popularRoutes.map((route) => (
              <li key={route.label}>
                <Link to={route.to} className="text-brand-200 transition hover:text-white">
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="not-italic">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-brand-200">
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
              <a href={telLink} className="font-semibold text-white hover:underline">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
              <span>
                {site.address.street}, {site.address.locality} {site.address.postalCode}, {site.address.region}
              </span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
              <span>Open {site.hours}</span>
            </li>
          </ul>
        </address>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-start justify-between gap-2 py-5 text-xs text-brand-300 sm:flex-row sm:items-center">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p>
            Serving Pune · PCMC · Mumbai · Navi Mumbai · Thane · Lonavala. Photos via{" "}
            <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Pexels
            </a>
            .
          </p>
        </Container>
      </div>
    </footer>
  );
}
