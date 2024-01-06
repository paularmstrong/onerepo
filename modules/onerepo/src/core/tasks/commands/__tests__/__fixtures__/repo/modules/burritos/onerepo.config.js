/** @type import('onerepo').Config */
module.exports = {
	tasks: {
		'pre-merge': { serial: [{ cmd: 'echo "pre-merge" "burritos"', meta: { good: 'yes' } }] },
		deploy: { parallel: ['echo "deployburritos"'] },
	},
};
