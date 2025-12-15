import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#f97316",
          50: "#fff5eb",
          100: "#ffe8d1",
          200: "#ffd0a3",
          300: "#ffb06d",
          400: "#ff8b35",
          500: "#f97316",
          600: "#dd5c0d",
          700: "#b5440d",
          800: "#8f3611",
          900: "#753013",
        },
      },
    },
  },
  plugins: [],
};

export default config;


