const PHONE = "351913503048";
const MESSAGE = "Olá Magda, gostaria de falar consigo sobre um imóvel.";

export default function WhatsAppButton() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full flex items-center justify-center bg-[#25D366] shadow-lg transition-all duration-200 hover:bg-[#20BD5A] hover:scale-110 hover:shadow-xl"
    >
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#fff" aria-hidden="true">
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.13-2.9-7-1.87-1.87-4.35-2.9-7-2.94Zm0 18.1h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.04s.88 2.37 1 2.53c.12.17 1.74 2.66 4.22 3.72.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
      </svg>
    </a>
  );
}
