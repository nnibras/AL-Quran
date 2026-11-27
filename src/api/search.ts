import { loadArabic, loadTranslation } from "../data/loadQuranData";
import { matchesAllTerms, normalizeForSearch, searchTerms } from "../utils/searchText";
import { TRANSLATIONS } from "./editions";
import { ayahText } from "./quran";

/**
 * Global search across the Arabic text and every bundled translation.
 *
 * The query's script decides which editions are searched (Arabic script →
 * Quran + Farsi + Urdu; Latin → every Latin-alphabet translation incl.
 * transliteration; Cyrillic, Bengali, Devanagari, CJK, Hangul → their own),
 * so we never load languages that can't possibly match. Editions are loaded
 * lazily, normalised once and cached; results stream in edition by edition.
 */

/** Pseudo edition code for the Arabic Quran text itself. */
export const ARABIC = "ar";

const LABELS = new Map<string, string>([
  [ARABIC, "Arabic"],
  ...TRANSLATIONS.filter((t) => t.code).map(
    (t) => [t.code, t.code === "en.transliteration" ? "Transliteration" : t.label] as [string, string]
  ),
]);

export function editionLabel(code: string): string {
  return LABELS.get(code) ?? code;
}

const SCRIPT_GROUPS: { name: string; test: RegExp; editions: string[] }[] = [
  { name: "Arabic script", test: /\p{Script=Arabic}/u, editions: [ARABIC, "fa.ayati", "ur.ahmedali"] },
  { name: "Cyrillic", test: /\p{Script=Cyrillic}/u, editions: ["ru.kuliev", "bg.theophanov"] },
  { name: "Bengali", test: /\p{Script=Bengali}/u, editions: ["bn.bengali"] },
  { name: "Devanagari", test: /\p{Script=Devanagari}/u, editions: ["hi.farooq"] },
  { name: "Japanese", test: /[\p{Script=Hiragana}\p{Script=Katakana}]/u, editions: ["ja.japanese"] },
  { name: "Chinese characters", test: /\p{Script=Han}/u, editions: ["zh.jian", "ja.japanese"] },
  { name: "Korean", test: /\p{Script=Hangul}/u, editions: ["ko.korean"] },
];
const NON_LATIN = new Set(SCRIPT_GROUPS.flatMap((g) => g.editions));
const LATIN_EDITIONS = TRANSLATIONS.map((t) => t.code).filter((c) => c && !NON_LATIN.has(c));

/** Editions to search for this query, most relevant first. */
export function editionsForQuery(query: string, preferred: string): { script: string; editions: string[] } {
  const group = SCRIPT_GROUPS.find((g) => g.test.test(query));
  const candidates = group ? group.editions : LATIN_EDITIONS;
  const priority = [ARABIC, preferred, "en.sahih", "en.transliteration"];
  const rank = (code: string) => {
    const i = priority.indexOf(code);
    return i === -1 ? priority.length : i;
  };
  return {
    script: group?.name ?? "Latin alphabet",
    editions: [...candidates].sort((a, b) => rank(a) - rank(b)),
  };
}

// ---------------------------------------------------------------------------
// Edition data (display text + normalised text), indexed by global ayah number - 1

export interface EditionData {
  text: string[];
  norm: string[];
  /** Arabic only: normalised with the dagger alef read as a full alef. */
  normAlt?: string[];
}

export interface AyahRef {
  surahNumber: number;
  numberInSurah: number;
  englishName: string;
  name: string;
}

const editionPromises = new Map<string, Promise<EditionData>>();
const readyEditions = new Map<string, EditionData>();
let ayahRefs: AyahRef[] | null = null;

const yieldToUi = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

async function buildEdition(code: string): Promise<EditionData> {
  const text: string[] = [];
  if (code === ARABIC) {
    const refs: AyahRef[] = [];
    for (const surah of await loadArabic()) {
      for (const ayah of surah.ayahs) {
        text[ayah.number - 1] = ayahText(surah.number, ayah.numberInSurah, ayah.text);
        refs[ayah.number - 1] = {
          surahNumber: surah.number,
          numberInSurah: ayah.numberInSurah,
          englishName: surah.englishName,
          name: surah.name,
        };
      }
    }
    ayahRefs = refs;
  } else {
    for (const surah of await loadTranslation(code)) {
      for (const ayah of surah.ayahs) text[ayah.number - 1] = ayah.text;
    }
  }

  const norm: string[] = new Array(text.length);
  const normAlt: string[] | undefined = code === ARABIC ? new Array(text.length) : undefined;
  for (let i = 0; i < text.length; i++) {
    norm[i] = normalizeForSearch(text[i]);
    if (normAlt) normAlt[i] = normalizeForSearch(text[i], true);
    if (i % 800 === 799) await yieldToUi(); // keep typing/scrolling responsive
  }
  return { text, norm, normAlt };
}

export function loadEdition(code: string): Promise<EditionData> {
  let promise = editionPromises.get(code);
  if (!promise) {
    promise = buildEdition(code).then(
      (data) => {
        readyEditions.set(code, data);
        return data;
      },
      (err) => {
        editionPromises.delete(code); // allow a retry
        throw err;
      }
    );
    editionPromises.set(code, promise);
  }
  return promise;
}

/** Synchronous access for rendering; undefined until the edition has loaded. */
export function readyEdition(code: string): EditionData | undefined {
  return readyEditions.get(code);
}

export function ayahRef(ayahNumber: number): AyahRef | undefined {
  return ayahRefs?.[ayahNumber - 1];
}

// ---------------------------------------------------------------------------
// Search

export interface SearchHit {
  ayahNumber: number;
  /** Editions this ayah matched in, in search priority order. */
  editions: string[];
  /** The query appears as an exact phrase (not just all its words) — ranked first. */
  exact: boolean;
}

export interface SearchProgress {
  terms: string[];
  script: string;
  /** All editions being searched, in order. */
  editions: string[];
  searched: string[];
  failed: string[];
  hits: SearchHit[];
  done: boolean;
}

/**
 * Searches every edition relevant to `query`, calling `onProgress` after each
 * one so results can be shown while the rest are still loading. Stops quietly
 * once `isCancelled()` returns true (e.g. the user kept typing).
 */
export async function runGlobalSearch(
  query: string,
  preferredTranslation: string,
  onProgress: (progress: SearchProgress) => void,
  isCancelled: () => boolean
): Promise<void> {
  const terms = searchTerms(query);
  const { script, editions } = editionsForQuery(query, preferredTranslation);
  const progress: SearchProgress = { terms, script, editions, searched: [], failed: [], hits: [], done: false };
  if (!terms.length) {
    onProgress({ ...progress, done: true });
    return;
  }

  // Arabic is always needed to display results; the reader's own translation
  // is shown under Arabic-only matches.
  await loadEdition(ARABIC);
  if (preferredTranslation) await loadEdition(preferredTranslation).catch(() => undefined);
  if (isCancelled()) return;
  onProgress({ ...progress });

  const phrase = terms.join(" ");
  const found = new Map<number, { editions: string[]; exact: boolean }>();
  for (const code of editions) {
    let data: EditionData;
    try {
      data = await loadEdition(code);
    } catch {
      progress.failed.push(code);
      continue;
    }
    if (isCancelled()) return;

    const { norm, normAlt } = data;
    for (let i = 0; i < norm.length; i++) {
      if (matchesAllTerms(norm[i], terms) || (normAlt && matchesAllTerms(normAlt[i], terms))) {
        const exact = terms.length > 1 && (norm[i].includes(phrase) || Boolean(normAlt?.[i].includes(phrase)));
        const entry = found.get(i + 1);
        if (entry) {
          entry.editions.push(code);
          entry.exact ||= exact;
        } else found.set(i + 1, { editions: [code], exact });
      }
    }

    progress.searched.push(code);
    progress.hits = [...found.entries()]
      .map(([ayahNumber, { editions: list, exact }]) => ({ ayahNumber, editions: [...list], exact }))
      .sort((a, b) => Number(b.exact) - Number(a.exact) || a.ayahNumber - b.ayahNumber);
    progress.done = progress.searched.length + progress.failed.length === editions.length;
    onProgress({ ...progress, searched: [...progress.searched], failed: [...progress.failed] });
    await yieldToUi();
  }
  if (!progress.done && !isCancelled()) onProgress({ ...progress, done: true });
}
