/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const safeListFile = "safelist.txt";

// colors.indigo
const SAFELIST_COLORS = "colors";

module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./safelist.txt"],
  darkMode: "class",
  theme: {
 
    fontFamily: {
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: [
        "ui-serif",
        "Georgia",
        "Cambria",
        '"Times New Roman"',
        "Times",
        "serif",
      ],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        '"Liberation Mono"',
        '"Courier New"',
        "monospace",
      ],
    },
    screens: {
      xs: "576",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.500"),
            maxWidth: "65ch",
          },
        },
        invert: {
          css: {
            color: theme("colors.gray.400"),
          },
        },
      }),
	  colors: {
		offWhite: "#F5F5F5",
		berrylavender: {
		  DEFAULT: "#8A89C0",
		  50: "#ECEBFF",
		  100: "#E0E0F8",
		  200: "#C2C1F0",
		  300: "#A3A3E6",
		  400: "#8584DC",
		  500: "#8A89C0", // Your base color
		  600: "#6E6CA3",
		  700: "#545185",
		  800: "#3A3866",
		  900: "#211F49",
		  light: "#AFAEE7",
		  dark: "#6867A5",
		},
		berryred: {
		  DEFAULT: "#A63446",
		  50: "#FFD1D4",
		  100: "#FFBBC0",
		  200: "#FF8B93",
		  300: "#FF5C66",
		  400: "#F53C49",
		  500: "#A63446", // Your base color
		  600: "#8C2D3B",
		  700: "#72252F",
		  800: "#581D24",
		  900: "#3E1418",
		  light: "#C45B6A",
		  dark: "#80192D",
		},
		berrywhite: "#FBFEF9",
	  },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("./twSafelistGenerator")({
      path: safeListFile,
      patterns: [
        `text-{${SAFELIST_COLORS}}`,
        `bg-{${SAFELIST_COLORS}}`,
        `dark:bg-{${SAFELIST_COLORS}}`,
        `dark:hover:bg-{${SAFELIST_COLORS}}`,
        `dark:active:bg-{${SAFELIST_COLORS}}`,
        `hover:text-{${SAFELIST_COLORS}}`,
        `hover:bg-{${SAFELIST_COLORS}}`,
        `active:bg-{${SAFELIST_COLORS}}`,
        `ring-{${SAFELIST_COLORS}}`,
        `hover:ring-{${SAFELIST_COLORS}}`,
        `focus:ring-{${SAFELIST_COLORS}}`,
        `focus-within:ring-{${SAFELIST_COLORS}}`,
        `border-{${SAFELIST_COLORS}}`,
        `focus:border-{${SAFELIST_COLORS}}`,
        `focus-within:border-{${SAFELIST_COLORS}}`,
        `dark:text-{${SAFELIST_COLORS}}`,
        `dark:hover:text-{${SAFELIST_COLORS}}`,
        `h-{height}`,
        `w-{width}`,
      ],
    }),
    require("@tailwindcss/typography"),
  ],
};
