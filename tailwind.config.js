/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
        colors: {
            'primary': '#2DABB1',
            'secondary': {
              100: '#E2E2D5',
              200: '#888883'
            },
        },
        fontFamily: {
        }
    },
  },
  plugins: [],
}

