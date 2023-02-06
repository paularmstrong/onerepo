/** @type import('@onerepo/graph').TaskConfig<'pre-commit' | 'pull-request'> */
module.exports = {
	'pre-commit': { parallel: ['$0 lint', '$0 tsc'] },
};
