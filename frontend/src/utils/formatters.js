const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** 2499 -> "₹2,499" */
export function formatCurrency(amount, currency = "INR") {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  if (currency !== "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return inrFormatter.format(amount);
}

/** 150 -> "150 km" */
export function formatDistance(km, unit = "km") {
  if (km == null) return "—";
  return `${new Intl.NumberFormat("en-IN").format(km)} ${unit}`;
}

/** "2026-03-14" -> "14 Mar 2026" */
export function formatDate(isoDate) {
  if (!isoDate) return "—";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Today's date as YYYY-MM-DD in local time (for <input type="date" min>) */
export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "one-way" -> "One Way" */
export function humanizeSlug(slug = "") {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}
