import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        barlow: ["var(--font-barlow-sans)", "sans-serif"],
      },
      colors: {
        primary: "#B631EE",
        secondary: "#E26EE5",
        background: "#fff",
        black: "#333",
      },
    },
  },
  plugins: [],
} satisfies Config;
