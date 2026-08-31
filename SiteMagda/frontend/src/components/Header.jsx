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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!transparentOnTop) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen ? "bg-charcoal/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl text-paper tracking-wide">
          Magda <span className="text-gold">Leal</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
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

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          className="md:hidden relative z-50 h-8 w-8 flex flex-col justify-center items-center gap-1.5"
        >
          <span
            className={`block h-px w-6 bg-paper transition-transform duration-300 ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-paper transition-transform duration-300 ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>
    </header>

    {/* Mobile menu overlay — deliberately outside <header>, which gets
        backdrop-blur (a new containing block for `fixed` descendants) once
        scrolled/open, which would otherwise shrink this to the header's
        own height instead of the full viewport. */}
    <nav
      className={`md:hidden fixed inset-0 z-40 bg-charcoal flex flex-col items-center justify-center gap-8 transition-opacity duration-300 ${
        menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`font-display text-3xl ${
            pathname === link.to ? "text-gold" : "text-paper"
          }`}
        >
          {link.label}
        </Link>
      ))}
      <a href="#contacto" className="font-display text-3xl text-paper">
        Contacto
      </a>
    </nav>
    </>
  );
}
