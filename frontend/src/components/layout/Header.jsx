import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { CarTaxiFront, Clock, Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import { navLinks, site, telLink, whatsappLink } from "../../config/site";
import { useBookingModal } from "../../context/BookingModalContext";
import { cn } from "../../utils/cn";
import Button from "../ui/Button";
import Container from "../ui/Container";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openBooking } = useBookingModal();
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="hidden bg-brand-900 text-brand-100 md:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <p className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
            24×7 Pune ⇄ Mumbai taxi · Fixed fares · Tolls included
          </p>
          <div className="flex items-center gap-5">
            <a href={`mailto:${site.email}`} className="flex items-center gap-1.5 hover:text-white">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {site.email}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              WhatsApp
            </a>
            <a href={telLink} className="flex items-center gap-1.5 font-semibold text-white">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {site.phoneDisplay}
            </a>
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "border-b bg-white/95 backdrop-blur transition-shadow",
          scrolled ? "border-slate-200 shadow-md shadow-slate-900/5" : "border-transparent"
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Link to="/" className="flex items-center gap-2.5" aria-label={`${site.name} — home`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
              <CarTaxiFront className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold tracking-tight text-brand-900 sm:text-lg">
                Pune Mumbai Cab
              </span>
              <span className="hidden text-[11px] font-medium uppercase tracking-wider text-slate-500 sm:block">
                Intercity taxi service
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "rounded-lg px-3 py-2 text-sm font-semibold transition",
                        isActive ? "bg-brand-50 text-brand-800" : "text-slate-600 hover:bg-slate-50 hover:text-brand-800"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={telLink}
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-brand-800 hover:bg-brand-50 xl:flex"
            >
              <Phone className="h-4 w-4 text-accent-500" aria-hidden="true" />
              {site.phoneDisplay}
            </a>
            <Button onClick={() => openBooking()} className="hidden sm:inline-flex" size="md">
              Book Your Cab
            </Button>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </Container>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={cn(
            "overflow-hidden border-t border-slate-100 bg-white transition-[max-height] duration-300 lg:hidden",
            menuOpen ? "max-h-[32rem]" : "max-h-0 border-t-0"
          )}
        >
          <nav aria-label="Mobile" className="px-4 py-3">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-lg px-3 py-2.5 text-[15px] font-semibold",
                        isActive ? "bg-brand-50 text-brand-800" : "text-slate-700 hover:bg-slate-50"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <Button variant="outline" href={telLink} size="md">
                <Phone className="h-4 w-4" aria-hidden="true" /> Call
              </Button>
              <Button onClick={() => openBooking()} size="md">
                Book Your Cab
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
