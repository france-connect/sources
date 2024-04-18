module.exports = {
  rules: {
    'lines-between-class-members': 0,
    'max-len': 0,
    'multiline-ternary': 0,
    'padding-line-between-statements': 0,
    'rest-spread-spacing': 0,
    semi: 0,
    'semi-spacing': 0,
    'semi-style': 0,
    'space-before-function-paren': 0,
    'space-in-parens': 0,
    'space-unary-ops': 0,
    'switch-colon-spacing': 0,
    'spaced-comment': [
      2,
      'always',
      {
        block: {
          balanced: true,
          exceptions: ['-', '+'],
          markers: ['=', '!', ':', '::'],
        },
        line: {
          exceptions: ['-', '+'],
          markers: ['=', '!', '/'],
        },
      },
    ],
    'wrap-iife': 0,
    'yield-star-spacing': 0,
  },
};
