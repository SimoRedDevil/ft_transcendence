/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,js,tsx,jsx}",
    "./components/**/*.{ts,js,tsx,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Bebas': ['Nabla', 'system-ui'], // Custom font family
        'loby': ['Faculty Glyphic', 'sans-serif'], // Custom font family
      },
      animation: {
        'scale-down': 'scaleDown 0.5s ease-in-out forwards',
      },
      keyframes: {
        scaleDown: {
          '0%': { transform: 'scale(2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      colors: {
        'deepSeaBlue': '#0B4464',
        'paddlefill': '#00A88C',
        'paddlestroke': '#58FFE3',
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
        // 'mobile': '360px',
        // 'less-than-tablet': { 'max': '640px' },
        // 'less-than-mobile': { 'max': '360px' },
        // 'tablet': '640px',
        // 'laptop': '1025px',
        // 'desktop': '1280px',
        'xs': '320px',
        'ls': '500px',
        'lm': '900px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1800px',
        '4xl': '2000px',
      },
      backgroundImage: {
        'main-bg': "url('/images/Main-Background.png')",
        'hover-bg' : "url(/images/cup.png)",
        'custom-gradient': 'linear-gradient(180deg, rgba(26, 31, 38, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)',
      },
      borderRadius: {
        'custom-Radius': '10px 20px 10px 20px',
        'sidebar_lg':'0px 30px 30px 00px;'
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}


