/** @type import('onerepo').TaskConfig */
module.exports = {
	'pre-commit': { parallel: ['$0 lint', '$0 tsc'] },
};
