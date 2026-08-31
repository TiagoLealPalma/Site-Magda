import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Spec from "../components/Spec";
import TickRule from "../components/TickRule";
import Lightbox from "../components/Lightbox";
import LeadForm from "../components/LeadForm";
import StatusBadge from "../components/StatusBadge";
import { getProperty } from "../api/client";
import { formatPrice, PLACEHOLDER_IMAGE } from "../utils/format";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    setProperty(null);
    getProperty(id).then(setProperty);
  }, [id]);

  if (!property) {
    return (
      <div className="bg-paper min-h-screen">
        <Header />
        <div className="pt-40 text-center text-stone text-sm">A carregar…</div>
      </div>
    );
  }

  const images = property.images.length ? property.images : [{ url: PLACEHOLDER_IMAGE }];

  return (
    <div className="bg-paper">
      <Header />

      {/* Full-bleed editorial hero */}
      <section
        className="group relative h-[75vh] cursor-zoom-in overflow-hidden"
        onClick={() => setLightboxIndex(0)}
      >
        <div
          key={property.id}
          className="kenburns absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${images[0].url}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors" />

        <StatusBadge status={property.status} className="absolute top-28 left-8" />

        <div className="absolute top-28 right-8 flex items-center gap-2 font-mono text-xs text-paper/0 group-hover:text-paper/90 transition-colors">
          <span>Ampliar</span>
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

        <div className="absolute inset-x-0 bottom-0 px-8 pb-14 mx-auto max-w-7xl">
          <Link
            to="/imoveis"
            onClick={(e) => e.stopPropagation()}
            className="font-mono text-xs text-paper/60 hover:text-gold"
          >
            ← Todos os imóveis
          </Link>
          <h1 className="font-display text-5xl md:text-6xl text-paper mt-4 max-w-2xl">
            {property.name}
          </h1>
          <p className="font-mono text-xl text-gold-soft mt-3">{formatPrice(property.price)}</p>
        </div>
      </section>

      {/* Filmstrip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto bg-charcoal px-8 py-4">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setLightboxIndex(i)}
              className="h-20 w-28 shrink-0 overflow-hidden opacity-70 hover:opacity-100 transition-opacity"
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Blueprint spec strip */}
      <section className="mx-auto max-w-7xl px-8 py-24">
        <TickRule className="mb-12" />
        <Reveal className="grid grid-cols-6 gap-8">
          <Spec label="Tipologia" value={property.typology || "—"} />
          <Spec label="Quartos" value={property.bedrooms ?? "—"} />
          <Spec label="Área Bruta" value={`${property.area} m²`} />
          <Spec label="Área Útil" value={property.liquid_area ? `${property.liquid_area} m²` : "—"} />
          <Spec label="Construído em" value={property.construction_date || "—"} />
          <Spec label="Morada" value={property.address} />
        </Reveal>

        <div className="grid grid-cols-3 gap-16 mt-24">
          <Reveal className="col-span-2">
            <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-4">
              Descrição
            </p>
            <p className="text-stone leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </Reveal>

          <Reveal delay={150}>
            <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-4">
              Interessado?
            </p>
            <LeadForm presetMessage={`Tenho interesse em: ${property.name}`} />
          </Reveal>
        </div>
      </section>

      <Footer />

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
