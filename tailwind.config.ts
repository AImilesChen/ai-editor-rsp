import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        rsp: {
          bg: "#0c0e13",
          surface: "#11131a",
          panel: "#161921",
          "panel-strong": "#1c2028",
          border: "#444853",
          text: "#e2e5f3",
          muted: "#a7abb8",
          primary: "#47dcc6",
          "primary-dim": "#32ceb8",
          secondary: "#f8bc63",
          tertiary: "#a1b2ff",
          "on-primary": "#004940",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: { glow: "0 0 60px rgba(71,220,198,0.18)" },
      maxWidth: { container: "1200px" },
    },
  },
  plugins: [],
};
export default config;
