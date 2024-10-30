/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,js,tsx,jsx}",
    "./components/**/*.{ts,js,tsx,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deepSeaBlue': '#0B4464',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' }, 
          '100%': { transform: 'translateX(0)', opacity: '1' },   
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' }, 
          '100%': { transform: 'translateX(0)', opacity: '1' },   
        },
      },
      animation: {
        'slide-in-left': 'slideInLeft 1s ease forwards',
        'slide-in-right': 'slideInRight 1s ease forwards',
      },
      screens: {
        'mobile': '360px',
        'less-than-tablet': { 'max': '640px' },
        'less-than-mobile': { 'max': '360px' },
        'tablet': '640px',
        'laptop': '1025px',
        'desktop': '1280px',
        'xs': '400px',
        'ls': '500px',
        'lm': '900px',
        '3xl': '1800px',
        '4xl': '2000px'
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


