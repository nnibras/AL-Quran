import { create } from "zustand";
import type { AyahPosition } from "../utils/readingPosition";

interface UiState {
  /** True while the user is scrolling down: the mobile header and reader toolbar slide away. */
  chromeHidden: boolean;
  setChromeHidden: (hidden: boolean) => void;
  /** Set when switching Cards/Book view: the ayah to show again once the other view renders. */
  keepAyah: AyahPosition | null;
  setKeepAyah: (position: AyahPosition | null) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  chromeHidden: false,
  setChromeHidden: (chromeHidden) => set({ chromeHidden }),
  keepAyah: null,
  setKeepAyah: (keepAyah) => set({ keepAyah }),
}));
