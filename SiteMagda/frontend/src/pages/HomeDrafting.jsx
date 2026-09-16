import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import TickRule from "../components/TickRule";
import PropertyCard from "../components/PropertyCard";
import LeadForm from "../components/LeadForm";
import Testimonials from "../components/Testimonials";
import { getProperties, getStats } from "../api/client";

// Variant B — "The Drafting Table": leans hardest into the engineer/
// blueprint identity already in DESIGN.md — a proof strip right under the
// hero, a ledger-style stat sheet instead of a stat grid, corner-bracket
// framing on the quote, and numbered index tags on the property cards.
export default function HomeDrafting() {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getProperties().then((data) => {
      const byPriceDesc = [...data].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      setProperties(byPriceDesc.slice(0, 6));
    });
    getStats().then(setStats);
  }, []);

  return (
    <div className="bg-paper">
      <Header />

      {/* Hero */}
      <section className="relative bg-paper pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-5">
              Consultora Imobiliária · Keller Williams
            </p>
            <TickRule className="w-16 mb-6" />
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-[1.05] md:leading-[0.95] max-w-xl">
              Encontre o seu novo lar connosco.
            </h1>
            <p className="mt-6 text-stone max-w-md text-lg font-light">
              O seu futuro pode estar à distância de um clique.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/imoveis"
                className="inline-flex items-center gap-3 border border-gold text-gold-deep px-8 py-3 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors"
              >
                Ver imóveis
              </Link>
              <Link
                to="/sobre"
                className="inline-block border-b border-ink/25 text-stone text-sm tracking-wide pb-1 hover:border-gold hover:text-gold-deep transition-colors"
              >
                Conhecer a Magda
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="border border-ink/10 p-3 md:p-4 max-w-md md:max-w-none mx-auto">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/static/landingpage/FotoMagda.png"
                  alt="Magda Leal"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center 15%" }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Proof strip — real numbers, presented immediately, in the site's
          own mono/tick-rule instrument language. */}
      {stats && (
        <section className="bg-ink py-9 md:py-11">
          <div className="mx-auto max-w-7xl px-6 md:px-8 flex flex-wrap items-center justify-center md:justify-between gap-x-14 gap-y-6">
            <StripStat label="Imóveis em venda" value={stats.number_of_properties} />
            <TickRule className="hidden md:block w-10" />
            <StripStat label="Imóveis vendidos" value={stats.properties_sold} />
            <TickRule className="hidden md:block w-10" />
            <StripStat label="Anos de experiência" value={`${stats.years_since}+`} />
          </div>
        </section>
      )}

      {/* About — a ledger of numbers instead of a stat grid, and a quote
          held inside a corner-bracketed frame, echoing the "select /
          measure" motif from the property gallery's zoom control. */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-5">Sobre</p>
            <h2 className="font-display text-3xl md:text-5xl leading-snug md:leading-tight max-w-lg">
              Excelência na realização dos seus sonhos imobiliários.
            </h2>
            <p className="mt-7 text-stone leading-relaxed max-w-md">
              Com mais de <span className="text-gold-deep font-medium">{stats?.years_since ?? 10} anos</span> de
              experiência no mercado imobiliário e{" "}
              <span className="text-gold-deep font-medium">duas décadas</span> de engenharia civil,
              ofereço um serviço de consultoria especializado — uma leitura técnica pouco comum no
              setor.
            </p>
            <Link
              to="/sobre"
              className="mt-8 inline-block border-b border-gold text-sm tracking-wide pb-1 hover:text-gold-deep transition-colors"
            >
              Ler mais
            </Link>

            {stats && (
              <div className="mt-14 md:mt-16 border-t border-ink/10 max-w-sm">
                <StatRow label="Imóveis em venda" value={stats.number_of_properties} />
                <StatRow label="Imóveis vendidos" value={stats.properties_sold} />
                <StatRow label="Anos de experiência" value={`${stats.years_since}+`} />
              </div>
            )}
          </Reveal>

          <Reveal delay={150} className="relative border border-ink/15 p-10 md:p-12">
            <CornerFrame />
            <span className="font-display text-6xl text-gold-deep leading-none">“</span>
            <p className="mt-2 font-display text-2xl md:text-3xl leading-snug text-ink">
              Vendi em 23 dias depois de mais de dois anos noutra imobiliária. A Magda faz mesmo a
              diferença!
            </p>
            <TickRule className="w-10 mt-8 mb-5" />
            <p className="font-mono text-xs tracking-widest uppercase text-gold-deep">
              Sílvia Fernandes
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured properties — bolder type, a ghost index numeral, and a
          numbered tag on each card. */}
      <section className="bg-charcoal py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <Reveal className="relative mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="relative">
              <span className="pointer-events-none absolute -top-10 md:-top-16 left-0 font-display text-[7rem] md:text-[10rem] leading-none text-gold/[0.08] select-none">
                02
              </span>
              <p className="relative font-mono text-xs tracking-[0.3em] text-gold-soft uppercase mb-4">
                Propriedades
              </p>
              <h2 className="relative font-display text-4xl md:text-6xl leading-snug md:leading-tight text-paper max-w-2xl">
                A preparar a nova etapa da sua vida.
              </h2>
            </div>
            <Link
              to="/imoveis"
              className="shrink-0 border-b border-gold text-sm tracking-wide pb-1 text-paper/80 hover:text-gold-soft hover:border-gold-soft transition-colors"
            >
              Ver todos →
            </Link>
          </Reveal>

          {properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {properties.map((p, i) => (
                <div key={p.id} className="relative">
                  <PropertyCard property={p} />
                  <span className="absolute top-4 right-4 z-10 font-mono text-[11px] text-paper/70 tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonials />

      {/* Lead form */}
      <section className="mx-auto max-w-2xl px-6 md:px-8 py-24 md:py-32 text-center">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-5">Contacto</p>
          <h2 className="font-display text-3xl md:text-5xl leading-snug md:leading-tight mb-14">
            Explique-nos que procura.
          </h2>
          <div className="text-left">
            <LeadForm />
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}

function StripStat({ label, value }) {
  return (
    <div className="text-center">
      <p className="font-mono text-2xl md:text-3xl text-paper">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-widest text-paper/50">{label}</p>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between border-b border-ink/10 py-4">
      <span className="text-xs uppercase tracking-widest text-stone">{label}</span>
      <span className="font-mono text-2xl text-ink">{value}</span>
    </div>
  );
}

// The property gallery's "Ampliar" corner-bracket glyph, reused as four
// independent corner marks (not one stretched SVG, which distorts badly on
// a non-square panel) — a quiet "measured / selected" frame around the quote.
function CornerFrame() {
  const bracket = (position) => (
    <svg
      className={`pointer-events-none absolute h-4 w-4 md:h-5 md:w-5 text-gold/40 ${position}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M1 6V1h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <>
      {bracket("top-3 left-3 md:top-4 md:left-4")}
      {bracket("top-3 right-3 md:top-4 md:right-4 rotate-90")}
      {bracket("bottom-3 right-3 md:bottom-4 md:right-4 rotate-180")}
      {bracket("bottom-3 left-3 md:bottom-4 md:left-4 -rotate-90")}
    </>
  );
}
