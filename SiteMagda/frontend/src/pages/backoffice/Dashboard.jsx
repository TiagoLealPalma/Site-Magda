import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/adminClient";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    adminApi.summary().then(setSummary);
    adminApi.listLeads().then((leads) => setRecentLeads(leads.slice(0, 5)));
  }, []);

  return (
    <div>
      <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-2">Dashboard</p>
      <h1 className="font-display text-3xl text-ink mb-10">Visão geral.</h1>

      {summary && (
        <div className="grid grid-cols-3 gap-6 mb-14">
          <Card label="Imóveis" value={summary.properties_count} />
          <Card label="Contactos recebidos" value={summary.leads_count} />
          <Card label="Contactos (7 dias)" value={summary.leads_last_7_days} />
        </div>
      )}

      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-xl text-ink">Últimos contactos</h2>
        <Link to="/backoffice/contactos" className="text-sm text-gold hover:underline">
          Ver todos →
        </Link>
      </div>

      <div className="bg-white border border-ink/10">
        {recentLeads.length === 0 ? (
          <p className="p-6 text-sm text-stone">Ainda sem contactos.</p>
        ) : (
          recentLeads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between px-6 py-4 border-b border-ink/5 last:border-0">
              <div>
                <p className="text-sm text-ink">{lead.name}</p>
                <p className="text-xs text-stone">{lead.email}</p>
              </div>
              <p className="font-mono text-xs text-stone">
                {new Date(lead.created_at).toLocaleDateString("pt-PT")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-white border border-ink/10 p-6">
      <p className="font-mono text-3xl text-ink">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-stone">{label}</p>
    </div>
  );
}
