/** @type import('onerepo').Config */
export default {
	tasks: {
		'pre-merge': { serial: [{ cmd: 'echo "pre-merge" "burritos"', meta: { good: 'yes' } }] },
		'pre-deploy': { parallel: ['echo "deployburritos"'] },
	},
};
