import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSurahAyahs } from "../api/quran";
import { AyahCard } from "../components/reader/AyahCard";
import { BookView } from "../components/reader/BookView";
import { ReaderSkeleton } from "../components/reader/ReaderSkeleton";
import { ReaderToolbar } from "../components/reader/ReaderToolbar";
import { SurahHeader } from "../components/reader/SurahHeader";
import { SurahPlayButton } from "../components/reader/SurahPlayButton";
import { ViewModeToggle } from "../components/reader/ViewModeToggle";
import { LoadMoreSentinel } from "../components/reader/LoadMoreSentinel";
import { Spinner } from "../components/common/Spinner";
import { CardsContainer } from "../components/reader/CardsContainer";
import { ErrorState } from "../components/common/ErrorState";
import { Select } from "../components/common/Select";
import { useAsyncData } from "../hooks/useAsyncData";
import { useFollowingSurahs } from "../hooks/useFollowingSurahs";
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

  // Book view reads continuously: following surahs are appended as you scroll.
  const isBook = viewMode === "book";
  const { following, loadingNext, nextError, hasMore, loadNext, retryNext } = useFollowingSurahs(
    isBook ? data : null,
    translation
  );
  const loaded = useMemo(() => (data ? [data, ...following] : []), [data, following]);
  const bookAyahs = useMemo(() => loaded.flatMap((s) => s.ayahs), [loaded]);

  // The surah currently on screen (differs from the URL once you scroll into a following surah).
  const [visibleSurah, setVisibleSurah] = useState(surahNumber);
  useEffect(() => {
    setVisibleSurah(surahNumber);
    if (!isBook) return;
    const update = () => {
      let current = surahNumber;
      for (const mark of document.querySelectorAll<HTMLElement>("[data-surah-start]")) {
        if (mark.getBoundingClientRect().top > window.innerHeight * 0.4) break;
        current = Number(mark.dataset.surahStart);
      }
      setVisibleSurah(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isBook, surahNumber, following.length]);

  const visibleMeta = loaded.find((s) => s.meta.number === visibleSurah)?.meta ?? data?.meta;

  useEffect(() => {
    if (data) setLastRead("surah", visibleSurah);
  }, [data, visibleSurah, setLastRead]);

  useEffect(() => {
    const targetAyah = searchParams.get("ayah");
    if (!data || !targetAyah) return;
    requestAnimationFrame(() => {
      document
        .getElementById(`ayah-${surahNumber}-${targetAyah}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [data, searchParams, surahNumber]);

  const surahOptions = useMemo(
    () =>
      surahs
        ? surahs.map((s) => ({ value: String(s.number), label: `${s.number}. ${s.englishName}` }))
        : [{ value: String(visibleSurah), label: `Surah ${visibleSurah}` }],
    [surahs, visibleSurah]
  );

  const sajdaCount = data?.ayahs.filter((a) => a.sajda).length ?? 0;

  const jumpToAyah = (n: number) => {
    document.getElementById(`ayah-${visibleSurah}-${n}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll to a surah that's already loaded below; otherwise open it fresh.
  const goToSurah = (n: number) => {
    if (n === surahNumber) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const mark = isBook ? document.querySelector(`[data-surah-start="${n}"]`) : null;
    if (mark) mark.scrollIntoView({ behavior: "smooth", block: "start" });
    else navigate(`/surah/${n}`);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <ReaderToolbar
        label="Surah"
        current={visibleSurah}
        total={TOTAL_SURAHS}
        options={surahOptions}
        onNavigate={goToSurah}
      >
        {visibleMeta && (
          <div className="w-[4.5rem] shrink-0">
            <Select
              label="Jump to ayah"
              hideLabel
              size="sm"
              value=""
              onChange={(v) => v && jumpToAyah(Number(v))}
              options={[
                { value: "", label: "Ayah" },
                ...Array.from({ length: visibleMeta.numberOfAyahs }, (_, i) => ({
                  value: String(i + 1),
                  label: String(i + 1),
                })),
              ]}
            />
          </div>
        )}
        {/* Book view has no SurahHeader, so its full-surah play lives here. */}
        {isBook && visibleMeta && <SurahPlayButton surah={visibleMeta} />}
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
          {isBook ? (
            <>
              <BookView ayahs={bookAyahs} />
              {nextError ? (
                <div className="px-4 pb-10 sm:px-8">
                  <ErrorState message={nextError} onRetry={retryNext} />
                </div>
              ) : loadingNext ? (
                <div className="flex justify-center pb-10">
                  <Spinner />
                </div>
              ) : (
                hasMore && <LoadMoreSentinel key={following.length} onVisible={loadNext} />
              )}
            </>
          ) : (
            <>
              <SurahHeader meta={data.meta} sajdaCount={sajdaCount} />
              <CardsContainer>
                {data.ayahs.map((ayah) => (
                  <AyahCard key={ayah.number} ayah={ayah} />
                ))}
              </CardsContainer>
            </>
          )}
        </>
      )}
    </div>
  );
}
