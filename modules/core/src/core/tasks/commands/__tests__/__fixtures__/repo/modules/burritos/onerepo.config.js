/** @type import('onerepo').graph.TaskConfig */
module.exports = {
	'pre-merge': { serial: [{ cmd: 'echo "pre-merge" "burritos"', meta: { good: 'yes' } }] },
	deploy: { parallel: ['echo "deployburritos"'] },
};
