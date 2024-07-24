module.exports = {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-order'],
  rules: {
    'color-hex-length': 'long',
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-alphabetical-order': true,
  },
  ignoreFiles: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
};
