/** An ayah identified by surah and number within the surah. */
export interface AyahPosition {
  surah: number;
  ayah: number;
}

/** Pixels from the top the reader is considered "at the top of the page" (no position to keep). */
const AT_TOP = 80;
/** How far below the reading line an ayah may start and still count as "the one at the top". */
const LINE_TOLERANCE = 40;

/** The last ayah scrollToAyah showed, and where it put it. */
let lastShown: { position: AyahPosition; top: number } | null = null;

/**
 * The ayah the reader is currently looking at (Cards and Book view both use
 * `id="ayah-<surah>-<n>"`). Null at the very top of the page.
 *
 * If the reader hasn't scrolled since scrollToAyah showed an ayah, that same
 * ayah is returned — so switching views back and forth can never drift.
 * Otherwise it's the last ayah that starts at or just below the reading line
 * (where scrollToAyah puts an ayah: its scroll-margin below the top, clear of
 * the bars). In Book view several short ayahs can start on the same line; the
 * first of them is used.
 */
export function readingAyah(): AyahPosition | null {
  if (window.scrollY < AT_TOP) return null;
  if (lastShown) {
    const el = document.getElementById(`ayah-${lastShown.position.surah}-${lastShown.position.ayah}`);
    if (el && Math.abs(el.getBoundingClientRect().top - lastShown.top) < 4) return lastShown.position;
  }

  const ayahs = document.querySelectorAll<HTMLElement>('[id^="ayah-"]');
  if (!ayahs.length) return null;
  const toolbar = document.querySelector("main .sticky");
  const barsBottom = Math.max(0, toolbar?.getBoundingClientRect().bottom ?? 0);
  const scrollMargin = parseFloat(getComputedStyle(ayahs[0]).scrollMarginTop) || 0;
  const line = Math.max(barsBottom, scrollMargin) + LINE_TOLERANCE;

  // Ayahs are in document (= vertical) order: binary-search the last one starting above the line.
  let lo = 0;
  let hi = ayahs.length - 1;
  let found = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (ayahs[mid].getBoundingClientRect().top <= line) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  // Several ayahs starting on that same line (Book view): take the first.
  const lineTop = ayahs[found].getBoundingClientRect().top;
  while (found > 0 && ayahs[found - 1].getBoundingClientRect().top >= lineTop - 2) found--;
  const m = ayahs[found].id.match(/^ayah-(\d+)-(\d+)$/);
  return m ? { surah: Number(m[1]), ayah: Number(m[2]) } : null;
}

/** Scrolls an ayah to the top of the reading area (just under the bars). Returns false if it isn't rendered. */
export function scrollToAyah({ surah, ayah }: AyahPosition): boolean {
  const el = document.getElementById(`ayah-${surah}-${ayah}`);
  if (!el) return false;
  el.scrollIntoView({ block: "start", behavior: "instant" });
  lastShown = { position: { surah, ayah }, top: el.getBoundingClientRect().top };
  return true;
}
