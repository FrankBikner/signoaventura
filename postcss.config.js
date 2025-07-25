module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(),  // 👈 este es el nuevo plugin
    require('autoprefixer')
  ]
}
