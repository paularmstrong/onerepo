/** @type import('onerepo').Config */
module.exports = {
	tasks: {
		'pre-commit': { parallel: ['$0 lint', '$0 tsc'] },
		commit: { serial: ['echo "commit"'] },
		'post-commit': { serial: ['echo "post-commit"'] },
		build: { serial: [{ match: '**/foo.json', cmd: 'build' }] },
		deploy: { parallel: ['echo "deployroot"'] },
	},
};
