/** @type import('onerepo').Config */
module.exports = {
	root: true,

	/** @type import('onerepo').graph.TaskConfig */
	tasks: {
		'pre-commit': { parallel: ['$0 lint', '$0 tsc'] },
	},
};
