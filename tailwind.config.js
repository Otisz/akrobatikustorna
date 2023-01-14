/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          primary: "#e27e2f",
          accent: "#c5651b",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
