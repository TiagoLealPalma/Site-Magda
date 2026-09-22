import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../api/adminClient";
import ListingCard from "../../components/ListingCard";
import PropertyDetailView from "../../components/PropertyDetailView";
import ScaledPreview from "../../components/backoffice/ScaledPreview";
import { LangOverride } from "../../i18n";

const EMPTY = {
  name: "",
  name_en: "",
  price: "",
  description: "",
  description_en: "",
  address: "",
  latitude: "",
  longitude: "",
  bedrooms: "",
  bathrooms: "",
  typology: "",
  area: "",
  liquid_area: "",
  construction_date: "",
  status: "available",
};

const STATUS_OPTIONS = [
  { value: "available", label: "Disponível" },
  { value: "coming_soon", label: "Brevemente" },
  { value: "reserved", label: "Reservado" },
];

export default function PropertyForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [loadedPhotoIds, setLoadedPhotoIds] = useState(() => new Set());
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [previewLang, setPreviewLang] = useState("pt");
  const [pending, setPending] = useState([]); // photos chosen before the property exists
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importNote, setImportNote] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    adminApi.getProperty(id).then((data) => {
      setForm({
        name: data.name ?? "",
        name_en: data.name_en ?? "",
        price: data.price ?? "",
        description: data.description ?? "",
        description_en: data.description_en ?? "",
        address: data.address ?? "",
        latitude: data.latitude ?? "",
        longitude: data.longitude ?? "",
        bedrooms: data.bedrooms ?? "",
        bathrooms: data.bathrooms ?? "",
        typology: data.typology ?? "",
        area: data.area ?? "",
        liquid_area: data.liquid_area ?? "",
        construction_date: data.construction_date ?? "",
        status: data.status ?? "available",
      });
      setImages(data.images);
      setLoading(false);
    });
  }, [id, isEditing]);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Imported photos land in state (and the grid) as soon as the backend has
  // stored them, but the browser still has to fetch each one — without this,
  // that fetch shows as an empty dark tile that reads as "the import didn't
  // bring photos" rather than "these are loading".
  function markPhotoLoaded(photoId) {
    setLoadedPhotoIds((s) => (s.has(photoId) ? s : new Set(s).add(photoId)));
  }

  // Runs pending photos through in order, batching consecutive same-kind
  // items (dragged files upload in parallel; imported URLs go in one bulk
  // request), then explicitly re-orders the saved images to match the
  // pending list's order — the order Magda actually chose (e.g. via "Tornar
  // capa") — since concurrent uploads can otherwise land in the database in
  // whatever order the server happened to finish them.
  async function persistPendingImages(propertyId, list) {
    const createdByIndex = new Array(list.length);
    let i = 0;
    while (i < list.length) {
      const remote = Boolean(list[i].remote);
      const runStart = i;
      const run = [];
      while (i < list.length && Boolean(list[i].remote) === remote) {
        run.push(list[i]);
        i += 1;
      }
      if (remote) {
        const res = await adminApi.importImages(propertyId, run.map((p) => p.url)).catch(() => null);
        (res?.images || []).forEach((image, idx) => {
          if (image) createdByIndex[runStart + idx] = image;
        });
      } else {
        const settled = await Promise.allSettled(run.map((p) => adminApi.uploadImage(propertyId, p.file)));
        settled.forEach((result, idx) => {
          if (result.status === "fulfilled") createdByIndex[runStart + idx] = result.value;
        });
      }
    }
    const orderedIds = createdByIndex.filter(Boolean).map((image) => image.id);
    if (orderedIds.length > 1) {
      await adminApi.reorderImages(propertyId, orderedIds).catch(() => {});
    }
  }

  // Moves a photo to the front — of the saved list (persists right away) or
  // of the queued list (just reorders local state; the save step above then
  // carries that order over once the property exists).
  async function makeCover(photoId) {
    if (isEditing) {
      const orderedIds = [photoId, ...images.filter((img) => img.id !== photoId).map((img) => img.id)];
      const updated = await adminApi.reorderImages(id, orderedIds);
      setImages(updated);
    } else {
      setPending((list) => {
        const chosen = list.find((p) => p.id === photoId);
        return chosen ? [chosen, ...list.filter((p) => p.id !== photoId)] : list;
      });
    }
  }

  // Pre-fills the form (and queues or imports the photos) from a KW Portugal
  // listing page. Works before or after the property exists; only Guardar
  // persists the text fields either way, photos follow the same immediate/
  // queued rule as drag-and-drop.
  async function handleImport() {
    const url = importUrl.trim();
    if (!url) return;
    setImporting(true);
    setImportError("");
    setImportNote("");
    try {
      const draft = await adminApi.importListing(url);

      // A fresh import replaces whatever was there before — merging with the
      // previous form/photos is what caused fields to stick around and
      // photos to double up when a link was imported more than once.
      setForm({
        ...EMPTY,
        name: draft.name || "",
        name_en: draft.name_en || "",
        description: draft.description || "",
        description_en: draft.description_en || "",
        address: draft.address || "",
        price: draft.price ?? "",
        typology: draft.typology || "",
        bedrooms: draft.bedrooms ?? "",
        bathrooms: draft.bathrooms ?? "",
        area: draft.area ?? "",
        liquid_area: draft.liquid_area ?? "",
        construction_date: draft.construction_date ?? "",
        latitude: draft.latitude ?? "",
        longitude: draft.longitude ?? "",
      });

      if (isEditing) {
        await Promise.allSettled(images.map((img) => adminApi.deleteImage(img.id)));
        setImages([]);
      } else {
        setPending([]);
      }

      const urls = draft.images || [];
      if (!urls.length) {
        setImportNote("Dados importados. Esta página não tinha fotos.");
      } else if (isEditing) {
        const res = await adminApi.importImages(id, urls);
        const ok = res.images.filter(Boolean);
        setImages(ok);
        setImportNote(
          res.failed ? `Dados e ${ok.length} fotos importados (${res.failed} falharam).` : `Dados e ${ok.length} fotos importados.`
        );
      } else {
        setPending(urls.map((u, i) => ({ id: `remote-${Date.now()}-${i}`, url: u, remote: true })));
        setImportNote(`Dados e ${urls.length} fotos importados. As fotos ficam guardadas quando carregar em Guardar.`);
      }
    } catch (err) {
      setImportError(err.body?.detail || err.message || "Não foi possível importar este link.");
    } finally {
      setImporting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      setPreviewLang("pt");
      setError("Preencha o nome e a descrição em português antes de guardar.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      price: form.price || null,
      bedrooms: form.bedrooms || null,
      bathrooms: form.bathrooms || null,
      liquid_area: form.liquid_area || null,
      construction_date: form.construction_date || null,
      latitude: form.latitude || null,
      longitude: form.longitude || null,
      area: Number(form.area),
    };

    try {
      if (isEditing) {
        await adminApi.updateProperty(id, payload);
        navigate("/backoffice/imoveis");
      } else {
        const created = await adminApi.createProperty(payload);
        await persistPendingImages(created.id, pending);
        pending.filter((p) => p.file).forEach((p) => URL.revokeObjectURL(p.url));
        navigate(`/backoffice/imoveis/${created.id}`);
      }
    } catch (err) {
      setError(err.body ? JSON.stringify(err.body) : err.message);
    } finally {
      setSaving(false);
    }
  }

  // Editing: photos upload straight away. Creating: they wait here (and show
  // in the previews) until the property exists, then upload on save.
  async function addFiles(fileList) {
    const files = [...fileList].filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    if (isEditing) {
      for (const file of files) {
        const image = await adminApi.uploadImage(id, file);
        setImages((imgs) => [...imgs, image]);
      }
    } else {
      setPending((list) => [
        ...list,
        ...files.map((file) => ({ id: `${file.name}-${file.lastModified}-${Math.random()}`, file, url: URL.createObjectURL(file) })),
      ]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePending(pid) {
    setPending((list) => {
      const gone = list.find((p) => p.id === pid);
      if (gone) URL.revokeObjectURL(gone.url);
      return list.filter((p) => p.id !== pid);
    });
  }

  async function handleDeleteImage(imageId) {
    await adminApi.deleteImage(imageId);
    setImages((imgs) => imgs.filter((img) => img.id !== imageId));
  }

  if (loading) return <p className="text-sm text-stone">A carregar…</p>;

  const photos = isEditing ? images : pending.map((p) => ({ id: p.id, url: p.url }));

  // The public card, fed straight from the form so it updates as Magda types.
  const preview = {
    id: id ?? 0,
    ...form,
    price: form.price || null,
    bedrooms: form.bedrooms === "" ? null : form.bedrooms,
    bathrooms: form.bathrooms === "" ? null : form.bathrooms,
    liquid_area: form.liquid_area || null,
    construction_date: form.construction_date || null,
    name: form.name || "Nome do imóvel",
    address: form.address || "Morada",
    images: photos,
  };

  return (
    <div className="max-w-6xl 2xl:max-w-none">
      <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-2">Imóveis</p>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">{isEditing ? "Editar imóvel." : "Novo imóvel."}</h1>
        <div>
          <LangToggle lang={previewLang} onChange={setPreviewLang} />
          <p className="mt-1.5 text-xs text-stone">Nome, descrição e pré-visualização mudam com o idioma.</p>
        </div>
      </div>

      <div className="mb-10 max-w-3xl border border-ink/15 bg-paper-dim/50 p-5">
        <label htmlFor="import-url" className="block font-mono text-[10px] uppercase tracking-widest text-stone mb-2">
          Importar de um link (kwportugal.pt)
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="import-url"
            type="url"
            placeholder="https://www.kwportugal.pt/pt/Imovel/..."
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            className="min-w-0 flex-1 bg-white border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={importing || !importUrl.trim()}
            className="shrink-0 border border-gold text-gold-deep px-6 py-2.5 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gold-deep"
          >
            {importing ? "A importar…" : "Importar"}
          </button>
        </div>
            <p className="mt-2 text-xs text-stone">
          Preenche o nome e a descrição em português e (quando disponível) em inglês, a morada, o preço, a tipologia, as áreas e as fotos.
        </p>
        {importError && <p className="mt-2 text-sm text-red-600">{importError}</p>}
        {importNote && <p className="mt-2 text-sm text-gold-deep">{importNote}</p>}
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_30rem] xl:gap-16 2xl:grid-cols-[minmax(0,40rem)_24rem_minmax(0,1fr)]">
      <div className="min-w-0 max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field
            label={previewLang === "en" ? "Nome (inglês, opcional)" : "Nome"}
            value={previewLang === "en" ? form.name_en : form.name}
            onChange={(v) => setField(previewLang === "en" ? "name_en" : "name", v)}
            required={previewLang === "pt"}
            hint={previewLang === "en" ? "Se ficar vazio, o site em inglês mostra o nome em português." : undefined}
            className="sm:col-span-2"
          />
          <Field label="Preço (€)" type="number" step="any" min="0" value={form.price} onChange={(v) => setField("price", v)} />
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-stone mb-2">
              Estado
            </label>
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
              className="w-full bg-white border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <Field label="Morada" value={form.address} onChange={(v) => setField("address", v)} required className="sm:col-span-2" />
          <Field
            label="Latitude"
            type="number"
            step="any"
            value={form.latitude}
            onChange={(v) => setField("latitude", v)}
            placeholder="38.532..."
          />
          <Field
            label="Longitude"
            type="number"
            step="any"
            value={form.longitude}
            onChange={(v) => setField("longitude", v)}
            placeholder="-28.629..."
          />
          <p className="sm:col-span-2 -mt-3 text-xs text-stone">
            Para obter as coordenadas: abra o imóvel no{" "}
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-gold-deep"
            >
              Google Maps
            </a>
            , clique com o botão direito no local exato e copie os dois números que aparecem no topo do menu.
          </p>
          <Field label="Tipologia" value={form.typology} onChange={(v) => setField("typology", v)} required />
          <Field label="Quartos" type="number" value={form.bedrooms} onChange={(v) => setField("bedrooms", v)} />
          <Field label="Casas de banho" type="number" value={form.bathrooms} onChange={(v) => setField("bathrooms", v)} />
          <Field label="Área bruta (m²)" type="number" step="any" min="0" value={form.area} onChange={(v) => setField("area", v)} required />
          <Field label="Área útil (m²)" type="number" step="any" min="0" value={form.liquid_area} onChange={(v) => setField("liquid_area", v)} />
          <Field label="Construído em" type="number" value={form.construction_date} onChange={(v) => setField("construction_date", v)} />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-stone mb-2">
            {previewLang === "en" ? "Descrição (inglês, opcional)" : "Descrição"}
          </label>
          <textarea
            required={previewLang === "pt"}
            rows={5}
            value={previewLang === "en" ? form.description_en : form.description}
            onChange={(e) => setField(previewLang === "en" ? "description_en" : "description", e.target.value)}
            placeholder={previewLang === "en" ? "Se ficar vazio, o site em inglês mostra a descrição em português." : undefined}
            className="w-full bg-white border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-stone mb-3">
            Fotos
          </label>
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {photos.map((img, i) => (
                <div key={img.id} className="relative group aspect-square overflow-hidden bg-charcoal">
                  {!loadedPhotoIds.has(img.id) && (
                    <div className="absolute inset-0 animate-pulse bg-ink/15" />
                  )}
                  <img
                    src={img.url}
                    alt=""
                    onLoad={() => markPhotoLoaded(img.id)}
                    onError={() => markPhotoLoaded(img.id)}
                    className={`h-full w-full object-cover transition-opacity duration-300 ${
                      loadedPhotoIds.has(img.id) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {i === 0 ? (
                    <span className="absolute left-2 top-2 bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink">
                      Capa
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makeCover(img.id)}
                      className="absolute left-2 top-2 bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-paper opacity-0 transition-opacity hover:bg-gold hover:text-ink group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      Tornar capa
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => (isEditing ? handleDeleteImage(img.id) : removePending(img.id))}
                    className="absolute bottom-2 right-2 bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-paper opacity-0 transition-opacity hover:bg-rust group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    {isEditing ? "Apagar" : "Remover"}
                  </button>
                </div>
              ))}
            </div>
          )}
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 border border-dashed px-6 py-8 text-center transition-colors ${
              dragging ? "border-gold bg-gold/10" : "border-ink/25 bg-white hover:border-gold"
            }`}
          >
            <span className="text-sm text-ink">Arraste fotos para aqui ou clique para escolher</span>
            <span className="text-xs text-stone">
              A primeira foto é a capa; passe o rato sobre outra e escolha "Tornar capa" para mudar.
              {!isEditing && " Ficam guardadas quando carregar em Guardar."}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => addFiles(e.target.files)}
              className="sr-only"
            />
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-gold text-ink text-sm px-8 py-3 hover:bg-gold-soft transition-colors disabled:opacity-60"
        >
          {saving ? "A guardar…" : "Guardar"}
        </button>
      </form>

      </div>

      {/* Below 2xl the two previews stack in one column (card, then page);
          on very wide screens the wrapper vanishes and they sit side by side. */}
      <div className="min-w-0 space-y-12 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:self-start lg:overflow-y-auto 2xl:contents">
      <aside className="max-w-[24rem] 2xl:sticky 2xl:top-8 2xl:self-start" aria-label="Pré-visualização do cartão">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone">Pré-visualização</p>
          <LangToggle lang={previewLang} onChange={setPreviewLang} />
        </div>
        <LangOverride lang={previewLang}>
          <ListingCard property={preview} preview />
        </LangOverride>
        <p className="mt-4 text-xs leading-relaxed text-stone">
          É assim que o cartão aparece na página de imóveis, e atualiza enquanto escreve.
          {" A foto de capa é a primeira da lista."}
        </p>
      </aside>

      <aside className="min-w-0 max-w-3xl 2xl:sticky 2xl:top-8 2xl:max-h-[calc(100vh-4rem)] 2xl:max-w-none 2xl:self-start 2xl:overflow-y-auto" aria-label="Pré-visualização da página do imóvel">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-stone">Página do imóvel</p>
        <ScaledPreview>
          <LangOverride lang={previewLang}>
            <PropertyDetailView property={preview} preview />
          </LangOverride>
        </ScaledPreview>
      </aside>
      </div>
      </div>
    </div>
  );
}

// One PT/EN switch shared by the Nome/Descrição fields and both live
// previews: click it once and everything on screen — what you are editing,
// the card, the page — shows the same language, instead of juggling two
// text boxes per field.
function LangToggle({ lang, onChange }) {
  return (
    <div role="group" aria-label="Idioma" className="flex border border-ink/15">
      {["pt", "en"].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          aria-pressed={lang === code}
          className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
            lang === code ? "bg-ink text-paper" : "text-stone hover:text-ink"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false, className = "", step, min, placeholder, hint }) {
  return (
    <div className={className}>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-stone mb-2">
        {label}
      </label>
      <input
        type={type}
        step={step}
        min={min}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
      />
      {hint && <p className="mt-1.5 text-xs text-stone">{hint}</p>}
    </div>
  );
}
