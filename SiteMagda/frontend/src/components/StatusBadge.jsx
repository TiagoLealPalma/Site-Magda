const LABELS = {
  coming_soon: "Brevemente",
  reserved: "Reservado",
};

const COLORS = {
  coming_soon: "bg-gold text-ink",
  reserved: "bg-rust text-paper",
};

export default function StatusBadge({ status, className = "" }) {
  if (!status || status === "available") return null;

  return (
    <span
      className={`inline-block font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 ${COLORS[status]} ${className}`}
    >
      {LABELS[status] || status}
    </span>
  );
}
