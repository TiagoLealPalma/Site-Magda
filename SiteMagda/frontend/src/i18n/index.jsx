import { createContext, Fragment, useContext, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import pt from "./pt";
import en from "./en";
import { equivalentPath, langFromPath, routeNameFromPath, routePath } from "./routes";

const DICTIONARIES = { pt, en };
const STORAGE_KEY = "lang";

const LangContext = createContext(null);

function lookup(dict, key) {
  return key.split(".").reduce((node, part) => (node == null ? undefined : node[part]), dict);
}

export function dictionary(lang) {
  return DICTIONARIES[lang];
}

export function rememberLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // storage can be blocked (private mode); the URL still carries the language
  }
}

export function storedLang() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

// t("a.b", { n: 3 }) fills {n}; when any value is a React node it returns an
// array of parts instead of a string. Falls back to Portuguese, then to the
// key itself, so a missing string is visible but never crashes a page.
function makeT(lang) {
  return (key, vars) => {
    const raw = lookup(DICTIONARIES[lang], key) ?? lookup(DICTIONARIES.pt, key) ?? key;
    if (!vars || typeof raw !== "string") return raw;
    const parts = raw.split(/\{(\w+)\}/g).map((piece, i) => (i % 2 ? vars[piece] ?? "" : piece));
    return parts.every((p) => typeof p === "string")
      ? parts.join("")
      : parts.map((p, i) => <Fragment key={i}>{p}</Fragment>);
  };
}

// Renders a subtree in a fixed language regardless of the URL (used by the
// backoffice to preview a listing as English visitors will see it).
export function LangOverride({ lang, children }) {
  const t = useMemo(() => makeT(lang), [lang]);
  const value = useMemo(
    () => ({
      lang,
      t,
      path: (name, params) => routePath(name, lang, params),
      routeName: null,
      otherLang: lang === "en" ? "pt" : "en",
      switchHref: () => null,
    }),
    [lang, t]
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function LangProvider({ children }) {
  const { pathname, search } = useLocation();
  const lang = langFromPath(pathname);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "pt-PT";
  }, [lang]);

  const t = useMemo(() => makeT(lang), [lang]);

  const value = useMemo(
    () => ({
      lang,
      t,
      path: (name, params) => routePath(name, lang, params),
      routeName: routeNameFromPath(pathname),
      otherLang: lang === "en" ? "pt" : "en",
      // Same page, other language, keeping filters and the like.
      switchHref: (target) => {
        const to = equivalentPath(pathname, target);
        return to ? `${to}${search}` : null;
      },
    }),
    [lang, t, pathname, search]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

export function useT() {
  return useLang().t;
}

// Only the listing name has an English version (optional, entered in the
// backoffice). Descriptions stay in Portuguese in both languages on purpose.
export function localizedProperty(property, lang) {
  if (lang !== "en") return property;
  return { ...property, name: property.name_en || property.name };
}
