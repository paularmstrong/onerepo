import type { Config } from 'onerepo';

export default {
	tasks: {
		'pre-commit': {
			serial: [
				{ match: '**/*.{astro}', cmd: '$0 ws docs astro -- check' },
				{ match: '../modules/**/*.ts', cmd: '$0 ws docs typedoc --add' },
				{ match: '../**/*', cmd: '$0 ws docs collect-content -w ${workspaces} --add' },
				{ match: '../**/CHANGELOG.md', cmd: '$0 ws docs pull-changelogs --add' },
			],
		},
		'pre-merge': {
			serial: [{ match: '**/*.{astro}', cmd: '$0 ws docs astro -- check' }],
		},
		build: {
			serial: ['$0 ws docs astro -- build'],
		},
	},
} satisfies Config;
