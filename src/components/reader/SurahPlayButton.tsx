import { surahAudioUrl } from "../../api/editions";
import { useAudioStore } from "../../store/useAudioStore";
import { usePreferencesStore } from "../../store/usePreferencesStore";
import { IconPause, IconPlay } from "../common/Icons";
import { Spinner } from "../common/Spinner";

interface SurahPlayButtonProps {
  surah: { number: number; englishName: string };
}

/** Compact play/pause for the full-surah recitation, shown in the reader toolbar. */
export function SurahPlayButton({ surah }: SurahPlayButtonProps) {
  const reciter = usePreferencesStore((s) => s.reciter);
  const loadAndPlay = useAudioStore((s) => s.loadAndPlay);
  const toggle = useAudioStore((s) => s.toggle);
  const isThisTrack = useAudioStore((s) => s.track?.kind === "surah" && s.track.title === surah.englishName);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const isLoading = useAudioStore((s) => s.isLoading);

  const playing = isThisTrack && isPlaying;
  const label = playing ? `Pause ${surah.englishName}` : `Listen to ${surah.englishName}`;

  const onClick = () => {
    if (isThisTrack) toggle();
    else loadAndPlay({ src: surahAudioUrl(reciter, surah.number), title: surah.englishName, kind: "surah" });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={playing}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm transition hover:bg-brand-700"
    >
      {isThisTrack && isLoading ? (
        <Spinner className="h-4 w-4" />
      ) : playing ? (
        <IconPause className="h-4 w-4" />
      ) : (
        <IconPlay className="ml-0.5 h-4 w-4" />
      )}
    </button>
  );
}
