import type { ReactNode } from "react";
import { Select } from "../common/Select";
import { IconChevronLeft, IconChevronRight } from "../common/Icons";

interface ReaderToolbarProps {
  label: string;
  current: number;
  total: number;
  options: { value: string; label: string }[];
  onNavigate: (n: number) => void;
  children?: ReactNode;
}

export function ReaderToolbar({ label, current, total, options, onNavigate, children }: ReaderToolbarProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-8 dark:border-stone-800 dark:bg-stone-900/90">
      <button
        type="button"
        onClick={() => onNavigate(current - 1)}
        disabled={current <= 1}
        aria-label={`Previous ${label.toLowerCase()}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:bg-stone-100 disabled:opacity-30 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
      >
        <IconChevronLeft className="h-4 w-4" />
      </button>

      <div className="min-w-[10rem] flex-1">
        <Select
          label={label}
          hideLabel
          value={String(current)}
          onChange={(v) => onNavigate(Number(v))}
          options={options}
        />
      </div>

      <button
        type="button"
        onClick={() => onNavigate(current + 1)}
        disabled={current >= total}
        aria-label={`Next ${label.toLowerCase()}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:bg-stone-100 disabled:opacity-30 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
      >
        <IconChevronRight className="h-4 w-4" />
      </button>

      {children && (
        <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:w-auto sm:justify-start">
          {children}
        </div>
      )}
    </div>
  );
}
