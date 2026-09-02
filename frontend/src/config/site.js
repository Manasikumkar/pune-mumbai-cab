/**
 * Business / brand configuration.
 * These are deployment-level constants (not API data). Update before go-live.
 */
export const site = {
  name: "Pune Mumbai Cab",
  legalName: "Pune Mumbai Cab Services",
  tagline: "Reliable intercity taxi between Pune & Mumbai — 24×7",
  // TODO: replace with the production domain before deploying
  url: "https://www.punemumbaicab.com",
  phone: "+919876543210",
  phoneDisplay: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "bookings@punemumbaicab.com",
  address: {
    street: "Office 12, Rajiv Gandhi Infotech Park, Hinjewadi Phase 1",
    locality: "Pune",
    region: "Maharashtra",
    postalCode: "411057",
    country: "IN",
  },
  geo: { latitude: 18.5912, longitude: 73.7389 },
  hours: "24×7, 365 days",
  foundedYear: 2014,
  social: {
    facebook: "https://www.facebook.com/punemumbaicab",
    instagram: "https://www.instagram.com/punemumbaicab",
    google: "https://g.page/punemumbaicab",
  },
  defaultOgImage:
    "https://images.pexels.com/photos/33898148/pexels-photo-33898148.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=630",
};

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Pune → Mumbai", to: "/pune-to-mumbai-cab" },
  { label: "Mumbai → Pune", to: "/mumbai-to-pune-cab" },
  { label: "Our Fleet", to: "/fleet" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const telLink = `tel:${site.phone}`;

export const whatsappLink = (
  message = "Hi! I'd like to book a cab between Pune and Mumbai."
) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
