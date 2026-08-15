import { IconMenu } from "../common/Icons";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 relative flex items-center justify-center border-b border-stone-200 bg-white/80 px-4 py-3 backdrop-blur lg:hidden dark:border-stone-800 dark:bg-stone-900/80">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
      >
        <IconMenu className="h-5 w-5" />
      </button>
      <span className="text-base font-bold text-stone-900 dark:text-white">Al-Quran</span>
    </header>
  );
}
