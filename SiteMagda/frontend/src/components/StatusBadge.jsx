// A paper plate with a small marker: hollow for "not yet" (Brevemente),
// solid for "taken" (Reservado). Available listings carry no badge at all.
import { useT } from "../i18n";

const CONFIG = {
  coming_soon: { marker: "border border-gold" },
  reserved: { marker: "bg-rust" },
};

export default function StatusBadge({ status, className = "" }) {
  const t = useT();
  const config = CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-2.5 bg-paper px-3.5 py-2 font-mono text-[11px] uppercase leading-none tracking-[0.22em] text-ink ${className}`}
    >
      <span aria-hidden="true" className={`h-2 w-2 shrink-0 ${config.marker}`} />
      {t(`status.${status}`)}
    </span>
  );
}
