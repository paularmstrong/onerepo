---
title: '@onerepo/plugin-tasks'
description: |
  Get information about your repository’s workspace graph.
type: core
---

## Configuration

This is a core plugin, meaning not additional steps are required to enable it in your oneRepo CLI. Tasks comes pre-configured with a set of common lifecycles that most JavaScript repositories tend to use.

Next, create a `onerepo.config.js` file in your root workspace.

```js title="onerepo.config.js"
/** @type import('@onerepo/graph').TaskConfig */
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

### Adding more lifecycles

First, configure the available `lifecycles` that the task runner has access to:

```js {3-7}
(async () => {
	const { run } = await setup({
		core: {
			tasks: {
				lifecycles: ['tacos', 'burritos'],
			},
		},
	});

	await run();
})();
```

Now, in any of your `onerepo.config.js` files, you will have the ability to run tasks for `tacos`, `burritos`, and any variant of those with `pre-` or `post-` prefixes.

```sh
one tasks -c pre-tacos
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

<!-- start-onerepo-sentinel -->

## `one tasks`

Run tasks against repo-defined lifecycles. This command will limit the tasks across the affected workspace set based on the current state of the repository.

```sh
one tasks --lifecycle=<lifecycle> [options]
```

You can fine-tune the determination of affected workspaces by providing a `--from-ref` and/or `through-ref`. For more information, get help with `--help --show-advanced`.

| Option              | Type      | Description                                                                                                 | Required |
| ------------------- | --------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| `--lifecycle`, `-c` | `string`  | Task lifecycle to run. `pre-` and `post-` lifecycles will automatically be run for non-prefixed lifecycles. | ✅       |
| `--list`            | `boolean` | List found tasks. Implies dry run and will not actually run any tasks.                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type                                                                   | Description                                                               | Required |
| --------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| `--from-ref`    | `string`                                                               | Git ref to start looking for affected files or workspaces                 |          |
| `--ignore`      | `array`, default: `["yarn.lock","package-lock.json","pnpm-lock.yaml"]` | List of filepath strings or globs to ignore when matching tasks to files. |          |
| `--through-ref` | `string`                                                               | Git ref to start looking for affected files or workspaces                 |          |

</details>

<!-- end-onerepo-sentinel -->
