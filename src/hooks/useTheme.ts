import { useEffect } from "react";
import { usePreferencesStore } from "../store/usePreferencesStore";

/**
 * Applies the chosen theme to <html>. Every non-light theme builds on Tailwind's
 * dark mode; "maroon" and "green" additionally swap the stone/brand color scales
 * via `.theme-maroon` / `.theme-green` in index.css.
 */
export function useTheme() {
  const theme = usePreferencesStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme !== "light");
    root.classList.toggle("theme-maroon", theme === "maroon");
    root.classList.toggle("theme-green", theme === "green");
  }, [theme]);
}
