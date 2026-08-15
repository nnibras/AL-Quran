import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { AudioBar } from "../reader/AudioBar";
import { Header } from "./Header";
import { ResumePrompt } from "./ResumePrompt";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50 dark:bg-stone-950">
      <ResumePrompt />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setMenuOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <AudioBar />
      </div>
    </div>
  );
}
