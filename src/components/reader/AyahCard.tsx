import { useState } from "react";
import { ayahAudioUrl, surahAudioUrl } from "../../api/editions";
import { useAudioStore } from "../../store/useAudioStore";
import { useBookmarksStore } from "../../store/useBookmarksStore";
import { usePreferencesStore } from "../../store/usePreferencesStore";
import type { Ayah } from "../../types";
import { IconBookmark, IconCheck, IconCopy, IconPlay } from "../common/Icons";

interface AyahCardProps {
  ayah: Ayah;
  showSurahLabel?: boolean;
}

export function AyahCard({ ayah, showSurahLabel }: AyahCardProps) {
  const fontSize = usePreferencesStore((s) => s.arabicFontSize);
  const reciter = usePreferencesStore((s) => s.reciter);
  const maroon = usePreferencesStore((s) => s.theme === "maroon");
  const green = usePreferencesStore((s) => s.theme === "green");
  const isBookmarked = useBookmarksStore((s) => s.isBookmarked(ayah.surah.number, ayah.numberInSurah));
  const toggleBookmark = useBookmarksStore((s) => s.toggleBookmark);
  const loadAndPlay = useAudioStore((s) => s.loadAndPlay);
  const isPlayingThis = useAudioStore(
    (s) => s.isPlaying && s.track?.title === `${ayah.surah.englishName} · Ayah ${ayah.numberInSurah}`
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = ayah.translation ? `${ayah.text}\n\n${ayah.translation}` : ayah.text;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  };

  const handlePlay = () => {
    loadAndPlay({
      src: ayahAudioUrl(reciter, ayah.number),
      fallbackSrc: surahAudioUrl(reciter, ayah.surah.number),
      title: `${ayah.surah.englishName} · Ayah ${ayah.numberInSurah}`,
      kind: "ayah",
    });
  };

  const iconBtn = maroon ? "hover:bg-maroon-600" : "hover:bg-stone-100 dark:hover:bg-stone-800";
  const iconIdle = maroon ? "text-parchment-300" : "text-stone-400";

  return (
    <article
      id={`ayah-${ayah.surah.number}-${ayah.numberInSurah}`}
      className={`scroll-mt-28 ${
        green
          ? "mb-4 rounded-3xl bg-stone-900 px-5 py-6 sm:px-8"
          : `border-b py-8 first:pt-4 last:border-b-0 ${
              maroon ? "border-parchment-gold/30" : "border-stone-100 dark:border-stone-800"
            }`
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${
              maroon
                ? "border border-parchment-gold bg-parchment-gold/20 text-parchment-100"
                : "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
            }`}>
            {showSurahLabel ? `${ayah.surah.englishName} ${ayah.numberInSurah}` : ayah.numberInSurah}
          </span>
          <span className={`text-xs font-medium ${maroon ? "text-parchment-300" : "text-stone-400 dark:text-stone-500"}`}>
            Page {ayah.page}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play ayah ${ayah.numberInSurah}`}
            aria-pressed={isPlayingThis}
            className={`rounded-full p-2 transition ${iconBtn} ${
              isPlayingThis ? (maroon ? "text-parchment-gold" : "text-brand-600") : iconIdle
            }`}
          >
            <IconPlay className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy ayah ${ayah.numberInSurah}`}
            className={`rounded-full p-2 transition ${iconBtn} ${iconIdle}`}
          >
            {copied ? <IconCheck className="h-4 w-4 text-green-500" /> : <IconCopy className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() =>
              toggleBookmark({
                surahNumber: ayah.surah.number,
                ayahNumberInSurah: ayah.numberInSurah,
                surahEnglishName: ayah.surah.englishName,
                text: ayah.translation || ayah.text,
                createdAt: Date.now(),
              })
            }
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            aria-pressed={isBookmarked}
            className={`rounded-full p-2 transition ${iconBtn} ${
              isBookmarked ? (maroon ? "text-parchment-gold" : "text-amber-500") : iconIdle
            }`}
          >
            <IconBookmark filled={isBookmarked} className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p
        dir="rtl"
        lang="ar"
        className={`text-center font-arabic leading-loose ${
          maroon ? "text-parchment-100" : "text-stone-900 dark:text-stone-50"
        }`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {ayah.text}
      </p>

      {ayah.translation && (
        <p
          className={`mt-4 text-center text-base leading-relaxed ${
            maroon ? "text-parchment-100/90" : "text-stone-600 dark:text-stone-300"
          }`}
        >
          {ayah.translation}
        </p>
      )}
    </article>
  );
}
