const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  //配置 js 全局变量，因为是 uni-app，全局的 uni 是不需要引入的，还有 5+ 的 plus 对象
  globals: {
    uni: 'readonly',
    plus: 'readonly',
    wx: 'readonly',
  },
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', '@vue/prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser', // 使用 @babel/eslint-parser 解析器
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-env'],
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['vue'],
  rules: {
    'vue/multi-word-component-names': 'off', // 关闭 multi-word-component-names 规则
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
});
