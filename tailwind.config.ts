import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        sparkle: {
          '0%': { 
            transform: 'translate(var(--tx), var(--ty)) scale(0)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translate(var(--tx), calc(var(--ty) - 100px)) scale(1)',
            opacity: '0'
          }
        }
      },
      animation: {
        'sparkle': 'sparkle 1s ease-out forwards'
      }
    },
  },
  plugins: [],
};
export default config;
