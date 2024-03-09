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
				'> View the full changelog: [${fromRef.short}...${throughRef.short}](https://github.com/paularmstrong/onerepo/compare/${fromRef}...${throughRef})',
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
		jest(),
		vitest(),
		eslint({ extensions: ['ts', 'tsx', 'js', 'jsx', 'cjs', 'mjs', 'astro'] }),
		prettier(),
		typescript({ tsconfig: 'tsconfig.json', useProjectReferences: true }),
		performanceWriter(),
	],

	tasks: {
		'pre-commit': {
			serial: [
				{ match: '**/onerepo.config.*', cmd: ['$0 codeowners sync --add'] },
				['$0 lint --staged --add', '$0 format --staged --add'],
				'$0 tsc --staged',
			],
			parallel: [{ match: '**/package.json', cmd: '$0 graph verify' }, '$0 change verify'],
		},
		'pre-merge': {
			serial: [['$0 lint --all --no-fix', '$0 format --check'], '$0 test -a', '$0 jest -a', '$0 tsc', '$0 build'],
			parallel: [
				{ match: '**/package.json', cmd: '$0 graph verify' },
				{ match: '**/onerepo.config.*', cmd: ['$0 codeowners verify'] },
				'$0 change verify',
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
