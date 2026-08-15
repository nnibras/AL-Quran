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

interface PageGroup {
  page: number;
  juz: number;
  ayahs: Ayah[];
}

function groupByPage(ayahs: Ayah[]): PageGroup[] {
  const groups: PageGroup[] = [];
  for (const ayah of ayahs) {
    const last = groups[groups.length - 1];
    if (last && last.page === ayah.page) {
      last.ayahs.push(ayah);
    } else {
      groups.push({ page: ayah.page, juz: ayah.juz, ayahs: [ayah] });
    }
  }
  return groups;
}

function AyahDetail({ ayah, onClose }: { ayah: Ayah; onClose: () => void }) {
  const reciter = usePreferencesStore((s) => s.reciter);
  const loadAndPlay = useAudioStore((s) => s.loadAndPlay);
  const isBookmarked = useBookmarksStore((s) => s.isBookmarked(ayah.surah.number, ayah.numberInSurah));
  const toggleBookmark = useBookmarksStore((s) => s.toggleBookmark);

  return (
    <div className="mt-3 animate-fade-in rounded-xl border border-amber-200 bg-white px-4 py-3 text-left shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
            {ayah.surah.englishName} · Ayah {ayah.numberInSurah}
          </p>
          {ayah.translation && (
            <p className="mt-1 text-sm leading-relaxed text-stone-700 dark:text-stone-300">{ayah.translation}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-full p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
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
          className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-brand-600 dark:hover:bg-stone-800"
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
          className={`rounded-full p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 ${
            isBookmarked ? "text-amber-500" : "text-stone-400"
          }`}
        >
          <IconBookmark filled={isBookmarked} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function BookView({ ayahs }: BookViewProps) {
  const fontSize = usePreferencesStore((s) => s.arabicFontSize);
  const [selectedKey, setSelectedKey] = useState<number | null>(null);

  const pages = useMemo(() => groupByPage(ayahs), [ayahs]);

  return (
    <div className="space-y-8 px-4 py-6 sm:px-8">
      {pages.map((group) => (
        <section
          key={group.page}
          className="mx-auto max-w-2xl rounded-2xl border border-amber-200/70 bg-amber-50/40 px-6 py-8 shadow-sm dark:border-stone-700 dark:bg-stone-900/40"
        >
          <p className="mb-6 text-center text-[0.65rem] font-semibold uppercase tracking-widest text-amber-700/70 dark:text-amber-400/60">
            Juz {group.juz}
          </p>

          <div dir="rtl" lang="ar" className="font-arabic text-justify leading-loose text-stone-900 dark:text-stone-50" style={{ fontSize: `${fontSize}px` }}>
            {group.ayahs.map((ayah) => (
              <span key={ayah.number} id={`ayah-${ayah.numberInSurah}`} className="scroll-mt-20">
                {ayah.numberInSurah === 1 && (
                  <span dir="ltr" className="my-4 block text-center font-sans">
                    <span className="block text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                      {ayah.surah.englishName}
                    </span>
                    {showsBismillahSeparately(ayah.surah.number) && (
                      <span dir="rtl" lang="ar" className="font-arabic mt-2 block text-2xl text-stone-800 dark:text-stone-100">
                        {BISMILLAH}
                      </span>
                    )}
                  </span>
                )}
                {ayah.text}{" "}
                <button
                  type="button"
                  onClick={() => setSelectedKey(selectedKey === ayah.number ? null : ayah.number)}
                  aria-label={`Ayah ${ayah.numberInSurah}, show translation`}
                  aria-pressed={selectedKey === ayah.number}
                  className={`mx-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border align-middle font-sans text-[0.55em] leading-none transition ${
                    selectedKey === ayah.number
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-amber-400/60 text-amber-700 hover:bg-amber-100 dark:border-stone-600 dark:text-amber-400 dark:hover:bg-stone-800"
                  }`}
                >
                  {toArabicNumeral(ayah.numberInSurah)}
                </button>{" "}
              </span>
            ))}
          </div>

          {group.ayahs
            .filter((a) => a.number === selectedKey)
            .map((a) => (
              <AyahDetail key={a.number} ayah={a} onClose={() => setSelectedKey(null)} />
            ))}

          <p className="mt-6 text-center text-xs font-medium text-amber-700/60 dark:text-amber-400/50">
            Page {group.page}
          </p>
        </section>
      ))}
    </div>
  );
}
