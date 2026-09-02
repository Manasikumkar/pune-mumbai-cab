import { useState } from "react";
import { cn } from "../../utils/cn";

/**
 * Image with native lazy-loading, async decoding and a soft fade-in.
 * Pass `priority` for above-the-fold images (hero) to load eagerly.
 */
export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  wrapperClassName,
  priority = false,
  sizes,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-slate-200", wrapperClassName)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
}
