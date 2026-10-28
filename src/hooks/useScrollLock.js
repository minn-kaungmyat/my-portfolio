import { useEffect } from "react";
import { getLenis } from "../utils/lenis";

/**
 * Locks page scrolling while `active` is true.
 * - Pauses Lenis (otherwise it hijacks wheel / trackpad events and scrolls the page)
 * - Sets overflow:hidden on <html> so native + touch scrolling stops too
 * `scrollbar-gutter: stable` (index.css) keeps the layout from shifting.
 */
export default function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;

    const lenis = getLenis();
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;

    lenis?.stop();
    html.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [active]);
}
