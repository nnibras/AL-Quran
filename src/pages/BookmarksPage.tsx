import { Link } from "react-router-dom";
import { useBookmarksStore } from "../store/useBookmarksStore";
import { IconBookmark } from "../components/common/Icons";

export function BookmarksPage() {
  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const removeBookmark = useBookmarksStore((s) => s.removeBookmark);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
      <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Bookmarks</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        Ayahs you've saved for later, stored on this device.
      </p>

      {bookmarks.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-stone-300 py-14 text-center dark:border-stone-700">
          <IconBookmark className="h-8 w-8 text-stone-300 dark:text-stone-600" />
          <p className="max-w-xs text-sm text-stone-500 dark:text-stone-400">
            No bookmarks yet. Tap the bookmark icon on any ayah while reading to save it here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {bookmarks.map((b) => (
            <li
              key={`${b.surahNumber}-${b.ayahNumberInSurah}`}
              className="flex items-start justify-between gap-3 rounded-xl border border-stone-200 px-4 py-3 dark:border-stone-800"
            >
              <Link to={`/surah/${b.surahNumber}?ayah=${b.ayahNumberInSurah}`} className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                  {b.surahEnglishName} · Ayah {b.ayahNumberInSurah}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-stone-700 dark:text-stone-300">{b.text}</p>
              </Link>
              <button
                type="button"
                onClick={() => removeBookmark(b.surahNumber, b.ayahNumberInSurah)}
                aria-label={`Remove bookmark for ${b.surahEnglishName} ayah ${b.ayahNumberInSurah}`}
                className="shrink-0 rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-red-500 dark:hover:bg-stone-800"
              >
                <IconBookmark filled className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
