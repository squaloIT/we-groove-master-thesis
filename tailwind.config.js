module.exports = {
  mode: 'jit',
  purge: [
    './templates/views/*',
    "./dist/*.js"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'brand-purple': '#433e90',
        'brand-blue': '#326ada',
        'brand-light-gray': '#d2d2d2',
        'brand-gray': '#d4d8d4',
        'brand-dark-gray': '#a19c9c',
        'brand-purple-hover': '#3c3781',
        'like-button-red': '#e0245e',
        'like-button-red-background': 'rgba(224, 36, 94, 0.1)',
        'comment-button-blue': 'rgb(29, 161, 242)',
        'comment-button-blue-background': 'rgba(29, 161, 242, 0.1)',
        'retweet-button-green': 'rgb(23, 191, 99)',
        'retweet-button-green-background': 'rgba(23, 191, 99, 0.1)',
        'light-gray-for-text': '#858d94',
        'mid-gray-for-text': '#5b7083',
        'dark-gray-for-text': '#1c1d1d',
        'super-light-gray-border': 'rgb(235, 238, 240)'
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        ubuntu: ['Ubuntu', 'monospace'],
        lobster: ['Lobster', 'cursive'],
      },
      animation: {
        blob: 'blob 6s infinite'
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)"
          },
          "33%": {
            transform: "translate(-30px, 20px) scale(1.1)"
          },
          "66%": {
            transform: "translate(30px, -30px) scale(0.9)"
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)"
          }
        }
      }
    },
    screens: {
      'xs': { 'min': '400px' },
      'sm': { 'min': '640px' },
      'md': { 'min': '768px' },
      'lg': { 'min': '1024px' },
      'xl': { 'min': '1280px' },
      '2xl': { 'min': '1536px' },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
