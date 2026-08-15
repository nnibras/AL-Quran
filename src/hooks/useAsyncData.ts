import { useCallback, useEffect, useRef, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/** Runs `fetcher` whenever `deps` change, tracking loading/error state and guarding against stale responses. */
export function useAsyncData<T>(fetcher: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const run = useCallback(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        if (id !== requestId.current) return;
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, retry: run };
}
