import { getTestimonials } from "../../services/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import StarRating from "../ui/StarRating";
import { ErrorState, Skeleton } from "../ui/Skeleton";
import TestimonialCard from "../testimonials/TestimonialCard";

export default function TestimonialsSection({ limit = 6 }) {
  const { data: testimonials, loading, error, refetch } = useAsyncData(() => getTestimonials({ limit }), [limit]);

  const average =
    testimonials && testimonials.length
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : null;

  return (
    <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="testimonials-title">
      <Container>
        <SectionHeading
          id="testimonials-title"
          eyebrow="Customer stories"
          title="Rated 4.8 by travellers who ride with us every week"
          description="Real feedback from airport runs, family weekends and corporate trips between Pune and Mumbai."
        />

        {average && (
          <div className="mb-8 flex items-center justify-center gap-3 text-sm text-slate-600">
            <StarRating rating={Math.round(Number(average))} size="lg" />
            <span>
              <span className="font-bold text-slate-900">{average} / 5</span> from recent reviews
            </span>
          </div>
        )}

        {error && <ErrorState message="Couldn't load reviews." onRetry={refetch} />}

        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="rounded-2xl border border-slate-100 bg-white p-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
                <Skeleton className="mt-6 h-10 w-40" />
              </li>
            ))}
          {testimonials?.map((testimonial) => (
            <li key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
