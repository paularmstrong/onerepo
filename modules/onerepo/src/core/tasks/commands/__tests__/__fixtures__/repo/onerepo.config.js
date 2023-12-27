/** @type import('onerepo').Config */
module.exports = {
	root: true,

	/** @type import('onerepo').graph.TaskConfig */
	tasks: {
		'pre-commit': { parallel: ['$0 lint', '$0 tsc'] },
		'post-commit': { serial: ['echo "post-commit"'] },
		build: { serial: [{ match: '**/foo.json', cmd: 'build' }] },
		deploy: { parallel: ['echo "deployroot"'] },
		'pre-merge': { serial: [['$0 lint', '$0 format']] },
	},
};
