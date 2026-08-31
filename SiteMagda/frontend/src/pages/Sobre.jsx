import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Spec from "../components/Spec";
import TickRule from "../components/TickRule";
import { getStats } from "../api/client";

const VALUES = [
  {
    title: "Rigor Técnico",
    text: "Uma leitura de engenheira sobre cada imóvel, para que decida com toda a informação, não apenas com a primeira impressão.",
  },
  {
    title: "Acompanhamento Próximo",
    text: "Disponibilidade real do primeiro contacto à escritura, com resposta rápida em cada etapa do processo.",
  },
  {
    title: "Confiança",
    text: "Transparência em cada negociação, para que a relação continue muito depois de as chaves mudarem de mãos.",
  },
];

const AWARDS = [
  { count: "3×", title: "Top 10 Mega Teams" },
  { count: "3×", title: "Top 3 Income" },
  { count: "2×", title: "Ouro KW Abaco" },
  { count: "1×", title: "Prata KW Abaco" },
  { count: "9×", title: "Capper" },
];

export default function Sobre() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  return (
    <div className="bg-paper">
      <Header transparentOnTop />

      <section className="relative h-[70vh] flex items-end overflow-hidden">
        <div
          className="kenburns absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/static/landingpage/PicoWallpaper.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-8 pb-16 md:pb-20">
          <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-4">Sobre</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-paper max-w-2xl leading-[1.15] md:leading-[1.05]">
            A conhecer melhor quem a vai acompanhar.
          </h1>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="aspect-square overflow-hidden">
          <img
            src="/static/landingpage/FotoMagda.png"
            alt="Magda Leal"
            className="h-full w-full object-cover grayscale"
          />
        </div>
        <div className="px-6 py-16 md:px-16 md:py-24 flex flex-col justify-center">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-6">
              Magda Leal
            </p>
            <div className="space-y-7 text-stone leading-relaxed max-w-md">
              <p>
                Com mais de <span className="text-gold font-medium">10 anos</span> de experiência
                no mercado imobiliário e <span className="text-gold font-medium">duas décadas</span>{" "}
                de engenharia civil, ofereço um serviço de consultoria especializado a quem procura
                comprar, vender ou arrendar o seu próximo imóvel.
              </p>
              <p>
                A minha formação em engenharia civil dá-me um olhar técnico pouco comum no mercado
                imobiliário: avalio a construção, o estado do imóvel e o seu potencial real, não
                apenas a sua apresentação. Junto a isso, o acompanhamento próximo e transparente
                que caracteriza o meu trabalho, do primeiro contacto à escritura.
              </p>
              <p>
                Represento a Keller Williams Portugal, a maior rede imobiliária do mundo, o que me
                permite oferecer aos meus clientes o alcance de uma rede internacional com o
                cuidado de um serviço verdadeiramente pessoal.
              </p>
            </div>
            <Link
              to="/imoveis"
              className="mt-10 inline-block border border-gold text-gold px-8 py-3 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors"
            >
              Ver Imóveis
            </Link>
          </Reveal>
        </div>
      </section>

      {stats && (
        <section className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-3 border-t border-ink/10 pt-20 pb-20 md:pt-24 md:pb-24 gap-6 sm:gap-8">
            <Spec label="Imóveis em venda" value={stats.number_of_properties} size="lg" center animate />
            <Spec label="Imóveis vendidos" value={stats.properties_sold} size="lg" center animate />
            <Spec label="Anos de experiência" value={`${stats.years_since}+`} size="lg" center animate />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 md:px-8 pb-24 md:pb-32">
        <Reveal className="text-center mb-14 md:mb-20">
          <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-4">
            Como trabalho
          </p>
          <h2 className="font-display text-3xl md:text-4xl">Três princípios que guiam cada negócio.</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-16">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 100} className="text-center">
              <TickRule className="w-10 mx-auto mb-8" />
              <p className="font-display text-xl text-gold mb-5">{v.title}</p>
              <p className="text-sm text-stone leading-relaxed">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-charcoal py-24 md:py-32">
        <Reveal className="text-center mb-14 md:mb-20">
          <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-4">
            Distinções
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-paper">Prémios e Reconhecimentos.</h2>
        </Reveal>

        <div className="mx-auto max-w-2xl px-6 md:px-8">
          {AWARDS.map((award, i) => (
            <Reveal
              key={award.title}
              delay={i * 80}
              className="flex items-baseline gap-6 py-7 border-t border-paper/10 last:border-b"
            >
              <span className="font-mono text-lg text-gold w-12 shrink-0">{award.count}</span>
              <span className="font-display text-2xl text-paper">{award.title}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
