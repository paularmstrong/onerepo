/** @type import('onerepo').TaskConfig */
export default {
	'pre-commit': {
		parallel: [{ match: 'src/core/**/*', cmd: '$0 ws core docgen --add' }],
	},
};
