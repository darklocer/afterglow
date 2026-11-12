/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: '#3B0D18',
        wine: '#5A1625',
        burgundy: '#7A2638',
        rosewood: '#9B5361',
        cream: '#F8F1E5',
        ivory: '#FFF9EF',
        gold: '#C9A96E',
        ink: '#24171A',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(59,13,24,.06), 0 12px 32px -12px rgba(59,13,24,.22)',
        lift: '0 2px 4px rgba(59,13,24,.08), 0 24px 48px -16px rgba(59,13,24,.34)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(.22,.7,.2,1)',
      },
    },
  },
  plugins: [],
};
