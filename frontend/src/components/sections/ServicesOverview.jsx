import { Link } from "react-router-dom";
import { ArrowRight, MoveRight, Plane, Repeat, Route } from "lucide-react";
import { getServices } from "../../services/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatCurrency } from "../../utils/formatters";
import { cn } from "../../utils/cn";
import Container from "../ui/Container";
import LazyImage from "../ui/LazyImage";
import SectionHeading from "../ui/SectionHeading";
import { ErrorState, Skeleton } from "../ui/Skeleton";

const ICONS = { route: Route, "route-reverse": Route, "one-way": MoveRight, "round-trip": Repeat, plane: Plane };

const IMAGES = {
  "pune-to-mumbai": "https://images.pexels.com/photos/33898148/pexels-photo-33898148.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=450",
  "mumbai-to-pune": "https://images.pexels.com/photos/33350001/pexels-photo-33350001.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=450",
  "one-way": "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=450",
  "round-trip": "https://images.pexels.com/photos/14124346/pexels-photo-14124346.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=450",
  "airport-transfer": "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=450",
};

export default function ServicesOverview() {
  const { data: services, loading, error, refetch } = useAsyncData(() => getServices(), []);

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="services-title">
      <Container>
        <SectionHeading
          id="services-title"
          eyebrow="Our services"
          title="Every kind of Pune–Mumbai trip"
          description="One-way, round trip and airport transfers — one trusted cab partner."
        />

        {error && <ErrorState message="Couldn't load services." onRetry={refetch} />}

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {loading && Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="overflow-hidden rounded-2xl border border-slate-100">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="p-4"><Skeleton className="h-5 w-3/4" /><Skeleton className="mt-2 h-4 w-full" /></div>
            </li>
          ))}
          {services?.map((service) => {
            const Icon = ICONS[service.icon] || Route;
            const flip = service.icon === "route-reverse";
            const img = IMAGES[service.slug];

            return (
              <li key={service.id}>
                <Link
                  to={service.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {img ? (
                      <LazyImage src={img} alt={service.name} width={600} height={450} wrapperClassName="aspect-[4/3]" className="transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-brand-50">
                        <Icon className={cn("h-10 w-10 text-brand-300", flip && "-scale-x-100")} />
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 rounded-xl bg-white/95 px-3 py-1.5 text-sm font-bold text-brand-800 shadow-md backdrop-blur">
                      From {formatCurrency(service.startingPrice)}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center gap-2">
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white")}>
                        <Icon className={cn("h-4 w-4", flip && "-scale-x-100")} />
                      </span>
                      <h3 className="font-bold text-slate-900">{service.name}</h3>
                    </div>
                    <p className="mt-1.5 flex-1 text-xs text-slate-500 line-clamp-1">{service.description}</p>
                    <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-700">
                      Details <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
