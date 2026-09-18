import { useEffect, useState } from "react";
import Reveal from "../../components/Reveal";
import { useReveal } from "../../hooks/useReveal";
import { getStats } from "../../api/client";
import { WHATSAPP_HREF } from "../../components/WhatsAppButton";

export const VALUES = [
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

export const AWARDS = [
  { count: "3×", title: "Top 10 Mega Teams" },
  { count: "3×", title: "Top 3 Income" },
  { count: "2×", title: "Ouro KW Abaco" },
  { count: "1×", title: "Prata KW Abaco" },
  { count: "9×", title: "Capper" },
];

export const KW_TEXT =
  "Represento a Keller Williams Portugal, a maior rede imobiliária do mundo, o que me permite oferecer aos meus clientes o alcance de uma rede internacional com o cuidado de um serviço verdadeiramente pessoal.";

export function useSobreStats() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    let live = true;
    getStats()
      .then((s) => live && setStats(s))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return stats;
}

export function usePrefersReducedMotion() {
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  return reduced;
}

// One hairline that draws itself in from the left once it scrolls into view.
export function DrawnRule({ delay = 0, className = "bg-ink/15" }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`h-px w-full origin-left ${className}`}
      style={{
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transition: `transform 1.2s cubic-bezier(0.65,0,0.35,1) ${delay}ms`,
      }}
    />
  );
}

function AwardRow({ award, index }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="group relative">
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-px w-full origin-left bg-paper/15 transition-colors duration-500 group-hover:bg-gold-soft"
        style={{
          transform: visible ? "scaleX(1)" : "scaleX(0)",
          transition: `transform 1.2s cubic-bezier(0.65,0,0.35,1) ${index * 90}ms, background-color 0.5s`,
        }}
      />
      <div
        className="flex items-baseline gap-6 py-7"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 90 + 200}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 90 + 200}ms`,
        }}
      >
        <span className="font-mono text-xl text-gold-soft w-14 shrink-0 tabular-nums">{award.count}</span>
        <span className="font-display text-2xl text-paper transition-transform duration-500 ease-out group-hover:translate-x-2">
          {award.title}
        </span>
      </div>
    </div>
  );
}

export function AwardsSection() {
  return (
    <section className="bg-charcoal py-24 md:py-32">
      <Reveal className="text-center mb-14 md:mb-20 px-6">
        <h2 className="font-display text-3xl md:text-5xl text-paper">Prémios e reconhecimentos.</h2>
      </Reveal>

      <div className="mx-auto max-w-2xl px-6 md:px-8">
        {AWARDS.map((award, i) => (
          <AwardRow key={award.title} award={award} index={i} />
        ))}
        <DrawnRule className="bg-paper/15" delay={AWARDS.length * 90} />
      </div>
    </section>
  );
}

export function ContactCta() {
  return (
    <section className="bg-paper py-24 md:py-36">
      <Reveal className="mx-auto max-w-3xl px-6 text-center md:px-8">
        <h2 className="font-display text-3xl leading-[1.08] sm:text-4xl md:text-5xl">Vamos falar do seu imóvel.</h2>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-stone">
          Conte-me o que procura; acompanho todo o processo, do primeiro contacto à escritura.
        </p>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-block bg-gold px-8 py-3 text-sm tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Falar com a Magda
        </a>
      </Reveal>
    </section>
  );
}
