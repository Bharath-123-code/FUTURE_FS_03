/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF8C00',
        dark: '#1A1A1A',
        cream: '#F9F7F2',
        'deep-charcoal': '#1A1A1A',
        'soft-gold': '#D4AF37',
        'off-white': '#F5F5F5',
        'navy-blue': '#1D2D44',
        'sage-green': '#8A9A5B',
        'terracotta': '#E2725B',
      },
      fontFamily: {
        'serif-bold': ['Georgia', 'serif'],
        'serif': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.decorative-underline': {
          'position': 'relative',
          '&::after': {
            'content': '""',
            'position': 'absolute',
            'bottom': '-8px',
            'left': '0',
            'width': '60px',
            'height': '2px',
            'background-color': '#D4AF37',
          },
        },
      });
    },
  ],
}
