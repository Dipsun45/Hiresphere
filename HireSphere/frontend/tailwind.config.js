/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F4FAFF",
          100: "#DCEEFF",
          200: "#BFE3FF",
          300: "#8FB4D6",
          400: "#1D8FE0",
          500: "#155DC1",
          600: "#0B3D91",
          900: "#0F2A47",
        },
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};