import { useCallback, useRef, useState } from "react";
import { getSurahAyahs } from "../api/quran";

type SurahData = Awaited<ReturnType<typeof getSurahAyahs>>;

const TOTAL_SURAHS = 114;

interface Direction {
  loading: boolean;
  error: string | null;
}
const idle: Direction = { loading: false, error: null };

interface RangeState {
  /** The anchor surah this state belongs to; anything else is stale. */
  anchor: SurahData | null;
  preceding: SurahData[];
  following: SurahData[];
  prev: Direction;
  next: Direction;
}

const emptyFor = (anchor: SurahData | null): RangeState => ({
  anchor,
  preceding: [],
  following: [],
  prev: idle,
  next: idle,
});

/**
 * For continuous Book reading: loads the surahs before and after `anchor`, one
 * at a time, when the reader nears either end.
 *
 * All loaded surahs are tied to the anchor object they were loaded for: when
 * the anchor changes (another surah opened, or a new translation), the old
 * ones are dropped immediately — in the same render — and late responses for
 * an old anchor are ignored, so surahs can never end up attached to the wrong
 * one.
 *
 * `onBeforePrepend` runs right before a preceding surah is inserted above the
 * current content, so the caller can keep the page the reader is on in place.
 */
export function useAdjacentSurahs(
  anchor: SurahData | null,
  translation: string,
  onBeforePrepend?: () => void
) {
  const [stored, setStored] = useState<RangeState>(() => emptyFor(anchor));
  const state = stored.anchor === anchor ? stored : emptyFor(anchor);
  const currentAnchor = useRef(anchor);
  currentAnchor.current = anchor;
  const { preceding, following, prev, next } = state;

  const first = preceding[0]?.meta.number ?? anchor?.meta.number ?? 0;
  const last = following.length ? following[following.length - 1].meta.number : anchor?.meta.number ?? 0;
  const hasPrevious = Boolean(anchor) && first > 1;
  const hasMore = Boolean(anchor) && last < TOTAL_SURAHS;

  /** Starts a request for `owner`, discarding any state left from an older anchor. */
  const begin = (owner: SurahData | null, change: (s: RangeState) => RangeState) =>
    setStored((s) => change(s.anchor === owner ? s : emptyFor(owner)));

  const fetchPrevious = useCallback(() => {
    const owner = anchor;
    begin(owner, (s) => ({ ...s, prev: { loading: true, error: null } }));
    getSurahAyahs(first - 1, translation)
      .then((data) => {
        if (currentAnchor.current !== owner) return;
        onBeforePrepend?.();
        setStored((s) => (s.anchor !== owner ? s : { ...s, preceding: [data, ...s.preceding], prev: idle }));
      })
      .catch((err) => {
        setStored((s) =>
          s.anchor !== owner
            ? s
            : { ...s, prev: { loading: false, error: err instanceof Error ? err.message : "Couldn't load the previous surah." } }
        );
      });
  }, [anchor, first, translation, onBeforePrepend]);

  const fetchNext = useCallback(() => {
    const owner = anchor;
    begin(owner, (s) => ({ ...s, next: { loading: true, error: null } }));
    getSurahAyahs(last + 1, translation)
      .then((data) => {
        setStored((s) => (s.anchor !== owner ? s : { ...s, following: [...s.following, data], next: idle }));
      })
      .catch((err) => {
        setStored((s) =>
          s.anchor !== owner
            ? s
            : { ...s, next: { loading: false, error: err instanceof Error ? err.message : "Couldn't load the next surah." } }
        );
      });
  }, [anchor, last, translation]);

  const loadPrevious = useCallback(() => {
    if (hasPrevious && !prev.loading && !prev.error) fetchPrevious();
  }, [hasPrevious, prev, fetchPrevious]);

  const loadNext = useCallback(() => {
    if (hasMore && !next.loading && !next.error) fetchNext();
  }, [hasMore, next, fetchNext]);

  return {
    preceding,
    following,
    hasPrevious,
    hasMore,
    loadingPrevious: prev.loading,
    loadingNext: next.loading,
    previousError: prev.error,
    nextError: next.error,
    loadPrevious,
    loadNext,
    retryPrevious: fetchPrevious,
    retryNext: fetchNext,
  };
}
