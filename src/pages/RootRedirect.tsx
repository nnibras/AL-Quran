import { Navigate } from "react-router-dom";
import { usePreferencesStore } from "../store/usePreferencesStore";

/** Sends the user back to whatever they were last reading, defaulting to Al-Fatihah. */
export function RootRedirect() {
  const lastRead = usePreferencesStore((s) => s.lastRead);
  if (lastRead?.mostRecent === "juz") return <Navigate to={`/juz/${lastRead.juz ?? 1}`} replace />;
  return <Navigate to={`/surah/${lastRead?.surah ?? 1}`} replace />;
}
