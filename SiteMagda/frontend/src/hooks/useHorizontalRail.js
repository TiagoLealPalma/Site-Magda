import { useEffect } from "react";

// Adds left/right arrow-key scrolling so the rail is usable without a mouse
// once it's focused (paired with tabIndex + a real aria-label on the
// container). Vertical wheel/trackpad scrolling is handled natively by the
// browser — the rail sets `overflow-y-hidden` explicitly alongside
// `overflow-x-auto` so the page's own vertical scroll is never captured,
// which is smoother than any hand-rolled wheel forwarding could be.
export function useHorizontalRail(ref, active = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    function onKeyDown(e) {
      if (e.key === "ArrowRight") {
        el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
      }
    }

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [ref, active]);
}
