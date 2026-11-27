import { useEffect } from "react";
import { useUiStore } from "../store/useUiStore";

/** Distance (px) the reader must move in one direction before the bars react. */
const THRESHOLD = 12;
/** Near the top of the page the bars are always shown. */
const ALWAYS_SHOW_ABOVE = 80;

const DOWN_KEYS = new Set(["ArrowDown", "PageDown", "End", " "]);
const UP_KEYS = new Set(["ArrowUp", "PageUp", "Home"]);

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/**
 * Hides the top bars while the reader scrolls down and brings them back as soon
 * as they scroll up, so the reading area gets the whole screen. Mount once (in
 * AppShell).
 *
 * The direction comes from the reader's own input — finger, wheel/trackpad,
 * keyboard — not from changes in the scroll position. The app also moves the
 * scroll position itself (keeping the page in place when a surah is inserted
 * above, jumping to an ayah), and on Android those corrections can arrive late
 * and look like the reader scrolling the other way. Input never lies about
 * direction.
 */
export function useHideOnScroll() {
  const setChromeHidden = useUiStore((s) => s.setChromeHidden);

  useEffect(() => {
    let pending = 0; // movement accumulated in the current direction
    let touchY: number | null = null;

    /** `dy` > 0: the reader is moving further down the page. */
    const move = (dy: number) => {
      if (dy === 0) return;
      if (Math.sign(dy) !== Math.sign(pending)) pending = 0;
      pending += dy;
      if (Math.abs(pending) < THRESHOLD) return;
      setChromeHidden(pending > 0 && window.scrollY >= ALWAYS_SHOW_ABOVE);
      pending = 0;
    };

    const onWheel = (e: WheelEvent) => move(e.deltaY);
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches.length === 1 ? e.touches[0].clientY : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null || e.touches.length !== 1) return;
      const y = e.touches[0].clientY;
      move(touchY - y); // finger moving up = content moving down the page
      touchY = y;
    };
    const onTouchEnd = () => {
      touchY = null;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.altKey || e.ctrlKey || e.metaKey) return;
      if (DOWN_KEYS.has(e.key)) move(e.key === " " && e.shiftKey ? -THRESHOLD : THRESHOLD);
      else if (UP_KEYS.has(e.key)) move(-THRESHOLD);
    };
    const onScroll = () => {
      if (window.scrollY < ALWAYS_SHOW_ABOVE) setChromeHidden(false);
    };

    const opts = { passive: true } as const;
    window.addEventListener("wheel", onWheel, opts);
    window.addEventListener("touchstart", onTouchStart, opts);
    window.addEventListener("touchmove", onTouchMove, opts);
    window.addEventListener("touchend", onTouchEnd, opts);
    window.addEventListener("touchcancel", onTouchEnd, opts);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, opts);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [setChromeHidden]);
}
