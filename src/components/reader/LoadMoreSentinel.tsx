import { useEffect, useRef } from "react";

/**
 * Calls `onVisible` when this (invisible) element comes within `margin` px of
 * the viewport, above or below — so it works at either end of a list.
 * Remount it (change its `key`) to re-check after new content loads.
 */
export function LoadMoreSentinel({ onVisible, margin = 1200 }: { onVisible: () => void; margin?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useRef(onVisible);
  callback.current = onVisible;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) callback.current();
      },
      { rootMargin: `${margin}px 0px ${margin}px 0px` }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return <div ref={ref} aria-hidden="true" className="h-px" />;
}
