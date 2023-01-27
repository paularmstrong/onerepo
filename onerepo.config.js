/** @type import('@onerepo/graph').TaskConfig<'pre-commit' | 'pull-request'> */
export default {
	'pre-commit': {
		sequential: [{ match: '**/*.{ts,tsx,js,jsx}', cmd: '$0 lint --add' }, '$0 format --add'],
		parallel: [{ match: '**/commands/**/*.ts', cmd: '$0 docgen --add' }],
	},
	'pull-request': {
		sequential: ['$0 lint --all', '$0 format --check', '$0 test', '$0 build'],
	},
};
