import { surahAudioUrl } from "../../api/editions";
import { useAudioStore } from "../../store/useAudioStore";
import { usePreferencesStore } from "../../store/usePreferencesStore";
import type { SurahMeta } from "../../types";
import { BISMILLAH, showsBismillahSeparately } from "../../utils/surah";
import { IconPlay } from "../common/Icons";

interface SurahHeaderProps {
  meta: SurahMeta;
  sajdaCount: number;
}

export function SurahHeader({ meta, sajdaCount }: SurahHeaderProps) {
  const reciter = usePreferencesStore((s) => s.reciter);
  const loadAndPlay = useAudioStore((s) => s.loadAndPlay);
  const isPlayingThis = useAudioStore((s) => s.isPlaying && s.track?.title === meta.englishName);

  return (
    <div className="border-b border-stone-100 px-4 pb-8 pt-6 text-center sm:px-8 dark:border-stone-800">
      <p dir="rtl" lang="ar" className="font-arabic text-4xl text-stone-900 dark:text-white">
        {meta.name}
      </p>
      <h1 className="mt-2 text-xl font-bold text-stone-800 dark:text-stone-100">
        {meta.number}. {meta.englishName}
      </h1>
      <p className="text-sm text-stone-500 dark:text-stone-400">{meta.englishNameTranslation}</p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
          {meta.revelationType}
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
          {meta.numberOfAyahs} ayahs
        </span>
        {sajdaCount > 0 && (
          <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            {sajdaCount} sajda{sajdaCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          loadAndPlay({
            src: surahAudioUrl(reciter, meta.number),
            title: meta.englishName,
            kind: "surah",
          })
        }
        className="mx-auto mt-5 flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        <IconPlay className="h-4 w-4" />
        {isPlayingThis ? "Playing…" : "Listen to full surah"}
      </button>

      {showsBismillahSeparately(meta.number) && (
        <p dir="rtl" lang="ar" className="font-arabic mt-8 text-3xl text-stone-800 dark:text-stone-100">
          {BISMILLAH}
        </p>
      )}
    </div>
  );
}
