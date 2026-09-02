import { Quote } from "lucide-react";
import StarRating from "../ui/StarRating";
import LazyImage from "../ui/LazyImage";
import { cn } from "../../utils/cn";

const LOCATION_IMAGES = {
  "Hinjewadi, Pune": "https://images.pexels.com/photos/14124346/pexels-photo-14124346.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=200",
  "Andheri West, Mumbai": "https://images.pexels.com/photos/33350001/pexels-photo-33350001.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=200",
  "Kothrud, Pune": "https://images.pexels.com/photos/34234571/pexels-photo-34234571.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=200",
  "Thane West": "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=200",
  "Powai, Mumbai": "https://images.pexels.com/photos/33898148/pexels-photo-33898148.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=200",
  "Baner, Pune": "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=200",
};

const initials = (name = "") =>
  name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

export default function TestimonialCard({ testimonial, className }) {
  const { name, location, rating, text, tripType } = testimonial;
  const bgImage = LOCATION_IMAGES[location];

  return (
    <figure
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card",
        className
      )}
    >
      {bgImage && (
        <div className="relative h-28 overflow-hidden">
          <LazyImage
            src={bgImage}
            alt={`${location} cityscape`}
            width={400}
            height={120}
            wrapperClassName="h-28"
            className="transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 to-transparent" />
          <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between">
            <StarRating rating={rating} />
            <Quote className="h-5 w-5 text-white/60" />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        {!bgImage && <StarRating rating={rating} />}
        <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-slate-700 line-clamp-3">
          "{text}"
        </blockquote>
        <figcaption className="mt-3 flex items-center gap-2.5 border-t border-slate-100 pt-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
            {initials(name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{name}</p>
            <p className="truncate text-xs text-slate-500">{location}{tripType ? ` · ${tripType}` : ""}</p>
          </div>
        </figcaption>
      </div>
    </figure>
  );
}
