import { useEffect } from "react";
import { usePreferencesStore } from "../store/usePreferencesStore";

export function useTheme() {
  const theme = usePreferencesStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const isDark = theme === "dark" || (theme === "system" && mql.matches);
      root.classList.toggle("dark", isDark);
    };

    apply();
    if (theme === "system") {
      mql.addEventListener("change", apply);
      return () => mql.removeEventListener("change", apply);
    }
  }, [theme]);
}
