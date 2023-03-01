/** @type import('@onerepo/graph').TaskConfig */
export default {
	'pre-commit': {
		sequential: [{ match: '**/*.{astro}', cmd: '$0 ws docs astro -- check' }],
		parallel: [{ match: '../modules/*/src/**/*.ts', cmd: '$0 ws docs typedoc --add' }],
	},
	'pre-merge': {
		sequential: [{ match: '**/*.{astro}', cmd: '$0 ws docs astro -- check' }],
	},
	build: {
		sequential: ['$0 ws docs astro -- build'],
	},
};
