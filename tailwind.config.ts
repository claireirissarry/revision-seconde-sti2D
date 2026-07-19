import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivoire: {
          DEFAULT: "#FAF6EF",
          soft: "#F3ECDF",
        },
        maths: {
          DEFAULT: "#4A7BC9",
          light: "#DCE6F7",
          dark: "#2E4F87",
        },
        physique: {
          DEFAULT: "#4FA383",
          light: "#DCF0E7",
          dark: "#2F7259",
        },
        arcenciel: {
          corail: "#FF7F6B",
          orange: "#FFB25B",
          miel: "#FFD966",
          menthe: "#7CD9B0",
          ciel: "#6FB8F0",
          lavande: "#B29CE8",
        },
        ink: "#2E2A24",
      },
      fontFamily: {
        lisible: ["Lexend", "sans-serif"],
        dys: ["OpenDyslexic", "sans-serif"],
        titre: ["Baloo 2", "Lexend", "sans-serif"],
      },
      lineHeight: {
        dys: "1.7",
      },
      letterSpacing: {
        dys: "0.03em",
      },
      backgroundImage: {
        "degrade-arcenciel":
          "linear-gradient(90deg, #FF7F6B, #FFB25B, #FFD966, #7CD9B0, #6FB8F0, #B29CE8)",
      },
    },
  },
  plugins: [],
} satisfies Config;
