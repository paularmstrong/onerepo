/** @type import('onerepo').Config */
module.exports = {
	tasks: {
		'pre-merge': { serial: [{ cmd: 'echo "pre-merge" "burritos"', match: ['asdf', '../tacos/foo'] }] },
	},
};
