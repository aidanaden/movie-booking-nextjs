module.exports = {
  mode: 'jit',
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      moderat: 'Moderat, sans-serif',
      moderat_extended: 'Moderat Extended, sans-serif'
    },
    extend: {
      colors: {
        'gv-yellow': '#FFD701',
        'shaw-red': '#A50709',
        'cathay-pink': '#CD0057',
        'woodsmoke': {
          '50': '#fafafa',
          '100': '#f5f4f4',
          '200': '#e8e3e3',
          '300': '#dad2d2',
          '400': '#ae9d9d',
          '500': '#7e6d6d',
          '600': '#5f4e4e',
          '700': '#493c3c',
          '800': '#2b2626',
          '900': '#101014',
        },
      },
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
      }
    },
  },
  variants: {
    lineClamp: ['responsive'],
    scrollbar: ['rounded'],
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography')
  ],
}
