/** @type import('onerepo').graph.TaskConfig */
module.exports = {
	'post-commit': { serial: ['echo "post-commit" "tacos"'] },
	publish: { parallel: [{ cmd: 'publish tacos', match: '../burritos/**/*' }] },
	deploy: { parallel: ['echo "deploytacos"'] },
};
