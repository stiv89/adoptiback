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
          DEFAULT: "#F47A5A",
          50: "#FFF3EF",
          100: "#FFE5DD",
          200: "#FECFC1",
          300: "#FEB199",
          400: "#FD8E6F",
          500: "#F47A5A",
          600: "#E35F3E",
          700: "#BC4A31",
          800: "#953B2A",
          900: "#783326",
        },
      },
    },
  },
  plugins: [],
};

export default config;


