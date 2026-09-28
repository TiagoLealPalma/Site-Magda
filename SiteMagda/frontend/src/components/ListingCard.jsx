import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import StatusBadge from "./StatusBadge";
import ListingTypeBadge from "./ListingTypeBadge";
import { coverImage, formatPrice, isRent } from "../utils/format";
import { useLang, localizedProperty } from "../i18n";
import { specRows, SpecLedger } from "../pages/imoveis/shared";
import { propertyParam } from "../seo/slug";

// The listing card of the Imóveis page. In `preview` mode (the backoffice
// form) it renders the same markup without linking anywhere or animating in,
// so what Magda sees while typing is what visitors get.
export default function ListingCard({ property: raw, index = 0, preview = false }) {
  const { t, lang, path } = useLang();
  const property = localizedProperty(raw, lang);
  const hasPhoto = Boolean(property.images?.length);

  const card = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
        {preview && !hasPhoto ? (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center font-mono text-xs uppercase tracking-widest text-paper/60">
            Sem foto
          </p>
        ) : (
          <img
            src={coverImage(property)}
            alt={property.name}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-105 ${
              property.status === "reserved" ? "saturate-[.3] group-hover:saturate-100" : ""
            }`}
          />
        )}
        <StatusBadge status={property.status} className="absolute left-4 top-4" />
        <ListingTypeBadge property={property} className="absolute right-4 top-4" />
      </div>
      <div className="flex flex-1 flex-col bg-charcoal p-6 text-paper">
        <p className="font-mono text-2xl tabular-nums text-gold-soft">{formatPrice(property.price, lang, isRent(property))}</p>
        {/* Every card reserves two title lines and clamps longer names, so a
            row of cards shares one height and one rhythm whatever the name. */}
        <h3 className="mt-3 line-clamp-2 min-h-[2.75em] font-display text-xl leading-snug">{property.name}</h3>
        <p className="mt-1 truncate font-mono text-xs uppercase tracking-widest text-paper/70">{property.address}</p>
        <div className="mt-auto pt-5">
          <div className="relative mb-5 h-px overflow-hidden bg-paper/15">
            <span className="absolute inset-0 origin-left scale-x-0 bg-gold-soft transition-transform duration-700 ease-out group-hover:scale-x-100" />
          </div>
          <SpecLedger rows={specRows(property, t).slice(0, 4)} tone="dark" />
        </div>
      </div>
    </>
  );

  if (preview) return <div className="group flex h-full flex-col">{card}</div>;

  return (
    <Reveal delay={(index % 3) * 100} className="h-full">
      <Link
        to={path("property", { id: propertyParam(property, lang) })}
        className="group flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        {card}
      </Link>
    </Reveal>
  );
}
