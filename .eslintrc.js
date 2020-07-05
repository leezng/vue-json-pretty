// http://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: [
    'plugin:vue/recommended'
  ],
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
