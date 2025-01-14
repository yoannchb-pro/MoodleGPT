module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  ignorePatterns: ['node_modules/'],
  overrides: [
    {
      files: ['extension/popup/*.js', 'src/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-constant-condition': 'off'
      }
    }
  ]
};
