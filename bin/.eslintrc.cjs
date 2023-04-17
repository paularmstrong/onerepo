/** @type {import('eslint').ESLint.Plugin} */
module.exports = {
	rules: {
		'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*'] }],
	},
};
