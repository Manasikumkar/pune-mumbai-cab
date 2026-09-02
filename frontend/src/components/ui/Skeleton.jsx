import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "../../utils/cn";

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-lg bg-slate-200/80", className)} aria-hidden="true" />;
}

export function CardSkeleton({ className }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-slate-100 bg-white", className)}>
      <Skeleton className="aspect-[3/2] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3, className }) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/** Inline error state with retry — used wherever a data fetch can fail. */
export function ErrorState({ message = "Something went wrong while loading.", onRetry, className }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center",
        className
      )}
    >
      <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
      <p className="text-sm font-medium text-red-800">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-100"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  );
}
