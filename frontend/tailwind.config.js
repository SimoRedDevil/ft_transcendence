/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,js,tsx,jsx}",
    "./components/**/*.{ts,js,tsx,jsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile': '320px',
        'xs': '400px',
        'ls': '500px',
        'lm': '900px',
        '3xl': '1800px',
        '4xl': '2000px'
      },
      backgroundImage: {
        'main-bg': "url('/images/Main-Background.png')",
      },
    },
  },
  plugins: [],
}

