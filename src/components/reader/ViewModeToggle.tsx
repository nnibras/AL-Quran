import { usePreferencesStore } from "../../store/usePreferencesStore";
import type { ViewMode } from "../../store/usePreferencesStore";
import { IconBook, IconLayers } from "../common/Icons";

const OPTIONS: { mode: ViewMode; label: string; Icon: typeof IconBook }[] = [
  { mode: "cards", label: "Cards", Icon: IconLayers },
  { mode: "book", label: "Book", Icon: IconBook },
];

export function ViewModeToggle() {
  const viewMode = usePreferencesStore((s) => s.viewMode);
  const setViewMode = usePreferencesStore((s) => s.setViewMode);

  return (
    <div
      role="group"
      aria-label="Reading view"
      className="flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100 p-1 dark:border-stone-800 dark:bg-stone-900"
    >
      {OPTIONS.map(({ mode, label, Icon }) => (
        <button
          key={mode}
          type="button"
          onClick={() => setViewMode(mode)}
          aria-pressed={viewMode === mode}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            viewMode === mode
              ? "bg-white text-brand-700 shadow-sm dark:bg-stone-800 dark:text-brand-300"
              : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
