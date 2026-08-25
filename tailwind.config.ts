import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cyber: {
          50: "#eef9ff",
          100: "#d8f1ff",
          200: "#b9e6ff",
          300: "#88d6ff",
          400: "#50bcff",
          500: "#279bf6",
          600: "#117de9",
          700: "#0b64bb",
          800: "#0e5499",
          900: "#11467a",
          950: "#0b2c50",
        },
        ai: {
          50: "#fbf6ff",
          100: "#f5ecff",
          200: "#eddbff",
          300: "#dfbdff",
          400: "#c88fff",
          500: "#af5fff",
          600: "#993bf4",
          700: "#8428d8",
          800: "#6f24b0",
          900: "#5b1f8e",
          950: "#3d0b67",
        },
      },
      animation: {
        "marquee": "marquee 35s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glow: {
          "0%": { opacity: "0.6", filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))" },
          "100%": { opacity: "1", filter: "drop-shadow(0 0 12px rgba(168, 85, 247, 0.8))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
