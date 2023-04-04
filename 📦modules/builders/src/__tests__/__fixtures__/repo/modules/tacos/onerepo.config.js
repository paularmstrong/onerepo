/** @type import('onerepo').graph.TaskConfig */
module.exports = {
	'post-commit': { sequential: ['echo "post-commit" "tacos"'] },
};
