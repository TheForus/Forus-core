/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bgBlack: "#0b0b0b",
        bgGray: "#181818",
        bgGreen: "#141A18",
        textGreenb: "#06FC99",
        textGreen: "#18c792",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
