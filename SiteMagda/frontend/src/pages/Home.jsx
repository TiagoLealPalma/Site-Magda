import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Spec from "../components/Spec";
import PropertyCard from "../components/PropertyCard";
import LeadForm from "../components/LeadForm";
import Testimonials from "../components/Testimonials";
import { getProperties, getStats } from "../api/client";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getProperties().then((data) => {
      // Featured card = priciest listing; the rest fill the grid in the
      // same descending order (top 5 by price overall).
      const byPriceDesc = [...data].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      setProperties(byPriceDesc.slice(0, 5));
    });
    getStats().then(setStats);
  }, []);

  return (
    <div className="bg-paper">
      <Header transparentOnTop />

      {/* Hero */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="kenburns absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/static/landingpage/LandingBackground.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
        <div className="relative mx-auto max-w-7xl px-8 pb-24 w-full">
          <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-4">
            Consultora Imobiliária · Keller Williams
          </p>
          <h1 className="font-display text-6xl md:text-7xl text-paper leading-[0.95] max-w-3xl">
            Encontre o seu novo lar connosco.
          </h1>
          <p className="mt-6 text-paper/80 max-w-md text-lg font-light">
            O seu futuro pode estar à distância de um clique.
          </p>
          <Link
            to="/imoveis"
            className="mt-10 inline-flex items-center gap-3 border border-gold text-gold px-8 py-3 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors"
          >
            Ver imóveis
          </Link>
        </div>
      </section>

      {/* About teaser */}
      <section className="mx-auto max-w-7xl px-8 py-28 grid grid-cols-2 gap-20 items-center">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-4">Sobre</p>
          <h2 className="font-display text-4xl leading-tight max-w-lg">
            Excelência na realização dos seus sonhos imobiliários.
          </h2>
          <p className="mt-6 text-stone leading-relaxed max-w-md">
            Com mais de <span className="text-gold font-medium">10 anos</span> de experiência no
            mercado imobiliário e <span className="text-gold font-medium">duas décadas</span> de
            engenharia civil, ofereço um serviço de consultoria especializado — uma leitura técnica
            pouco comum no setor.
          </p>
          <Link
            to="/sobre"
            className="mt-8 inline-block border-b border-gold text-sm tracking-wide pb-1 hover:text-gold transition-colors"
          >
            Ler mais
          </Link>

          {stats && (
            <div className="mt-14 grid grid-cols-3 gap-8 border-t border-ink/10 pt-8">
              <Spec label="Imóveis em venda" value={stats.number_of_properties} size="lg" center animate />
              <Spec label="Imóveis vendidos" value={stats.properties_sold} size="lg" center animate />
              <Spec label="Anos de experiência" value={`${stats.years_since}+`} size="lg" center animate />
            </div>
          )}
        </Reveal>
        <Reveal delay={150} className="aspect-[4/5] overflow-hidden">
          <img
            src="/static/landingpage/FotoMagda.png"
            alt="Magda Leal"
            className="h-full w-full object-cover grayscale"
          />
        </Reveal>
      </section>

      {/* Featured properties — asymmetric rhythm, not a uniform grid */}
      <section className="bg-charcoal py-28">
        <div className="mx-auto max-w-7xl px-8">
          <Reveal className="mb-14 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-4">
                Propriedades
              </p>
              <h2 className="font-display text-4xl text-paper">
                A preparar a nova etapa da sua vida.
              </h2>
            </div>
            <Link
              to="/imoveis"
              className="hidden md:inline-block text-sm text-paper/70 hover:text-gold transition-colors"
            >
              Ver todos →
            </Link>
          </Reveal>

          {properties.length > 0 && (
            <div className="grid grid-cols-4 grid-rows-2 gap-6 h-[42rem]">
              <div className="col-span-2 row-span-2">
                <PropertyCard property={properties[0]} featured fillHeight />
              </div>
              {properties.slice(1, 5).map((p) => (
                <PropertyCard key={p.id} property={p} fillHeight />
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonials />

      {/* Lead form */}
      <section className="mx-auto max-w-3xl px-8 py-28 text-center">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-4">Contacto</p>
          <h2 className="font-display text-4xl mb-10">Explique-nos que procura.</h2>
          <div className="text-left">
            <LeadForm />
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
