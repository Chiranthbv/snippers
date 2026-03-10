import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A0F1E",
        secondary: "#0F172A",
        accent: {
          blue: "#6366F1",
          purple: "#8B5CF6",
          teal: "#14B8A6",
        },
        txt: {
          primary: "#F8FAFC",
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "10px",
        badge: "999px",
      },
      maxWidth: {
        container: "1200px",
      },
      animation: {
        "orb-pulse": "orbPulse 4s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
