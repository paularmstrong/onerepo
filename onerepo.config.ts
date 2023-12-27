import type { Config } from 'onerepo';
import { changesets } from '@onerepo/plugin-changesets';
import { docgen } from '@onerepo/plugin-docgen';
import { eslint } from '@onerepo/plugin-eslint';
import { jest } from '@onerepo/plugin-jest';
import { vitest } from '@onerepo/plugin-vitest';
import { prettier } from '@onerepo/plugin-prettier';
import { typescript } from '@onerepo/plugin-typescript';
import { performanceWriter } from '@onerepo/plugin-performance-writer';

export default {
	root: true,

	core: {
		generate: { templatesDir: './config/templates' },
		graph: { customSchema: './config/graph-schema.ts' },
		tasks: {
			ignore: ['**/README.md', '**/CHANGELOG.md', '.changeset/**'],
		},
	},
	plugins: [
		changesets(),
		docgen({
			outWorkspace: 'root',
			outFile: './docs/usage/cli.md',
			format: 'markdown',
			safeWrite: true,
		}),
		vitest({ name: ['test', 'vitest'] }),
		jest(),
		eslint({ name: ['lint', 'eslint'], extensions: ['ts', 'tsx', 'js', 'jsx', 'cjs', 'mjs', 'astro'] }),
		prettier({ name: ['format', 'prettier'] }),
		typescript({ tsconfig: 'tsconfig.json', useProjectReferences: true }),
		performanceWriter(),
	],

	tasks: {
		'pre-commit': {
			serial: [['$0 lint --staged --add', '$0 format --staged --add'], '$0 tsc --staged'],
			parallel: [{ match: '**/package.json', cmd: '$0 graph verify' }],
		},
		'pre-merge': {
			serial: [
				['$0 lint --all --no-fix', '$0 format --check'],
				'$0 test --affected -w ${workspaces} -- --passWithNoTests',
				'$0 jest --affected -w ${workspaces} -- --passWithNoTests',
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
	},
} satisfies Config;
