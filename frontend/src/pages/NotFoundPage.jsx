import { Link } from "react-router-dom";
import { ArrowRight, CarTaxiFront, Phone } from "lucide-react";
import { site, telLink } from "../config/site";
import SEO from "../components/seo/SEO";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";

const LINKS = [
  { to: "/pune-to-mumbai-cab", label: "Pune to Mumbai cab fares" },
  { to: "/mumbai-to-pune-cab", label: "Mumbai to Pune cab & airport pickups" },
  { to: "/fleet", label: "Compare our fleet" },
  { to: "/contact", label: "Book a cab" },
];

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Book a Pune to Mumbai or Mumbai to Pune cab from our home page."
        path="/404"
        noIndex
      />
      <section className="bg-slate-50 py-20 sm:py-28" aria-labelledby="nf-title">
        <Container className="max-w-2xl text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-700 text-white shadow-lg">
            <CarTaxiFront className="h-10 w-10" aria-hidden="true" />
          </span>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-accent-600">Error 404</p>
          <h1 id="nf-title" className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Looks like this page took a wrong exit
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            The page you're looking for doesn't exist or has moved. Let's get you back on the Expressway.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" to="/">
              Back to home
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" href={telLink}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              {site.phoneDisplay}
            </Button>
          </div>
          <nav aria-label="Helpful links" className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Popular pages</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-800 transition hover:border-brand-300 hover:bg-brand-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>
    </>
  );
}
