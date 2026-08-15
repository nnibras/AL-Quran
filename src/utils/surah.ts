export const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

/** Surahs 1 (it's ayah 1 itself) and 9 (traditionally omits it) don't get a separately-rendered Bismillah. */
export function showsBismillahSeparately(surahNumber: number): boolean {
  return surahNumber !== 1 && surahNumber !== 9;
}

/**
 * For every surah except 1 and 9, ayah 1's text in the source data already
 * has the Bismillah baked into it (with combining marks in a different, but
 * canonically-equivalent, order than the BISMILLAH constant above — hence
 * normalizing before comparing). Since the UI renders it as a separate
 * heading via showsBismillahSeparately, it must be stripped here or it shows
 * up twice.
 */
export function stripEmbeddedBismillah(text: string): string {
  const normalized = text.normalize("NFC");
  const bismillah = BISMILLAH.normalize("NFC");
  if (!normalized.startsWith(bismillah)) return text;
  return normalized.slice(bismillah.length).trimStart();
}

const ARABIC_INDIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Renders a non-negative integer using Arabic-Indic digits, as ayah-end markers appear in a real mushaf. */
export function toArabicNumeral(n: number): string {
  return String(n)
    .split("")
    .map((d) => ARABIC_INDIC_DIGITS[Number(d)] ?? d)
    .join("");
}
