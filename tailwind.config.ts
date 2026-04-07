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
        background: "#FFFFFF",
        foreground: "#111827",
        card: "#FFFFFF",
        "card-hover": "#F9FAFB",
        border: "#E5E7EB",
        "border-light": "#D1D5DB",
        muted: "#9CA3AF",
        "muted-foreground": "#6B7280",
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
        sans: ["Inter", "Pretendard", "system-ui", "sans-serif"],
        display: ["Inter", "Pretendard", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #7c3aed, #e94560)",
        "gradient-purple": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
        "gradient-card": "linear-gradient(135deg, #FFFFFF, #F9FAFB)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124, 58, 237, 0.1)",
        "glow-pink": "0 0 20px rgba(233, 69, 96, 0.1)",
        card: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
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
