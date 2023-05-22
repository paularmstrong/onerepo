/** @type import('onerepo').graph.TaskConfig */
export default {
	'pre-commit': {
		serial: [['$0 lint --add', '$0 format --add'], '$0 tsc'],
		parallel: [{ match: '**/package.json', cmd: '$0 graph verify' }],
	},
	'pre-merge': {
		serial: [
			['$0 lint --all --no-fix', '$0 format --check'],
			'$0 test --affected -w ${workspaces} -- --passWithNoTests',
			'$0 tsc',
			'$0 build',
		],
		parallel: [{ match: '**/package.json', cmd: '$0 graph verify' }],
	},
	'post-checkout': {
		serial: ['yarn'],
	},
	build: {
		serial: ['$0 build -w ${workspaces}'],
	},
};
