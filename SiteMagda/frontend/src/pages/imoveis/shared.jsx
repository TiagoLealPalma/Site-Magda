import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProperties } from "../../api/client";
import { useWhatsappHref } from "../../components/WhatsAppButton";
import { useLang, useT } from "../../i18n";
import { formatArea, formatPrice } from "../../utils/format";
import Reveal from "../../components/Reveal";

const PRICE_STEPS = ["100000", "200000", "300000", "500000", "800000"];
const CATEGORY_PARAMS = ["housing", "commercial", "land"];
const RENT_STEPS = ["500", "750", "1000", "1500", "2000"];

// URL value <-> API value for the buy/rent switch.
const TYPE_PARAM = { venda: "sale", arrendar: "rent" };
const TYPE_TO_PARAM = { sale: "venda", rent: "arrendar" };

// The three dropdowns, labelled and worded in the visitor's language.
function useSelects(filters) {
  const { t, lang } = useLang();
  const rent = filters.type === "rent";
  return [
    [
      "category",
      t("category.label"),
      [
        { value: "", label: t("filters.all") },
        { value: "housing", label: t("category.housing") },
        { value: "commercial", label: t("category.commercial") },
        { value: "land", label: t("category.land") },
      ],
    ],
    [
      "type",
      t("listing.type"),
      [
        { value: "", label: t("filters.all") },
        { value: "sale", label: t("listing.sale") },
        { value: "rent", label: t("listing.rentFilter") },
      ],
    ],
    [
      "bedrooms",
      t("filters.bedrooms"),
      [
        { value: "", label: t("filters.all") },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5+" },
      ],
    ],
    [
      "price",
      rent ? t("listing.maxRent") : t("filters.maxPrice"),
      [
        { value: "", label: t("filters.noLimit") },
        ...(rent ? RENT_STEPS : PRICE_STEPS).map((v) => ({
          value: v,
          label: t("filters.upTo", { price: formatPrice(v, lang, rent) }),
        })),
      ],
    ],
    [
      "sort",
      t("filters.sort"),
      [
        { value: "", label: t("filters.sortDefault") },
        { value: "preco-asc", label: t("filters.sortAsc") },
        { value: "preco-desc", label: t("filters.sortDesc") },
      ],
    ],
  ];
}

const byPrice = (dir) => (a, b) => dir * ((Number(a.price) || 0) - (Number(b.price) || 0));

// Filters live in the URL so a search can be shared or reloaded; results are
// fetched debounced and stale responses are dropped so fast typing never
// flashes old results over new ones.
export function useProperties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    type: TYPE_PARAM[searchParams.get("tipo")] || "",
    category: CATEGORY_PARAMS.includes(searchParams.get("categoria")) ? searchParams.get("categoria") : "",
    bedrooms: searchParams.get("bedrooms") || "",
    price: searchParams.get("price") || "",
    sort: searchParams.get("ordem") || "",
  });
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const hasActive = Boolean(filters.search || filters.type || filters.category || filters.bedrooms || filters.price);

  function update(next) {
    // Sale and rent prices live on different scales, so a cap set for one
    // never carries over to the other.
    if (next.type !== filters.type) next = { ...next, price: "" };
    setFilters(next);
    const params = {};
    if (next.search) params.search = next.search;
    if (next.category) params.categoria = next.category;
    if (next.type) params.tipo = TYPE_TO_PARAM[next.type];
    if (next.bedrooms) params.bedrooms = next.bedrooms;
    if (next.price) params.price = next.price;
    if (next.sort) params.ordem = next.sort;
    setSearchParams(params, { replace: true });
  }

  function clear() {
    update({ ...filters, search: "", type: "", category: "", bedrooms: "", price: "" });
  }

  useEffect(() => {
    let live = true;
    setError(false);
    const id = setTimeout(() => {
      getProperties({ search: filters.search, type: filters.type, category: filters.category, bedrooms: filters.bedrooms, price: filters.price })
        .then((d) => live && setData(d))
        .catch(() => live && setError(true));
    }, 200);
    return () => {
      live = false;
      clearTimeout(id);
    };
  }, [filters.search, filters.type, filters.category, filters.bedrooms, filters.price, attempt]);

  const properties = useMemo(() => {
    if (!data) return null;
    if (filters.sort === "preco-asc") return [...data].sort(byPrice(1));
    if (filters.sort === "preco-desc") return [...data].sort(byPrice(-1));
    return data;
  }, [data, filters.sort]);

  return {
    filters,
    update,
    clear,
    hasActive,
    properties,
    error,
    retry: () => setAttempt((a) => a + 1),
  };
}

export function specRows(p, t) {
  const rows = [{ label: t("spec.type"), value: p.typology || (p.bedrooms ? `T${p.bedrooms}` : "—") }];
  if (p.category && p.category !== "housing") rows.push({ label: t("category.label"), value: t(`category.${p.category}`) });
  if (formatArea(p.area)) rows.push({ label: t("spec.area"), value: `${formatArea(p.area)} m²` });
  if (formatArea(p.liquid_area)) rows.push({ label: t("spec.usableArea"), value: `${formatArea(p.liquid_area)} m²` });
  if (p.bathrooms) rows.push({ label: t("spec.wc"), value: String(p.bathrooms) });
  if (p.construction_date) rows.push({ label: t("spec.year"), value: String(p.construction_date) });
  return rows;
}

// Labelled mono figures separated by hairline dividers: the site's "ledger"
// voice, so a listing reads as data before it reads as a photo.
export function SpecLedger({ rows, tone = "light", className = "" }) {
  const divider = tone === "dark" ? "border-paper/15" : "border-ink/15";
  const value = tone === "dark" ? "text-paper" : "text-ink";
  const label = tone === "dark" ? "text-paper/60" : "text-stone";
  return (
    <dl className={`flex flex-wrap gap-y-4 ${className}`}>
      {rows.map((r) => (
        <div key={r.label} className={`mr-5 border-r pr-5 last:mr-0 last:border-r-0 last:pr-0 ${divider}`}>
          <dd className={`font-mono text-sm tabular-nums ${value}`}>{r.value}</dd>
          <dt className={`mt-1 text-[11px] uppercase tracking-widest ${label}`}>{r.label}</dt>
        </div>
      ))}
    </dl>
  );
}

function Chevron({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="M2 4.5l4 4 4-4" />
    </svg>
  );
}

// A listbox in the site's own voice instead of the browser's native picker:
// hairline-bordered paper panel, gold marker on the current answer, full
// keyboard support (arrows, Home/End, Enter/Space, Esc, type-ahead).
function Select({ id, value, onChange, options, variant = "flat" }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  function openList() {
    setActive(selectedIndex);
    setOpen(true);
  }

  function choose(i) {
    onChange(options[i].value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(e) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    } else if (e.key.length === 1) {
      const next = options.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (next >= 0) setActive(next);
    }
  }

  const triggerClass =
    variant === "flat"
      ? "min-h-11 border-b border-ink/25 py-2 text-base focus-visible:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      : "py-0.5 text-sm";

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 bg-transparent text-left text-ink focus:outline-none ${triggerClass}`}
      >
        <span className="truncate">{selected.label}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          className="absolute left-0 top-full z-50 mt-2 w-max min-w-full max-w-[18rem] border border-ink/15 bg-paper py-1.5"
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={`flex cursor-pointer items-center gap-3 whitespace-nowrap px-4 py-2.5 text-sm ${
                i === active ? "bg-ink/5" : ""
              } ${i === selectedIndex ? "font-medium text-ink" : "text-stone"}`}
            >
              <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 ${i === selectedIndex ? "bg-gold" : ""}`} />
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Search field with our own clear control (the browser's built-in one is
// stripped) and a gold caret.
function SearchInput({ id, value, onChange, variant = "flat" }) {
  const t = useT();
  const ref = useRef(null);
  const fieldClass =
    variant === "flat"
      ? "min-h-11 border-b border-ink/25 py-2 text-base focus-visible:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      : "py-0.5 text-sm";
  return (
    <div className="relative flex items-center">
      <input
        ref={ref}
        id={id}
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        placeholder={t("filters.searchPlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full min-w-0 bg-transparent pr-7 text-ink caret-gold placeholder:text-stone focus:outline-none ${fieldClass}`}
      />
      {value && (
        <button
          type="button"
          aria-label={t("filters.clearSearch")}
          onClick={() => {
            onChange("");
            ref.current?.focus();
          }}
          className="absolute right-0 flex h-8 w-8 items-center justify-center text-stone transition-colors hover:text-ink"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
      )}
    </div>
  );
}

function Segment({ id, label, className = "", children }) {
  return (
    <div
      className={`relative flex min-w-0 flex-col justify-center px-5 py-2 transition-colors hover:bg-ink/5 focus-within:bg-ink/5 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-gold ${className}`}
    >
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-widest text-stone">
        {label}
      </label>
      {children}
    </div>
  );
}

// A dimension tick between fields: the site's blueprint motif turned into a
// divider.
function Tick() {
  return <span aria-hidden="true" className="h-8 w-px shrink-0 bg-gold/50" />;
}

// The floating state: a frosted white plate that detaches from the page
// with a gap above it, in the same flat, sharp-cornered voice as the rest of
// the site: gold hairline, gold crop marks at the corners, gold ticks between
// fields. Light on purpose: it passes over navy listing cards and must never
// read as one of them.
function FloatFilters({ filters, update, clear, hasActive, count, idPrefix, className = "" }) {
  const t = useT();
  const selects = useSelects(filters);
  const p = idPrefix;
  const showClear = hasActive && count !== 0;

  return (
    <div className={`relative flex items-center border border-gold/35 bg-white/85 p-1.5 text-ink backdrop-blur-xl ${className}`}>
      {["-left-px -top-px border-l border-t", "-right-px -top-px border-r border-t", "-bottom-px -left-px border-b border-l", "-bottom-px -right-px border-b border-r"].map((corner) => (
        <span key={corner} aria-hidden="true" className={`pointer-events-none absolute h-2 w-2 border-gold ${corner}`} />
      ))}
      <Segment id={`${p}-search`} label={t("filters.search")} className="flex-[1.7]">
        <SearchInput id={`${p}-search`} value={filters.search} onChange={(v) => update({ ...filters, search: v })} variant="float" />
      </Segment>
      {selects.map(([key, label, options]) => (
        <div key={key} className="flex flex-1 items-center">
          <Tick />
          <Segment id={`${p}-${key}`} label={label} className="flex-1">
            <Select
              id={`${p}-${key}`}
              value={filters[key]}
              onChange={(v) => update({ ...filters, [key]: v })}
              options={options}
              variant="float"
            />
          </Segment>
        </div>
      ))}
      <Tick />
      <div className="flex min-w-[9.5rem] flex-col justify-center px-5 py-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-stone">{t("filters.results")}</p>
        <p aria-live="polite" className="whitespace-nowrap font-mono text-sm tabular-nums text-gold-deep">
          {count === null ? t("common.loading") : `${count} ${count === 1 ? t("filters.one") : t("filters.many")}`}
          {showClear && (
            <button
              type="button"
              onClick={clear}
              className="ml-3 font-sans text-xs text-ink underline underline-offset-4 transition-colors hover:text-gold-deep"
            >
              {t("filters.clear")}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

function FlatField({ id, label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-widest text-stone">
        {label}
      </label>
      {children}
    </div>
  );
}

// The resting state: plain underlined fields on the page, in the site's
// mono-label voice.
function FlatFilters({ filters, update, clear, hasActive, count, idPrefix, className = "" }) {
  const t = useT();
  const selects = useSelects(filters);
  const p = idPrefix;
  const showClear = hasActive && count !== 0;

  return (
    <div className={`grid grid-cols-2 items-end gap-x-6 gap-y-4 md:grid-cols-[minmax(0,1.6fr)_repeat(5,minmax(0,1fr))_auto] md:gap-x-8 ${className}`}>
      <div className="col-span-2 md:col-span-1">
        <FlatField id={`${p}-search`} label={t("filters.search")}>
          <SearchInput id={`${p}-search`} value={filters.search} onChange={(v) => update({ ...filters, search: v })} />
        </FlatField>
      </div>
      {selects.map(([key, label, options]) => (
        <FlatField key={key} id={`${p}-${key}`} label={label}>
          <Select
            id={`${p}-${key}`}
            value={filters[key]}
            onChange={(v) => update({ ...filters, [key]: v })}
            options={options}
          />
        </FlatField>
      ))}
      <div className="flex min-h-11 flex-wrap items-center justify-end gap-x-5 gap-y-1">
        {showClear && (
          <button
            type="button"
            onClick={clear}
            className="min-h-11 font-mono text-xs text-stone underline underline-offset-4 transition-colors hover:text-gold-deep"
          >
            {t("filters.clearFilters")}
          </button>
        )}
        <p aria-live="polite" className="font-mono text-xs tabular-nums text-stone">
          {count === null ? t("common.loading") : `${count} ${count === 1 ? t("filters.one") : t("filters.many")}`}
        </p>
      </div>
    </div>
  );
}

export function FilterBar({ variant = "flat", idPrefix = "f", ...props }) {
  return variant === "float" ? (
    <FloatFilters idPrefix={idPrefix} {...props} />
  ) : (
    <FlatFilters idPrefix={idPrefix} {...props} />
  );
}

export function LoadingState({ tone = "light" }) {
  const t = useT();
  return (
    <div role="status" className="py-24 text-center">
      <div className={`relative mx-auto h-px w-40 overflow-hidden ${tone === "dark" ? "bg-paper/15" : "bg-ink/10"}`}>
        <div className="rule-scan absolute inset-y-0 left-0 bg-gold" />
      </div>
      <p className="mt-5 font-mono text-xs uppercase tracking-widest text-stone">{t("properties.loadingProperties")}</p>
    </div>
  );
}

export function ErrorState({ retry }) {
  const t = useT();
  return (
    <div role="alert" className="py-20 text-center">
      <p className="font-display text-2xl">{t("properties.errorTitle")}</p>
      <p className="mt-3 text-sm text-stone">{t("properties.errorText")}</p>
      <button
        type="button"
        onClick={retry}
        className="mt-8 border border-gold px-8 py-3 text-sm tracking-wide text-gold-deep transition-colors hover:bg-gold hover:text-ink"
      >
        {t("common.tryAgain")}
      </button>
    </div>
  );
}

export function EmptyState({ hasActive, clear }) {
  const t = useT();
  const href = useWhatsappHref();
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <p className="font-display text-3xl leading-tight md:text-4xl">
        {hasActive ? t("properties.emptyFiltered") : t("properties.emptyAll")}
      </p>
      <p className="mt-4 leading-relaxed text-stone">
        {t("properties.emptyText")}
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-gold px-8 py-3 text-sm tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {t("common.talkToMagda")}
        </a>
        {hasActive && (
          <button
            type="button"
            onClick={clear}
            className="min-h-11 border-b border-ink/25 pb-1 text-sm tracking-wide text-stone transition-colors hover:border-gold hover:text-gold-deep"
          >
            {t("filters.clearFilters")}
          </button>
        )}
      </div>
    </div>
  );
}

export function ContactBand() {
  const t = useT();
  const href = useWhatsappHref();
  return (
    <section className="bg-charcoal py-20 text-paper md:py-28">
      <Reveal className="mx-auto max-w-3xl px-6 text-center md:px-8">
        <h2 className="font-display text-3xl leading-[1.1] md:text-5xl">{t("properties.contactTitle")}</h2>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-paper/75">
          {t("properties.contactText")}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-block bg-gold px-8 py-3 text-sm tracking-wide text-ink transition-colors hover:bg-paper"
        >
          {t("common.talkToMagda")}
        </a>
      </Reveal>
    </section>
  );
}
