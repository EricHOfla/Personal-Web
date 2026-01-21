/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        sm: "375px",
        sml: "500px",
        md: "667px",
        mdl: "768px",
        lg: "960px",
        lgl: "1024px",
        xl: "1280px",
      },
      fontFamily: {
        bodyfont: ["Poppins", "sans-serif"],
        titleFont: ["Montserrat", "sans-serif"],
      },
      colors: {
        bodyColor: "#191919",
        textColor: "rgba(255, 255, 255, 0.85)",
        designColor: "#8b5cf6",
        titleRoundBg:
          "linear-gradient(135deg,rgba(120,204,109,.15) 0%,rgba(120,204,109,1%) 100%)",
        surface: "rgba(24,24,27,0.7)",
        ink: "#e5e7eb",
      },
      animation: {
        "spin-slow": "spin 60s linear infinite",
        "reverse-spin": "reverse-spin 60s linear infinite",
      },
      keyframes: {
        "reverse-spin": {
          from: {
            transform: "rotate(360deg)",
          },
        },
      },
      boxShadow: {
        greenShadow: "0px 0px 188px -14px rgba(237,255,32,1)",
        testShwdow: "11px 0px 13px -15px rgba(0,0,0,1)",
        glow: "0 10px 40px -12px rgba(139,92,246,0.35)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("@tailwindcss/line-clamp"),
  ],
};
