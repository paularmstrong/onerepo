/** @type import('onerepo').graph.TaskConfig */
module.exports = {
	'pre-commit': { parallel: ['$0 lint', '$0 tsc'] },
	commit: { sequential: ['echo "commit"'] },
	'post-commit': { sequential: ['echo "post-commit"'] },
};
