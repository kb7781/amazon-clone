/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        amazon: {
          DEFAULT: "#FF9900",
          dark: "#131921",
          light: "#232F3E",
          blue: "#37475A",
          yellow: "#FEBD69",
          green: "#007600",
          hover: "#F08804",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        skeleton: "skeleton 1.5s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-in-out",
      },
      keyframes: {
        skeleton: {
          "0%, 100%": { backgroundColor: "#e0e0e0" },
          "50%": { backgroundColor: "#c8c8c8" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(-8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(-10px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
