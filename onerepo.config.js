/** @type import('@onerepo/graph').TaskConfig<'pre-commit' | 'pull-request' | 'post-checkout'> */
export default {
	'pre-commit': {
		sequential: [{ match: '**/*.{ts,tsx,js,jsx}', cmd: '$0 lint --add' }, '$0 format --add', '$0 tsc'],
		parallel: [
			{ match: '**/commands/**/*.ts', cmd: '$0 docgen --add' },
			{ match: '**/package.json', cmd: '$0 graph verify' },
			{ match: 'plugins/*/src/**/*', cmd: '$0 docgen-internal --add' },
		],
	},
	'pull-request': {
		sequential: ['$0 lint --all --no-fix', '$0 format --check', '$0 test', '$0 tsc', '$0 build'],
		parallel: [{ match: '**/package.json', cmd: '$0 graph verify' }],
	},
	'post-checkout': {
		sequential: ['yarn'],
	},
};
