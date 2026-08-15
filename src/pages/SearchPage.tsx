import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { searchQuran } from "../api/quran";
import { ErrorState } from "../components/common/ErrorState";
import { IconSearch } from "../components/common/Icons";
import { Spinner } from "../components/common/Spinner";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useSurahList } from "../hooks/useSurahList";
import { usePreferencesStore } from "../store/usePreferencesStore";
import type { SearchMatch } from "../types";

function highlight(text: string, keyword: string) {
  if (!keyword.trim()) return text;
  const parts = text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} className="rounded bg-amber-200 px-0.5 text-stone-900 dark:bg-amber-400/40 dark:text-white">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const translation = usePreferencesStore((s) => s.translation);
  const { surahs } = useSurahList();

  const [matches, setMatches] = useState<SearchMatch[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 3) {
      setMatches(null);
      setError(null);
      setLoading(false);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    searchQuran(trimmed, translation || "en.sahih")
      .then((results) => {
        if (id !== requestId.current) return;
        setMatches(results);
        setLoading(false);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        setError(err instanceof Error ? err.message : "Search failed. Please try again.");
        setLoading(false);
      });
  }, [debouncedQuery, translation]);

  const surahMatches = useMemo(() => {
    const trimmed = debouncedQuery.trim().toLowerCase();
    if (!surahs || trimmed.length < 1) return [];
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(trimmed) ||
        s.englishNameTranslation.toLowerCase().includes(trimmed) ||
        s.name.includes(debouncedQuery.trim())
    );
  }, [surahs, debouncedQuery]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
      <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Search the Quran</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        Find a surah by name, or search ayah translations for a word or phrase.
      </p>

      <div className="relative mt-5">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. mercy, Al-Baqarah, patience…"
          autoFocus
          className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-stone-700 dark:bg-stone-900"
        />
      </div>

      {surahMatches.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">Surahs</h2>
          <ul className="mt-2 divide-y divide-stone-100 rounded-xl border border-stone-200 dark:divide-stone-800 dark:border-stone-800">
            {surahMatches.slice(0, 8).map((s) => (
              <li key={s.number}>
                <Link
                  to={`/surah/${s.number}`}
                  className="flex items-center justify-between px-4 py-3 text-sm transition hover:bg-stone-50 dark:hover:bg-stone-900"
                >
                  <span className="font-medium text-stone-700 dark:text-stone-200">
                    {s.number}. {highlight(s.englishName, query)}
                  </span>
                  <span dir="rtl" lang="ar" className="font-arabic text-stone-500 dark:text-stone-400">
                    {s.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        {debouncedQuery.trim().length >= 3 && (
          <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">Ayahs</h2>
        )}

        {loading && (
          <div className="flex items-center gap-2 py-8 text-sm text-stone-500 dark:text-stone-400">
            <Spinner className="h-4 w-4" /> Searching…
          </div>
        )}

        {error && !loading && <div className="mt-3"><ErrorState message={error} /></div>}

        {!loading && !error && debouncedQuery.trim().length >= 3 && matches?.length === 0 && (
          <p className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">
            No ayahs found for “{debouncedQuery}”.
          </p>
        )}

        {!loading && matches && matches.length > 0 && (
          <ul className="mt-2 space-y-2">
            {matches.map((m) => (
              <li key={m.number}>
                <Link
                  to={`/surah/${m.surah.number}?ayah=${m.numberInSurah}`}
                  className="block rounded-xl border border-stone-200 px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50/50 dark:border-stone-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/30"
                >
                  <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    {m.surah.englishName} · Ayah {m.numberInSurah}
                  </p>
                  <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">{highlight(m.text, debouncedQuery)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
