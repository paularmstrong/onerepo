#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import initJiti from 'jiti';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const jiti = initJiti(import.meta.url, { interopDefault: true });

const { setup } = jiti('onerepo');
const { changesets } = jiti('@onerepo/plugin-changesets');
const { docgen } = jiti('@onerepo/plugin-docgen');
const { eslint } = jiti('@onerepo/plugin-eslint');
const { jest } = jiti('@onerepo/plugin-jest');
const { vitest } = jiti('@onerepo/plugin-vitest');
const { prettier } = jiti('@onerepo/plugin-prettier');
const { typescript } = jiti('@onerepo/plugin-typescript');
const { performanceWriter } = jiti('@onerepo/plugin-performance-writer');

setup(
	/** @type import('onerepo').Config */
	{
		name: 'one',
		description: 'oneRepo’s very own `one` CLI.',
		root: path.join(dirname, '..'),
		subcommandDir: 'commands',
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
			eslint({ name: 'lint', extensions: ['ts', 'tsx', 'js', 'jsx', 'cjs', 'mjs', 'astro'] }),
			prettier({ name: 'format' }),
			typescript({ tsconfig: 'tsconfig.json', useProjectReferences: true }),
			performanceWriter(),
		],
	},
).then(
	({
		// @ts-ignore This will all be refactored soon
		run,
	}) => run(),
);
