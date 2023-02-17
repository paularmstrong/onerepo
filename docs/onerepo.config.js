/** @type import('@onerepo/graph').TaskConfig */
export default {
	'pre-commit': {
		sequential: [{ match: '**/*.{astro}', cmd: '$0 ws docs astro -- check' }],
	},
	'pre-merge': {
		sequential: [{ match: '**/*.{astro}', cmd: '$0 ws docs astro -- check' }],
	},
	build: {
		sequential: ['$0 ws docs astro -- build'],
	},
};
