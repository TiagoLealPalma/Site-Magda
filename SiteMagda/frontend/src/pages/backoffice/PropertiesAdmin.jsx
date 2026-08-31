import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/adminClient";
import { formatPrice } from "../../utils/format";

const STATUS_LABELS = {
  available: "Disponível",
  coming_soon: "Brevemente",
  reserved: "Reservado",
};

export default function PropertiesAdmin() {
  const [properties, setProperties] = useState(null);

  function reload() {
    adminApi.listProperties().then(setProperties);
  }

  useEffect(reload, []);

  async function handleDelete(id, name) {
    if (!confirm(`Apagar "${name}"? Esta ação não pode ser desfeita.`)) return;
    await adminApi.deleteProperty(id);
    reload();
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-2">Imóveis</p>
          <h1 className="font-display text-3xl text-ink">Gerir imóveis.</h1>
        </div>
        <Link
          to="/backoffice/imoveis/novo"
          className="self-start sm:self-auto bg-gold text-ink text-sm px-6 py-3 hover:bg-gold-soft transition-colors"
        >
          Novo Imóvel
        </Link>
      </div>

      <div className="bg-white border border-ink/10">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-ink/10 font-mono text-[10px] uppercase tracking-widest text-stone">
          <span>Nome</span>
          <span>Preço</span>
          <span>Tipologia</span>
          <span>Fotos</span>
          <span>Estado</span>
          <span></span>
        </div>

        {properties === null ? (
          <p className="p-6 text-sm text-stone">A carregar…</p>
        ) : properties.length === 0 ? (
          <p className="p-6 text-sm text-stone">Ainda não há imóveis.</p>
        ) : (
          properties.map((p) => (
            <div
              key={p.id}
              className="px-6 py-4 border-b border-ink/5 last:border-0 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] md:gap-4 md:items-center"
            >
              <span className="block text-sm text-ink font-medium md:font-normal">{p.name}</span>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone md:hidden">
                <span className="font-mono">{formatPrice(p.price)}</span>
                <span>·</span>
                <span>{p.typology}</span>
                <span>·</span>
                <span>{p.images.length} {p.images.length === 1 ? "foto" : "fotos"}</span>
                <span>·</span>
                <span>{STATUS_LABELS[p.status] || p.status}</span>
              </div>
              <span className="hidden md:inline font-mono text-sm text-stone">{formatPrice(p.price)}</span>
              <span className="hidden md:inline text-sm text-stone">{p.typology}</span>
              <span className="hidden md:inline font-mono text-sm text-stone">{p.images.length}</span>
              <span className="hidden md:inline text-sm text-stone">{STATUS_LABELS[p.status] || p.status}</span>
              <div className="mt-3 md:mt-0 flex gap-4 md:justify-end">
                <Link to={`/backoffice/imoveis/${p.id}`} className="text-sm text-gold hover:underline">
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Apagar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
