import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSurahAyahs } from "../api/quran";
import { AyahCard } from "../components/reader/AyahCard";
import { BookView } from "../components/reader/BookView";
import { ReaderSkeleton } from "../components/reader/ReaderSkeleton";
import { ReaderToolbar } from "../components/reader/ReaderToolbar";
import { SurahHeader } from "../components/reader/SurahHeader";
import { ViewModeToggle } from "../components/reader/ViewModeToggle";
import { ErrorState } from "../components/common/ErrorState";
import { Select } from "../components/common/Select";
import { useAsyncData } from "../hooks/useAsyncData";
import { useSurahList } from "../hooks/useSurahList";
import { usePreferencesStore } from "../store/usePreferencesStore";

const TOTAL_SURAHS = 114;

export function SurahPage() {
  const { number } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const surahNumber = Math.min(TOTAL_SURAHS, Math.max(1, Number(number) || 1));

  const translation = usePreferencesStore((s) => s.translation);
  const setLastRead = usePreferencesStore((s) => s.setLastRead);
  const viewMode = usePreferencesStore((s) => s.viewMode);
  const { surahs } = useSurahList();

  const { data, loading, error, retry } = useAsyncData(
    () => getSurahAyahs(surahNumber, translation),
    [surahNumber, translation]
  );

  useEffect(() => {
    if (data) setLastRead("surah", surahNumber);
  }, [data, surahNumber, setLastRead]);

  useEffect(() => {
    const targetAyah = searchParams.get("ayah");
    if (!data || !targetAyah) return;
    requestAnimationFrame(() => {
      document.getElementById(`ayah-${targetAyah}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [data, searchParams]);

  const surahOptions = useMemo(
    () =>
      surahs
        ? surahs.map((s) => ({ value: String(s.number), label: `${s.number}. ${s.englishName}` }))
        : [{ value: String(surahNumber), label: `Surah ${surahNumber}` }],
    [surahs, surahNumber]
  );

  const sajdaCount = data?.ayahs.filter((a) => a.sajda).length ?? 0;

  const jumpToAyah = (n: number) => {
    document.getElementById(`ayah-${n}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <ReaderToolbar
        label="Surah"
        current={surahNumber}
        total={TOTAL_SURAHS}
        options={surahOptions}
        onNavigate={(n) => navigate(`/surah/${n}`)}
      >
        {data && (
          <div className="w-28 shrink-0">
            <Select
              label="Jump to ayah"
              hideLabel
              value=""
              onChange={(v) => v && jumpToAyah(Number(v))}
              options={[
                { value: "", label: "Ayah…" },
                ...Array.from({ length: data.meta.numberOfAyahs }, (_, i) => ({
                  value: String(i + 1),
                  label: String(i + 1),
                })),
              ]}
            />
          </div>
        )}
        <ViewModeToggle />
      </ReaderToolbar>

      {loading && <ReaderSkeleton />}
      {error && !loading && (
        <div className="px-4 py-10 sm:px-8">
          <ErrorState message={error} onRetry={retry} />
        </div>
      )}
      {data && !loading && !error && (
        <>
          <SurahHeader meta={data.meta} sajdaCount={sajdaCount} />
          {viewMode === "book" ? (
            <BookView ayahs={data.ayahs} />
          ) : (
            <div className="px-4 sm:px-8">
              {data.ayahs.map((ayah) => (
                <AyahCard key={ayah.number} ayah={ayah} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
