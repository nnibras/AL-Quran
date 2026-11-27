import type { SelectHTMLAttributes } from "react";
import { IconChevronDown } from "./Icons";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange" | "size"> {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  hideLabel?: boolean;
  /** "sm" is the compact variant used in the reader toolbar. */
  size?: "md" | "sm";
  /** Text shown in the closed control (sm only); defaults to the selected option's label. */
  displayValue?: string;
}

export function Select({
  label,
  value,
  options,
  onChange,
  hideLabel,
  size = "md",
  displayValue,
  id,
  ...rest
}: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const labelEl = (
    <label
      htmlFor={selectId}
      className={hideLabel ? "sr-only" : "text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400"}
    >
      {label}
    </label>
  );
  const optionEls = options.map((opt) => (
    <option key={opt.value} value={opt.value}>
      {opt.label}
    </option>
  ));

  if (size === "sm") {
    // Compact toolbar variant: we draw the visible text and arrow ourselves and
    // lay the real <select> invisibly on top. Native selects (Android WebView
    // especially) reserve a lot of room for their own arrow/padding, which left
    // narrow toolbar selects showing no text at all. Tapping still opens the
    // native picker with the full option labels.
    const shown = displayValue ?? options.find((o) => o.value === value)?.label ?? "";
    return (
      <div className="flex flex-col gap-1">
        {labelEl}
        <div className="relative flex h-8 w-full min-w-0 items-center gap-1 rounded-lg border border-stone-300 bg-white pl-2 pr-1.5 text-xs text-stone-900 shadow-sm transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100">
          <span aria-hidden="true" className="min-w-0 flex-1 truncate">
            {shown}
          </span>
          <IconChevronDown aria-hidden="true" className="h-3 w-3 shrink-0 text-stone-400" />
          <select
            id={selectId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
            {...rest}
          >
            {optionEls}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {labelEl}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        {...rest}
      >
        {optionEls}
      </select>
    </div>
  );
}
