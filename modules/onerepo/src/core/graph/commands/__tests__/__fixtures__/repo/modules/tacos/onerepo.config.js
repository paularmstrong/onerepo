/** @type import('onerepo').graph.TaskConfig */
module.exports = {
	'post-commit': { serial: ['echo "post-commit" "tacos"'] },
};
