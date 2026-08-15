import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the built `dist/` folder works when drag-and-dropped
// directly onto Netlify (or opened from any subpath) as well as when
// deployed to GitHub Pages under a repo subpath.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    // The Quran-text-per-language chunks are large but lazy: only the
    // selected translation is ever fetched, so the default 500kB warning
    // (tuned for eagerly-loaded bundles) doesn't apply here.
    chunkSizeWarningLimit: 2200,
  },
});
