import { Link } from "react-router-dom";
import { coverImage, formatPrice } from "../utils/format";
import StatusBadge from "./StatusBadge";

export default function PropertyCard({ property, featured = false, fillHeight = false }) {
  return (
    <Link
      to={`/imoveis/${property.id}`}
      className={`group relative block overflow-hidden bg-charcoal ${
        featured ? "aspect-[4/3]" : "aspect-[3/4]"
      } ${fillHeight ? "md:aspect-auto md:h-full" : ""}`}
    >
      <img
        src={coverImage(property)}
        alt={property.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />

      <StatusBadge status={property.status} className="absolute top-4 left-4" />

      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="tick-rule mb-4 opacity-80" />
        <p
          className={`font-display text-paper leading-snug line-clamp-2 ${
            featured ? "text-3xl" : "text-xl"
          }`}
        >
          {property.address}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-mono text-sm text-gold-soft">{formatPrice(property.price)}</p>
          <p className="font-mono text-xs text-paper/70">
            {property.bedrooms ? `T${property.bedrooms}` : property.typology} · {property.area} m²
          </p>
        </div>
      </div>
    </Link>
  );
}
