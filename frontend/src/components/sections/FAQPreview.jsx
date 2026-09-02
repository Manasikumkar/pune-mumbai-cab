import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { ErrorState, TextSkeleton } from "../ui/Skeleton";
import FAQAccordion from "../faq/FAQAccordion";

/**
 * FAQ section. The parent fetches FAQs (so it can also feed the FAQPage
 * JSON-LD schema) and passes them here.
 */
export default function FAQPreview({
  faqs,
  loading,
  error,
  onRetry,
  eyebrow = "Good to know",
  title = "Frequently asked questions",
  description = "Straight answers about fares, tolls, cancellations and payments.",
  ctaLabel = "Still have a question? Contact us",
  ctaTo = "/contact",
  id = "faq-title",
  className = "bg-white",
}) {
  return (
    <section className={`${className} py-16 sm:py-20`} aria-labelledby={id}>
      <Container className="max-w-4xl">
        <SectionHeading id={id} eyebrow={eyebrow} title={title} description={description} />
        {loading && (
          <div className="space-y-4 rounded-2xl border border-slate-200 p-6">
            <TextSkeleton lines={2} />
            <TextSkeleton lines={2} />
            <TextSkeleton lines={2} />
          </div>
        )}
        {error && <ErrorState message="Couldn't load FAQs." onRetry={onRetry} />}
        {faqs && <FAQAccordion faqs={faqs} />}
        {ctaLabel && (
          <div className="mt-8 text-center">
            <Button variant="ghost" to={ctaTo}>
              {ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
