/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        'pulse-2s': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
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
