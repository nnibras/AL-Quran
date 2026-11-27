import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import { useAdjacentSurahs } from "../hooks/useAdjacentSurahs";
import { ignoreNextScrollJump } from "../hooks/useHideOnScroll";
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

  const { data: fetched, loading, error, retry } = useAsyncData(
    () => getSurahAyahs(surahNumber, translation),
    [surahNumber, translation]
  );
  // Right after choosing another surah, the previous one's data is still around
  // for a moment; never render (or load neighbours for) the wrong surah.
  const data = fetched?.meta.number === surahNumber ? fetched : null;

  // Book view reads continuously in both directions: neighbouring surahs are
  // loaded as you approach the top or bottom.
  const isBook = viewMode === "book";

  // When a surah is inserted above, keep what the reader is looking at in place:
  // remember where the current first surah banner sits, then scroll by however
  // far the insertion pushed it down.
  const scrollAnchor = useRef<{ surah: string; top: number } | null>(null);
  const rememberScrollAnchor = useCallback(() => {
    const mark = document.querySelector<HTMLElement>("[data-surah-start]");
    scrollAnchor.current = mark ? { surah: mark.dataset.surahStart!, top: mark.getBoundingClientRect().top } : null;
  }, []);

  const {
    preceding,
    following,
    hasPrevious,
    hasMore,
    loadingPrevious,
    loadingNext,
    previousError,
    nextError,
    loadPrevious,
    loadNext,
    retryPrevious,
    retryNext,
  } = useAdjacentSurahs(isBook ? data : null, translation, rememberScrollAnchor);

  useLayoutEffect(() => {
    const anchor = scrollAnchor.current;
    if (!anchor) return;
    scrollAnchor.current = null;
    const mark = document.querySelector(`[data-surah-start="${anchor.surah}"]`);
    // "instant": the page-wide `scroll-behavior: smooth` would otherwise animate
    // this correction, and a second insertion mid-animation loses the position.
    if (mark) {
      ignoreNextScrollJump();
      window.scrollBy({ top: mark.getBoundingClientRect().top - anchor.top, behavior: "instant" });
    }
  }, [preceding.length]);

  // We restore the position ourselves, so the browser's own scroll anchoring
  // must not adjust it a second time.
  useEffect(() => {
    if (!isBook) return;
    const root = document.documentElement;
    root.style.overflowAnchor = "none";
    return () => {
      root.style.overflowAnchor = "";
    };
  }, [isBook]);

  const loaded = useMemo(() => (data ? [...preceding, data, ...following] : []), [preceding, data, following]);
  const bookAyahs = useMemo(() => loaded.flatMap((s) => s.ayahs), [loaded]);

  // The surah currently on screen (differs from the URL once you scroll into a neighbouring surah).
  const [visibleSurah, setVisibleSurah] = useState(surahNumber);
  const firstLoaded = loaded[0]?.meta.number ?? surahNumber;
  useEffect(() => {
    setVisibleSurah(surahNumber);
    if (!isBook) return;
    const update = () => {
      let current = firstLoaded;
      for (const mark of document.querySelectorAll<HTMLElement>("[data-surah-start]")) {
        if (mark.getBoundingClientRect().top > window.innerHeight * 0.4) break;
        current = Number(mark.dataset.surahStart);
      }
      setVisibleSurah(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isBook, surahNumber, firstLoaded, following.length]);

  const visibleMeta = loaded.find((s) => s.meta.number === visibleSurah)?.meta ?? data?.meta;

  useEffect(() => {
    if (data) setLastRead("surah", visibleSurah);
  }, [data, visibleSurah, setLastRead]);

  // Opening a different surah starts at its beginning — otherwise the scroll
  // position from the previous surah would drop the reader mid-surah.
  // (A requested ?ayah= is handled below instead.)
  useEffect(() => {
    if (searchParams.get("ayah")) return;
    ignoreNextScrollJump();
    window.scrollTo({ top: 0, behavior: "instant" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahNumber]);

  useEffect(() => {
    const targetAyah = searchParams.get("ayah");
    if (!data || !targetAyah) return;
    // Instant (not smooth): a surah may be inserted above right after, and a
    // smooth scroll would keep heading for the old, now-shifted position.
    requestAnimationFrame(() => {
      ignoreNextScrollJump();
      document
        .getElementById(`ayah-${surahNumber}-${targetAyah}`)
        ?.scrollIntoView({ block: "start", behavior: "instant" });
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

  // Jumps are instant: a smooth scroll can be knocked off target when a
  // neighbouring surah is inserted above mid-animation.
  const jumpTo = (el: Element | null) => {
    if (!el) return false;
    ignoreNextScrollJump();
    el.scrollIntoView({ block: "start", behavior: "instant" });
    return true;
  };

  const jumpToAyah = (n: number) => {
    jumpTo(document.getElementById(`ayah-${visibleSurah}-${n}`));
  };

  // Scroll to a surah that's already loaded; otherwise open it fresh.
  const goToSurah = (n: number) => {
    if (!isBook && n === surahNumber) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const mark = isBook ? document.querySelector(`[data-surah-start="${n}"]`) : null;
    if (!jumpTo(mark)) navigate(`/surah/${n}`);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <ReaderToolbar
        label="Surah"
        current={visibleSurah}
        total={TOTAL_SURAHS}
        options={surahOptions}
        currentLabel={visibleMeta?.englishName}
        onNavigate={goToSurah}
      >
        {visibleMeta && (
          <div className="w-[3.75rem] shrink-0">
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

      {(loading || (!data && !error)) && <ReaderSkeleton />}
      {error && !loading && (
        <div className="px-4 py-10 sm:px-8">
          <ErrorState message={error} onRetry={retry} />
        </div>
      )}
      {data && !loading && !error && (
        <>
          {isBook ? (
            <>
              {/* Fixed-height slot so showing the spinner doesn't shift the page. */}
              {(hasPrevious || previousError) && (
                <div className="flex min-h-12 items-end justify-center px-4 sm:px-8">
                  {previousError ? (
                    <div className="w-full pt-6">
                      <ErrorState message={previousError} onRetry={retryPrevious} />
                    </div>
                  ) : loadingPrevious ? (
                    <Spinner />
                  ) : (
                    <LoadMoreSentinel key={`prev-${preceding.length}`} onVisible={loadPrevious} margin={600} />
                  )}
                </div>
              )}
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
                hasMore && <LoadMoreSentinel key={`next-${following.length}`} onVisible={loadNext} />
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
