/** @type import('onerepo').Config */
module.exports = {
	tasks: {
		'post-commit': { serial: ['echo "post-commit" "tacos"'] },
		publish: { parallel: [{ cmd: 'publish tacos', match: '../burritos/**/*' }] },
		deploy: { parallel: ['echo "deploytacos"'] },
	},
};
