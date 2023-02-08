---
title: '@onerepo/plugin-tasks'
description: |
  Get information about your repository’s workspace graph.
type: core
---

## Configuration

First, configure the available `lifecycles` that the task runner has access to:

```js
(async () => {
	const { run } = await setup({
		core: {
			tasks: {
				/**
				 * An array of strings. Each one will enable running of tasks across affected workspaces for that particular lifecycle
				 */
				lifecycles: ['pre-commit', 'pull-request'],
			},
		},
	});

	await run();
})();
```

Next, create a `onerepo.config.js` file in your root workspace

```js
/** @type import('@onerepo/graph').TaskConfig<'pre-commit' | 'pull-request'> */
export default {
	'pre-commit': {
		sequential: [{ match: '**/*.{ts,tsx,js,jsx}', cmd: '$0 lint --add' }, '$0 format --add', '$0 tsc'],
		parallel: [
			{ match: '**/commands/**/*.ts', cmd: '$0 docgen --add' },
			{ match: '**/package.json', cmd: '$0 graph verify' },
			{ match: 'plugins/*/src/**/*', cmd: '$0 docgen-internal --add' },
		],
	},
	'pull-request': {
		sequential: ['$0 lint --all --no-fix', '$0 format --check', '$0 test', '$0 tsc', '$0 build'],
		parallel: [{ match: '**/package.json', cmd: '$0 graph verify' }],
	},
};
```

## Uninstall

```js
(async () => {
	const { run } = await setup({
		core: {
			// Prevents all usage of `tasks` from your CLI
			tasks: false,
		},
	});

	await run();
})();
```
