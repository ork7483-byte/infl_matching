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
        background: "#0a0a0f",
        foreground: "#e4e4e7",
        card: "#1a1a2e",
        "card-hover": "#252542",
        border: "#2a2a3e",
        "border-light": "#3a3a4e",
        muted: "#71717a",
        "muted-foreground": "#a1a1aa",
        brand: {
          purple: "#7c3aed",
          "purple-light": "#8b5cf6",
          "purple-dark": "#6d28d9",
          pink: "#e94560",
          "pink-light": "#f06292",
          "pink-dark": "#d63384",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ["Pretendard", "Satoshi", "system-ui", "sans-serif"],
        display: ["Satoshi", "Pretendard", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #7c3aed, #e94560)",
        "gradient-purple": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
        "gradient-card": "linear-gradient(135deg, #1a1a2e, #252542)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124, 58, 237, 0.15)",
        "glow-pink": "0 0 20px rgba(233, 69, 96, 0.15)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "count-up": "countUp 2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
