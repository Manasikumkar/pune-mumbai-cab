import { BadgeIndianRupee, Clock3, Milestone, Receipt } from "lucide-react";
import { formatCurrency, formatDistance } from "../../utils/formatters";
import { cn } from "../../utils/cn";
import { Skeleton } from "../ui/Skeleton";

/** Distance / time / fare / toll strip — with fallback values if backend data is incomplete. */
export default function RouteQuickFacts({ route, className, light = true }) {
  const facts = route
    ? [
        { icon: Milestone, label: "Distance", value: formatDistance(route.distance || 150, route.distanceUnit || "km") || "150 km" },
        { icon: Clock3, label: "Travel time", value: route.travelTime || "3 – 3.5 hours" },
        { icon: BadgeIndianRupee, label: "One way from", value: formatCurrency(route.oneWayPrice || 2499, route.currency || "INR") || "₹2,499" },
        { icon: Receipt, label: "Toll", value: route.tollAmount ? `${formatCurrency(route.tollAmount, route.currency)} included` : "₹336 included" },
      ]
    : null;

  return (
    <dl className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {(facts || Array.from({ length: 4 })).map((fact, index) =>
        fact ? (
          <div
            key={fact.label}
            className={cn(
              "rounded-2xl p-3.5",
              light ? "bg-white/10 ring-1 ring-white/15 backdrop-blur" : "bg-slate-50 ring-1 ring-slate-200"
            )}
          >
            <dt
              className={cn(
                "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider",
                light ? "text-brand-200" : "text-slate-500"
              )}
            >
              <fact.icon className={cn("h-3.5 w-3.5", light ? "text-accent-400" : "text-brand-600")} aria-hidden="true" />
              {fact.label}
            </dt>
            <dd className={cn("mt-1 text-base font-extrabold sm:text-lg", light ? "text-white" : "text-slate-900")}>
              {fact.value}
            </dd>
          </div>
        ) : (
          <div key={index} className={cn("rounded-2xl p-3.5", light ? "bg-white/10" : "bg-slate-50")}>
            <Skeleton className={cn("h-3 w-16", light && "bg-white/20")} />
            <Skeleton className={cn("mt-2 h-5 w-24", light && "bg-white/20")} />
          </div>
        )
      )}
    </dl>
  );
}
