module.exports = {
  content: ['**/*.tsx'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'toast-show': 'show-y 1s ease-in-out',
        'toast-hide': 'hide-x 1s ease-in-out',
      },
      keyframes: {
        'show-y': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'hide-x': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
