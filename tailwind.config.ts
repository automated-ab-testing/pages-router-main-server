import { type Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
  // NOTE: Jangan lupa safelist ditambahkan sesuai dengan style yang terdapat di database
  safelist: ["bg-purple-500", "bg-red-500"],
} satisfies Config;
