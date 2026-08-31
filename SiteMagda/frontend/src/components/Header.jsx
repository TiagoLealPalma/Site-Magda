import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre" },
  { to: "/imoveis", label: "Imóveis" },
];

export default function Header({ transparentOnTop = false }) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(!transparentOnTop);

  useEffect(() => {
    if (!transparentOnTop) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-charcoal/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-8 h-20 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl text-paper tracking-wide">
          Magda <span className="text-gold">Leal</span>
        </Link>
        <nav className="flex items-center gap-10">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative inline-block py-2 text-sm tracking-wide transition-colors ${
                pathname === link.to
                  ? "text-gold font-medium"
                  : "text-paper/90 hover:text-gold"
              }`}
            >
              {link.label}
              {pathname === link.to && (
                <span
                  key={pathname}
                  className="nav-underline absolute left-0 right-0 -bottom-px h-px bg-gold"
                />
              )}
            </Link>
          ))}
          <a
            href="#contacto"
            className="text-sm tracking-wide text-paper/90 hover:text-gold transition-colors"
          >
            Contacto
          </a>
        </nav>
      </div>
    </header>
  );
}
