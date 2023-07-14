#!/usr/bin/env node
const path = require('node:path');

require('esbuild-register/dist/node').register({});

const { setup } = require('onerepo');
const { changesets } = require('@onerepo/plugin-changesets');
const { eslint } = require('@onerepo/plugin-eslint');
const { jest } = require('@onerepo/plugin-jest');
const { prettier } = require('@onerepo/plugin-prettier');
const { typescript } = require('@onerepo/plugin-typescript');
const { performanceWriter } = require('@onerepo/plugin-performance-writer');

setup(
	/** @type import('onerepo').Config */
	{
		name: 'one',
		description: 'oneRepo’s very own `one` CLI.',
		root: path.join(__dirname, '..'),
		subcommandDir: 'commands',
		core: {
			docgen: {
				outWorkspace: 'root',
				outFile: 'docs/usage/cli.md',
				format: 'markdown',
				safeWrite: true,
			},
			generate: {
				templatesDir: path.join(__dirname, '..', 'config', 'templates'),
			},
			graph: { customSchema: path.join(__dirname, '..', 'config', 'graph-schema.ts') },
			tasks: {
				ignore: ['**/README.md', '**/CHANGELOG.md', '.changeset/**'],
			},
		},
		plugins: [
			changesets(),
			jest({ name: 'test' }),
			eslint({ name: 'lint', extensions: ['ts', 'tsx', 'js', 'jsx', 'cjs', 'mjs', 'astro'] }),
			prettier({ name: 'format' }),
			typescript({ tsconfig: 'tsconfig.json' }),
			performanceWriter(),
		],
	},
).then(({ run }) => run());
