/** @type import('onerepo').graph.TaskConfig */
export default {
	'pre-commit': {
		sequential: [{ match: '**/*.{ts,tsx,js,jsx,astro}', cmd: '$0 lint --add' }, '$0 format --add', '$0 tsc'],
		parallel: [{ match: '**/package.json', cmd: '$0 graph verify' }],
	},
	'pre-merge': {
		sequential: ['$0 lint --all --no-fix', '$0 format --check', '$0 test --affected', '$0 tsc', '$0 build'],
		parallel: [{ match: '**/package.json', cmd: '$0 graph verify' }],
	},
	'post-checkout': {
		sequential: ['yarn'],
	},
	build: {
		sequential: ['$0 build -w ${workspaces}'],
	},
};
