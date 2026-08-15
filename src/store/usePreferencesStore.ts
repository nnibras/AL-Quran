import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_RECITER, DEFAULT_TRANSLATION } from "../api/editions";
import type { Theme } from "../types";

export type ViewMode = "cards" | "book";

interface LastRead {
  surah: number;
  juz: number;
  /** Which of the two was viewed most recently — used only to resume at "/". */
  mostRecent: "surah" | "juz";
}

interface PreferencesState {
  translation: string;
  reciter: string;
  theme: Theme;
  arabicFontSize: number;
  viewMode: ViewMode;
  lastRead: LastRead;
  skipResumePrompt: boolean;
  setTranslation: (code: string) => void;
  setReciter: (code: string) => void;
  setTheme: (theme: Theme) => void;
  setArabicFontSize: (size: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setLastRead: (kind: "surah" | "juz", number: number) => void;
  setSkipResumePrompt: (skip: boolean) => void;
}

export const MIN_FONT_SIZE = 20;
export const MAX_FONT_SIZE = 48;
const DEFAULT_FONT_SIZE = 30;

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      translation: DEFAULT_TRANSLATION,
      reciter: DEFAULT_RECITER,
      theme: "light",
      arabicFontSize: DEFAULT_FONT_SIZE,
      viewMode: "cards",
      lastRead: { surah: 1, juz: 1, mostRecent: "surah" },
      skipResumePrompt: false,
      setTranslation: (code) => set({ translation: code }),
      setReciter: (code) => set({ reciter: code }),
      setTheme: (theme) => set({ theme }),
      setArabicFontSize: (size) =>
        set({ arabicFontSize: Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size)) }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setLastRead: (kind, number) =>
        set((state) => ({ lastRead: { ...state.lastRead, [kind]: number, mostRecent: kind } })),
      setSkipResumePrompt: (skip) => set({ skipResumePrompt: skip }),
    }),
    { name: "al-quran/preferences" }
  )
);
