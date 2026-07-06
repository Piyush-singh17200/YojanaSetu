/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B2545",       // Premium Deep Navy / Ashoka Blue
        primaryDark: "#134074",   // Deep Blue
        primaryTint: "#EEF4F8",   // Ice Blue / Soft Slate Tint
        secondary: "#F57C00",     // Warm Saffron Gold
        secondaryTint: "#FFF3E0", // Soft Saffron Tint
        accent: "#15803D",        // Emerald Green (Tricolor Accent)
        accentTint: "#DCFCE7",    // Soft Emerald Tint
        bg: "#F8FAFC",            // Clean Canvas Background
        success: "#15803D",
        warning: "#EAB308",
        danger: "#DC2626",
        ink: "#0F172A",           // Deep Slate Ink
        sub: "#475569",           // Muted Sub-text
        line: "#E2E8F0",          // Subtle Divider Border
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
