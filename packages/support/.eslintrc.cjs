/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ['@pkg/eslint-config/base', '@pkg/eslint-config/react'],
};

module.exports = config;
