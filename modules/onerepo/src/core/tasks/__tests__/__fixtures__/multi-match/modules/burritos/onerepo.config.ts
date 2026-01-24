/** @type import('onerepo').Config */
export default {
	tasks: {
		'pre-merge': { serial: [{ cmd: 'echo "pre-merge" "burritos"', match: ['asdf', '../tacos/foo'] }] },
	},
};
