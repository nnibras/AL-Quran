import { create } from "zustand";

interface UiState {
  /** True while the user is scrolling down: the mobile header and reader toolbar slide away. */
  chromeHidden: boolean;
  setChromeHidden: (hidden: boolean) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  chromeHidden: false,
  setChromeHidden: (chromeHidden) => set({ chromeHidden }),
}));
