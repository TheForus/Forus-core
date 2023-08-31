/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bgBlack: "#080808",
        bgGray: "#CDD4DC",
        bgGreen: "#141A18",
        textGreenb: "#06FC99",
        textGreen: "#18c792",
        highlight: "#5AD8CC",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")]
};
