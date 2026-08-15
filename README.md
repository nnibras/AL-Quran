# Al-Quran

A fast, accessible Quran reader — read by Surah or Juz, search translations, listen to recitations from several reciters, and bookmark ayahs. Built with React, TypeScript, Vite and Tailwind CSS, backed by the [alquran.cloud](https://alquran.cloud/api) API.

## Features

- Read by Surah (1–114) or by Juz/Para (1–30), with previous/next navigation and jump-to-ayah
- 28 translation languages, switchable at any time
- Full-surah and per-ayah audio, with a choice of reciters
- Full-text search across ayah translations, plus instant surah-name search
- Bookmark any ayah — saved locally on your device
- Adjustable Arabic text size
- Light / dark / system theme
- Remembers your last-read surah or juz and all preferences between visits
- Fully responsive, keyboard- and screen-reader-friendly

## Development

Requires Node 16.20+ (or newer).

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and build to dist/
npm run preview   # preview the production build locally
```

## Deployment

The build output in `dist/` is a fully static, self-contained site (relative asset paths, hash-based routing, no environment variables or server required), so it can be deployed anywhere.

**Netlify — drag and drop:**

1. `npm run build`
2. Drag the generated `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop)

That's it — no build configuration needed on Netlify's side. (A `netlify.toml`/`_redirects` aren't required since routing uses URL hashes, but a `public/_redirects` is included anyway for robustness if you later connect this repo to Netlify's git-based builds.)

**GitHub Pages:**

A workflow at `.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages automatically on every push to `main`. Enable it once under the repo's **Settings → Pages → Source: GitHub Actions**.

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-router-dom](https://reactrouter.com/) (hash-based routing)
- [zustand](https://github.com/pmndrs/zustand) for state, persisted to `localStorage`
- [alquran.cloud API](https://alquran.cloud/api) for Quran text, translations and search
- [Islamic Network CDN](https://cdn.islamic.network/) for recitation audio

---

© Developed and maintained by N. Nibras — [GitHub](https://github.com/nnibras) · [LinkedIn](https://www.linkedin.com/in/nafinibras)
