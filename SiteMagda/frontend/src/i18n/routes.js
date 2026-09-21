// One entry per public page. Portuguese keeps its existing URLs (already
// indexed, already shared); English lives under /en with English slugs.
export const ROUTES = {
  home: { pt: "/", en: "/en" },
  about: { pt: "/sobre", en: "/en/about" },
  properties: { pt: "/imoveis", en: "/en/properties" },
  property: { pt: "/imoveis/:id", en: "/en/properties/:id" },
};

export const LANGS = ["pt", "en"];

export function langFromPath(pathname) {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "pt";
}

export function routePath(name, lang, params = {}) {
  const pattern = ROUTES[name]?.[lang] ?? ROUTES.home[lang];
  return pattern.replace(/:(\w+)/g, (_, key) => encodeURIComponent(params[key] ?? ""));
}

function patternToRegex(pattern) {
  const source = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/:(\w+)/g, "(?<$1>[^/]+)");
  return new RegExp(`^${source}/?$`);
}

// The same page in the other language, or null when the current path is not
// a public page (backoffice, unknown URLs).
export function equivalentPath(pathname, target) {
  const current = langFromPath(pathname);
  for (const [name, patterns] of Object.entries(ROUTES)) {
    const match = pathname.match(patternToRegex(patterns[current]));
    if (match) return routePath(name, target, match.groups ?? {});
  }
  return null;
}

export function routeNameFromPath(pathname) {
  const current = langFromPath(pathname);
  for (const [name, patterns] of Object.entries(ROUTES)) {
    if (pathname.match(patternToRegex(patterns[current]))) return name;
  }
  return null;
}
