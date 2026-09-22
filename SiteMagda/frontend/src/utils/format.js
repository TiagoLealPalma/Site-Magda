export function formatPrice(value, lang = "pt") {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  if (lang === "en") return "€" + new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(n);
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(n) + " €";
}

// Areas come from the API as a decimal-precision string (e.g. "87.0" or
// "87.5"); this drops a trailing ".0" without dropping a real fraction.
export function formatArea(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n % 1 === 0 ? String(n) : n.toFixed(1);
}

export const PLACEHOLDER_IMAGE = "/static/properties/placeholder.jpg";

export function coverImage(property) {
  return property.images?.[0]?.url || PLACEHOLDER_IMAGE;
}
