export function formatPrice(value, lang = "pt") {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  if (lang === "en") return "€" + new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(n);
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(n) + " €";
}

export const PLACEHOLDER_IMAGE = "/static/properties/placeholder.jpg";

export function coverImage(property) {
  return property.images?.[0]?.url || PLACEHOLDER_IMAGE;
}
