export const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

/** Surahs 1 (it's ayah 1 itself) and 9 (traditionally omits it) don't get a separately-rendered Bismillah. */
export function showsBismillahSeparately(surahNumber: number): boolean {
  return surahNumber !== 1 && surahNumber !== 9;
}

const ARABIC_INDIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Renders a non-negative integer using Arabic-Indic digits, as ayah-end markers appear in a real mushaf. */
export function toArabicNumeral(n: number): string {
  return String(n)
    .split("")
    .map((d) => ARABIC_INDIC_DIGITS[Number(d)] ?? d)
    .join("");
}
