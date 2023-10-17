/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "pulse-2s": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
  plugins: [require("tailwind-scrollbar")],
};
