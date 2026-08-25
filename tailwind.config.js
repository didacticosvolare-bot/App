/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        salsa: '#4A6741',
        guajillo: '#C1440E',
        nixtamal: '#F7F1E1',
        totopo: '#D4A24C',
        carbon: '#2B2118',
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        worksans: ['Work Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
