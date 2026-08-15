import type { SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  hideLabel?: boolean;
}

export function Select({ label, value, options, onChange, hideLabel, id, ...rest }: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className={hideLabel ? "sr-only" : "text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400"}>
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
