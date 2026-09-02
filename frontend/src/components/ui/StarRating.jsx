import { Star } from "lucide-react";
import { cn } from "../../utils/cn";

export default function StarRating({ rating = 5, max = 5, size = "sm", className }) {
  const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(sizeClass, i < rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200")}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
