module.exports = {
  plugins: [
    'postcss-preset-env',
    require('tailwindcss'),
    // require('@tailwindcss/jit'),
    require('cssnano')({
      preset: 'default',
    }),
    require('autoprefixer'),
  ]
}