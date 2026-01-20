/** @type import('onerepo').Config */
export default {
	tasks: {
		'pre-commit': { parallel: ['$0 lint', '$0 tsc'] },
	},
};
