import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang, dictionary, rememberLang } from "../i18n";
import { LANGS, routePath } from "../i18n/routes";

const LINKS = ["home", "about", "properties"];

// The current language reads as plain text; the other one is the way over,
// landing on the same page (filters and all) in that language.
function LanguageSwitch({ className = "" }) {
  const { lang, switchHref } = useLang();
  return (
    <div className={`flex items-center gap-3 font-mono text-xs tracking-widest ${className}`}>
      {LANGS.map((code, i) => (
        <span key={code} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-paper/25" />}
          {code === lang ? (
            <span aria-current="true" className="text-gold-soft">
              {code.toUpperCase()}
            </span>
          ) : (
            <Link
              to={switchHref(code) ?? routePath("home", code)}
              lang={code}
              hrefLang={code}
              aria-label={dictionary(code).nav.switchLabel}
              onClick={() => rememberLang(code)}
              className="text-paper/70 transition-colors hover:text-gold-soft"
            >
              {code.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const { t, path, routeName } = useLang();
  const activeName = routeName === "property" ? "properties" : routeName;
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lets sticky page elements (e.g. the listing filters) ride up to the top
  // edge while the header is tucked away, and sit under it when it returns.
  useEffect(() => {
    document.body.classList.toggle("header-hidden", hidden && !menuOpen);
    return () => document.body.classList.remove("header-hidden");
  }, [hidden, menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Hide the header on scroll-down, bring it back on scroll-up — keeps it
  // out of the way of the pinned/scroll-driven sections without losing
  // access to navigation once the visitor pauses or reverses. Computed
  // directly here (not via a value another component writes on its own
  // scroll listener) since two independent 'scroll' listeners racing each
  // other left this a step behind and effectively non-functional.
  useEffect(() => {
    function onScroll() {
      const feedbackEl = document.getElementById("scroll-feedback");
      if (feedbackEl) {
        const rect = feedbackEl.getBoundingClientRect();
        const pinned = rect.top <= 0 && rect.bottom > window.innerHeight;
        if (pinned) {
          setHidden(true);
          lastScrollY.current = window.scrollY;
          return;
        }
      }
      const y = window.scrollY;
      setHidden(y > lastScrollY.current && y > 120);
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className="fixed inset-x-0 z-50 bg-charcoal/90 backdrop-blur-sm"
      style={{ top: hidden && !menuOpen ? "-88px" : "0px", transition: "top 300ms ease" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 h-20 flex items-center justify-between">
        <Link to={path("home")} className="font-display text-2xl text-paper tracking-wide">
          Magda <span className="text-gold-soft">Leal</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map((name) => (
            <Link
              key={name}
              to={path(name)}
              className={`relative inline-block py-2 text-sm tracking-wide transition-colors ${
                activeName === name
                  ? "text-gold-soft font-medium"
                  : "text-paper/90 hover:text-gold-soft"
              }`}
            >
              {t(`nav.${name}`)}
              {activeName === name && (
                <span
                  key={pathname}
                  className="nav-underline absolute left-0 right-0 -bottom-px h-px bg-gold-soft"
                />
              )}
            </Link>
          ))}
          <a
            href="#contacto"
            className="text-sm tracking-wide text-paper/90 hover:text-gold-soft transition-colors"
          >
            {t("nav.contact")}
          </a>
          <LanguageSwitch className="ml-2 border-l border-paper/15 pl-8" />
        </nav>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
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
      {LINKS.map((name) => (
        <Link
          key={name}
          to={path(name)}
          className={`font-display text-3xl ${
            activeName === name ? "text-gold-soft" : "text-paper"
          }`}
        >
          {t(`nav.${name}`)}
        </Link>
      ))}
      <a href="#contacto" className="font-display text-3xl text-paper">
        {t("nav.contact")}
      </a>
      <LanguageSwitch className="mt-4 text-sm" />
    </nav>
    </>
  );
}
