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
		serial: [{ match: '**/*.{ts,tsx,js,jsx}', cmd: '$0 lint --add' }, '$0 format --add', '$0 tsc'],
		parallel: [
			{ match: '**/commands/**/*.ts', cmd: '$0 docgen --add' },
			{ match: '**/package.json', cmd: '$0 graph verify' },
			{ match: 'plugins/*/src/**/*', cmd: '$0 docgen-internal --add' },
		],
	},
	'pre-merge': {
		serial: ['$0 lint --all --no-fix', '$0 format --check', '$0 test', '$0 tsc', '$0 build'],
		parallel: [{ match: '**/package.json', cmd: '$0 graph verify' }],
	},
};
```

### Options

<!-- start-usage-typedoc -->

This content will be auto-generated. Do not edit

<!-- end-usage-typedoc -->

### Tasks

There are four main types of tasks:

#### Serial tasks

When running full task sets on a single machine, some tasks may need to use a lot of resources at a single time. For example, running the [TypeScript plugin command](/docs/plugins/typescript/) will batch many processes across as many CPU cores as possible. For that reason, it should not be run in _parallel_ to any other tasks.

```js title="onerepo.config.js"
/** @type import('onerepo').TaskConfig */
export default {
	'pre-commit': {
		serial: ['$0 tsc'],
	},
};
```

#### Parallel tasks

When you have multiple tasks that run quickly and consume very few system resources, it can be possible to run them at the same time to make things faster. All parallel tasks for a given lifecycle will be run first before serial tasks to hopefully provide faster feedback.

```js title="onerepo.config.js"
/** @type import('onerepo').TaskConfig */
export default {
	'pre-commit': {
		parallel: ['$0 graph verify', '$0 other-fast-task'],
	},
};
```

#### Sequential tasks

In some cases, it may be necessary to run specific commands in sequential order, but still keep them as separate commands for different use-cases.

One example would be a build, publish to CDN, and deploy tasks for a web application.

Sequential tasks can be denoted by an array of strings within the list of tasks (instead of a single `string` or conditional task).

```js title="onerepo.config.js"
/** @type import('onerepo').TaskConfig */
export default {
	deploy: {
		serial: [['$0 ws my-app build', '$0 ws my-app cdn-push', '$0 ws my-app deploy']],
	},
};
```

#### Conditional tasks

Tasks may also be conditional based on glob patterns for modified files!

```js title="onerepo.config.js"
/** @type import('onerepo').TaskConfig */
export default {
	'pre-commit': {
		serial: [{ match: '**/*.{ts,tsx}', cmd: '$0 tsc' }],
	},
};
```

Conditional tasks can also be a sequential list of commands:

```js title="onerepo.config.js"
/** @type import('onerepo').TaskConfig */
export default {
	deploy: {
		serial: [
			{
				match: './src/**/*',
				cmd: ['$0 ws my-app build', '$0 ws my-app cdn-push', '$0 ws my-app deploy'],
			},
		],
	},
};
```

Lastly, conditional tasks aren't just conditional, they can also include a record of `meta` information. This information will only be available when listing tasks like in [GitHub Actions](#github-actions).

```ts
type TaskDef = { cmd: string | Array<string>; match?: string; meta?: Record<string, unknown> };
```

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

Now, in any of your `onerepo.config.js` files, you will have the ability to run tasks for `tacos` and `burritos`.

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

While the `tasks` command does its best to split out parallel and serial tasks to run as fast as possible on a single machine, using GitHub Actions can save even more time by spreading out each individual task to single instances using a matrix strategy.

To do this, we make use of the `task --list` argument to write a JSON-formatted list of tasks to standard output, then read that in with a matrix strategy as a second job.

```yaml title=".github/workflows/pull-request.yaml" showLineNumbers {8-11, 15-18, 26, 36-38, 60-63}
name: Pull request

on: pull_request

jobs:
  setup:
    runs-on: ubuntu-latest
    # This job is the originator for determining the list of tasks to be farmed out to a matrix.
    # This declares the output from the `tasks --list` step
    outputs:
      tasks: ${{ steps.tasks.outputs.tasks }}
    steps:
      - uses: actions/checkout@v3
        with:
          # Ensure you check out enough history to allow oneRepo to determine the
          # merge-base and changed files. `0` will pull all history and should be sufficiently
          # safe, unless your repo is gigabytes in size
          fetch-depth: 0

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'yarn'
      - run: yarn

      # Determine the tasks for the given lifecycle and send them to the github output
      - uses: paularmstrong/onerepo/actions/get-tasks@main
        id: tasks # important!: this must match the ID used in the output
        with:
          cli: ./bin/one.cjs
          lifecycle: pre-merge

  tasks:
    runs-on: ubuntu-latest
    needs: setup
    # A conditional here prevents the job from failing unexpectedly in the rare case
    # that there are no tasks to run at all.
    if: ${{ fromJSON(needs.setup.outputs.tasks).parallel != '[]' && fromJSON(needs.setup.outputs.tasks).parallel != '[]' }}
    strategy:
      # Run all tasks, even if some fail
      fail-fast: false
      matrix:
        # Because we run all tasks on separate runners, we do not need to worry about
        # which tasks are parallel or serial – they can all be parallel
        task:
          - ${{ fromJSON(needs.setup.outputs.tasks).parallel }}
          - ${{ fromJSON(needs.setup.outputs.tasks).serial }}
    name: ${{ join(matrix.task.*.name, ', ') }}
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'yarn'
      - run: yarn

      - uses: paularmstrong/onerepo/actions/run-task@main
        with:
          task: |
            ${{ toJSON(matrix.task) }}
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

## Usage

<!-- start-auto-generated-from-cli-tasks -->

This content will be auto-generated. Do not edit

<!-- end-auto-generated-from-cli-tasks -->
