import { useEffect, useState } from "react";
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
  const [filters, setFilters] = useState({ search: "", bedrooms: "", price: "" });
  const [properties, setProperties] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => {
      getProperties(filters).then(setProperties);
    }, 200);
    return () => clearTimeout(id);
  }, [filters]);

  return (
    <div className="bg-paper min-h-screen">
      <Header />

      <section className="pt-40 pb-20 bg-charcoal">
        <div className="mx-auto max-w-7xl px-8">
          <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-4">Imóveis</p>
          <h1 className="font-display text-5xl text-paper max-w-xl">
            A preparar a nova etapa da sua vida.
          </h1>

          <div className="mt-16 flex flex-wrap items-end gap-8 border-t border-paper/10 pt-10">
            <Field label="Pesquisar">
              <input
                type="text"
                placeholder="Localização, nome…"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="bg-transparent border-b border-paper/30 text-paper placeholder:text-paper/40 py-2 text-sm focus:outline-none focus:border-gold transition-colors w-56"
              />
            </Field>
            <Field label="Quartos">
              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
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
                onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                className="bg-transparent border-b border-paper/30 text-paper py-2 text-sm focus:outline-none focus:border-gold transition-colors"
              >
                {PRICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="text-ink">
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            {properties && (
              <p className="ml-auto font-mono text-xs text-paper/50">
                {properties.length} {properties.length === 1 ? "imóvel" : "imóveis"}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-24">
        {properties === null ? (
          <p className="text-stone text-sm">A carregar…</p>
        ) : properties.length === 0 ? (
          <p className="text-stone text-sm py-16 text-center">
            Nenhuma propriedade disponível de momento.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-10">
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
      <label className="font-mono text-[10px] uppercase tracking-widest text-paper/40">
        {label}
      </label>
      {children}
    </div>
  );
}
