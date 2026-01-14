/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midnight': {
          900: '#1a1a2e',
          800: '#16213e',
          700: '#1f1f3a',
        },
        'cosmic': {
          purple: '#9d4edd',
          blue: '#00b4d8',
          pink: '#ff006e',
        }
      },
      fontFamily: {
        'friendly': ['Comic Sans MS', 'Arial Rounded MT Bold', 'Trebuchet MS', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
