import type { ReactNode } from "react";
import { useUiStore } from "../../store/useUiStore";
import { Select } from "../common/Select";
import { IconChevronLeft, IconChevronRight } from "../common/Icons";

interface ReaderToolbarProps {
  label: string;
  current: number;
  total: number;
  options: { value: string; label: string }[];
  /** Short text for the closed dropdown (e.g. just the surah name); defaults to the option label. */
  currentLabel?: string;
  onNavigate: (n: number) => void;
  children?: ReactNode;
}

const navButton =
  "flex h-8 w-7 shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 disabled:opacity-30 dark:text-stone-400 dark:hover:bg-stone-800";

/**
 * Compact single-line reader bar. Always spans the full width (like the header
 * above it); sticks under the mobile header (top-12) and slides away together
 * with it while scrolling down (see useHideOnScroll).
 */
export function ReaderToolbar({ label, current, total, options, currentLabel, onNavigate, children }: ReaderToolbarProps) {
  const hidden = useUiStore((s) => s.chromeHidden);

  return (
    <div
      className={`sticky z-20 w-full border-b border-stone-200 bg-white/90 backdrop-blur transition-[top,transform] duration-200 dark:border-stone-800 dark:bg-stone-900/90 ${
        hidden ? "top-0 -translate-y-full" : "top-12 lg:top-0"
      }`}
    >
      {/* The bar always spans the full width; the controls line up with the reading column. */}
      <div className="mx-auto flex w-full max-w-3xl items-center gap-1 px-2 py-1.5 sm:gap-2 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate(current - 1)}
          disabled={current <= 1}
          aria-label={`Previous ${label.toLowerCase()}`}
          className={navButton}
        >
          <IconChevronLeft className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1">
          <Select
            label={label}
            hideLabel
            size="sm"
            value={String(current)}
            displayValue={currentLabel}
            onChange={(v) => onNavigate(Number(v))}
            options={options}
          />
        </div>

        <button
          type="button"
          onClick={() => onNavigate(current + 1)}
          disabled={current >= total}
          aria-label={`Next ${label.toLowerCase()}`}
          className={navButton}
        >
          <IconChevronRight className="h-4 w-4" />
        </button>

        {children && <div className="flex shrink-0 items-center gap-1 sm:gap-2">{children}</div>}
    
      </div>
    </div>
  );
}
