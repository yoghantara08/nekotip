import plugin from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities }) {
      addBase({});
      addComponents({});
      addUtilities({});
    }),
  ],
  theme: {
    extend: {
      screens: {
        xs: "460px",
        xxl: "1920px",
      },
    },
  },
};
