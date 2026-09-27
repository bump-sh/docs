module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009'
      },
      stage: 2,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        // Native in every targeted browser: no polyfill that would rewrite selectors
        'cascade-layers': false,
        'color-mix': false
      },
    },
    'cssnano': {
      preset: 'default'
    }
  }
}
