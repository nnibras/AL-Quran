export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface Ayah {
  /** Global ayah number across the whole Quran (1-6236). */
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  sajda: boolean;
  /** Standard Madani mushaf page this ayah falls on (1-604). */
  page: number;
  /** Juz (para) this ayah falls in (1-30). */
  juz: number;
  surah: {
    number: number;
    englishName: string;
    name: string;
  };
}

export interface Edition {
  code: string;
  label: string;
}

/** App color theme. "dark", "maroon" and "green" all render in Tailwind dark mode. */
export type Theme = "light" | "dark" | "maroon" | "green";

export interface Bookmark {
  surahNumber: number;
  ayahNumberInSurah: number;
  surahEnglishName: string;
  text: string;
  createdAt: number;
}
