import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll position on every route change — without this, navigating
// via the nav links keeps whatever scroll position the previous page was at.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
