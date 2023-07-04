/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	plugins: ['@internal/eslint-plugin'],
	extends: ['plugin:@internal/eslint-plugin/base'],
};
