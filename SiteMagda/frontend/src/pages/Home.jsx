import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Spec from "../components/Spec";
import TickRule from "../components/TickRule";
import PropertyCard from "../components/PropertyCard";
import LeadForm from "../components/LeadForm";
import ScrollFeedback from "../components/ScrollFeedback";
import { useHorizontalRail } from "../hooks/useHorizontalRail";
import { getProperties, getStats } from "../api/client";

// The featured quote up top and the smaller grid below are both real client
// testimonials — kept in one static section instead of the featured quote
// plus a separate auto-rotating carousel repeating the same idea twice.
const FEATURED_TESTIMONIAL = {
  text: "Vendi em 23 dias depois de mais de dois anos noutra imobiliária. A Magda faz mesmo a diferença!",
  author: "Sílvia Fernandes",
};

const MORE_TESTIMONIALS = [
  {
    text: "A Magda foi incansável no processo, tanto na procura como durante a aquisição, com grande profissionalismo, sempre simpática, disponível e nos momentos mais críticos teve sempre uma palavra amiga.",
    author: "Rosário Sousa",
  },
  {
    text: "Incansáveis. Sempre que a bola está do lado da Equipa da Magda Leal, rapidamente o assunto é tratado. Nunca uma chamada da nossa parte ficou por atender. Não se pode pedir mais.",
    author: "Silvana Curado",
  },
  {
    text: "Uma agente imobiliária impecável! Não só é uma excelente profissional como também é uma amiga que se preocupa genuinamente com os seus clientes.",
    author: "Catarina Cardoso",
  },
  {
    text: "Profissionalismo, dedicação, seriedade e simpatia! Tornou todo o processo de compra de casa simples e rápido!",
    author: "Carlos Silva",
  },
];


export default function Home() {
  const [properties, setProperties] = useState(null);
  const [stats, setStats] = useState(null);
  const railRef = useRef(null);
  const hasProperties = properties !== null && properties.length > 0;
  useHorizontalRail(railRef, hasProperties);

  useEffect(() => {
    getProperties()
      .then((data) => {
        const byPriceDesc = [...data].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        setProperties(byPriceDesc.slice(0, 6));
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

      {/* About — same two-column grid and gap as the hero above it, so both
          title blocks share one left edge and one column width; the stats
          live inside that same first column instead of a separate max-w
          guess, so they align with it exactly. */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20">
          <div>
            <Reveal>
              <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-6">Sobre</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.1] max-w-2xl">
                Excelência na realização dos seus sonhos imobiliários.
              </h2>
            </Reveal>

            {stats && (
              <Reveal
                delay={200}
                className="mt-16 md:mt-20 grid grid-cols-3 gap-6 md:gap-8 border-t border-ink/10 pt-10"
              >
                <Spec label="Imóveis em venda" value={stats.number_of_properties} size="lg" center animate />
                <Spec label="Imóveis vendidos" value={stats.properties_sold} size="lg" center animate />
                <Spec label="Anos de experiência" value={`${stats.years_since}+`} size="lg" center animate />
              </Reveal>
            )}
          </div>

          <Reveal delay={120} className="border border-ink/10 p-8 md:p-10 flex flex-col justify-center items-start">
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
      </section>

      {/* Feedback — a pinned, fullscreen scrollytelling section: the primary
          quote disappears as each secondary testimonial crossfades in,
          driven by scroll position rather than a carousel timer. */}
      <ScrollFeedback featured={FEATURED_TESTIMONIAL} others={MORE_TESTIMONIALS} />

      {/* Featured properties */}
      <section className="bg-paper py-24 md:py-36">
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
          <div className="pl-6 md:pl-8 flex gap-6 md:gap-10 overflow-x-hidden pb-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="shrink-0 w-[78vw] sm:w-[46vw] lg:w-[30vw] aspect-[4/3] bg-ink/5" />
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
              className="pl-6 md:pl-8 flex gap-6 md:gap-10 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory [&>*]:snap-start [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
            >
              {properties.map((p) => (
                <div key={p.id} className="shrink-0 w-[78vw] sm:w-[46vw] lg:w-[30vw]">
                  <PropertyCard property={p} featured />
                </div>
              ))}
              <div className="shrink-0 w-2" aria-hidden />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-paper to-transparent" />
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
