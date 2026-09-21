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
import { useLang } from "../i18n";

export default function Home() {
  const { t, path } = useLang();
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
              {t("home.heroEyebrow")}
            </p>
            <TickRule className="w-16 mb-6" />
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-[1.05] md:leading-[0.95] max-w-xl">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-6 text-stone max-w-md text-lg font-light">
              {t("home.heroSub")}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to={path("properties")}
                className="inline-flex items-center gap-3 border border-gold text-gold-deep px-8 py-3 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors"
              >
                {t("common.viewProperties")}
              </Link>
              <Link
                to={path("about")}
                className="inline-block border-b border-ink/25 text-stone text-sm tracking-wide pb-1 hover:border-gold hover:text-gold-deep transition-colors"
              >
                {t("home.meetMagda")}
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
              <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-6">{t("home.aboutEyebrow")}</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.1] max-w-2xl">
                {t("home.aboutTitle")}
              </h2>
            </Reveal>

            {stats && (
              <Reveal
                delay={200}
                className="mt-16 md:mt-20 grid grid-cols-3 gap-6 md:gap-8 border-t border-ink/10 pt-10"
              >
                <Spec label={t("home.forSale")} value={stats.number_of_properties} size="lg" center animate />
                <Spec label={t("home.sold")} value={stats.properties_sold} size="lg" center animate />
                <Spec label={t("home.yearsLabel")} value={`${stats.years_since}+`} size="lg" center animate />
              </Reveal>
            )}
          </div>

          <Reveal delay={120} className="border border-ink/10 p-8 md:p-10 flex flex-col justify-center items-start">
            <p className="text-stone leading-relaxed">
              {t("home.aboutBlurb", {
                years: <span className="text-gold-deep font-medium">{t("home.yearsPhrase", { n: stats?.years_since ?? 10 })}</span>,
                decades: <span className="text-gold-deep font-medium">{t("home.decadesPhrase")}</span>,
              })}
            </p>
            <Link
              to={path("about")}
              className="mt-6 inline-block border-b border-gold text-sm tracking-wide pb-1 hover:text-gold-deep transition-colors"
            >
              {t("home.readMore")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Feedback — a pinned, fullscreen scrollytelling section: the primary
          quote disappears as each secondary testimonial crossfades in,
          driven by scroll position rather than a carousel timer. */}
      <ScrollFeedback featured={t("testimonials.featured")} others={t("testimonials.others")} />

      {/* Featured properties */}
      <section className="bg-paper py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <Reveal className="mb-14 md:mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-4">
                {t("home.propertiesEyebrow")}
              </p>
              <h2 className="font-display text-3xl md:text-5xl leading-snug text-ink max-w-xl">
                {t("home.propertiesTitle")}
              </h2>
            </div>
            <Link
              to={path("properties")}
              className="hidden md:inline-block shrink-0 border-b border-gold text-sm tracking-wide pb-1 hover:text-gold-deep transition-colors"
            >
              {t("home.viewAll")}
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
            <p className="text-stone text-sm">{t("home.loadError")}</p>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={railRef}
              role="region"
              aria-label={t("home.railLabel")}
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
            to={path("properties")}
            className="inline-block border-b border-gold text-sm tracking-wide pb-1 hover:text-gold-deep transition-colors"
          >
            {t("home.viewAllProperties")}
          </Link>
        </div>
      </section>

      {/* Lead form */}
      <section className="mx-auto max-w-2xl px-6 md:px-8 py-24 md:py-36 text-center">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-5">{t("home.contactEyebrow")}</p>
          <h2 className="font-display text-3xl md:text-5xl leading-snug mb-14">
            {t("home.contactTitle")}
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
