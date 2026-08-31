import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const LINKS = [
  { to: "/backoffice", label: "Dashboard", end: true },
  { to: "/backoffice/imoveis", label: "Imóveis" },
  { to: "/backoffice/contactos", label: "Contactos" },
];

export default function BackofficeLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper flex">
      <aside className="w-60 shrink-0 bg-charcoal text-paper flex flex-col">
        <div className="px-6 py-6 border-b border-paper/10">
          <p className="font-display text-xl text-gold">Magda Leal</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40 mt-1">
            Backoffice
          </p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm rounded-sm transition-colors ${
                  isActive ? "bg-gold/15 text-gold" : "text-paper/70 hover:text-paper hover:bg-paper/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-paper/10">
          <p className="text-xs text-paper/50 mb-3">{user?.username}</p>
          <button
            onClick={logout}
            className="text-xs font-mono uppercase tracking-widest text-paper/60 hover:text-gold transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 px-10 py-10">
        <Outlet />
      </main>
    </div>
  );
}
