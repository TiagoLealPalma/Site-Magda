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
    <div className="min-h-screen bg-paper flex flex-col md:flex-row">
      <aside className="w-full md:w-60 md:shrink-0 bg-charcoal text-paper flex flex-col">
        <div className="px-6 py-5 md:py-6 flex items-center justify-between md:block md:border-b md:border-paper/10">
          <div>
            <p className="font-display text-xl text-gold">Magda Leal</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40 mt-1">
              Backoffice
            </p>
          </div>
          <button
            onClick={logout}
            className="md:hidden text-xs font-mono uppercase tracking-widest text-paper/60 hover:text-gold transition-colors"
          >
            Sair
          </button>
        </div>

        <nav className="flex md:flex-col overflow-x-auto px-3 py-2 md:py-6 gap-1 border-t border-paper/10 md:border-t-0">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `shrink-0 px-3 py-2 text-sm rounded-sm transition-colors ${
                  isActive ? "bg-gold/15 text-gold" : "text-paper/70 hover:text-paper hover:bg-paper/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block px-6 py-5 border-t border-paper/10">
          <p className="text-xs text-paper/50 mb-3">{user?.username}</p>
          <button
            onClick={logout}
            className="text-xs font-mono uppercase tracking-widest text-paper/60 hover:text-gold transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
