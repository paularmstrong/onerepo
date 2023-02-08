---
title: '@onerepo/plugin-tasks'
description: |
  Get information about your repository’s workspace graph.
type: core
---

## Configuration

First, configure the available `lifecycles` that the task runner has access to:

```js {3-7}
(async () => {
	const { run } = await setup({
		core: {
			tasks: {
				lifecycles: ['pre-commit', 'pull-request'],
			},
		},
	});

	await run();
})();
```

Next, create a `onerepo.config.js` file in your root workspace

```js title="onerepo.config.js"
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

## Workflows

### GitHub Actions

While the `tasks` command does its best to split out parallel and sequential tasks to run as fast as possible on a single machine, using GitHub Actions can save even more time by spreading out each individual task to single instances using a matrix strategy.

To do this, we make use of the `task --list` argument to write a JSON-formatted list of tasks to standard output, then read that in with a matrix strategy as a second job.

```yaml title=".github/workflows/pull-request.yaml"
name: Pull request

on: pull_request

jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      tasks: ${{ steps.tasks.outputs.tasks }}
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - run: git fetch --no-tags --prune --depth=1 origin main

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'yarn'
      - run: yarn

      - name: Get tasks
        id: tasks
        run: |
          TASKS=$(./bin/one.cjs tasks --lifecycle=pull-request --list -vvvvv)
          echo ${TASKS}
          echo "tasks=${TASKS}" >> $GITHUB_OUTPUT
  tasks:
    runs-on: ubuntu-latest
    needs: setup
    strategy:
      fail-fast: false
      matrix:
        task: ${{ fromJSON(needs.setup.outputs.tasks) }}
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - run: git fetch --no-tags --prune --depth=1 origin main

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'yarn'
      - run: yarn

      - name: ${{ matrix.task.name }}
        run: |
          cd ${{ matrix.task.opts.cwd }}
          ${{ matrix.task.cmd }} ${{ join(matrix.task.args, ' ') }}
```

## Uninstall

So you have decided that `tasks` are not for you? That’s okay. You can deactivate the core plugin by passing `false` to the configuration:

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
