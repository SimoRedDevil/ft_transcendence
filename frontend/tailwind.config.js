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
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      },
      backgroundImage: {
        'main-bg': "url('/images/Main-Background.png')",
        'hover-bg' : "url(/images/cup.png)",
        'custom-gradient': 'linear-gradient(180deg, rgba(26, 31, 38, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)',
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


