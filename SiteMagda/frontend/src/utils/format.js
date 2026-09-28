export const isRent = (property) => property?.listing_type === "rent";

// A rental's price is the monthly rent, so it carries a "/mês" suffix.
export function formatPrice(value, lang = "pt", rent = false) {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  if (lang === "en") return "€" + new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(n) + (rent ? "/month" : "");
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(n) + " €" + (rent ? "/mês" : "");
}

// Areas come from the API as a decimal-precision string (e.g. "87.5"); they
// are shown as whole square metres.
export function formatArea(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : String(Math.round(n));
}

export const PLACEHOLDER_IMAGE = "/static/properties/placeholder.jpg";

export function coverImage(property) {
  return property.images?.[0]?.url || PLACEHOLDER_IMAGE;
}
