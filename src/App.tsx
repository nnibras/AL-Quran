import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { BookmarksPage } from "./pages/BookmarksPage";
import { JuzPage } from "./pages/JuzPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RootRedirect } from "./pages/RootRedirect";
import { SearchPage } from "./pages/SearchPage";
import { SurahPage } from "./pages/SurahPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<RootRedirect />} />
        <Route path="surah/:number" element={<SurahPage />} />
        <Route path="juz/:number" element={<JuzPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="bookmarks" element={<BookmarksPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
