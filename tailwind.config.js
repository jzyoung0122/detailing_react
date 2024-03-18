/** @type {import('tailwindcss').Config} */
module.exports = {
  important:true,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
    "node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing:{
        '128': '32rem',
        '144': '36rem',
      }
    },
  },
  plugins: [require('flowbite/plugin')],
}

