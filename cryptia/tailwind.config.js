/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primarybg: "#c9e3ff", // main background
        primarydark: "#003D80", // primary text color for header ie(exchange xdc)
        sectionheader: "#D7E4EB", // section headers
        bodytext: "#111835", // main body text
        faqbg: "#C8E2FE", // faq section background
        // bgGreen: "#141A18",
        // textGreenb: "#06FC99",
        // textGreen: "#18c792",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
