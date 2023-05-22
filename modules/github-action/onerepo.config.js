/** @type import('onerepo').graph.TaskConfig */
export default {
	'pre-commit': {
		parallel: ['$0 ws github-action build'],
	},
	build: {
		parallel: ['$0 ws github-action build'],
	},
};
