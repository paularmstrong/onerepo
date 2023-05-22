/** @type import('onerepo').graph.TaskConfig */
export default {
	'pre-commit': {
		serial: [{ match: '**/*.{astro}', cmd: '$0 ws docs astro -- check' }],
	},
	'pre-merge': {
		serial: [{ match: '**/*.{astro}', cmd: '$0 ws docs astro -- check' }],
	},
	build: {
		serial: ['$0 ws docs astro -- build'],
	},
};
