/** @type import('@onerepo/graph').TaskConfig<'pre-commit' | 'pull-request'> */
export default {
	'pre-commit': {
		sequential: [{ match: '**/*.{astro}', cmd: '$0 ws docs astro -- check' }],
	},
	'pull-request': {
		sequential: [{ match: '**/*.{astro}', cmd: '$0 ws docs astro -- check' }],
	},
};
