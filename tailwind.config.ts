import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        rsp: {
          bg: "#0b0f1a",
          surface: "#101522",
          panel: "#161b26",
          "panel-strong": "#1e2431",
          border: "#2d3343",
          text: "#f1eadf",
          muted: "#a9adba",
          primary: "#5b8cff",
          "primary-dim": "#b2c5ff",
          secondary: "#b87333",
          tertiary: "#6b2c2c",
          "on-primary": "#ffffff",
        },
      },
      fontFamily: {
        heading: ["var(--font-libre-caslon)", "Georgia", "serif"],
        body: ["var(--font-hanken-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: { glow: "0 0 60px rgba(71,220,198,0.18)" },
      maxWidth: { container: "1200px" },
    },
  },
  plugins: [],
};
export default config;
