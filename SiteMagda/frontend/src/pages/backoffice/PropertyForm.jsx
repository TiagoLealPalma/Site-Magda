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
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [previewLang, setPreviewLang] = useState("pt");
  const [pending, setPending] = useState([]); // photos chosen before the property exists
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isEditing) return;
    adminApi.getProperty(id).then((data) => {
      setForm({
        name: data.name ?? "",
        name_en: data.name_en ?? "",
        price: data.price ?? "",
        description: data.description ?? "",
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

  async function handleSubmit(e) {
    e.preventDefault();
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
        await Promise.allSettled(pending.map((p) => adminApi.uploadImage(created.id, p.file)));
        pending.forEach((p) => URL.revokeObjectURL(p.url));
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
      <h1 className="font-display text-3xl text-ink mb-10">
        {isEditing ? "Editar imóvel." : "Novo imóvel."}
      </h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_30rem] xl:gap-16 2xl:grid-cols-[minmax(0,40rem)_24rem_minmax(0,1fr)]">
      <div className="min-w-0 max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Nome" value={form.name} onChange={(v) => setField("name", v)} required />
          <Field label="Nome (inglês, opcional)" value={form.name_en} onChange={(v) => setField("name_en", v)} />
          <Field label="Preço (€)" type="number" value={form.price} onChange={(v) => setField("price", v)} />
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
          <Field label="Área bruta (m²)" type="number" value={form.area} onChange={(v) => setField("area", v)} required />
          <Field label="Área útil (m²)" type="number" value={form.liquid_area} onChange={(v) => setField("liquid_area", v)} />
          <Field label="Construído em" type="number" value={form.construction_date} onChange={(v) => setField("construction_date", v)} />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-stone mb-2">
            Descrição
          </label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
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
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute left-2 top-2 bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink">
                      Capa
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => (isEditing ? handleDeleteImage(img.id) : removePending(img.id))}
                    className="absolute inset-0 bg-ink/60 text-paper text-sm opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
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
              A primeira foto é a capa.
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
          <div role="group" aria-label="Idioma da pré-visualização" className="flex border border-ink/15">
            {["pt", "en"].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setPreviewLang(code)}
                aria-pressed={previewLang === code}
                className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  previewLang === code ? "bg-ink text-paper" : "text-stone hover:text-ink"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
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

function Field({ label, value, onChange, type = "text", required = false, className = "", step, placeholder, hint }) {
  return (
    <div className={className}>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-stone mb-2">
        {label}
      </label>
      <input
        type={type}
        step={step}
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
