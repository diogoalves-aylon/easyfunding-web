/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        "theme-bg": "var(--bg-theme)",
        "theme-text": "var(--text-theme)",
        "theme-icon": "var(--icon-theme)",
        "theme-button": "var(--bg-button-theme)",
        "theme-muted": "var(--muted-theme)",
        "theme-border": "var(--border-theme)",
        "theme-surface": "var(--surface-theme)",
        "theme-textSecondary": "var(--text-secondary-theme)",
      },

      borderRadius: {
        ui: "1.25rem",
        "ui-lg": "1.75rem", 
        "ui-xl": "2.5rem",
      },

      boxShadow: {
        "ui-sm": "0 1px 2px rgba(0,0,0,.04), 0 6px 16px rgba(0,0,0,.06)",
        "ui-md": "0 10px 30px rgba(0,0,0,.10)",
        "ui-xl": "0 18px 60px rgba(0,0,0,.18)",
      },

      transitionTimingFunction: {
        ui: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },

      keyframes: {
        uiFadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        uiPop: {
          "0%": { transform: "scale(.98)", opacity: "0.6" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        uiShakeX: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-2px)" },
          "40%": { transform: "translateX(2px)" },
          "60%": { transform: "translateX(-1px)" },
          "80%": { transform: "translateX(1px)" },
        },
      },

      animation: {
        "ui-fade-up": "uiFadeUp .25s ease both",
        "ui-pop": "uiPop .18s ease both",
        "ui-shake-x": "uiShakeX .25s ease both",
      },
    },
  },
  plugins: [],
};
