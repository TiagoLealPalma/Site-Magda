import { useEffect } from "react";

// A horizontal-scroll rail sits on both scroll axes once `overflow-x: auto`
// is set (browsers force overflow-y to a scroll-capable value too), which
// lets it silently swallow a visitor's vertical mouse-wheel scroll instead
// of the gesture reaching the page — a real desktop scroll-trap, not a
// stylistic nicety. This forwards clearly-vertical wheel gestures to the
// page, and clearly-horizontal ones to the rail; it does not touch touch or
// trackpad-drag scrolling, which already works natively.
//
// It also adds left/right arrow-key scrolling so the rail is usable without
// a mouse once it's focused (paired with tabIndex + a real aria-label on
// the container).
export function useHorizontalRail(ref, active = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    function onWheel(e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        // Explicit "auto": the page's CSS scroll-behavior is smooth, and
        // without this every wheel tick (there are many per gesture) queues
        // its own eased scroll animation, which stack and fight each other
        // into a laggy, stuttering scroll instead of tracking the wheel.
        window.scrollBy({ top: e.deltaY, behavior: "auto" });
      }
    }

    function onKeyDown(e) {
      if (e.key === "ArrowRight") {
        el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("keydown", onKeyDown);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, active]);
}
