/**
 * JSON-LD structured-data builders (schema.org).
 * Pass the results to <SEO schemas={[...]} />.
 */
import { site } from "../config/site";

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();

const BUSINESS_ID = `${site.url}/#business`;
const WEBSITE_ID = `${site.url}/#website`;

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    additionalType: "https://schema.org/TaxiService",
    name: site.name,
    legalName: site.legalName,
    description: site.tagline,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: site.defaultOgImage,
    logo: `${site.url}/favicon.svg`,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
    foundingDate: String(site.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    areaServed: ["Pune", "Pimpri-Chinchwad", "Mumbai", "Navi Mumbai", "Thane", "Lonavala"].map((name) => ({
      "@type": "City",
      name,
    })),
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ALL_DAYS, opens: "00:00", closes: "23:59" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phone,
        contactType: "reservations",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi", "Marathi"],
      },
    ],
    sameAs: Object.values(site.social),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    publisher: { "@id": BUSINESS_ID },
    inLanguage: "en-IN",
  };
}

/**
 * @param {object} opts
 * @param {string} opts.name
 * @param {string} opts.description
 * @param {string} opts.path
 * @param {string} opts.origin
 * @param {string} opts.destination
 * @param {number} opts.price       lowest one-way price
 * @param {Array}  [opts.offers]    [{ name, price }] per-vehicle offers
 */
export function serviceSchema({ name, description, path, origin, destination, price, offers = [] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Intercity taxi service",
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": BUSINESS_ID },
    areaServed: [origin, destination].map((city) => ({ "@type": "City", name: city })),
    offers:
      offers.length > 0
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            lowPrice: Math.min(...offers.map((o) => o.price)),
            highPrice: Math.max(...offers.map((o) => o.price)),
            offerCount: offers.length,
            offers: offers.map((o) => ({
              "@type": "Offer",
              name: o.name,
              price: o.price,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: absoluteUrl(path),
            })),
          }
        : {
            "@type": "Offer",
            price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(path),
          },
  };
}

export function faqPageSchema(faqs = []) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** @param {Array<{name: string, path: string}>} items */
export function breadcrumbSchema(items = []) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Vehicle list as an ItemList of Products (fleet page). */
export function fleetItemListSchema(vehicles = []) {
  if (!vehicles.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Pune Mumbai Cab fleet",
    itemListElement: vehicles.map((v, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: `${v.name} cab (${v.seatingCapacity} seater)`,
        description: v.description,
        image: v.image,
        offers: {
          "@type": "Offer",
          price: v.price,
          priceCurrency: v.currency || "INR",
          availability: "https://schema.org/InStock",
          url: absoluteUrl("/fleet"),
        },
      },
    })),
  };
}
