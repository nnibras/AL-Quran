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
        // A calm, deep teal-green — evokes manuscript/mosque-tile greens rather
        // than a generic SaaS blue, and pairs with the warm stone neutrals and
        // amber/parchment tones used in the Book view.
        brand: {
          50: "#effaf6",
          100: "#d7f2e7",
          200: "#b1e4d2",
          300: "#7ecfb6",
          400: "#4bb497",
          500: "#2b9a80",
          600: "#1f7d69",
          700: "#1c6456",
          800: "#1a5047",
          900: "#18423b",
          950: "#092621",
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
