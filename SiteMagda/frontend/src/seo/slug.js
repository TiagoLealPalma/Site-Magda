// Readable listing URLs (/imoveis/3-moradia-com-vista-para-o-mar). The number
// is what identifies the listing; the words are for people and search engines
// and may change without breaking old links.
export function slugify(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

export function propertyParam(property, lang) {
  const name = lang === "en" && property.name_en ? property.name_en : property.name;
  const slug = slugify(name);
  return slug ? `${property.id}-${slug}` : String(property.id);
}

export function propertyIdFromParam(param) {
  const id = parseInt(param, 10);
  return Number.isNaN(id) ? null : id;
}
