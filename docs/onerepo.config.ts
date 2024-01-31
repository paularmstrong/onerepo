import type { Config } from 'onerepo';

export default {
	commands: {
		passthrough: {
			start: { description: 'Start the Astro dev server.', command: 'astro dev' },
			build: { description: 'Build the documentation site for production.', command: 'astro build' },
			check: { description: 'Check Astro pages for errors.', command: 'astro check' },
			astro: { description: 'Run Astro directly.' },
		},
	},
	tasks: {
		'pre-commit': {
			serial: [
				{ match: '**/*.{astro}', cmd: '$0 ws docs check' },
				{ match: '../modules/**/*.ts', cmd: '$0 ws docs typedoc --add' },
				{ match: '../**/*', cmd: '$0 ws docs collect-content -w ${workspaces} --add' },
				{ match: '../**/CHANGELOG.md', cmd: '$0 ws docs pull-changelogs --add' },
			],
		},
		'pre-merge': {
			serial: [{ match: '**/*.{astro}', cmd: '$0 ws docs check' }],
		},
		build: {
			serial: ['$0 ws docs build'],
		},
	},
} satisfies Config;
