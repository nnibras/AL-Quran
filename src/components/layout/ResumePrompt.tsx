import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePreferencesStore } from "../../store/usePreferencesStore";
import { Modal } from "../common/Modal";

const DEFAULT_PATH = "/surah/1";

function wasPageReload(): boolean {
  const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  return entry?.type === "reload";
}

function describePath(pathname: string): string | null {
  const surahMatch = pathname.match(/^\/surah\/(\d+)/);
  if (surahMatch) return `Surah ${surahMatch[1]}`;
  const juzMatch = pathname.match(/^\/juz\/(\d+)/);
  if (juzMatch) return `Juz ${juzMatch[1]}`;
  if (pathname.startsWith("/search")) return "Search";
  if (pathname.startsWith("/bookmarks")) return "Bookmarks";
  return null;
}

/** After a hard browser refresh (not an in-app navigation), offers to resume where the user was or reset to the default landing page. */
export function ResumePrompt() {
  const location = useLocation();
  const navigate = useNavigate();
  const skipPrompt = usePreferencesStore((s) => s.skipResumePrompt);
  const setSkipResumePrompt = usePreferencesStore((s) => s.setSkipResumePrompt);
  const [visible, setVisible] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [resumeLabel, setResumeLabel] = useState<string | null>(null);

  useEffect(() => {
    if (skipPrompt) return;
    if (location.pathname === DEFAULT_PATH || location.pathname === "/") return;
    if (!wasPageReload()) return;
    setResumeLabel(describePath(location.pathname));
    setVisible(true);
    // Only ever evaluate once, right after the initial page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const finish = () => {
    if (dontAskAgain) setSkipResumePrompt(true);
    setVisible(false);
  };

  const stay = () => finish();
  const goToDefault = () => {
    finish();
    navigate(DEFAULT_PATH);
  };

  return (
    <Modal title="Welcome back" onClose={stay}>
      <p>
        {resumeLabel ? (
          <>
            You were reading <strong className="font-semibold text-stone-800 dark:text-stone-100">{resumeLabel}</strong>. Pick up where you left off, or start fresh from Al-Fatihah?
          </>
        ) : (
          "Continue where you left off, or start fresh from Al-Fatihah?"
        )}
      </p>

      <label className="mt-4 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
        <input
          type="checkbox"
          checked={dontAskAgain}
          onChange={(e) => setDontAskAgain(e.target.checked)}
          className="h-3.5 w-3.5 rounded border-stone-300 text-brand-600 focus:ring-brand-500 dark:border-stone-600"
        />
        Don't ask me again
      </label>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={goToDefault}
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
        >
          Start fresh
        </button>
        <button
          type="button"
          onClick={stay}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Stay here
        </button>
      </div>
    </Modal>
  );
}
