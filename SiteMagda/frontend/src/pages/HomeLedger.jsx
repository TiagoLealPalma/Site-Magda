import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Spec from "../components/Spec";
import TickRule from "../components/TickRule";
import PropertyCard from "../components/PropertyCard";
import LeadForm from "../components/LeadForm";
import Testimonials from "../components/Testimonials";
import { getProperties, getStats } from "../api/client";

// Variant A — "The Ledger": the calmest, most generous reading of the
// system. One idea per screen, wide margins, no boxed panels — the hero's
// quiet, framed-print language carried all the way down the page.
export default function HomeLedger() {
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

      {/* About + stats + quote — one narrow centered column, generous
          vertical rhythm, no boxed panels at all. */}
      <section className="mx-auto max-w-3xl px-6 md:px-8 py-24 md:py-36 text-center">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-5">Sobre</p>
          <h2 className="font-display text-3xl md:text-5xl leading-snug md:leading-tight">
            Excelência na realização dos seus sonhos imobiliários.
          </h2>
          <p className="mt-8 text-stone leading-relaxed text-lg max-w-2xl mx-auto">
            Com mais de <span className="text-gold-deep font-medium">{stats?.years_since ?? 10} anos</span> de experiência
            no mercado imobiliário e <span className="text-gold-deep font-medium">duas décadas</span> de
            engenharia civil, ofereço um serviço de consultoria especializado — uma leitura técnica
            pouco comum no setor.
          </p>
          <Link
            to="/sobre"
            className="mt-8 inline-block border-b border-gold text-sm tracking-wide pb-1 hover:text-gold-deep transition-colors"
          >
            Ler mais
          </Link>
        </Reveal>

        {stats && (
          <Reveal delay={100} className="mt-20 grid grid-cols-3 gap-10 md:gap-16 border-t border-ink/10 pt-12">
            <Spec label="Imóveis em venda" value={stats.number_of_properties} size="lg" center animate />
            <Spec label="Imóveis vendidos" value={stats.properties_sold} size="lg" center animate />
            <Spec label="Anos de experiência" value={`${stats.years_since}+`} size="lg" center animate />
          </Reveal>
        )}

        <Reveal delay={200} className="mt-20 md:mt-24">
          <TickRule className="w-10 mx-auto mb-8" />
          <p className="font-display text-2xl md:text-3xl leading-snug text-ink max-w-2xl mx-auto">
            “Vendi em 23 dias depois de mais de dois anos noutra imobiliária. A Magda faz mesmo a
            diferença!”
          </p>
          <p className="mt-6 font-mono text-xs tracking-widest uppercase text-gold-deep">
            Sílvia Fernandes
          </p>
        </Reveal>
      </section>

      {/* Featured properties — a calm, uniform grid on paper, not a dense
          asymmetric block on charcoal; the cards' own dark frames provide
          the contrast, the page around them stays quiet. */}
      <section className="bg-paper py-24 md:py-36 border-t border-ink/10">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <Reveal className="mb-16 md:mb-20 text-center max-w-2xl mx-auto">
            <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-4">
              Propriedades
            </p>
            <h2 className="font-display text-3xl md:text-5xl leading-snug md:leading-tight text-ink">
              A preparar a nova etapa da sua vida.
            </h2>
          </Reveal>

          {properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}

          <Reveal delay={150} className="mt-16 text-center">
            <Link
              to="/imoveis"
              className="inline-block border-b border-gold text-sm tracking-wide pb-1 hover:text-gold-deep transition-colors"
            >
              Ver todos os imóveis →
            </Link>
          </Reveal>
        </div>
      </section>

      <Testimonials />

      {/* Lead form */}
      <section className="mx-auto max-w-2xl px-6 md:px-8 py-24 md:py-36 text-center">
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
