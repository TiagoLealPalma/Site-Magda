export function formatPrice(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(n) + " €";
}

export const PLACEHOLDER_IMAGE = "/static/properties/placeholder.jpg";

export function coverImage(property) {
  return property.images?.[0]?.url || PLACEHOLDER_IMAGE;
}
