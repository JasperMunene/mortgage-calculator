/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          lime: 'hsl(61, 70%, 52%)',
          red: 'hsl(4, 69%, 50%)',
        },
        neutral: {
          white: 'hsl(0, 0%, 100%)',
          slate100: 'hsl(202, 86%, 94%)',
          slate300: 'hsl(203, 41%, 72%)',
          slate500: 'hsl(200, 26%, 54%)',
          slate700: 'hsl(200, 24%, 40%)',
          slate900: 'hsl(202, 55%, 16%)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        paragraph: '16px',
      },
    },
  },
  plugins: [],
}
