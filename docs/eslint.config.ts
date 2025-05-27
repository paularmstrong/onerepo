import tseslint from 'typescript-eslint';
import pluginAstro from 'eslint-plugin-astro';

export default tseslint.config({
	ignores: ['.astro/**'],
	extends: [...pluginAstro.configs.recommended],
	rules: {
		'import/no-unresolved': ['error', { ignore: ['astro:*'] }],
	},
});
