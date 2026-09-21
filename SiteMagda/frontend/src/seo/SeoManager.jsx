import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSeo } from "../api/client";

function el(tag, attrs) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  node.setAttribute("data-seo", "");
  return node;
}

// Applies the metadata Django computed for this URL (the very same data nginx
// injected into the first HTML response) whenever the route changes, so a
// single-page navigation never leaves the previous page's title, canonical or
// structured data behind.
function applyMeta(meta) {
  // Clear what nginx injected (or the previous route left) first: that includes
  // the server-rendered <title>, which document.title then re-creates.
  document.querySelectorAll("head [data-seo]").forEach((node) => node.remove());
  document.title = meta.title;

  const head = document.head;
  const add = (node) => head.appendChild(node);

  if (meta.description) add(el("meta", { name: "description", content: meta.description }));
  add(el("meta", { name: "robots", content: meta.robots }));
  if (meta.canonical) add(el("link", { rel: "canonical", href: meta.canonical }));

  const langs = { pt: "pt-PT", en: "en" };
  Object.entries(meta.alternates || {}).forEach(([lang, href]) =>
    add(el("link", { rel: "alternate", hreflang: langs[lang], href }))
  );
  if (meta.alternates?.pt) add(el("link", { rel: "alternate", hreflang: "x-default", href: meta.alternates.pt }));

  if (meta.canonical) {
    const locale = { pt: "pt_PT", en: "en_GB" };
    const other = meta.lang === "pt" ? "en" : "pt";
    const og = {
      "og:type": meta.og_type,
      "og:site_name": "Magda Leal",
      "og:title": meta.title,
      "og:description": meta.description,
      "og:url": meta.canonical,
      "og:image": meta.og_image,
      "og:locale": locale[meta.lang],
    };
    Object.entries(og).forEach(([property, content]) => add(el("meta", { property, content: content ?? "" })));
    add(el("meta", { property: "og:locale:alternate", content: locale[other] }));
    add(el("meta", { name: "twitter:card", content: "summary_large_image" }));
    add(el("meta", { name: "twitter:title", content: meta.title }));
    add(el("meta", { name: "twitter:description", content: meta.description }));
    add(el("meta", { name: "twitter:image", content: meta.og_image }));
  }

  if (meta.jsonld?.length) {
    const script = el("script", { type: "application/ld+json" });
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": meta.jsonld });
    add(script);
  }
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/backoffice")) return;
    let live = true;
    getSeo(pathname)
      .then((meta) => live && applyMeta(meta))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [pathname]);

  return null;
}
