import { useReveal } from "../hooks/useReveal";
import { useCountUp } from "../hooks/useCountUp";

// A single technical data point rendered in the site's "blueprint annotation"
// language: mono numerals, small gold caption — used for price, area,
// bedrooms, stats. Kept out of decorative use elsewhere.
export default function Spec({ label, value, size = "md", center = false, animate = false }) {
  const valueSize = size === "lg" ? "text-3xl" : "text-base";
  const { ref, visible } = useReveal();
  const display = useCountUp(value, animate && visible);

  return (
    <div ref={animate ? ref : undefined} className={center ? "text-center" : undefined}>
      <p className={`font-mono ${valueSize} text-ink tracking-tight`}>{animate ? display : value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-widest text-stone">{label}</p>
    </div>
  );
}
