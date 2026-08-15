/**
 * All Quran text (Arabic + every translation) ships with the app as static
 * JSON — no network call to a third-party API is ever made for text, search,
 * or surah/juz data. Each file is still its own lazily-loaded chunk (via
 * dynamic import / import.meta.glob), so selecting a translation only
 * downloads that one language, and nothing is fetched until it's needed.
 *
 * Only audio streaming still depends on an external CDN (see api/editions.ts).
 */

export interface RawWholeAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface RawWholeSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: "Meccan" | "Medinan";
  ayahs: RawWholeAyah[];
}

interface RawWholeQuranModule {
  default: { data: { surahs: RawWholeSurah[] } };
}

const translationModules = import.meta.glob<RawWholeQuranModule>("./translations/*.json");

let arabicPromise: Promise<RawWholeSurah[]> | null = null;
const translationCache = new Map<string, Promise<RawWholeSurah[]>>();

export function loadArabic(): Promise<RawWholeSurah[]> {
  if (!arabicPromise) {
    arabicPromise = import("./quran-simple.json")
      .then((mod) => (mod as unknown as RawWholeQuranModule).default.data.surahs)
      .catch((err) => {
        // Let a later retry try the import again instead of replaying this rejection forever.
        arabicPromise = null;
        throw err instanceof Error ? err : new Error("Couldn't load the Quran text. Try refreshing the page.");
      });
  }
  return arabicPromise;
}

export function loadTranslation(code: string): Promise<RawWholeSurah[]> {
  const cached = translationCache.get(code);
  if (cached) return cached;

  const loader = translationModules[`./translations/${code}.json`];
  if (!loader) {
    return Promise.reject(new Error(`Unknown translation "${code}".`));
  }

  const promise = loader()
    .then((mod) => mod.default.data.surahs)
    .catch((err) => {
      translationCache.delete(code);
      throw err instanceof Error ? err : new Error("Couldn't load this translation. Try refreshing the page.");
    });
  translationCache.set(code, promise);
  return promise;
}
