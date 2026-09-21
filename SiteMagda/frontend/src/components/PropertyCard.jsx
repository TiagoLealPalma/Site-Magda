import { Link } from "react-router-dom";
import { useLang, localizedProperty } from "../i18n";
import { propertyParam } from "../seo/slug";
import { coverImage, formatPrice } from "../utils/format";
import StatusBadge from "./StatusBadge";

export default function PropertyCard({ property: raw, featured = false, fillHeight = false }) {
  const { lang, path } = useLang();
  const property = localizedProperty(raw, lang);
  return (
    <Link
      to={path("property", { id: propertyParam(property, lang) })}
      className={`group property-card relative block overflow-hidden bg-charcoal ${
        featured ? "aspect-[4/3]" : "aspect-[3/4]"
      } ${fillHeight ? "md:aspect-auto md:h-full" : ""}`}
    >
      <img
        src={coverImage(property)}
        alt={property.name}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-105 ${
          property.status === "reserved" ? "saturate-[.3] group-hover:saturate-100" : ""
        }`}
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
          <p className="font-mono text-sm text-gold-soft">{formatPrice(property.price, lang)}</p>
          <p className="font-mono text-xs text-paper/70">
            {property.bedrooms ? `T${property.bedrooms}` : property.typology} · {property.area} m²
          </p>
        </div>
      </div>
    </Link>
  );
}
