// Only rentals are flagged: sale is the default and carries no badge, like an
// available status. Sits top-right so it never collides with StatusBadge.
import { useT } from "../i18n";
import { isRent } from "../utils/format";

export default function ListingTypeBadge({ property, className = "" }) {
  const t = useT();
  if (!isRent(property)) return null;
  return (
    <span
      className={`inline-flex items-center bg-gold px-3.5 py-2 font-mono text-[11px] uppercase leading-none tracking-[0.22em] text-ink ${className}`}
    >
      {t("listing.rent")}
    </span>
  );
}
