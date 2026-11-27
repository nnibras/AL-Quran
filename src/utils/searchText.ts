/**
 * Text normalisation for search, shared by the search engine (matching) and the
 * results UI (highlighting).
 *
 * Matching is case-, accent- and Arabic-diacritic-insensitive:
 *  - Latin accents are dropped ("é" → "e"), compatibility forms unified (NFKD).
 *  - Arabic harakat, Quranic annotation marks, tatweel and hamza carriers are
 *    stripped/unified, so "الرحمن" finds "الرَّحْمَٰنِ" and "اله" finds "إِلَٰهَ".
 *  - Letter variants are folded: ٱ→ا, ى/ی→ي, ک→ك, ة/ۃ/ہ/ھ→ه (also lets people
 *    typing on Farsi/Urdu keyboards find Arabic text).
 * Vowel signs of other scripts (Devanagari, Bengali…) are kept: they're letters
 * there, not optional diacritics.
 */

const STRIP =
  /[̀-ͯؐ-ًؚ-ٰٟۖ-ۭـ﻿​-‏]/g;
const FOLD_CHARS = /[ٱىیکةۃہھ]/g;
const FOLD: Record<string, string> = {
  "ٱ": "ا", // ٱ → ا
  "ى": "ي", // ى → ي
  "ی": "ي", // ی → ي
  "ک": "ك", // ک → ك
  "ة": "ه", // ة → ه
  "ۃ": "ه", // ۃ → ه
  "ہ": "ه", // ہ → ه
  "ھ": "ه", // ھ → ه
};

/**
 * @param daggerAlefAsAlef The Quran writes some long "a" sounds with a small
 *   superscript alef (ٰ) where modern spelling uses a full alef (الكتٰب vs
 *   الكتاب). Arabic text is indexed both ways so either spelling matches.
 */
export function normalizeForSearch(text: string, daggerAlefAsAlef = false): string {
  let s = text.toLowerCase();
  if (daggerAlefAsAlef) s = s.replace(/ٰ/g, "ا");
  return s.normalize("NFKD").replace(STRIP, "").normalize("NFC").replace(FOLD_CHARS, (c) => FOLD[c]);
}

/** Normalised query words (punctuation removed). Empty if the query has no letters. */
export function searchTerms(query: string): string[] {
  const terms = normalizeForSearch(query)
    .replace(/[\p{P}\p{S}]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  return terms.some((t) => /\p{L}/u.test(t)) ? terms : [];
}

export function matchesAllTerms(normalizedText: string, terms: string[]): boolean {
  for (const term of terms) if (!normalizedText.includes(term)) return false;
  return true;
}

export type Range = [start: number, end: number];

/** Normalises `text` char by char, remembering where each normalised char came from. */
function indexMap(text: string, daggerAlefAsAlef: boolean) {
  let norm = "";
  const origin: number[] = [];
  for (let i = 0; i < text.length; ) {
    const ch = String.fromCodePoint(text.codePointAt(i)!);
    const n = normalizeForSearch(ch, daggerAlefAsAlef);
    for (let k = 0; k < n.length; k++) origin.push(i);
    norm += n;
    i += ch.length;
  }
  return { norm, origin };
}

/**
 * Character ranges of `text` (original, un-normalised) that match any term,
 * merged and sorted. Trailing diacritics are included so Arabic letters are
 * never split from their harakat.
 */
export function highlightRanges(text: string, terms: string[], alsoDaggerAlefAsAlef = false): Range[] {
  if (!terms.length) return [];
  const ranges: Range[] = [];
  const variants = alsoDaggerAlefAsAlef ? [false, true] : [false];
  for (const variant of variants) {
    const { norm, origin } = indexMap(text, variant);
    for (const term of terms) {
      let from = norm.indexOf(term);
      while (from !== -1) {
        const start = origin[from];
        const lastOrigin = origin[from + term.length - 1];
        let end = lastOrigin + String.fromCodePoint(text.codePointAt(lastOrigin)!).length;
        // swallow following combining marks (they normalise to nothing)
        while (end < text.length && normalizeForSearch(text[end], variant) === "") end++;
        ranges.push([start, end]);
        from = norm.indexOf(term, from + term.length);
      }
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Range[] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([r[0], r[1]]);
  }
  return merged;
}

/**
 * A window of at most ~`maxLength` chars around the first highlight, cut at word
 * boundaries, with ranges shifted to match. Short texts are returned whole.
 */
export function snippet(text: string, ranges: Range[], maxLength = 220): { text: string; ranges: Range[] } {
  if (text.length <= maxLength) return { text, ranges };
  const focus = ranges[0]?.[0] ?? 0;
  let start = Math.max(0, focus - Math.floor(maxLength / 3));
  let end = Math.min(text.length, start + maxLength);
  start = Math.max(0, end - maxLength);
  if (start > 0) {
    const space = text.indexOf(" ", start);
    if (space !== -1 && space < focus) start = space + 1;
  }
  if (end < text.length) {
    const space = text.lastIndexOf(" ", end);
    if (space > start + maxLength / 2) end = space;
  }
  const prefix = start > 0 ? "… " : "";
  const suffix = end < text.length ? " …" : "";
  const shift = prefix.length - start;
  return {
    text: prefix + text.slice(start, end) + suffix,
    ranges: ranges
      .filter(([s, e]) => e > start && s < end)
      .map(([s, e]) => [Math.max(s, start) + shift, Math.min(e, end) + shift] as Range),
  };
}
