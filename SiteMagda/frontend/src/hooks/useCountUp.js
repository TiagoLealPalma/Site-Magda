import { useEffect, useState } from "react";

// Animates a numeric value (optionally with a trailing suffix like "+") from
// 0 up to its target once `active` becomes true.
export function useCountUp(value, active, duration = 1200) {
  const [display, setDisplay] = useState(active ? value : 0);

  useEffect(() => {
    if (!active) return;
    const match = String(value).match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const target = Number(match[1]);
    const suffix = match[2];
    const start = performance.now();
    let raf;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${Math.round(target * eased)}${suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, active, duration]);

  return display;
}
