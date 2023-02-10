#!/usr/bin/env node
const path = require('node:path');
const { register } = require('esbuild-register/dist/node');

register({});

const { setup } = require('onerepo');
const { changesets } = require('@onerepo/plugin-changesets');
const { docgen } = require('@onerepo/plugin-docgen');
const { eslint } = require('@onerepo/plugin-eslint');
const { vitest } = require('@onerepo/plugin-vitest');
const { prettier } = require('@onerepo/plugin-prettier');

(async () => {
	const { run } = await setup(
		/** @type import('onerepo').Config */
		{
			name: 'one',
			description: 'oneRepo’s very own `one` CLI.',
			root: path.join(__dirname, '..'),
			subcommandDir: 'commands',
			core: {
				tasks: { lifecycles: ['pre-commit', 'pull-request'] },
			},
			plugins: [
				changesets(),
				vitest({ name: 'test' }),
				eslint({ name: 'lint', extensions: ['ts', 'tsx', 'js', 'jsx', 'cjs', 'mjs', 'astro'] }),
				prettier({ name: 'format' }),
				docgen({
					outWorkspace: 'root',
					outFile: 'docs/src/pages/docs/contributing/cli.md',
					format: 'markdown',
					safeWrite: true,
				}),
			],
		}
	);

	await run();
})();
