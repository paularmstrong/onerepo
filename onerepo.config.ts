import type { Config } from 'onerepo';
import { docgen } from '@onerepo/plugin-docgen';
import { eslint } from '@onerepo/plugin-eslint';
import { jest } from '@onerepo/plugin-jest';
import { vitest } from '@onerepo/plugin-vitest';
import { prettier } from '@onerepo/plugin-prettier';
import { typescript } from '@onerepo/plugin-typescript';
import { performanceWriter } from '@onerepo/plugin-performance-writer';

export default {
	root: true,

	changes: {
		filenames: 'human',
		prompts: 'guided',
		formatting: {
			commit: '([${ref.short}](https://github.com/paularmstrong/onerepo/commit/${ref}))',
			footer:
				'> View the full changelog: [${fromRef.short}...${throughRef.short}](https://github.com/paularmstrong/onerepo/commits/${fromRef}...${throughRef})',
		},
	},

	dependencies: {
		dedupe: true,
	},

	templateDir: './config/templates',
	validation: {
		schema: './config/graph-schema.ts',
	},
	ignore: ['**/README.md', '**/CHANGELOG.md'],
	plugins: [
		docgen({
			outWorkspace: 'root',
			outFile: './docs/src/content/docs/plugins/docgen/example.mdx',
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
			parallel: [
				{ match: '**/package.json', cmd: '$0 graph verify' },
				{ match: '**/onerepo.config.*', cmd: ['$0 codeowners sync --add'] },
			],
		},
		'pre-merge': {
			serial: [
				['$0 lint --all --no-fix', '$0 format --check'],
				'$0 test --affected -w ${workspaces} -- --passWithNoTests',
				'$0 jest --affected -w ${workspaces} -- --passWithNoTests',
				'$0 tsc',
				'$0 build',
			],
			parallel: [
				{ match: '**/package.json', cmd: '$0 graph verify' },
				{ match: '**/onerepo.config.*', cmd: ['$0 codeowners verify'] },
			],
		},
		build: {
			serial: ['$0 build -w ${workspaces}'],
		},
		'pre-publish': {
			serial: ['$0 build -w ${workspaces}'],
		},
	},

	codeowners: {
		'*': ['@paularmstrong'],
	},

	vcs: {
		autoSyncHooks: true,
	},
} satisfies Config;
