/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["Manrope", "sans-serif"],
      },
      colors: {
        black: {
          400: "#16161e",
          600: "#0b0d11",
          800: "#0b0c10",
        },
        gray: {
          200: "#b9b8bb",
          400: "#3f3f43",
        },
        purple: {
          200: "#45507a",
          600: "#131343",
          500: "#121243",
        },
      },
    },
  },
  plugins: [],
};
