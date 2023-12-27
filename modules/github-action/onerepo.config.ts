import type { Config } from 'onerepo';

export default {
	tasks: {
		'pre-commit': {
			parallel: [{ cmd: '$0 ws github-action build', match: 'src/**/*' }],
		},
		build: {
			parallel: ['$0 ws github-action build'],
		},
	},
} satisfies Config;
