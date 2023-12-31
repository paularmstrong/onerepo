/** @type import('onerepo').graph.TaskConfig */
module.exports = {
	'pre-merge': { serial: [{ cmd: 'echo "pre-merge" "burritos"', match: ['asdf', '../tacos/foo'] }] },
};
