import { useEffect, useRef } from "react";
import { useAudioStore } from "../../store/useAudioStore";
import { IconClose, IconPause, IconPlay } from "../common/Icons";
import { Spinner } from "../common/Spinner";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioBar() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    track,
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration,
    registerAudio,
    toggle,
    seek,
    setPlaying,
    setLoading,
    setError,
    setProgress,
  } = useAudioStore();

  useEffect(() => {
    registerAudio(audioRef.current);
    return () => registerAudio(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stop = () => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
    }
    useAudioStore.setState({ track: null, isPlaying: false, currentTime: 0, duration: 0, error: null });
  };

  const handleError = () => {
    const el = audioRef.current;
    if (el && track?.fallbackSrc && el.src !== track.fallbackSrc) {
      el.src = track.fallbackSrc;
      el.play().catch(() => setError("This reciter's audio couldn't be loaded."));
      useAudioStore.setState({ usedFallback: true });
    } else {
      setError("This reciter's audio couldn't be loaded. Try a different reciter from the sidebar.");
    }
  };

  return (
    <div
      className={`sticky bottom-0 z-20 border-t border-stone-200 bg-white/95 backdrop-blur transition-transform dark:border-stone-800 dark:bg-stone-900/95 ${
        track ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      aria-hidden={!track}
    >
      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onLoadedMetadata={(e) => setProgress(0, e.currentTarget.duration)}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime, e.currentTarget.duration)}
        onError={handleError}
        className="hidden"
      />
      {track && (
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700"
          >
            {isLoading ? <Spinner className="h-4 w-4" /> : isPlaying ? <IconPause className="h-4 w-4" /> : <IconPlay className="h-4 w-4 translate-x-0.5" />}
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-stone-800 dark:text-stone-100">{track.title}</p>
            {error ? (
              <p className="truncate text-xs text-red-500">{error}</p>
            ) : (
              <div className="mt-1 flex items-center gap-2">
                <span className="w-9 shrink-0 text-xs tabular-nums text-stone-400">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  aria-label="Seek"
                  min={0}
                  max={duration || 0}
                  value={Math.min(currentTime, duration || 0)}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="h-1.5 w-full flex-1 cursor-pointer appearance-none rounded-full bg-stone-200 accent-brand-600 dark:bg-stone-700"
                />
                <span className="w-9 shrink-0 text-xs tabular-nums text-stone-400">{formatTime(duration)}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={stop}
            aria-label="Close player"
            className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
