import { useEffect, useRef, useState } from "react";
import { createLead } from "../api/client";
import { useT } from "../i18n";

export default function LeadForm({ presetMessage = "" }) {
  const t = useT();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: presetMessage });
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
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-gold/40 bg-gold/5 px-6 py-8 text-center">
        <p className="font-display text-xl text-ink">{t("lead.sentTitle")}</p>
        <p className="mt-2 text-sm text-stone">
          {t("lead.sentText")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="lead-name" className="sr-only">
            {t("lead.name")}
          </label>
          <input
            id="lead-name"
            required
            type="text"
            placeholder={t("lead.name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-transparent border-b border-ink/20 py-2 text-sm placeholder:text-stone focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div>
          <label htmlFor="lead-email" className="sr-only">
            {t("lead.email")}
          </label>
          <input
            id="lead-email"
            required
            type="email"
            placeholder={t("lead.email")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-transparent border-b border-ink/20 py-2 text-sm placeholder:text-stone focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-phone" className="sr-only">
            {t("lead.phoneLabel")}
          </label>
          <input
            id="lead-phone"
            required
            type="tel"
            placeholder={t("lead.phone")}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-transparent border-b border-ink/20 py-2 text-sm placeholder:text-stone focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="lead-message" className="sr-only">
          {t("lead.message")}
        </label>
        <textarea
          id="lead-message"
          ref={messageRef}
          required
          rows={1}
          placeholder={t("lead.message")}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-transparent border-b border-ink/20 py-2 text-sm placeholder:text-stone focus:outline-none focus:border-gold transition-colors resize-none overflow-hidden block"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 bg-gold text-paper text-sm tracking-wide px-8 py-3 hover:bg-ink transition-colors disabled:opacity-60"
      >
        {status === "sending" ? t("lead.sending") : t("lead.submit")}
      </button>
      {status === "error" && (
        <p className="text-sm text-rust">{t("lead.error")}</p>
      )}
    </form>
  );
}
