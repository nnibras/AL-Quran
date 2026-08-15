import { usePreferencesStore } from "../../store/usePreferencesStore";
import type { Theme } from "../../types";
import { IconButton } from "../common/IconButton";
import { IconMoon, IconSun, IconSystem } from "../common/Icons";

const OPTIONS: { theme: Theme; label: string; Icon: typeof IconSun }[] = [
  { theme: "light", label: "Light theme", Icon: IconSun },
  { theme: "system", label: "Match system theme", Icon: IconSystem },
  { theme: "dark", label: "Dark theme", Icon: IconMoon },
];

export function ThemeToggle() {
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);

  return (
    <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100 p-1 dark:border-stone-800 dark:bg-stone-900">
      {OPTIONS.map(({ theme: t, label, Icon }) => (
        <IconButton key={t} label={label} active={theme === t} onClick={() => setTheme(t)} className="h-8 w-8">
          <Icon className="h-4 w-4" />
        </IconButton>
      ))}
    </div>
  );
}
