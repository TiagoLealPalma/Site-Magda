import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import Spec from "./Spec";
import TickRule from "./TickRule";
import LeadForm from "./LeadForm";
import StatusBadge from "./StatusBadge";
import { formatPrice, PLACEHOLDER_IMAGE } from "../utils/format";
import { useLang } from "../i18n";

// Reveal-on-scroll makes no sense in a scaled, inert preview (nothing ever
// scrolls into view there), so it renders its content straight away.
function Static({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

// The body of a listing page (hero, filmstrip, spec strip, description and
// contact form). `preview` renders it inert and at a fixed height for the
// backoffice, where it is shown scaled down beside the form.
export default function PropertyDetailView({ property, preview = false, onOpenImage = () => {} }) {
  const { t, lang, path } = useLang();
  const Block = preview ? Static : Reveal;
  const noPhoto = preview && !property.images?.length;
  const images = property.images?.length ? property.images : [{ url: PLACEHOLDER_IMAGE }];

  return (
    <>
      {/* Full-bleed editorial hero */}
      <section
        className={`group relative overflow-hidden ${preview ? "h-[640px]" : "h-[75vh] cursor-zoom-in"}`}
        onClick={() => onOpenImage(0)}
      >
        {noPhoto ? (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal font-mono text-sm uppercase tracking-widest text-paper/50">
            Sem foto
          </div>
        ) : (
          <div
            key={property.id}
            className={`absolute inset-0 bg-cover bg-center ${preview ? "" : "kenburns"}`}
            style={{ backgroundImage: `url('${images[0].url}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors" />

        <StatusBadge status={property.status} className={`absolute left-8 ${preview ? "top-8" : "top-28"}`} />

        <div className={`absolute right-8 flex ${preview ? "top-8" : "top-28"} items-center gap-2 font-mono text-xs text-paper/0 group-hover:text-paper/90 transition-colors`}>
          <span>{t("detail.zoom")}</span>
          <svg
            className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 md:px-8 pb-10 md:pb-14 mx-auto max-w-7xl">
          <Link
            to={path("properties")}
            onClick={(e) => e.stopPropagation()}
            className="font-mono text-xs text-paper/60 hover:text-gold-soft"
          >
            {t("detail.allProperties")}
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl leading-snug md:leading-tight text-paper mt-5 max-w-2xl">
            {property.name}
          </h1>
          <p className="font-mono text-lg md:text-xl text-gold-soft mt-3">{formatPrice(property.price, lang)}</p>
        </div>
      </section>

      {/* Filmstrip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto bg-charcoal px-6 md:px-8 py-4">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => onOpenImage(i)}
              className="h-20 w-28 shrink-0 overflow-hidden opacity-70 hover:opacity-100 transition-opacity"
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Blueprint spec strip */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-24">
        {preview ? <div className="tick-rule mb-11 md:mb-12" /> : <TickRule className="mb-11 md:mb-12" />}
        <Block className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
          <Spec label={t("spec.type")} value={property.typology || "—"} />
          <Spec label={t("spec.bedrooms")} value={property.bedrooms ?? "—"} />
          <Spec label={t("spec.grossArea")} value={property.area ? `${property.area} m²` : "—"} />
          <Spec label={t("spec.usableArea")} value={property.liquid_area ? `${property.liquid_area} m²` : "—"} />
          <Spec label={t("spec.builtIn")} value={property.construction_date || "—"} />
          <Spec label={t("spec.address")} value={property.address} />
        </Block>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mt-16 md:mt-24">
          <Block className="md:col-span-2">
            <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-4">
              {t("detail.description")}
              {t("detail.descriptionNote") && (
                <span className="ml-3 normal-case tracking-normal text-stone">· {t("detail.descriptionNote")}</span>
              )}
            </p>
            <p lang="pt" className="text-stone leading-relaxed whitespace-pre-line">
              {property.description || (preview ? "A descrição aparece aqui." : "")}
            </p>
          </Block>

          <Block delay={150}>
            <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-4">
              {t("detail.interested")}
            </p>
            <LeadForm presetMessage={t("detail.interestedIn", { name: property.name })} />
          </Block>
        </div>
      </section>

    </>
  );
}
