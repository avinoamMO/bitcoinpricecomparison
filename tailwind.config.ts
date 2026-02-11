import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#fafafa",
        card: {
          DEFAULT: "#111111",
          foreground: "#fafafa",
        },
        border: "#222222",
        muted: {
          DEFAULT: "#171717",
          foreground: "#a3a3a3",
        },
        accent: {
          DEFAULT: "#1a1a2e",
          foreground: "#fafafa",
        },
        success: {
          DEFAULT: "#22c55e",
          foreground: "#052e16",
        },
        danger: {
          DEFAULT: "#ef4444",
          foreground: "#450a0a",
        },
        gold: {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706",
        },
        crypto: {
          green: "#22c55e",
          red: "#ef4444",
          blue: "#3b82f6",
          purple: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "price-flash": "priceFlash 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        priceFlash: {
          "0%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(34, 197, 94, 0.1)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
