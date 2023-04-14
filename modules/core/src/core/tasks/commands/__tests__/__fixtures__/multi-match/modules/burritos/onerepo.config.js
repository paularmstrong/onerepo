/** @type import('onerepo').graph.TaskConfig */
module.exports = {
	'pre-merge': { sequential: [{ cmd: 'echo "pre-merge" "burritos"', match: ['asdf', '../tacos/foo'] }] },
};
