import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { useLang } from "../i18n";
import {
  useSobreStats,
  usePrefersReducedMotion,
  DrawnRule,
  AwardsSection,
  ContactCta,
} from "./sobre/shared";

const clamp = (n) => Math.min(1, Math.max(0, n));

// A statement that fills in word by word as it scrolls through the reading
// zone, so the one sentence that carries her pitch is read, not skimmed.
function ScrollWords({ text }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(reduced ? 1 : 0);
  const words = text.split(" ");

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    function update() {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setProgress(clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3)));
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <p ref={ref} className="font-display text-2xl leading-[1.3] sm:text-3xl lg:text-4xl">
      {words.map((word, i) => {
        const t = clamp(progress * words.length * 1.25 - i);
        return (
          <span key={i} style={{ opacity: 0.2 + 0.8 * t }}>
            {word}{" "}
          </span>
        );
      })}
    </p>
  );
}

function DimLine({ pct, label, delay }) {
  return (
    <div>
      <p className="develop font-mono text-[11px] uppercase tracking-widest text-gold-soft" style={{ "--d": `${delay + 500}ms` }}>
        {label}
      </p>
      <div className="mt-2.5" style={{ width: `${pct}%` }}>
        <div className="dim-rule rule-draw" style={{ "--d": `${delay}ms` }} />
      </div>
    </div>
  );
}

function ValueRow({ value, index }) {
  return (
    <div className="group">
      <DrawnRule className="bg-ink/15 transition-colors duration-500 group-hover:bg-gold" delay={index * 120} />
      <Reveal delay={index * 120 + 150} className="grid grid-cols-1 gap-4 py-9 md:grid-cols-[1fr_1.4fr] md:gap-12 md:py-12">
        <h3 className="font-display text-2xl transition-colors duration-500 group-hover:text-gold-deep md:text-3xl">
          {value.title}
        </h3>
        <p className="max-w-md leading-relaxed text-stone">{value.text}</p>
      </Reveal>
    </div>
  );
}

export default function Sobre() {
  const { t, path } = useLang();
  const stats = useSobreStats();
  const years = stats?.years_since ?? 10;
  const values = t("about.values");

  return (
    <div className="bg-paper">
      <Header />

      <section className="overflow-hidden bg-charcoal text-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-10 px-6 pt-32 md:grid-cols-[1fr_auto] md:gap-12 md:px-8 md:pt-44 lg:gap-20">
          <div className="pb-2 md:pb-24">
            <h1 className="font-display text-4xl leading-[1.04] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
              <span className="line-mask">
                <span className="line-up text-balance" style={{ "--d": "300ms" }}>{t("about.heroLine1")}</span>
              </span>
              <span className="line-mask">
                <span className="line-up text-balance italic text-gold-soft" style={{ "--d": "480ms" }}>
                  {t("about.heroLine2")}
                </span>
              </span>
            </h1>

            <p className="develop mt-8 max-w-md leading-relaxed text-paper/75" style={{ "--d": "900ms" }}>
              {t("about.intro", { years })}
            </p>

            <div className="mt-14 max-w-md space-y-9 md:mt-16">
              <DimLine pct={100} label={t("about.dimEngineering")} delay={700} />
              <DimLine pct={Math.min(100, (years / 20) * 100)} label={t("about.dimMarket", { years })} delay={950} />
            </div>
          </div>

          <img
            src="/static/landingpage/FotoMagdaSemFundo.webp"
            alt={t("about.photoAlt")}
            width="884"
            height="1080"
            className="wipe-up mx-auto block w-4/5 max-w-sm md:mx-0 md:w-[19rem] lg:w-[24rem]"
            style={{
              mixBlendMode: "multiply",
              filter: "grayscale(1) brightness(1.35) contrast(1.08)",
              "--d": "250ms",
            }}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-40">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[7fr_4fr] md:gap-24">
          <ScrollWords text={t("about.standfirst")} />

          <Reveal delay={100} className="md:pt-3">
            <p className="leading-relaxed text-stone">{t("about.kw")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to={path("properties")}
                className="inline-block border border-gold px-8 py-3 text-sm tracking-wide text-gold-deep transition-colors hover:bg-gold hover:text-ink"
              >
                {t("common.viewProperties")}
              </Link>
              {stats && (
                <p className="font-mono text-xs uppercase tracking-widest text-stone">
                  {t("common.soldCount", { n: stats.properties_sold })}
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-8 md:pb-40">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[4fr_8fr] md:gap-20">
          <Reveal>
            <h2 className="font-display text-3xl leading-[1.1] md:sticky md:top-32 md:text-4xl">
              {t("about.principlesTitle")}
            </h2>
          </Reveal>
          <div>
            {values.map((v, i) => (
              <ValueRow key={v.title} value={v} index={i} />
            ))}
            <DrawnRule delay={values.length * 120} />
          </div>
        </div>
      </section>

      <AwardsSection />
      <ContactCta />
      <Footer />
    </div>
  );
}
