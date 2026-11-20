import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#041f3d",
          900: "#062847",
          800: "#0b3b66",
        },
        gold: {
          DEFAULT: "#ffd45a",
          hover: "#f5c43d",
          text: "#102c41",
        },
        ice: {
          bg: "#f4f9fc",
          section: "#eaf4fb",
          card: "#e4f1fa",
          border: "#c6dce9",
        },
        slate: {
          body: "#173246",
          muted: "#4b6578",
        },
        whatsapp: {
          DEFAULT: "#25d366",
          hover: "#20bd5a",
          dark: "#072814",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
