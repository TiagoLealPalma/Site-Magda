import { useEffect, useState } from "react";
import Reveal from "./Reveal";

const TESTIMONIALS = [
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
  {
    text: "Vendi em 23 dias depois de mais de dois anos noutra imobiliária. A Magda faz mesmo a diferença!",
    author: "Sílvia Fernandes",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, []);

  const current = TESTIMONIALS[active];

  return (
    <section className="bg-paper py-32">
      <Reveal className="text-center mb-16">
        <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-5">Feedback</p>
        <h2 className="font-display text-3xl md:text-4xl text-ink max-w-xl mx-auto leading-snug">
          Não confie em nós, confie em quem já confiou.
        </h2>
      </Reveal>

      <div className="relative mx-auto max-w-2xl px-8">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 font-display text-[10rem] leading-none text-gold/[0.08] select-none"
        >
          “
        </span>

        <div className="relative min-h-[11rem] flex flex-col items-center justify-center text-center">
          <p
            key={active}
            className="font-display text-xl md:text-2xl leading-relaxed tracking-tight text-ink animate-[fadein_0.6s_ease-out]"
          >
            {current.text}
          </p>
          <p
            key={`${active}-author`}
            className="mt-6 font-mono text-xs tracking-widest uppercase text-gold animate-[fadein_0.8s_ease-out]"
          >
            {current.author}
          </p>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Testemunho ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-gold" : "w-1.5 bg-ink/15"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
