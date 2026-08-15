import { Link, NavLink, useLocation } from "react-router-dom";
import { RECITERS } from "../../api/editions";
import { TRANSLATIONS } from "../../api/editions";
import { MAX_FONT_SIZE, MIN_FONT_SIZE, usePreferencesStore } from "../../store/usePreferencesStore";
import { useBookmarksStore } from "../../store/useBookmarksStore";
import { Select } from "../common/Select";
import { IconBook, IconBookmark, IconClose, IconLayers, IconSearch } from "../common/Icons";
import { FooterCredits } from "./FooterCredits";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
      : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
  }`;

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const translation = usePreferencesStore((s) => s.translation);
  const setTranslation = usePreferencesStore((s) => s.setTranslation);
  const reciter = usePreferencesStore((s) => s.reciter);
  const setReciter = usePreferencesStore((s) => s.setReciter);
  const fontSize = usePreferencesStore((s) => s.arabicFontSize);
  const setFontSize = usePreferencesStore((s) => s.setArabicFontSize);
  const lastRead = usePreferencesStore((s) => s.lastRead);
  const bookmarkCount = useBookmarksStore((s) => s.bookmarks.length);

  const isSurahActive = location.pathname.startsWith("/surah");
  const isJuzActive = location.pathname.startsWith("/juz");

  const content = (
    <div className="flex h-full flex-col gap-6 overflow-y-auto scrollbar-thin p-5">
      <div className="relative flex items-center justify-center">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <IconBook className="h-4 w-4" />
          </span>
          Al-Quran
        </NavLink>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 lg:hidden dark:text-stone-400 dark:hover:bg-stone-800"
        >
          <IconClose className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1" aria-label="Main navigation">
        <Link to={`/surah/${lastRead.surah ?? 1}`} className={navLinkClass({ isActive: isSurahActive })} onClick={onClose}>
          <IconBook className="h-4 w-4" /> Surahs
        </Link>
        <Link to={`/juz/${lastRead.juz ?? 1}`} className={navLinkClass({ isActive: isJuzActive })} onClick={onClose}>
          <IconLayers className="h-4 w-4" /> Juz (Para)
        </Link>
        <NavLink to="/search" className={navLinkClass} onClick={onClose}>
          <IconSearch className="h-4 w-4" /> Search
        </NavLink>
        <NavLink to="/bookmarks" className={navLinkClass} onClick={onClose}>
          <IconBookmark className="h-4 w-4" /> Bookmarks
          {bookmarkCount > 0 && (
            <span className="ml-auto rounded-full bg-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-700 dark:bg-stone-700 dark:text-stone-200">
              {bookmarkCount}
            </span>
          )}
        </NavLink>
      </nav>

      <div className="h-px bg-stone-200 dark:bg-stone-800" />

      <div className="flex flex-col gap-4">
        <Select
          label="Translation"
          value={translation}
          onChange={setTranslation}
          options={TRANSLATIONS.map((t) => ({ value: t.code, label: t.label }))}
        />
        <Select
          label="Reciter"
          value={reciter}
          onChange={setReciter}
          options={RECITERS.map((r) => ({ value: r.code, label: r.label }))}
        />

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Arabic text size
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFontSize(fontSize - 2)}
              disabled={fontSize <= MIN_FONT_SIZE}
              aria-label="Decrease Arabic text size"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-300 text-stone-600 transition hover:bg-stone-100 disabled:opacity-40 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              −
            </button>
            <span className="w-10 text-center text-sm tabular-nums text-stone-600 dark:text-stone-300">
              {fontSize}
            </span>
            <button
              type="button"
              onClick={() => setFontSize(fontSize + 2)}
              disabled={fontSize >= MAX_FONT_SIZE}
              aria-label="Increase Arabic text size"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-300 text-stone-600 transition hover:bg-stone-100 disabled:opacity-40 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Theme
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div className="mt-auto border-t border-stone-200 pt-5 dark:border-stone-800">
        <FooterCredits />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: static sidebar */}
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-72 lg:shrink-0 lg:border-r lg:border-stone-200 lg:bg-white dark:lg:border-stone-800 dark:lg:bg-stone-900">
        {content}
      </aside>

      {/* Mobile: off-canvas drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-stone-900/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={`absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl transition-transform duration-200 dark:bg-stone-900 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {content}
        </div>
      </div>
    </>
  );
}
