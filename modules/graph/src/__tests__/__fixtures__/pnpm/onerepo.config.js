/** @type import('onerepo').Config */
module.exports = {
	root: true,
	tasks: {
		'pre-commit': { parallel: ['$0 lint', '$0 tsc'] },
	},
};
