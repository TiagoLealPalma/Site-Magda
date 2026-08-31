import { useEffect } from "react";

export default function Lightbox({ images, index, onClose, onNavigate }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-6 right-8 text-paper/70 hover:text-gold text-3xl leading-none"
      >
        ×
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + images.length) % images.length);
        }}
        aria-label="Anterior"
        className="absolute left-6 text-paper/60 hover:text-gold text-4xl px-3"
      >
        ‹
      </button>

      <img
        src={images[index].url}
        alt="Imagem do imóvel"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[85vw] object-contain"
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % images.length);
        }}
        aria-label="Seguinte"
        className="absolute right-6 text-paper/60 hover:text-gold text-4xl px-3"
      >
        ›
      </button>

      <p className="absolute bottom-6 font-mono text-xs text-paper/50">
        {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
      </p>
    </div>
  );
}
