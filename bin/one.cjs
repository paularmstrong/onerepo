#!/usr/bin/env node
const path = require('node:path');
require('esbuild-register/dist/node').register({});

const { setup } = require('onerepo');
const { changesets } = require('@onerepo/plugin-changesets');
const { docgen } = require('@onerepo/plugin-docgen');
const { eslint } = require('@onerepo/plugin-eslint');
const { jest } = require('@onerepo/plugin-jest');
const { prettier } = require('@onerepo/plugin-prettier');
const { typescript } = require('@onerepo/plugin-typescript');

setup(
	/** @type import('onerepo').Config */
	{
		name: 'one',
		description: 'oneRepo’s very own `one` CLI.',
		root: path.join(__dirname, '..'),
		subcommandDir: 'commands',
		core: {
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
			docgen({
				outWorkspace: 'root',
				outFile: 'docs/usage/cli.md',
				format: 'markdown',
				safeWrite: true,
			}),
			typescript({ tsconfig: 'tsconfig.json' }),
		],
	}
).then(({ run }) => run());
