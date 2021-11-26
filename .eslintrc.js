module.exports = {
  extends: ['alloy', 'alloy/react', 'alloy/typescript', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    // myGlobal: false

    DOMAIN: false,
    NODE_ENV: false,

    HT_ATTENDANCE_MOCK_DATA: false,

    bootstrap: false,
  },
  rules: {
    // 自定义你的规则
    '@typescript-eslint/no-parameter-properties': ['off'],

    // 使用 solid-js 不需要
    'react/jsx-key': ['off'],
  },
};
