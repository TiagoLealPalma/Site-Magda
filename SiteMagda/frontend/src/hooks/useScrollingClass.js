import { useEffect } from "react";

// Marks <body> with "is-scrolling" for the duration of any scroll gesture
// (page scroll or a horizontal rail's own scroll), cleared shortly after it
// settles. Used to suspend hover-triggered effects that otherwise fire
// rapidly as elements sweep past a stationary cursor mid-scroll.
export function useScrollingClass() {
  useEffect(() => {
    let timeoutId = null;

    function onScroll() {
      document.body.classList.add("is-scrolling");
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 150);
    }

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      clearTimeout(timeoutId);
      document.body.classList.remove("is-scrolling");
    };
  }, []);
}
