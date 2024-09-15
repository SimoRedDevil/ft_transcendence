/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,js,tsx,jsx}",
    "./components/**/*.{ts,js,tsx,jsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile': '360px',
        'tablet': '601px',
        'laptop': '1025px'
      },
      backgroundImage: {
        'main-bg': "url('/images/Main-Background.png')",
      },
    },
  },
  plugins: [],
}

