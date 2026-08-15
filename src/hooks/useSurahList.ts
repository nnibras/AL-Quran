import { useEffect, useState } from "react";
import { getSurahList } from "../api/quran";
import type { SurahMeta } from "../types";

let memoryCache: SurahMeta[] | null = null;

/** getSurahList() reads bundled local data (memoized in loadQuranData.ts), so this just mirrors that into component state. */
export function useSurahList() {
  const [surahs, setSurahs] = useState<SurahMeta[] | null>(memoryCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (surahs) return;
    getSurahList()
      .then((list) => {
        memoryCache = list;
        setSurahs(list);
      })
      .catch(() => setError("Couldn't load the list of surahs."));
  }, [surahs]);

  return { surahs, loading: !surahs && !error, error };
}
