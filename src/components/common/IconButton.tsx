import type { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
}

export function IconButton({ label, active, className = "", children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100 ${
        active ? "bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
