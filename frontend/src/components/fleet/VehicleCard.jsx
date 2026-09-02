import { Briefcase, Check, Snowflake, Users } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { cn } from "../../utils/cn";
import Button from "../ui/Button";
import LazyImage from "../ui/LazyImage";

const VEHICLE_IMAGES = {
  sedan: "https://images.pexels.com/photos/9544521/pexels-photo-9544521.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=700",
  suv: "https://images.pexels.com/photos/17612417/pexels-photo-17612417.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=700",
  innova: "https://images.pexels.com/photos/30195580/pexels-photo-30195580.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=700",
  "innova-crysta": "https://images.pexels.com/photos/37029578/pexels-photo-37029578.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=700",
};
const DEFAULT_IMAGE = "https://images.pexels.com/photos/9544521/pexels-photo-9544521.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=700";

export default function VehicleCard({ vehicle, onBook, detailed = false, className }) {
  const imgSrc = (() => {
    const url = vehicle.image || vehicle.imageUrl;
    if (!url || url.startsWith("/")) return VEHICLE_IMAGES[vehicle.slug] || DEFAULT_IMAGE;
    return url;
  })();

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-card-hover",
        className
      )}
    >
      {/* Large image */}
      <div className="relative">
        <LazyImage
          src={imgSrc}
          alt={vehicle.imageAlt || `${vehicle.name} cab`}
          width={900}
          height={700}
          wrapperClassName="aspect-[4/3]"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {vehicle.isPopular && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
            Most popular
          </span>
        )}
        <div className="absolute bottom-3 right-3 rounded-xl bg-brand-800/90 px-3 py-2 text-right shadow-lg backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-200">From</p>
          <p className="text-xl font-extrabold leading-none text-white">
            {formatCurrency(vehicle.price, vehicle.currency)}
          </p>
        </div>
      </div>

      {/* Compact info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold text-slate-900">{vehicle.name}</h3>

        <div className="mt-2.5 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4 text-brand-500" /> {vehicle.seatingCapacity} seats
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-4 w-4 text-brand-500" /> {vehicle.luggageCapacity || 2} bags
          </span>
          <span className="inline-flex items-center gap-1">
            <Snowflake className="h-4 w-4 text-brand-500" /> AC
          </span>
        </div>

        {detailed && vehicle.description && (
          <p className="mt-2.5 text-sm text-slate-500 line-clamp-2">{vehicle.description}</p>
        )}

        {detailed && (vehicle.features || []).length > 0 && (
          <ul className="mt-3 grid grid-cols-1 gap-1 text-xs text-slate-600 sm:grid-cols-2">
            {vehicle.features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-center gap-1.5">
                <Check className="h-3 w-3 shrink-0 text-green-600" /> {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4">
          <Button fullWidth onClick={() => onBook?.(vehicle)}>
            Book {vehicle.name}
          </Button>
        </div>
      </div>
    </article>
  );
}
