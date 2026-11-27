import { useEffect } from "react";
import { useUiStore } from "../store/useUiStore";

/** Distance (px) the user must scroll in one direction before the bars react. */
const THRESHOLD = 12;
/** Near the top of the page the bars are always shown. */
const ALWAYS_SHOW_ABOVE = 80;

let ignoreUntil = 0;
/**
 * Call right before scrolling programmatically (e.g. keeping the reading
 * position when content is inserted above) so that jump isn't mistaken for the
 * reader scrolling down.
 */
export function ignoreNextScrollJump() {
  ignoreUntil = performance.now() + 150;
}

/**
 * Hides the top bars while scrolling down and brings them back on any scroll up,
 * so the reading area gets the whole screen. Mount once (in AppShell).
 */
export function useHideOnScroll() {
  const setChromeHidden = useUiStore((s) => s.setChromeHidden);

  useEffect(() => {
    let lastY = window.scrollY;

    // Browsers already dispatch scroll events at most once per frame.
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (performance.now() < ignoreUntil || Math.abs(delta) > window.innerHeight) {
        // A jump, not a scroll gesture (e.g. content inserted above, jump to ayah).
        lastY = y;
      } else if (y < ALWAYS_SHOW_ABOVE) {
        setChromeHidden(false);
        lastY = y;
      } else if (Math.abs(delta) >= THRESHOLD) {
        setChromeHidden(delta > 0);
        lastY = y;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setChromeHidden]);
}
