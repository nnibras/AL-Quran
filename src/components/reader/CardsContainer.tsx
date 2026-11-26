import type { ReactNode } from "react";
import { usePreferencesStore } from "../../store/usePreferencesStore";

/** Wraps the list of AyahCards and applies theme-specific framing. */
export function CardsContainer({ children }: { children: ReactNode }) {
  const theme = usePreferencesStore((s) => s.theme);

  if (theme === "maroon") {
    return (
      <div className="bg-maroon-900 px-2 py-4 sm:px-4">
        <div className="maroon-frame px-8 sm:px-12">{children}</div>
      </div>
    );
  }

  if (theme === "green") {
    // Each AyahCard renders as its own rounded panel in this theme.
    return <div className="px-4 py-4 sm:px-8">{children}</div>;
  }

  return <div className="px-4 sm:px-8">{children}</div>;
}
