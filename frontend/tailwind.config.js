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
        'less-than-tablet': { 'max': '640px' },
        'less-than-mobile': { 'max': '360px' },
        'tablet': '640px',
        'laptop': '1025px',
        'desktop': '1280px',
      },
      backgroundImage: {
        'main-bg': "url('/images/Main-Background.png')",
      },
      borderRadius: {
        'custom-Radius': '10px 20px 10px 20px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

