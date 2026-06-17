import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        rsp: {
          bg: "#F7F2EA",
          surface: "#EFE7DC",
          panel: "#FFFFFF",
          "panel-strong": "#F3E8DA",
          border: "#D8C8B8",
          text: "#1E1B18",
          muted: "#6F6258",
          primary: "#B87333",
          "primary-dim": "#D4A574",
          secondary: "#b87333",
          tertiary: "#6b2c2c",
          "on-primary": "#fffaf2",
        },
      },
      fontFamily: {
        heading: ["var(--font-newsreader)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: { glow: "0 22px 70px rgba(184,115,51,0.18)" },
      maxWidth: { container: "1200px" },
    },
  },
  plugins: [],
};
export default config;
