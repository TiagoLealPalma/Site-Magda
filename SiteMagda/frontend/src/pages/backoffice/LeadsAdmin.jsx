import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminClient";

export default function LeadsAdmin() {
  const [leads, setLeads] = useState(null);

  function reload() {
    adminApi.listLeads().then(setLeads);
  }

  useEffect(reload, []);

  async function handleDelete(id) {
    if (!confirm("Apagar este contacto?")) return;
    await adminApi.deleteLead(id);
    reload();
  }

  return (
    <div>
      <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-2">Contactos</p>
      <h1 className="font-display text-3xl text-ink mb-10">Pedidos recebidos.</h1>

      <div className="bg-white border border-ink/10">
        {leads === null ? (
          <p className="p-6 text-sm text-stone">A carregar…</p>
        ) : leads.length === 0 ? (
          <p className="p-6 text-sm text-stone">Ainda sem contactos.</p>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="px-6 py-5 border-b border-ink/5 last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-ink font-medium">{lead.name}</p>
                  <p className="text-xs text-stone mt-0.5">
                    {[lead.email, lead.phone].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <p className="font-mono text-xs text-stone">
                    {lead.created_at ? new Date(lead.created_at).toLocaleString("pt-PT") : "—"}
                  </p>
                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Apagar
                  </button>
                </div>
              </div>
              <p className="text-sm text-stone mt-3">{lead.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
