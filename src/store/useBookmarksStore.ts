import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bookmark } from "../types";

interface BookmarksState {
  bookmarks: Bookmark[];
  isBookmarked: (surahNumber: number, ayahNumberInSurah: number) => boolean;
  toggleBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (surahNumber: number, ayahNumberInSurah: number) => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      isBookmarked: (surahNumber, ayahNumberInSurah) =>
        get().bookmarks.some(
          (b) => b.surahNumber === surahNumber && b.ayahNumberInSurah === ayahNumberInSurah
        ),
      toggleBookmark: (bookmark) => {
        const exists = get().isBookmarked(bookmark.surahNumber, bookmark.ayahNumberInSurah);
        if (exists) {
          get().removeBookmark(bookmark.surahNumber, bookmark.ayahNumberInSurah);
        } else {
          set({ bookmarks: [bookmark, ...get().bookmarks] });
        }
      },
      removeBookmark: (surahNumber, ayahNumberInSurah) =>
        set({
          bookmarks: get().bookmarks.filter(
            (b) => !(b.surahNumber === surahNumber && b.ayahNumberInSurah === ayahNumberInSurah)
          ),
        }),
    }),
    { name: "al-quran/bookmarks" }
  )
);
