import { useState } from "react";
import { useT } from "../i18n";

function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function CopyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <rect x="9" y="9" width="12" height="12" rx="0.5" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" strokeLinecap="round" />
    </svg>
  );
}

// A hairline-bordered map block: the site's flat, sharp-cornered language
// applied to a Google Maps embed. Renders an address bar with a copy button
// even when there is no pin yet, so the block is never a dead end.
export default function LocationMap({ address, latitude, longitude, preview = false }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const hasPin = latitude != null && latitude !== "" && longitude != null && longitude !== "";
  const mapsUrl = hasPin
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : `https://www.google.com/maps?q=${encodeURIComponent(address || "")}`;

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be blocked; the address is still selectable text.
    }
  }

  return (
    <div className="border border-ink/10">
      <div className="relative aspect-[16/10] bg-paper-dim sm:aspect-[21/9]">
        {hasPin ? (
          <iframe
            title={t("detail.mapTitle")}
            src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
            className="absolute inset-0 h-full w-full grayscale-[15%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={preview ? -1 : 0}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-stone">
            <PinIcon className="h-6 w-6 text-stone/60" />
            {t("detail.noPin")}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-ink/10 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <PinIcon className="h-4 w-4 shrink-0 text-gold-deep" />
          <p className="truncate text-sm text-ink" title={address}>
            {address}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-5">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden font-mono text-xs uppercase tracking-widest text-stone transition-colors hover:text-gold-deep sm:inline"
          >
            {t("detail.openInMaps")}
          </a>
          <button
            type="button"
            onClick={copyAddress}
            className="flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-widest text-stone transition-colors hover:text-gold-deep"
          >
            <CopyIcon className="h-4 w-4" />
            {copied ? t("detail.copied") : t("detail.copyAddress")}
          </button>
        </div>
      </div>
    </div>
  );
}
