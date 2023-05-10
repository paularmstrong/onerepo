/* eslint-env node */
/** @type import('onerepo').graph.TaskConfig */
module.exports = {
	build: { serial: ['echo "build" "tacos"'] },
};
