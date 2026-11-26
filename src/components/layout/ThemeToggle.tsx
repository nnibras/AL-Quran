import { usePreferencesStore } from "../../store/usePreferencesStore";
import type { Theme } from "../../types";

const OPTIONS: { theme: Theme; label: string; swatch: string }[] = [
  { theme: "light", label: "Day", swatch: "border-stone-300 bg-white" },
  { theme: "dark", label: "Night", swatch: "border-stone-500 bg-[#0c0a09]" },
  { theme: "maroon", label: "Maroon", swatch: "border-parchment-gold bg-maroon-700" },
  { theme: "green", label: "Green", swatch: "border-[#2b9a80] bg-[#1d4a40]" },
];

export function ThemeToggle() {
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);

  return (
    <div role="radiogroup" aria-label="Theme" className="flex items-start gap-3">
      {OPTIONS.map(({ theme: t, label, swatch }) => {
        const active = theme === t;
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(t)}
            className="group flex flex-col items-center gap-1 focus-visible:outline-none"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full transition group-focus-visible:ring-2 group-focus-visible:ring-brand-500 ${
                active ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-stone-900" : ""
              }`}
            >
              <span className={`h-7 w-7 rounded-full border-2 ${swatch}`} />
            </span>
            <span
              className={`text-[0.7rem] font-medium ${
                active ? "text-brand-600 dark:text-brand-400" : "text-stone-500 dark:text-stone-400"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
