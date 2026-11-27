import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ARABIC,
  ayahRef,
  editionLabel,
  readyEdition,
  runGlobalSearch,
  type SearchHit,
  type SearchProgress,
} from "../api/search";
import { IconSearch } from "../components/common/Icons";
import { Spinner } from "../components/common/Spinner";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useSurahList } from "../hooks/useSurahList";
import { usePreferencesStore } from "../store/usePreferencesStore";
import type { SurahMeta } from "../types";
import { highlightRanges, normalizeForSearch, searchTerms, snippet, type Range } from "../utils/searchText";

const PAGE_SIZE = 30;

function Highlighted({ text, ranges }: { text: string; ranges: Range[] }) {
  if (!ranges.length) return <>{text}</>;
  const parts: ReactNode[] = [];
  let pos = 0;
  ranges.forEach(([start, end], i) => {
    if (start > pos) parts.push(text.slice(pos, start));
    parts.push(
      <mark key={i} className="rounded bg-amber-200 px-0.5 text-stone-900 dark:bg-amber-400/40 dark:text-white">
        {text.slice(start, end)}
      </mark>
    );
    pos = end;
  });
  if (pos < text.length) parts.push(text.slice(pos));
  return <>{parts}</>;
}

/** Letters/digits only, normalised — for forgiving surah-name matching ("albaqarah" ≈ "Al-Baqara"). */
const compact = (s: string) => normalizeForSearch(s).replace(/[^\p{L}\p{N}]/gu, "");

function matchSurahs(surahs: SurahMeta[], query: string): SurahMeta[] {
  const q = compact(query);
  if (!q) return [];
  const asNumber = Number(query.trim());
  return surahs.filter((s) => {
    if (Number.isInteger(asNumber) && asNumber === s.number) return true;
    if (/^\d+$/.test(q)) return false;
    return [s.englishName, s.englishNameTranslation, s.name]
      .map(compact)
      .some((name) => name.includes(q) || (q.length >= 5 && q.includes(name)));
  });
}

/** "2:255", "2.255" or "2 255" → a direct ayah reference, if valid. */
function parseReference(query: string, surahs: SurahMeta[] | null) {
  const m = query.trim().match(/^(\d{1,3})\s*[:.\s]\s*(\d{1,3})$/);
  if (!m || !surahs) return null;
  const surah = surahs[Number(m[1]) - 1];
  const ayah = Number(m[2]);
  if (!surah || ayah < 1 || ayah > surah.numberOfAyahs) return null;
  return { surah, ayah };
}

function ResultCard({
  hit,
  terms,
  exact,
  filter,
  preferred,
}: {
  hit: SearchHit;
  terms: string[];
  /** Exact-match pattern (highlight the whole phrase), or null to highlight each word. */
  exact: string | null;
  filter: string;
  preferred: string;
}) {
  const ref = ayahRef(hit.ayahNumber);
  const arabic = readyEdition(ARABIC)?.text[hit.ayahNumber - 1] ?? "";
  if (!ref) return null;

  const arabicMatched = hit.editions.includes(ARABIC);
  const arabicView = snippet(arabic, arabicMatched ? highlightRanges(arabic, terms, true, exact ?? undefined) : [], 180);

  // Which translation line to show: the filtered language, else the best match, else the reader's own.
  const matchedTranslations = hit.editions.filter((e) => e !== ARABIC);
  const translationCode =
    filter !== "all" && filter !== ARABIC
      ? filter
      : matchedTranslations[0] ?? (preferred && readyEdition(preferred) ? preferred : null);
  const translationMatched = translationCode ? hit.editions.includes(translationCode) : false;
  const translation = translationCode ? readyEdition(translationCode)?.text[hit.ayahNumber - 1] ?? "" : "";
  const translationView = snippet(translation, translationMatched ? highlightRanges(translation, terms, false, exact ?? undefined) : []);

  const tags = hit.editions.map(editionLabel);

  return (
    <li>
      <Link
        to={`/surah/${ref.surahNumber}?ayah=${ref.numberInSurah}`}
        className="block rounded-xl border border-stone-200 px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50/50 dark:border-stone-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/30"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
            {ref.englishName} · {ref.surahNumber}:{ref.numberInSurah}
          </p>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-stone-100 px-2 py-0.5 text-[0.65rem] font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400"
              >
                {t}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[0.65rem] font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {arabic && (
          <p
            dir="rtl"
            lang="ar"
            className="mt-2 font-arabic text-xl leading-loose text-stone-900 dark:text-stone-50"
          >
            <Highlighted text={arabicView.text} ranges={arabicView.ranges} />
          </p>
        )}

        {translation && (
          <p className="mt-1 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            {translationMatched && matchedTranslations.length > 0 && (
              <span className="mr-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
                {editionLabel(translationCode!)}
              </span>
            )}
            <Highlighted text={translationView.text} ranges={translationView.ranges} />
          </p>
        )}
      </Link>
    </li>
  );
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [exactOnly, setExactOnly] = useState(() => searchParams.get("exact") === "1");
  const debouncedQuery = useDebouncedValue(query, 300);
  const translation = usePreferencesStore((s) => s.translation);
  const { surahs } = useSurahList();

  // `progress` is what's on screen; `live` tracks the running search. Previous
  // results stay (dimmed) until the new search has its first edition done.
  const [progress, setProgress] = useState<SearchProgress | null>(null);
  const [live, setLive] = useState<SearchProgress | null>(null);
  const [searching, setSearching] = useState(false);
  const [filter, setFilter] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const requestId = useRef(0);

  // Keep the query (and exact mode) in the URL so "back" from a result returns to the same search.
  useEffect(() => {
    const q = debouncedQuery.trim();
    const want = new URLSearchParams();
    if (q) want.set("q", q);
    if (exactOnly) want.set("exact", "1");
    if (want.toString() !== searchParams.toString()) setSearchParams(want, { replace: true });
  }, [debouncedQuery, exactOnly, searchParams, setSearchParams]);

  useEffect(() => {
    const id = ++requestId.current;
    setFilter("all");
    setVisible(PAGE_SIZE);
    const q = debouncedQuery.trim();
    setLive(null);
    if (!q) {
      setProgress(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    runGlobalSearch(
      q,
      translation,
      (p) => {
        if (id !== requestId.current) return;
        setLive(p);
        if (p.searched.length > 0 || p.done) setProgress(p);
        if (p.done) setSearching(false);
      },
      () => id !== requestId.current,
      { exact: exactOnly }
    ).catch(() => {
      if (id === requestId.current) setSearching(false);
    });
  }, [debouncedQuery, translation, exactOnly]);

  const surahMatches = useMemo(
    () => (surahs ? matchSurahs(surahs, debouncedQuery) : []),
    [surahs, debouncedQuery]
  );
  const reference = useMemo(() => parseReference(debouncedQuery, surahs), [debouncedQuery, surahs]);

  const hits = progress?.hits ?? [];
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const hit of hits) for (const e of hit.editions) map.set(e, (map.get(e) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [hits]);
  const filtered = filter === "all" ? hits : hits.filter((h) => h.editions.includes(filter));
  const terms = progress?.terms ?? [];
  const textSearch = useMemo(() => searchTerms(debouncedQuery).length > 0, [debouncedQuery]);
  const current = live && !live.done ? live.editions[live.searched.length + live.failed.length] : null;
  const stale = searching && progress !== live;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
      <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Search the Quran</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        Search the Arabic text and every translation at once — type in any language, or jump to an ayah like 2:255.
      </p>

      <div className="relative mt-5">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. mercy, الرحمن, miséricorde, 2:255…"
          autoFocus
          dir="auto"
          className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-stone-700 dark:bg-stone-900"
        />
      </div>

      <label className="mt-3 flex cursor-pointer select-none items-center gap-2.5 text-sm text-stone-600 dark:text-stone-300">
        <input
          type="checkbox"
          role="switch"
          checked={exactOnly}
          onChange={(e) => setExactOnly(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="relative h-5 w-9 shrink-0 rounded-full bg-stone-300 transition peer-checked:bg-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40 dark:bg-stone-700 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-4"
        />
        <span>
          <span className="font-medium">Exact match</span>
          <span className="ml-1.5 text-xs text-stone-400 dark:text-stone-500">
            {exactOnly ? "whole words, in this order" : "off: all words, any order"}
          </span>
        </span>
      </label>

      {reference && (
        <Link
          to={`/surah/${reference.surah.number}?ayah=${reference.ayah}`}
          className="mt-4 flex items-center justify-between rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <span>
            Go to {reference.surah.englishName} {reference.surah.number}:{reference.ayah}
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      )}

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
                    {s.number}. {s.englishName}
                    <span className="ml-2 text-xs font-normal text-stone-400">{s.englishNameTranslation}</span>
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

      {textSearch && (
        <div className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">Ayahs</h2>
            <p className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
              {searching ? (
                <>
                  <Spinner className="h-3 w-3" />
                  Searching {current ? editionLabel(current) : "…"}
                  {live && ` (${live.searched.length + 1}/${live.editions.length})`}
                </>
              ) : (
                progress && (
                  <>
                    {hits.length.toLocaleString()} ayah{hits.length === 1 ? "" : "s"}
                    {progress.exact ? " · exact" : ""} · {progress.editions.length}{" "}
                    {progress.editions.length === 1 ? "edition" : "editions"} in {progress.script}
                  </>
                )
              )}
            </p>
          </div>

          {counts.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter by language">
              {[["all", hits.length] as [string, number], ...counts].map(([code, n]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setFilter(code);
                    setVisible(PAGE_SIZE);
                  }}
                  aria-pressed={filter === code}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    filter === code
                      ? "border-brand-500 bg-brand-600 text-white"
                      : "border-stone-200 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                  }`}
                >
                  {code === "all" ? "All" : editionLabel(code)} · {n}
                </button>
              ))}
            </div>
          )}

          {progress && progress.failed.length > 0 && (
            <p className="mt-3 text-xs text-red-500">
              Couldn't load: {progress.failed.map(editionLabel).join(", ")}. Check your connection and search again.
            </p>
          )}

          {!searching && progress?.done && hits.length === 0 && (
            <p className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">
              No ayahs found for “{debouncedQuery.trim()}”.
            </p>
          )}

          {filtered.length > 0 && (
            <ul className={`mt-3 space-y-2 transition-opacity ${stale ? "opacity-50" : ""}`}>
              {filtered.slice(0, visible).map((hit) => (
                <ResultCard
                  key={hit.ayahNumber}
                  hit={hit}
                  terms={terms}
                  exact={progress?.exact ?? null}
                  filter={filter}
                  preferred={translation}
                />
              ))}
            </ul>
          )}

          {filtered.length > visible && (
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="mt-4 w-full rounded-xl border border-stone-200 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              Show more ({(filtered.length - visible).toLocaleString()} left)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
