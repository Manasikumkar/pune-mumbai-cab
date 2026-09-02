import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Visual breadcrumbs. Pair with breadcrumbSchema() in <SEO> for JSON-LD.
 * @param {Array<{name: string, path: string}>} items — first item should be Home
 */
export default function Breadcrumbs({ items = [], light = false, className }) {
  if (!items.length) return null;
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className={cn("h-3.5 w-3.5", light ? "text-white/50" : "text-slate-400")}
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className={cn("font-medium", light ? "text-white" : "text-slate-900")}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "inline-flex items-center gap-1 transition",
                    light ? "text-white/70 hover:text-white" : "text-slate-500 hover:text-brand-700"
                  )}
                >
                  {index === 0 && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
