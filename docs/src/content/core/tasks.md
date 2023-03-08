---
title: Tasks
description: |
  Get information about your repository’s workspace graph.
usage: tasks
---

# Tasks

## Configuration

Tasks comes pre-configured with a set of common lifecycles that most JavaScript repositories tend to use.

Next, create a `onerepo.config.js` file in your root workspace.

```js title="onerepo.config.js"
/** @type import('onerepo').TaskConfig */
export default {
	'pre-commit': {
		sequential: [{ match: '**/*.{ts,tsx,js,jsx}', cmd: '$0 lint --add' }, '$0 format --add', '$0 tsc'],
		parallel: [
			{ match: '**/commands/**/*.ts', cmd: '$0 docgen --add' },
			{ match: '**/package.json', cmd: '$0 graph verify' },
			{ match: 'plugins/*/src/**/*', cmd: '$0 docgen-internal --add' },
		],
	},
	'pre-merge': {
		sequential: ['$0 lint --all --no-fix', '$0 format --check', '$0 test', '$0 tsc', '$0 build'],
		parallel: [{ match: '**/package.json', cmd: '$0 graph verify' }],
	},
};
```

### Tasks

Each task can either be a `string` or an `object`:

```ts
type Task = string | { cmd: string; match?: string; meta?: Record<string, unknown> };
```

For commands that need to run under all circumstancs, you will typically want to use a `string`. If, however, you need to limit a task to only when modified files match a particular glob, you can use the `object` pattern.

For example, to run a `lint` only when TS or JS files have been modified:

```js
{ match: '**/*.{ts,tsx,js,jsx}', cmd: '$0 lint --add' }
```

You can also provide `meta` information in tasks. This information will only be available when listing tasks like in [GitHub Actions](#github-actions).

### Adding more lifecycles

First, configure the extra available `lifecycles` that the task runner should have access to run:

```js {3-5}
setup({
	core: {
		tasks: {
			lifecycles: ['tacos', 'burritos'],
		},
	},
}).then(({ run }) => run());
```

Now, in any of your `onerepo.config.js` files, you will have the ability to run tasks for `tacos`, `burritos`, and any variant of those with `pre-` or `post-` prefixes.

```sh
one tasks -c pre-tacos
```

### Special tokens

Some tokens in tasks can be used as special replacement values that the `tasks` command will determine for you. This is most useful when using self-referential commands that need to know how to access the oneRepo CLI to run commands, like `$0 tsc` will your your repo’s `tsc` command.

| Token           | Description and replacement                                                                                                               | Example                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `$0`            | Token for the repo’s oneRepo CLI. More specifically, `process.argv[1]`                                                                    | `$0 tsc`                    |
| `${workspaces}` | The names of all affected workspaces will be spread comma-spaced. If you're using `withWorkspaces()`, use as `--workspaces ${workspaces}` | `$0 build -w ${workspaces}` |

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

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'yarn'
      - run: yarn

      - name: Get tasks
        id: tasks
        run: |
          TASKS=$(./bin/one.cjs tasks --lifecycle=pre-merge --list -vvvvv)
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

## Disabling

So you have decided that `tasks` are not for you? That’s okay. You can deactivate the core plugin by passing `false` to the configuration:

```js
setup({
	core: {
		// Prevents all usage of `tasks` from your CLI
		tasks: false,
	},
}).then(({ run }) => run());
```
