import type { Edition } from "../types";

/**
 * `code: ""` means "Arabic only" — just render the quran-simple text with no
 * translation row. Every other code names one of the bundled local JSON
 * files in src/data/translations (see data/loadQuranData.ts) — no network
 * request is made for text.
 */
export const TRANSLATIONS: Edition[] = [
  { code: "", label: "Arabic only" },
  { code: "en.transliteration", label: "English Transliteration" },
  { code: "en.sahih", label: "English" },
  { code: "bn.bengali", label: "Bengali" },
  { code: "sq.ahmeti", label: "Albanian" },
  { code: "az.mammadaliyev", label: "Azerbaijani" },
  { code: "bs.mlivo", label: "Bosnian" },
  { code: "bg.theophanov", label: "Bulgarian" },
  { code: "zh.jian", label: "Chinese" },
  { code: "cs.hrbek", label: "Czech" },
  { code: "nl.keyzer", label: "Dutch" },
  { code: "fa.ayati", label: "Farsi" },
  { code: "fr.hamidullah", label: "French" },
  { code: "de.aburida", label: "German" },
  { code: "hi.farooq", label: "Hindi" },
  { code: "id.indonesian", label: "Indonesian" },
  { code: "it.piccardo", label: "Italian" },
  { code: "ja.japanese", label: "Japanese" },
  { code: "ko.korean", label: "Korean" },
  { code: "ms.basmeih", label: "Malay" },
  { code: "no.berg", label: "Norwegian" },
  { code: "pl.bielawskiego", label: "Polish" },
  { code: "pt.elhayek", label: "Portuguese" },
  { code: "ro.grigore", label: "Romanian" },
  { code: "ru.kuliev", label: "Russian" },
  { code: "es.asad", label: "Spanish" },
  { code: "sv.bernstrom", label: "Swedish" },
  { code: "tr.ates", label: "Turkish" },
  { code: "ur.ahmedali", label: "Urdu" },
];

export const DEFAULT_TRANSLATION = "en.sahih";

export interface Reciter {
  code: string;
  label: string;
}

/** Audio editions available on alquran.cloud / cdn.islamic.network. */
export const RECITERS: Reciter[] = [
  { code: "ar.alafasy", label: "Mishary Rashid Al-Afasy" },
  { code: "ar.abdulbasitmurattal", label: "Abdul Basit (Murattal)" },
];

export const DEFAULT_RECITER = "ar.alafasy";

/** Full-surah audio, streamed from the Islamic Network CDN. */
export function surahAudioUrl(reciterCode: string, surahNumber: number, bitrate: 64 | 128 = 128): string {
  return `https://cdn.islamic.network/quran/audio-surah/${bitrate}/${reciterCode}/${surahNumber}.mp3`;
}

/** Legacy source kept only as a last-resort fallback if the CDN URL fails to load. */
export function legacySurahAudioUrl(surahNumber: number): string {
  return `https://github.com/Treposting/Surah-API/blob/main/Surah/${surahNumber}.mp3?raw=true`;
}

/** Single-ayah audio, addressed by the ayah's global number (1-6236). */
export function ayahAudioUrl(reciterCode: string, globalAyahNumber: number, bitrate: 64 | 128 = 128): string {
  return `https://cdn.islamic.network/quran/audio/${bitrate}/${reciterCode}/${globalAyahNumber}.mp3`;
}
