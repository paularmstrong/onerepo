/** @type import('onerepo').Config */
export default {
	root: true,
	tasks: {
		'pre-commit': { parallel: ['$0 lint', '$0 tsc'] },
	},
};
