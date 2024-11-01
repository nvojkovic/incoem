const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  tooltip: {
    target: "",
  },
  theme: {
    extend: {
      transitionProperty: {
        maxHeight: "max-height",
      },
      colors: {
        "main-orange": "var(--primary-color)",
        "main-orange-light": "rgba(var(--primary-color-segment),0.1)",
      },
    },
    colors: {
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
