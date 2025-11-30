/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a', // Dark theme base
        secondary: '#f5f5f5', // Light text
        accent: '#e63946', // Example accent color, adjust based on preference
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Figtree"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
