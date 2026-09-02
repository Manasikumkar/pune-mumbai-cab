import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-accent-500 text-white shadow-sm shadow-accent-500/30 hover:bg-accent-600 active:bg-accent-700",
  secondary:
    "bg-brand-700 text-white shadow-sm shadow-brand-900/20 hover:bg-brand-800 active:bg-brand-900",
  outline:
    "border border-brand-200 bg-white text-brand-800 hover:border-brand-300 hover:bg-brand-50",
  ghost: "text-brand-800 hover:bg-brand-50",
  white: "bg-white text-brand-900 shadow-sm hover:bg-brand-50",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-dark shadow-sm shadow-green-600/30",
  "outline-white": "border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20",
};

const sizes = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-lg",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-13 px-7 text-base gap-2 rounded-xl",
};

/**
 * Polymorphic button: renders <Link> when `to` is given, <a> when `href`, else <button>.
 */
const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    to,
    href,
    className,
    children,
    loading = false,
    disabled,
    fullWidth = false,
    ...props
  },
  ref
) {
  const classes = cn(
    "inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all duration-200",
    "disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" className={classes} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});

export default Button;
