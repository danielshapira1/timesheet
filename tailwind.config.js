/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Blue 500
          dark: '#60A5FA',    // Blue 400
        },
        secondary: {
          DEFAULT: '#10B981', // Emerald 500
          dark: '#34D399',    // Emerald 400
        }
      }
    },
  },
  plugins: [],
}
