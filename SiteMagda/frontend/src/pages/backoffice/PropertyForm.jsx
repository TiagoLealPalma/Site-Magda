import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../api/adminClient";

const EMPTY = {
  name: "",
  price: "",
  description: "",
  address: "",
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
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isEditing) return;
    adminApi.getProperty(id).then((data) => {
      setForm({
        name: data.name ?? "",
        price: data.price ?? "",
        description: data.description ?? "",
        address: data.address ?? "",
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
      area: Number(form.area),
    };

    try {
      if (isEditing) {
        await adminApi.updateProperty(id, payload);
        navigate("/backoffice/imoveis");
      } else {
        const created = await adminApi.createProperty(payload);
        navigate(`/backoffice/imoveis/${created.id}`);
      }
    } catch (err) {
      setError(err.body ? JSON.stringify(err.body) : err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const image = await adminApi.uploadImage(id, file);
    setImages((imgs) => [...imgs, image]);
    fileInputRef.current.value = "";
  }

  async function handleDeleteImage(imageId) {
    await adminApi.deleteImage(imageId);
    setImages((imgs) => imgs.filter((img) => img.id !== imageId));
  }

  if (loading) return <p className="text-sm text-stone">A carregar…</p>;

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-2">Imóveis</p>
      <h1 className="font-display text-3xl text-ink mb-10">
        {isEditing ? "Editar imóvel." : "Novo imóvel."}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <Field label="Nome" value={form.name} onChange={(v) => setField("name", v)} required />
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
          <Field label="Morada" value={form.address} onChange={(v) => setField("address", v)} required className="col-span-2" />
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-gold text-ink text-sm px-8 py-3 hover:bg-gold-soft transition-colors disabled:opacity-60"
        >
          {saving ? "A guardar…" : "Guardar"}
        </button>
      </form>

      {isEditing && (
        <div className="mt-14">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-stone mb-4">
            Fotos
          </label>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {images.map((img) => (
              <div key={img.id} className="relative group aspect-square overflow-hidden bg-charcoal">
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute inset-0 bg-ink/60 text-paper text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Apagar
                </button>
              </div>
            ))}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false, className = "" }) {
  return (
    <div className={className}>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-stone mb-2">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}
