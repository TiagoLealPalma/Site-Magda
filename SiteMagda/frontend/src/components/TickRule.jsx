import { useReveal } from "../hooks/useReveal";

// The site's signature blueprint motif, animated to draw itself in — a nod
// to Magda's engineering background. Used sparingly, not on every rule.
export default function TickRule({ className = "", delay = 0 }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`tick-rule ${className}`}
      style={{
        transformOrigin: "left",
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transition: `transform 1s cubic-bezier(0.65,0,0.35,1) ${delay}ms`,
      }}
    />
  );
}
