import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import { getProperties } from "../api/client";

const BEDROOM_OPTIONS = [
  { value: "", label: "Nº de Quartos" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5+" },
];

const PRICE_OPTIONS = [
  { value: "", label: "Preço máximo" },
  { value: "100000", label: "Até 100.000 €" },
  { value: "200000", label: "Até 200.000 €" },
  { value: "300000", label: "Até 300.000 €" },
  { value: "500000", label: "Até 500.000 €" },
  { value: "800000", label: "Até 800.000 €" },
];

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    price: searchParams.get("price") || "",
  });
  const [properties, setProperties] = useState(null);
  const [error, setError] = useState(false);
  const hasActiveFilters = Boolean(filters.search || filters.bedrooms || filters.price);

  function updateFilters(next) {
    setFilters(next);
    const params = {};
    if (next.search) params.search = next.search;
    if (next.bedrooms) params.bedrooms = next.bedrooms;
    if (next.price) params.price = next.price;
    setSearchParams(params, { replace: true });
  }

  function clearFilters() {
    updateFilters({ search: "", bedrooms: "", price: "" });
  }

  useEffect(() => {
    setError(false);
    const id = setTimeout(() => {
      getProperties(filters)
        .then(setProperties)
        .catch(() => setError(true));
    }, 200);
    return () => clearTimeout(id);
  }, [filters]);

  return (
    <div className="bg-paper min-h-screen">
      <Header />

      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <p className="font-mono text-xs tracking-[0.3em] text-gold-soft uppercase mb-4">Imóveis</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-snug md:leading-tight text-paper max-w-xl">
            A preparar a nova etapa da sua vida.
          </h1>

          <div className="mt-14 md:mt-16 flex flex-wrap items-end gap-6 md:gap-8 border-t border-paper/10 pt-9 md:pt-10">
            <Field label="Pesquisar">
              <input
                type="text"
                placeholder="Localização, nome…"
                value={filters.search}
                onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
                className="bg-transparent border-b border-paper/30 text-paper placeholder:text-paper/40 py-2 text-sm focus:outline-none focus:border-gold transition-colors w-full sm:w-56"
              />
            </Field>
            <Field label="Quartos">
              <select
                value={filters.bedrooms}
                onChange={(e) => updateFilters({ ...filters, bedrooms: e.target.value })}
                className="bg-transparent border-b border-paper/30 text-paper py-2 text-sm focus:outline-none focus:border-gold transition-colors"
              >
                {BEDROOM_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="text-ink">
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Preço">
              <select
                value={filters.price}
                onChange={(e) => updateFilters({ ...filters, price: e.target.value })}
                className="bg-transparent border-b border-paper/30 text-paper py-2 text-sm focus:outline-none focus:border-gold transition-colors"
              >
                {PRICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="text-ink">
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="font-mono text-xs text-paper/70 hover:text-gold-soft underline underline-offset-4 transition-colors"
              >
                Limpar filtros
              </button>
            )}
            {properties && (
              <p className="ml-auto font-mono text-xs text-paper/50">
                {properties.length} {properties.length === 1 ? "imóvel" : "imóveis"}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-24">
        {error ? (
          <div className="text-center py-16">
            <p className="text-stone text-sm">
              Não foi possível carregar os imóveis. Verifique a sua ligação.
            </p>
            <button
              type="button"
              onClick={() => setFilters({ ...filters })}
              className="mt-4 border border-gold text-gold px-6 py-2 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : properties === null ? (
          <p className="text-stone text-sm">A carregar…</p>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone text-sm">
              {hasActiveFilters
                ? "Nenhum imóvel corresponde aos filtros selecionados."
                : "Nenhuma propriedade disponível de momento."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 border border-gold text-gold px-6 py-2 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[11px] uppercase tracking-widest text-paper/70">
        {label}
      </label>
      {children}
    </div>
  );
}
