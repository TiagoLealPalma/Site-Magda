import { useEffect, useRef, useState } from "react";
import { createLead } from "../api/client";

export default function LeadForm({ presetMessage = "" }) {
  const [form, setForm] = useState({ name: "", email: "", message: presetMessage });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const messageRef = useRef(null);

  // Auto-grow the message field to fit its content, so the underline always
  // sits right under the text instead of a few empty lines below it.
  useEffect(() => {
    const el = messageRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [form.message]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await createLead(form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-gold/40 bg-gold/5 px-6 py-8 text-center">
        <p className="font-display text-xl text-ink">Mensagem recebida.</p>
        <p className="mt-2 text-sm text-stone">
          Obrigada pelo contacto — respondemos o mais breve possível.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          required
          type="text"
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-transparent border-b border-ink/20 py-2 text-sm placeholder:text-stone focus:outline-none focus:border-gold transition-colors"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-transparent border-b border-ink/20 py-2 text-sm placeholder:text-stone focus:outline-none focus:border-gold transition-colors"
        />
      </div>
      <textarea
        ref={messageRef}
        required
        rows={1}
        placeholder="O que procura?"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full bg-transparent border-b border-ink/20 py-2 text-sm placeholder:text-stone focus:outline-none focus:border-gold transition-colors resize-none overflow-hidden block"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 bg-gold text-paper text-sm tracking-wide px-8 py-3 hover:bg-ink transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "A enviar…" : "Solicitar Contacto"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-700">Não foi possível enviar. Tente novamente.</p>
      )}
    </form>
  );
}
