module.exports = {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  plugins: ['stylelint-order'],
  rules: {
    'color-hex-length': 'long',
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-alphabetical-order': true,
  },
};
