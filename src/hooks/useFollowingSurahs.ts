import { useCallback, useEffect, useRef, useState } from "react";
import { getSurahAyahs } from "../api/quran";

type SurahData = Awaited<ReturnType<typeof getSurahAyahs>>;

const TOTAL_SURAHS = 114;

/**
 * For continuous Book reading: loads the surahs that come after `anchor`, one at
 * a time, whenever `loadNext` is called (typically when the reader nears the end).
 * Resets whenever the anchor surah or translation changes.
 */
export function useFollowingSurahs(anchor: SurahData | null, translation: string) {
  const [following, setFollowing] = useState<SurahData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    requestId.current++;
    setFollowing([]);
    setLoading(false);
    setError(null);
  }, [anchor, translation]);

  const lastLoaded = following.length ? following[following.length - 1].meta.number : anchor?.meta.number ?? 0;
  const hasMore = Boolean(anchor) && lastLoaded < TOTAL_SURAHS;

  const load = useCallback(() => {
    const id = requestId.current;
    setLoading(true);
    setError(null);
    getSurahAyahs(lastLoaded + 1, translation)
      .then((next) => {
        if (id !== requestId.current) return;
        setFollowing((prev) => [...prev, next]);
        setLoading(false);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        setError(err instanceof Error ? err.message : "Couldn't load the next surah.");
        setLoading(false);
      });
  }, [lastLoaded, translation]);

  const loadNext = useCallback(() => {
    if (hasMore && !loading && !error) load();
  }, [hasMore, loading, error, load]);

  return { following, loadingNext: loading, nextError: error, hasMore, loadNext, retryNext: load };
}
