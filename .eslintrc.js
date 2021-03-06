// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'indent': 0,
    'space-before-function-paren': 0,
    // 允许在return语句中使用赋值操作
    'no-return-assign': 0,
    'spaced-comment': 0,
    'no-trailing-spaces': 0,
    'space-before-blocks': 0,
    'comma-spacing': 0,
    'semi': 0,
    'no-unused-vars': 0,
    'no-new': 0,
    'brace-style': 0,
    'operator-linebreak': 0,
    'object-property-newline': 0
  }
}
