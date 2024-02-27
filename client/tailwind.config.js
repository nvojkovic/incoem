const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      transitionProperty: {
        maxHeight: "max-height",
      },
    },
    colors: {
      "main-orange": "#FF7957",
      ...colors,
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant("fullscreen", "&:fullscreen");
    },
    require("flowbite/plugin"),
  ],
};
