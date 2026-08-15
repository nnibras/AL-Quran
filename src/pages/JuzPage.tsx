import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJuzAyahs } from "../api/quran";
import { AyahCard } from "../components/reader/AyahCard";
import { BookView } from "../components/reader/BookView";
import { ErrorState } from "../components/common/ErrorState";
import { ReaderSkeleton } from "../components/reader/ReaderSkeleton";
import { ReaderToolbar } from "../components/reader/ReaderToolbar";
import { ViewModeToggle } from "../components/reader/ViewModeToggle";
import { useAsyncData } from "../hooks/useAsyncData";
import { usePreferencesStore } from "../store/usePreferencesStore";

const TOTAL_JUZ = 30;

export function JuzPage() {
  const { number } = useParams();
  const navigate = useNavigate();
  const juzNumber = Math.min(TOTAL_JUZ, Math.max(1, Number(number) || 1));

  const translation = usePreferencesStore((s) => s.translation);
  const setLastRead = usePreferencesStore((s) => s.setLastRead);
  const viewMode = usePreferencesStore((s) => s.viewMode);

  const { data: ayahs, loading, error, retry } = useAsyncData(
    () => getJuzAyahs(juzNumber, translation),
    [juzNumber, translation]
  );

  useEffect(() => {
    if (ayahs) setLastRead("juz", juzNumber);
  }, [ayahs, juzNumber, setLastRead]);

  const options = useMemo(
    () => Array.from({ length: TOTAL_JUZ }, (_, i) => ({ value: String(i + 1), label: `Juz ${i + 1}` })),
    []
  );

  const range = ayahs && ayahs.length > 0
    ? `${ayahs[0].surah.englishName} ${ayahs[0].numberInSurah} – ${ayahs[ayahs.length - 1].surah.englishName} ${ayahs[ayahs.length - 1].numberInSurah}`
    : null;

  let lastSurahNumber = -1;

  return (
    <div className="mx-auto max-w-3xl">
      <ReaderToolbar
        label="Juz"
        current={juzNumber}
        total={TOTAL_JUZ}
        options={options}
        onNavigate={(n) => navigate(`/juz/${n}`)}
      >
        <ViewModeToggle />
      </ReaderToolbar>

      {loading && <ReaderSkeleton />}
      {error && !loading && (
        <div className="px-4 py-10 sm:px-8">
          <ErrorState message={error} onRetry={retry} />
        </div>
      )}
      {ayahs && !loading && !error && (
        <>
          <div className="border-b border-stone-100 px-4 py-6 text-center sm:px-8 dark:border-stone-800">
            <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Juz {juzNumber}</h1>
            {range && <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{range}</p>}
          </div>
          {viewMode === "book" ? (
            <BookView ayahs={ayahs} />
          ) : (
            <div className="px-4 sm:px-8">
              {ayahs.map((ayah) => {
                const isNewSurah = ayah.surah.number !== lastSurahNumber;
                lastSurahNumber = ayah.surah.number;
                return (
                  <div key={ayah.number}>
                    {isNewSurah && (
                      <h2 className="pt-8 text-center text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                        {ayah.surah.englishName}
                      </h2>
                    )}
                    <AyahCard ayah={ayah} />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
