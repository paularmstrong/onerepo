---
title: Writing commands
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

Every team, repo, and workspace has unique needs. oneRepo shines when it comes to doing what you need at the right time.

oneRepo commands are an extended version of the [Yargs command module](https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module), written as ESM and TypeScript compatible modules. By default, command files can be placed in a `commands/` folder at the repository root and within any workspace and they will automatically be registered. This directory can be changed by setting the [`commands.directory` setting](/docs/config/#commandsdirectory) in the [root configuration](/docs/config/#root-configuration).

Commands are required to implement the following `exports`:

| Export        | Type                                     | Description                                                                                                                                                                                                                       |
| ------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | `string \| Array<string>`                | The command’s name. If provided as an array, all values will be considered aliases for the same command.<br><br>Any value can also be `'$0'`, which is a special token that allows this command to be the default for the parent. |
| `description` | `string \| false`                        | A help description. If set to `false`, the command will be hidden from help output unless `--show-advanced` is included with `--help`. <br><br>**Note:** unlike in Yargs, this export _must_ be `description` and not `describe`. |
| `builder`     | [`Builder<T>`](/api/#buildercommandargv) | A function that helps parse the command-line arguments                                                                                                                                                                            |
| `handler`     | [`Handler<T>`](/api/#handlercommandargv) | Asynchronous function that is invoked for the command                                                                                                                                                                             |

## Basic example

```ts title="./commands/basic.ts"
import type { Builder, Handler } from 'onerepo';

export const command = 'basic';

export const description = 'A basic command that shows the minimum requirements for writing commands with eRepo';

export const builder: Builder = (yargs) => yargs.usage(`$0 ${command}`);

export const handler: Handler = async (argv, { logger }) => {
	logger.warn('Nothing to do!');
};
```

## API

oneRepo provides a robust API and suite of tools to flesh out your commands. Please refer to the [full API documentation](/api/) for available methods, namespaces, and interfaces.

## Common use-cases

oneRepo exports helpers in the form of [`builders`](/api/namespaces/namespace.builders/) for common input arguments and [`getters`](/api/namespaces/namespace.getters/) for file and workspace querying based on the `builders`’ input arguments.

```ts
export const builder: Builder<WithWorkspaces> = (yargs) => builders.withWorkspaces(yargs);

export const handler: Handler<WithWorkspaces> = (argv, { getWorkspaces }) => {
	// Get a list of workspaces given the input arguments
	const workspaces = getWorkspaces();
};
```

Using the previous command, we can then get the list of _affected_ workspaces based on the input workspace ome-workspace` using common inputs:

```sh
one my-command --workspace some-workspace --affected
```

For a full list of available helpers on handlers, see [`HandlerExtra`](/api/#handlerextra).

## Best practices

### Write helpful documentation

The more explanation and context that you can provide, the better it will be for your peers using commands. Consider adding [epilogues](http://yargs.js.org/docs/#api-reference-epiloguestr) and [examples](http://yargs.js.g/docs/#api-reference-examplecmd-desc) along with the required `description`.

You can also generate Markdown documentation of the full CLI using the [docgen plugin](/docs/plugins/docgen/)!

### Logging

<div class="grid grid-cols-2">

:::tip[Do]
Use the built-in `logger`.
:::

:::danger[Don’t]
Use `console.log` or a third-party logger.
:::

</div>

oneRepo provides a robust [`Logger`](/api/#logger) to all commands and methods. This logger is responsible for tracking output and ensuring that all subprocess output is buffered and redirected appropriately for a better debugging experience.

<aside>

This logger should always be used instead of directly writing to `console.log` or `process.stdout` unless you explicitly know that your output should be piped to another process (e.g. you want to write JSON to `stdout`).

</aside>

The `logger` instance is primarily available in command handlers via the [`HandlerExtra`](/api/#handlerextra). Logger verbosity is controlled via the global counter argument `--verbosity`, or `-v`.

```ts
export const handler: Handler = async (argv, { logger }) => {
	// -v (1)
	logger.error('This will output an error (and also set cause this run to exit with code 1)');
	logger.info('This will output an important informative message.');
	// -vv (2, default)
	logger.warn('This will output a warning');
	// -vvv (3)
	logger.log('This is log output');
	// -vvvv (4)
	logger.debug('This is extra debug information');
};
```

Generally speaking, it is best practice to wrap your logs in steps. This will help for better scannability and timing when debugging any issues:

```ts
export const handler: Handler = async (argv, { logger }) => {
	const step = logger.createStep('Setup');
	step.debug('do some work and write to the logger via the `step`');
	// Ensure you await the step to end so all logs are written out of the buffer
	await step.end();
};
```

### Subprocesses

<div class="grid grid-cols-2">

:::tip[Do]
Use the built-in subprocessing functions like `run`, `batch`.
:::

:::danger[Don’t]
Directly use Node.js APIs or third-party `child_process` spawning.
:::

</div>

oneRepo includes advanced child process spawning via the [`run`](/api/#run) and [`batch`](/api/#batch) functions. These async functions work like Node.js [`child_process.spawn`](https://nodejs.org/docs/latest-v18.x/api/child_process.html#child_processspawncommand-args-options), but are promise-based asynchronous functions that handle redirecting and buffering output as well as failure tracking for you. These should be used in favor of the direct Node.js builtins.

If the command you're trying to run is installed by a third party node module through your package manager (NPM, Yarn, or pNPM), you are encouraged to use [`graph.packageManager.run`](/api/#packagemanager) and [`graph.packageManager.batch`](/api/#packagemanager) functions. These will determine the correct install path to the executable and avoid potential issues across package manager install locations.

#### Run single processes

```ts
import { run } from 'onerepo';

export const handler: Handler = async (argv) => {
	await run({
		name: 'Do some work',
		cmd: 'sleep',
		args: ['5'],
	});
};
```

#### Batching processes

Often it will make sense to run many things at once. The [`batch`](/api/#batch) function handles automatic resource sharing and prevents running too many processes at once for your current machine.

```ts
import { batch } from 'onerepo';
import type { Handler, RunSpec } from 'onerepo';

export const handler: Handler = async (argv) => {
	const processes: Array<RunSpec> = [
		{ name: 'Say hello', cmd: 'echo', args: ['"hello"'] },
		{ name: 'Say world', cmd: 'echo', args: ['"world"'] },
	];

	const results = await batch(processes);

	expect(results).toEqual([
		['hello', ''],
		['world', ''],
	]);
};
```

### Limiting workspaces

<div class="grid grid-cols-2">

:::tip[Do]
Limit the scope of your command to the affected workspaces.
:::

:::danger[Don’t]
Always run across every workspace.
:::

</div>

```ts title="commands/my-command.ts" collapse={2-5}
import { builders } from 'onerepo';

export const command = 'my-command';

export const description = 'A useful description for my command';

type Argv = builders.WithWorkspaces & builders.WithAffected;

export const builder: Builder<Argv> = (yargs) => builders.withAffected(builders.withWorkspaces(yargs));

export const handler: Handler<Argv> = (argv, { getWorkspaces }) => {
	// Get a list of workspaces given the input arguments
	const workspaces = getWorkspaces();
};
```

By using the [`builders`](/api/namespaces/builders/) helpers, your command will automatically have extra input arguments available that help limit which workspaces will be returned from the `getWorkspaces` function. By default, `--affected` will be set to `true` _unless_ you specify another option when invoking the command.

```sh title="Default usage"
one my-command
```

```sh title="Run for workspaces 'foo' and 'bar' only"
one my-command --workspaces foo bar
```

```sh title="Force run against all workspaces"
one my-command --all
```

## Automated tests

Avoiding writing tooling that is easily mis-interpreted and prone to breaking by writing functional tests around your custom commands. The oneRepo suite includes the ability to set up a mock environment to run commands with CLI flags and assert on their behaviors within both [Jest](https://jestjs.io) and [Vitest](https://vitest.dev).

To get started, install the `@onerepo/test-cli` package as a development dependency:

```sh
npm install --save-dev @onerepo/test-cli
```

```ts title="commands/__tests__/my-command.test.ts"
import * as oneRepo from 'onerepo';
import { getCommand } from '@onerepo/test-cli';
import * as MyCommand from '../my-command';

const { build, run } = getCommand(MyCommand);

describe('my-command', () => {
	test('can test the builder', async () => {
		const argv = await build('--arg1 --arg2=foo');

		expect(argv).toMatchObject({
			/* ... */
		});
	});

	test('can test the handler', async () => {
		vi.spyOn(oneRepo, 'run').mockResolvedValue(['', '']);
		await run('--arg1 --arg2=foo');

		expect(oneRepo.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'foo',
				args: ['...'],
			}),
		);
	});
});
```

## Examples

The official oneRepo plugins are the best source for up-to-date, working examples.

- Determining appropriate files and default setup for a single process: [@onerepo/plugin-eslint](https://github.com/paularmstrong/onerepo/blob/main/plugins/eslint/src/eslint.ts)
- Batching multiple processes against affected or input workspaces: [@onerepo/plugin-typescript](https://github.com/paularmstrong/onerepo/blob/main/plugins/typescript/src/typescript.ts)
