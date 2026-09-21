import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang, dictionary, rememberLang, storedLang } from "../i18n";

// Language handling that never gets between a visitor (or a crawler) and the
// page they asked for: nothing redirects on first contact. A visitor whose
// browser is not Portuguese gets a small, dismissible offer; a visitor who
// previously chose English is taken there once, on arrival.
export default function LanguageSuggestion() {
  const { lang, switchHref } = useLang();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const arrived = useRef(true);

  useEffect(() => {
    if (!arrived.current) return;
    arrived.current = false;
    if (lang !== "pt") return;
    const to = switchHref("en");
    if (!to) return;
    const saved = storedLang();
    if (saved === "en") {
      navigate(to, { replace: true });
    } else if (!saved && !/^pt/i.test(navigator.language || "pt")) {
      setVisible(true);
    }
    // arrival-only on purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible || lang !== "pt") return null;

  const copy = dictionary("en").language;
  const to = switchHref("en");

  return (
    <div
      role="region"
      lang="en"
      aria-label="Language"
      className="fixed bottom-6 left-6 z-40 flex max-w-[calc(100vw-7rem)] items-center gap-4 border border-gold/40 bg-white/90 px-5 py-4 text-ink backdrop-blur-xl sm:max-w-md"
    >
      <p className="text-sm leading-snug">{copy.suggestion}</p>
      <button
        type="button"
        onClick={() => {
          rememberLang("en");
          navigate(to);
        }}
        className="shrink-0 bg-gold px-4 py-2 text-xs tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        {copy.accept}
      </button>
      <button
        type="button"
        aria-label={copy.dismiss}
        onClick={() => {
          rememberLang("pt");
          setVisible(false);
        }}
        className="flex h-8 w-8 shrink-0 items-center justify-center text-stone transition-colors hover:text-ink"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <path d="M2 2l8 8M10 2l-8 8" />
        </svg>
      </button>
    </div>
  );
}
