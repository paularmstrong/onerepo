#!/usr/bin/env node
const path = require('node:path');
const { register } = require('esbuild-register/dist/node');

register({});

const { setup } = require('onerepo');
const { eslint } = require('../src');

(async () => {
	const { run } = await setup(
		/** @type import('onerepo').Config */
		{
			root: path.join(__dirname, '..', '..', '..'),
			core: {
				generate: false,
				graph: false,
				install: false,
				tasks: false,
			},
			plugins: [eslint()],
		},
	);

	await run();
})();
