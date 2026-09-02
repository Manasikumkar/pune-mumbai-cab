import { cn } from "../../utils/cn";

/**
 * Consistent section header. `as` controls the heading level so pages keep a
 * strict H1 > H2 > H3 hierarchy.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  align = "center",
  light = false,
  className,
  id,
}) {
  return (
    <div
      className={cn(
        "mb-10 max-w-3xl",
        align === "center" && "mx-auto text-center",
        align === "left" && "text-left",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-bold uppercase tracking-[0.18em]",
            light ? "text-accent-300" : "text-accent-600"
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={cn(
          "text-3xl font-extrabold leading-tight sm:text-4xl",
          light ? "text-white" : "text-slate-900"
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", light ? "text-brand-100" : "text-slate-600")}>
          {description}
        </p>
      )}
    </div>
  );
}
