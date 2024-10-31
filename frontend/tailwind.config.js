/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,js,tsx,jsx}",
    "./components/**/*.{ts,js,tsx,jsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '2000px'
      },
      backgroundImage: {
        'main-bg': "url('/images/Main-Background.png')",
        'hover-bg' : "url(/images/cup.png)",
        'custom-gradient': 'linear-gradient(180deg, rgba(26, 31, 38, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)',
      },
    },
  },
  plugins: [],
}

