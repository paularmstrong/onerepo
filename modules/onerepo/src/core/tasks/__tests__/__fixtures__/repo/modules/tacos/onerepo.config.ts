/** @type import('onerepo').Config */
export default {
	tasks: {
		'post-commit': { serial: ['echo "post-commit" "tacos"'] },
		'pre-publish': { parallel: [{ cmd: 'publish tacos', match: '../burritos/**/*' }] },
		'pre-deploy': { parallel: ['echo "deploytacos"'] },
	},
};
