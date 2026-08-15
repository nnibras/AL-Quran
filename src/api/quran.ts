import { loadArabic, loadTranslation, type RawWholeSurah } from "../data/loadQuranData";
import type { Ayah, SearchMatch, SurahMeta } from "../types";
import { DEFAULT_TRANSLATION } from "./editions";

function buildSurahMeta(surah: RawWholeSurah): SurahMeta {
  return {
    number: surah.number,
    name: surah.name,
    englishName: surah.englishName,
    englishNameTranslation: surah.englishNameTranslation,
    numberOfAyahs: surah.ayahs.length,
    revelationType: surah.revelationType,
  };
}

function translationTextByAyahNumber(surahs: RawWholeSurah[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const surah of surahs) {
    for (const ayah of surah.ayahs) map.set(ayah.number, ayah.text);
  }
  return map;
}

export async function getSurahList(): Promise<SurahMeta[]> {
  const surahs = await loadArabic();
  return surahs.map(buildSurahMeta);
}

export async function getSurahAyahs(surahNumber: number, translationCode: string): Promise<{
  meta: SurahMeta;
  ayahs: Ayah[];
}> {
  const arabicSurahs = await loadArabic();
  const surah = arabicSurahs[surahNumber - 1];
  if (!surah) throw new Error(`Surah ${surahNumber} doesn't exist.`);

  const translationMap = translationCode
    ? translationTextByAyahNumber(await loadTranslation(translationCode))
    : null;

  const ayahs: Ayah[] = surah.ayahs.map((ayah) => ({
    number: ayah.number,
    numberInSurah: ayah.numberInSurah,
    text: ayah.text,
    translation: translationMap?.get(ayah.number) ?? "",
    sajda: Boolean(ayah.sajda),
    page: ayah.page,
    juz: ayah.juz,
    surah: { number: surah.number, englishName: surah.englishName, name: surah.name },
  }));

  return { meta: buildSurahMeta(surah), ayahs };
}

export async function getJuzAyahs(juzNumber: number, translationCode: string): Promise<Ayah[]> {
  const arabicSurahs = await loadArabic();
  const translationMap = translationCode
    ? translationTextByAyahNumber(await loadTranslation(translationCode))
    : null;

  const ayahs: Ayah[] = [];
  for (const surah of arabicSurahs) {
    for (const ayah of surah.ayahs) {
      if (ayah.juz !== juzNumber) continue;
      ayahs.push({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: translationMap?.get(ayah.number) ?? "",
        sajda: Boolean(ayah.sajda),
        page: ayah.page,
        juz: ayah.juz,
        surah: { number: surah.number, englishName: surah.englishName, name: surah.name },
      });
    }
  }
  return ayahs;
}

export async function searchQuran(keyword: string, translationCode: string): Promise<SearchMatch[]> {
  const needle = keyword.trim().toLowerCase();
  if (!needle) return [];

  const surahs = await loadTranslation(translationCode || DEFAULT_TRANSLATION);
  const matches: SearchMatch[] = [];
  for (const surah of surahs) {
    for (const ayah of surah.ayahs) {
      if (ayah.text.toLowerCase().includes(needle)) {
        matches.push({
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          text: ayah.text,
          surah: { number: surah.number, englishName: surah.englishName, name: surah.name },
        });
      }
    }
  }
  return matches;
}
