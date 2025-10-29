/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#FFC107',
        'brand-blue': '#0D47A1',
        'neutral-950': '#0C1117',
        'neutral-800': '#1C2734',
        'neutral-300': '#D1D5DB',
      }
    },
  },
  plugins: [],
}