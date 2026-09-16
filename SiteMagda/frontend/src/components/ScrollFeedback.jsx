import { useEffect, useRef, useState } from "react";
import TickRule from "./TickRule";

const VH_PER_STEP = 80; // scroll distance (vh) to go from the primary quote to the rest

// A short, pinned fullscreen moment: the primary testimonial holds the
// screen, then disappears as the rest crossfade in as a group — driven by
// scroll position, not a timer, and short enough not to overstay its welcome.
export default function ScrollFeedback({ featured, others }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reducedMotion) return;
    const el = trackRef.current;
    if (!el) return;

    function onScroll() {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setActiveIndex(progress < 0.5 ? 0 : 1);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="bg-paper py-24 md:py-36 border-t border-ink/10">
        <div className="mx-auto max-w-3xl px-6 md:px-8 text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-10">Feedback</p>
          <p className="font-display text-2xl md:text-3xl leading-snug text-ink">“{featured.text}”</p>
          <TickRule className="w-10 mx-auto mt-8 mb-5" />
          <p className="font-mono text-xs tracking-widest uppercase text-gold-deep">{featured.author}</p>
        </div>
        <div className="mx-auto max-w-6xl px-6 md:px-8 mt-20 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12 border-t border-ink/10 pt-16">
          {others.map((t) => (
            <div key={t.author}>
              <p className="text-stone leading-relaxed">“{t.text}”</p>
              <p className="mt-4 font-mono text-xs tracking-widest uppercase text-gold-deep">
                {t.author}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={trackRef}
      id="scroll-feedback"
      className="relative bg-paper"
      style={{ height: `${100 + VH_PER_STEP}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6 md:px-8">
        <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase mb-10">Feedback</p>

        <div className="relative w-full max-w-4xl min-h-[16rem] md:min-h-[20rem]">
          <div
            className="absolute inset-0 flex flex-col items-center justify-start text-center transition-opacity duration-500 ease-out"
            style={{ opacity: activeIndex === 0 ? 1 : 0, pointerEvents: activeIndex === 0 ? "auto" : "none" }}
            aria-hidden={activeIndex !== 0}
          >
            <p className="font-display text-2xl sm:text-3xl md:text-5xl leading-snug text-ink max-w-3xl">
              “{featured.text}”
            </p>
            <TickRule className="w-10 mt-8 mb-5" />
            <p className="font-mono text-xs tracking-widest uppercase text-gold-deep">{featured.author}</p>
          </div>

          <div
            className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 content-center transition-opacity duration-500 ease-out"
            style={{ opacity: activeIndex === 1 ? 1 : 0, pointerEvents: activeIndex === 1 ? "auto" : "none" }}
            aria-hidden={activeIndex !== 1}
          >
            {others.map((t) => (
              <div key={t.author}>
                <p className="text-stone leading-relaxed text-sm md:text-base">“{t.text}”</p>
                <p className="mt-3 font-mono text-xs tracking-widest uppercase text-gold-deep">
                  {t.author}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2">
          <span className={`h-1.5 transition-all duration-300 ${activeIndex === 0 ? "w-6 bg-gold" : "w-1.5 bg-ink/15"}`} />
          <span className={`h-1.5 transition-all duration-300 ${activeIndex === 1 ? "w-6 bg-gold" : "w-1.5 bg-ink/15"}`} />
        </div>

        <p
          className="mt-8 font-mono text-[11px] tracking-widest uppercase text-stone transition-opacity duration-500"
          style={{ opacity: activeIndex === 0 ? 1 : 0 }}
        >
          Continue a percorrer ↓
        </p>
      </div>
    </section>
  );
}
