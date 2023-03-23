module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // 使用来自 React 17 的新 JSX 转换，请扩展react/jsx-runtime 到 eslint 配置
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'prettier', '@typescript-eslint'],
  /**
   * 0或off 表示关闭规则
   * warn或1 表示打开规则作为警告 （不会中断代码）
   * error或2 表示打开规则作为错误抛出（会中断代码）
   */
  rules: {
    'no-undef': 0,
    'no-console': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': 0,
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
    'consistent-return': 0,
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/button-has-type': 0,
    'react/no-array-index-key': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'react/prop-types': 0, // TS不需要props验证
    eqeqeq: 2,
    'global-require': 0,
    'react/self-closing-comp': 0,
    'axe/forms': 0,
    'react/require-default-props': 0,
    'import/prefer-default-export': 0,
    '@typescript-eslint/no-var-requires': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-danger': 0,
  },
};
