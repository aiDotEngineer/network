/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: [
    '@pkg/eslint-config/base',
    '@pkg/eslint-config/nextjs',
    '@pkg/eslint-config/react',
  ],
  rules: {
    // TODO: Re-enable the following rules and fix the corresponding code
    curly: 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'import/consistent-type-specifier-style': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/no-redundant-roles': 'off',
    'no-useless-escape': 'off',
    'react/jsx-no-target-blank': 'off',
    'react/no-unknown-property': 'off',
    // TODO: Consider turning on the following rules in project-wide config
    '@typescript-eslint/no-misused-promises': 'warn',
  },
};

module.exports = config;
