const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const scale = (name) =>
  Object.fromEntries(SHADES.map((n) => [n, `rgb(var(--${name}-${n}) / <alpha-value>)`]));

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["Kitab", "Traditional Arabic", "serif"],
      },
      colors: {
        // Both scales are driven by CSS variables (see index.css) so a reading
        // theme such as "maroon" can re-skin the whole app by swapping them.
        // Defaults: Tailwind's stone + a calm, deep teal-green brand that evokes
        // manuscript/mosque-tile greens rather than a generic SaaS blue.
        stone: scale("stone"),
        brand: scale("brand"),
        // Deep maroon + parchment palette for the optional "Maroon" card theme.
        maroon: {
          600: "#6b3640",
          700: "#4d2930",
          800: "#46222a",
          900: "#3c1319",
        },
        parchment: {
          100: "#f1e1d2",
          300: "#d9c3ac",
          gold: "#c9a55a",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
