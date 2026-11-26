import { useMemo, useState } from "react";
import { ayahAudioUrl, surahAudioUrl } from "../../api/editions";
import { useAudioStore } from "../../store/useAudioStore";
import { useBookmarksStore } from "../../store/useBookmarksStore";
import { usePreferencesStore } from "../../store/usePreferencesStore";
import type { Ayah } from "../../types";
import { BISMILLAH, showsBismillahSeparately, toArabicNumeral } from "../../utils/surah";
import { IconBookmark, IconClose, IconPlay } from "../common/Icons";

interface BookViewProps {
  ayahs: Ayah[];
}

function AyahDetail({ ayah, onClose }: { ayah: Ayah; onClose: () => void }) {
  const reciter = usePreferencesStore((s) => s.reciter);
  const loadAndPlay = useAudioStore((s) => s.loadAndPlay);
  const isBookmarked = useBookmarksStore((s) => s.isBookmarked(ayah.surah.number, ayah.numberInSurah));
  const toggleBookmark = useBookmarksStore((s) => s.toggleBookmark);
  const maroon = usePreferencesStore((s) => s.theme === "maroon");
  const iconBtn = maroon ? "hover:bg-maroon-600" : "hover:bg-stone-100 dark:hover:bg-stone-800";
  const iconIdle = maroon ? "text-parchment-300" : "text-stone-400";

  return (
    <div
      className={`mt-3 animate-fade-in rounded-xl border px-4 py-3 text-left shadow-sm ${
        maroon
          ? "border-parchment-gold/60 bg-maroon-800"
          : "border-amber-200 bg-white dark:border-stone-700 dark:bg-stone-900"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-semibold ${maroon ? "text-parchment-gold" : "text-brand-600 dark:text-brand-400"}`}>
            {ayah.surah.englishName} · Ayah {ayah.numberInSurah}
          </p>
          {ayah.translation && (
            <p
              className={`mt-1 text-sm leading-relaxed ${
                maroon ? "text-parchment-100" : "text-stone-700 dark:text-stone-300"
              }`}
            >
              {ayah.translation}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`shrink-0 rounded-full p-1 ${iconBtn} ${iconIdle}`}
        >
          <IconClose className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-1">
        <button
          type="button"
          onClick={() =>
            loadAndPlay({
              src: ayahAudioUrl(reciter, ayah.number),
              fallbackSrc: surahAudioUrl(reciter, ayah.surah.number),
              title: `${ayah.surah.englishName} · Ayah ${ayah.numberInSurah}`,
              kind: "ayah",
            })
          }
          aria-label={`Play ayah ${ayah.numberInSurah}`}
          className={`rounded-full p-1.5 ${iconBtn} ${iconIdle} ${maroon ? "hover:text-parchment-gold" : "hover:text-brand-600"}`}
        >
          <IconPlay className="h-4 w-4" />
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
          className={`rounded-full p-1.5 ${iconBtn} ${
            isBookmarked ? (maroon ? "text-parchment-gold" : "text-amber-500") : iconIdle
          }`}
        >
          <IconBookmark filled={isBookmarked} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface PageGroup {
  page: number;
  juz: number;
  ayahs: Ayah[];
}

function groupByPage(ayahs: Ayah[]): PageGroup[] {
  const groups: PageGroup[] = [];
  for (const ayah of ayahs) {
    const last = groups[groups.length - 1];
    if (last && last.page === ayah.page) last.ayahs.push(ayah);
    else groups.push({ page: ayah.page, juz: ayah.juz, ayahs: [ayah] });
  }
  return groups;
}

/**
 * Mushaf-style reading: one box per mushaf page, and surahs follow one another
 * in a single scroll, each opening with the same title banner. Tapping an ayah
 * number opens its translation right below that ayah.
 */
export function BookView({ ayahs }: BookViewProps) {
  const fontSize = usePreferencesStore((s) => s.arabicFontSize);
  const maroon = usePreferencesStore((s) => s.theme === "maroon");
  const [selectedKey, setSelectedKey] = useState<number | null>(null);

  const pages = useMemo(() => groupByPage(ayahs), [ayahs]);
  const labelColor = maroon ? "text-parchment-gold" : "text-amber-700/70 dark:text-amber-400/60";

  return (
    <div className={`space-y-6 px-3 py-4 sm:space-y-8 sm:px-8 sm:py-6 ${maroon ? "bg-maroon-900" : ""}`}>
      {pages.map((group) => (
        <section
          key={group.page}
          className={
            maroon
              ? "maroon-frame mx-auto max-w-2xl px-9 py-6 shadow-lg sm:px-12 sm:py-8"
              : "mx-auto max-w-2xl rounded-2xl border border-amber-200/70 bg-amber-50/40 px-4 py-6 shadow-sm sm:px-8 sm:py-8 dark:border-stone-700 dark:bg-stone-900/40"
          }
        >
          <p className={`mb-4 text-center text-[0.65rem] font-semibold uppercase tracking-widest ${labelColor}`}>
            Juz {group.juz}
          </p>

          <div
            dir="rtl"
            lang="ar"
            className={`font-arabic text-justify leading-loose ${
              maroon ? "text-parchment-100" : "text-stone-900 dark:text-stone-50"
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {group.ayahs.map((ayah, i) => {
              const selected = selectedKey === ayah.number;
              return (
                <span key={ayah.number} id={`ayah-${ayah.surah.number}-${ayah.numberInSurah}`} className="scroll-mt-28">
                  {ayah.numberInSurah === 1 && (
                    <span
                      dir="ltr"
                      data-surah-start={ayah.surah.number}
                      className={`block scroll-mt-28 text-center font-sans ${i === 0 ? "mb-4" : "mb-4 mt-8"}`}
                    >
                      {/* Mushaf-style surah title frame (see .surah-banner in index.css). */}
                      <span className="surah-banner block px-12 py-3">
                        <span
                          dir="rtl"
                          lang="ar"
                          className={`font-arabic block text-3xl leading-snug ${
                            maroon ? "text-parchment-100" : "text-stone-900 dark:text-stone-50"
                          }`}
                        >
                          {ayah.surah.name}
                        </span>
                        <span
                          className={`mt-0.5 block text-[0.7rem] font-semibold uppercase tracking-widest ${
                            maroon ? "text-parchment-gold" : "text-brand-700 dark:text-brand-300"
                          }`}
                        >
                          Surah {ayah.surah.number} · {ayah.surah.englishName}
                        </span>
                      </span>
                      {showsBismillahSeparately(ayah.surah.number) && (
                        <span
                          dir="rtl"
                          lang="ar"
                          className={`font-arabic mt-3 block text-2xl ${
                            maroon ? "text-parchment-100" : "text-stone-800 dark:text-stone-100"
                          }`}
                        >
                          {BISMILLAH}
                        </span>
                      )}
                    </span>
                  )}
                  {ayah.text}{" "}
                  <button
                    type="button"
                    onClick={() => setSelectedKey(selected ? null : ayah.number)}
                    aria-label={`Ayah ${ayah.numberInSurah}, show translation`}
                    aria-pressed={selected}
                    className={`mx-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border align-middle font-sans text-[0.55em] leading-none transition ${
                      selected
                        ? maroon
                          ? "border-parchment-gold bg-parchment-gold text-maroon-900"
                          : "border-brand-500 bg-brand-500 text-white"
                        : maroon
                          ? "border-parchment-gold text-parchment-gold hover:bg-maroon-600"
                          : "border-amber-400/60 text-amber-700 hover:bg-amber-100 dark:border-stone-600 dark:text-amber-400 dark:hover:bg-stone-800"
                    }`}
                  >
                    {toArabicNumeral(ayah.numberInSurah)}
                  </button>{" "}
                  {selected && (
                    <span dir="ltr" className="mb-3 block font-sans">
                      <AyahDetail ayah={ayah} onClose={() => setSelectedKey(null)} />
                    </span>
                  )}
                </span>
              );
            })}
          </div>

          <p className={`mt-6 text-center text-xs font-medium ${labelColor}`}>Page {group.page}</p>
        </section>
      ))}
    </div>
  );
}
