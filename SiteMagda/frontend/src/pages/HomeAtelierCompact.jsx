import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Spec from "../components/Spec";
import TickRule from "../components/TickRule";
import PropertyCard from "../components/PropertyCard";
import LeadForm from "../components/LeadForm";
import Testimonials from "../components/Testimonials";
import { useHorizontalRail } from "../hooks/useHorizontalRail";
import { getProperties, getStats } from "../api/client";

// Atelier / "Compact Confidence" — a denser two-row horizontal grid instead
// of a single row, built for a catalog that grows past a handful of
// listings: more properties visible per scroll, scanability over magazine
// pacing, tighter uniform cards.
export default function HomeAtelierCompact() {
  const [properties, setProperties] = useState(null);
  const [stats, setStats] = useState(null);
  const railRef = useRef(null);
  const hasProperties = properties !== null && properties.length > 0;
  useHorizontalRail(railRef, hasProperties);

  useEffect(() => {
    getProperties()
      .then((data) => {
        const byPriceDesc = [...data].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        setProperties(byPriceDesc);
      })
      .catch(() => setProperties([]));
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

      {/* About */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-36">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-14 md:gap-24">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-6">Sobre</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] max-w-2xl">
              Excelência na realização dos seus sonhos imobiliários.
            </h2>
          </Reveal>
          <Reveal delay={120} className="md:pl-12 md:border-l md:border-ink/10 flex flex-col justify-center items-start">
            <p className="text-stone leading-relaxed">
              Com mais de <span className="text-gold-deep font-medium">{stats?.years_since ?? 10} anos</span> de
              experiência no mercado imobiliário e{" "}
              <span className="text-gold-deep font-medium">duas décadas</span> de engenharia civil,
              ofereço um serviço de consultoria especializado — uma leitura técnica pouco comum no
              setor.
            </p>
            <Link
              to="/sobre"
              className="mt-6 inline-block border-b border-gold text-sm tracking-wide pb-1 hover:text-gold-deep transition-colors"
            >
              Ler mais
            </Link>
          </Reveal>
        </div>

        {stats && (
          <Reveal
            delay={200}
            className="mt-20 md:mt-24 grid grid-cols-3 gap-8 md:gap-16 border-t border-ink/10 pt-12 max-w-3xl"
          >
            <Spec label="Imóveis em venda" value={stats.number_of_properties} size="lg" center animate />
            <Spec label="Imóveis vendidos" value={stats.properties_sold} size="lg" center animate />
            <Spec label="Anos de experiência" value={`${stats.years_since}+`} size="lg" center animate />
          </Reveal>
        )}
      </section>

      {/* Pull-quote */}
      <section className="relative bg-paper py-28 md:py-40 border-t border-ink/10 overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-6 md:px-8 text-center">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 md:-top-24 left-1/2 -translate-x-1/2 font-display text-[10rem] md:text-[14rem] leading-none text-gold/[0.08] select-none"
          >
            “
          </span>
          <Reveal className="relative">
            <p className="font-display text-3xl md:text-5xl leading-snug text-ink">
              Vendi em 23 dias depois de mais de dois anos noutra imobiliária. A Magda faz mesmo a
              diferença!
            </p>
            <TickRule className="w-10 mx-auto mt-10 mb-6" />
            <p className="font-mono text-xs tracking-widest uppercase text-gold-deep">
              Sílvia Fernandes
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured properties — Compact Confidence: a two-row scroll grid */}
      <section className="bg-paper py-24 md:py-36 border-t border-ink/10">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <Reveal className="mb-14 md:mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-4">
                Propriedades
              </p>
              <h2 className="font-display text-3xl md:text-5xl leading-snug text-ink max-w-xl">
                A preparar a nova etapa da sua vida.
              </h2>
            </div>
            <Link
              to="/imoveis"
              className="hidden md:inline-block shrink-0 border-b border-gold text-sm tracking-wide pb-1 hover:text-gold-deep transition-colors"
            >
              Ver todos →
            </Link>
          </Reveal>
        </div>

        {properties === null ? (
          <div className="pl-6 md:pl-8 grid grid-rows-2 grid-flow-col auto-cols-[68vw] sm:auto-cols-[38vw] lg:auto-cols-[22vw] gap-4 md:gap-6 overflow-x-hidden pb-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-ink/5" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <p className="text-stone text-sm">Não foi possível carregar os imóveis de momento.</p>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={railRef}
              role="region"
              aria-label="Lista de imóveis — deslize horizontalmente"
              tabIndex={0}
              className="pl-6 md:pl-8 grid grid-rows-2 grid-flow-col auto-cols-[68vw] sm:auto-cols-[38vw] lg:auto-cols-[22vw] gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [&>*]:snap-start [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
            >
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
              <div className="row-span-2 w-2" aria-hidden />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-paper to-transparent" />
            <p className="mx-auto max-w-7xl px-6 md:px-8 mt-4 font-mono text-xs text-stone">
              {properties.length} imóveis
            </p>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-6 md:px-8 mt-8 md:hidden">
          <Link
            to="/imoveis"
            className="inline-block border-b border-gold text-sm tracking-wide pb-1 hover:text-gold-deep transition-colors"
          >
            Ver todos os imóveis →
          </Link>
        </div>
      </section>

      <Testimonials />

      {/* Lead form */}
      <section className="mx-auto max-w-2xl px-6 md:px-8 py-24 md:py-36 text-center">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-5">Contacto</p>
          <h2 className="font-display text-3xl md:text-5xl leading-snug mb-14">
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
