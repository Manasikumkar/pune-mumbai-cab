import { MessageCircle, Phone } from "lucide-react";
import { site, telLink, whatsappLink } from "../../config/site";

/** Persistent conversion bar for phones (hidden from md: upwards). */
export default function MobileStickyBar() {
  return (
    <div
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-slate-200 bg-white shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.25)] md:hidden"
      role="region"
      aria-label="Quick contact"
    >
      <a
        href={telLink}
        className="flex h-14 items-center justify-center gap-2 bg-brand-700 text-sm font-bold text-white active:bg-brand-800"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        Call Now
      </a>
      <a
        href={whatsappLink(`Hi ${site.name}! I'd like to book a cab.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 items-center justify-center gap-2 bg-whatsapp text-sm font-bold text-white active:bg-whatsapp-dark"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        WhatsApp Us
      </a>
    </div>
  );
}
