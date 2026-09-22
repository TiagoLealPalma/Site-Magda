import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";
import Reveal from "../components/Reveal";
import { coverImage, formatPrice } from "../utils/format";
import { useLang, useT, localizedProperty } from "../i18n";
import ListingCard from "../components/ListingCard";
import { propertyParam } from "../seo/slug";
import { getProperties } from "../api/client";
import {
  useProperties,
  specRows,
  SpecLedger,
  FilterBar,
  LoadingState,
  ErrorState,
  EmptyState,
  ContactBand,
} from "./imoveis/shared";

function pickFeatured(list) {
  const byPrice = [...list].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  return byPrice.find((p) => p.status === "available") || byPrice[0] || null;
}

function Featured({ property: raw }) {
  const { t, lang, path } = useLang();
  const property = localizedProperty(raw, lang);
  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-charcoal text-paper">
      <div
        className="kenburns absolute inset-0 bg-cover"
        style={{ backgroundImage: `url('${coverImage(property)}')`, backgroundPosition: "center 80%" }}
        role="img"
        aria-label={property.name}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 md:px-8 md:pb-20">
        <StatusBadge status={property.status} className="mb-5" />
        <p className="line-mask font-mono text-xs uppercase tracking-widest text-paper/80">
          <span className="line-up" style={{ "--d": "250ms" }}>{property.address}</span>
        </p>
        <h2 className="mt-4 max-w-4xl font-display text-4xl leading-[1.03] tracking-[-0.02em] sm:text-5xl lg:text-7xl">
          <span className="line-mask">
            <span className="line-up text-balance" style={{ "--d": "380ms" }}>{property.name}</span>
          </span>
        </h2>
        <div className="develop mt-8 flex flex-wrap items-end justify-between gap-x-12 gap-y-8" style={{ "--d": "900ms" }}>
          <div className="flex flex-wrap items-end gap-x-12 gap-y-6">
            <p className="font-mono text-2xl tabular-nums text-gold-soft md:text-3xl">{formatPrice(property.price, lang)}</p>
            <SpecLedger rows={specRows(property, t)} tone="dark" />
          </div>
          <Link
            to={path("property", { id: propertyParam(property, lang) })}
            className="inline-block border border-gold-soft px-8 py-3 text-sm tracking-wide text-gold-soft transition-colors hover:bg-gold-soft hover:text-ink"
          >
            {t("properties.viewProperty")}
          </Link>
        </div>
        <div className="develop mt-12 flex items-center gap-5" style={{ "--d": "1200ms" }}>
          <div className="dim-rule rule-draw w-24" style={{ "--d": "1200ms" }} />
          <a
            href="#lista"
            className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-widest text-paper/80 transition-colors hover:text-gold-soft"
          >
            {t("properties.allLink")} <span aria-hidden="true" className="ml-2">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function FeaturedFallback() {
  const t = useT();
  return (
    <section className="bg-charcoal pb-14 pt-32 text-paper md:pb-20 md:pt-44">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <h2 className="max-w-3xl font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
          {t("properties.fallbackTitle")}
        </h2>
      </div>
    </section>
  );
}

// The filters sit on the page as plain underlined fields. Once they scroll
// out of view, the same controls reappear as a floating plate under the header
// (or near the top edge while the header is tucked away), and leave again when
// the listings end.
function useFloatingFilters(flatRef, sectionRef) {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    let raf = 0;
    function update() {
      raf = 0;
      const flat = flatRef.current;
      const section = sectionRef.current;
      if (!flat || !section) return;
      const past = flat.getBoundingClientRect().bottom < 88;
      const within = section.getBoundingClientRect().bottom > 260;
      setFloating(past && within);
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
  }, [flatRef, sectionRef]);

  return floating;
}

export default function Properties() {
  const { t } = useLang();
  const { filters, update, clear, hasActive, properties, error, retry } = useProperties();
  const [featured, setFeatured] = useState(undefined);
  const flatRef = useRef(null);
  const sectionRef = useRef(null);
  const floating = useFloatingFilters(flatRef, sectionRef);
  const filterProps = { filters, update, clear, hasActive, count: properties ? properties.length : null };

  useEffect(() => {
    let live = true;
    getProperties({})
      .then((list) => live && setFeatured(pickFeatured(list)))
      .catch(() => live && setFeatured(null));
    return () => {
      live = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main id="main">
      <h1 className="sr-only">{t("properties.pageTitle")}</h1>

      {featured ? <Featured property={featured} /> : featured === null ? <FeaturedFallback /> : <div className="min-h-[92svh] bg-charcoal" />}

      <section ref={sectionRef} id="lista" className="mx-auto max-w-7xl scroll-mt-20 px-6 pb-16 pt-16 md:px-8 md:pb-28 md:pt-24">
        <Reveal>
          <h2 className="mb-10 font-display text-3xl leading-[1.08] md:mb-12 md:text-5xl">
            {hasActive ? t("properties.resultsTitle") : t("properties.allTitle")}
          </h2>
        </Reveal>

        <div ref={flatRef}>
          <FilterBar variant="flat" idPrefix="f" {...filterProps} />
        </div>

        <div className="mt-8 md:mt-12">
          {error ? (
            <ErrorState retry={retry} />
          ) : properties === null ? (
            <LoadingState />
          ) : properties.length === 0 ? (
            <EmptyState hasActive={hasActive} clear={clear} />
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p, i) => (
                <ListingCard key={p.id} property={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div
        inert={!floating}
        aria-hidden={!floating}
        className={`filter-float pointer-events-none fixed inset-x-0 z-30 hidden transition-[opacity,transform,top] duration-500 ease-out md:block ${
          floating ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <div className="pointer-events-auto mx-auto max-w-7xl px-8">
          <FilterBar variant="float" idPrefix="fp" {...filterProps} />
        </div>
      </div>

      <ContactBand />
      </main>
      <Footer />
    </div>
  );
}
