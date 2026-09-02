import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { site } from "../../config/site";
import { absoluteUrl } from "../../utils/schema";

/**
 * index.html ships a static <title>/<meta description> as a no-JS fallback.
 * React 19 hoists Helmet's tags natively but doesn't dedupe against static
 * markup, so we drop the fallbacks once the first <SEO> mounts.
 */
function removeStaticSeoTags() {
  document.querySelectorAll("head > [data-static-seo]").forEach((el) => el.remove());
}

/**
 * Per-page SEO head manager.
 *
 * @param {string}  title        Page title (brand suffix appended automatically)
 * @param {string}  description  Meta description (≤160 chars recommended)
 * @param {string}  path         Route path used for the canonical + og:url
 * @param {string}  [image]      Absolute OG image URL
 * @param {string}  [type]       og:type — "website" | "article"
 * @param {boolean} [noIndex]    Set true for 404 / utility pages
 * @param {Array}   [schemas]    JSON-LD objects (see utils/schema.js)
 */
export default function SEO({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noIndex = false,
  schemas = [],
}) {
  const fullTitle = title
    ? title.includes(site.name)
      ? title
      : `${title} | ${site.name}`
    : `${site.name} | ${site.tagline}`;
  const canonical = absoluteUrl(path);
  const ogImage = image || site.defaultOgImage;
  const jsonLd = schemas.filter(Boolean);

  useEffect(() => {
    removeStaticSeoTags();
  }, []);

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Geo / local */}
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Pune, Maharashtra" />

      {jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
