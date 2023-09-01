---
title: Custom commands
---

# Custom commands

Every team, repo, and workspace has unique needs. oneRepo shines when it comes to doing what you need at the right time.

oneRepo commands are an extended version of the [Yargs command module](https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module), written as ESM and TypeScript compatible modules. By default, command files can be placed in a `commands/` folder at the repository root and within any workspace and they will automatically be registered. See [`setup({ subcommandDir })`](/docs/core/api/#config) for configuration options.

Commands are required to implement the following `exports`:

| Export        | Type                                    | Description                                                                                                                                                                                                                       |
| ------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | `string \| Array<string>`               | The command’s name. If provided as an array, all values will be considered aliases for the same command.<br><br>Any value can also be `'$0'`, which is a special token that lows this command to be the default for the parent.   |
| `description` | `string \| false`                       | A help description. If set to `false`, the command will be hidden from help output unless `--show-advanced` is included with `--help`. <br><br>**Note:** unlike in Yargs, this export _must_ be `description` and not `describe`. |
| `builder`     | [`Builder<T>`](/docs/core/api/#builder) | A function that helps parse the command-line arguments                                                                                                                                                                            |
| `handler`     | [`Handler<T>`](/docs/core/api/#handler) | Asynchronous function that is invoked for the command                                                                                                                                                                             |

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

oneRepo provides a robust API and suite of tools to flesh out your commands. Please refer to the [full API documentation](/docs/core/api/) for available methods, namespaces, and interfaces.

## Common use-cases

oneRepo exports helpers in the form of [`builders`](/docs/core/api/namespaces/namespace.builders/) for common input arguments and [`getters`](/docs/core/api/namespaces/namespace.getters/) for file and workspace querying based on the `builders`’ input arguments.

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

For a full list of available helpers on handlers, see [`HandlerExtra`](/docs/core/api/#handlerextra).

## Write helpful documentation

The more explanation and context that you can provide, the better it will be for your peers using commands. nsider adding [epilogues](http://yargs.js.org/docs/#api-reference-epiloguestr) and [examples](http://yargs.js.g/docs/#api-reference-examplecmd-desc) along with the required `description`.

You can also generate Markdown documentation of the full CLI using the [docgen command](/docs/core/docgen/)!

## Logging

At the core of oneRepo command output is the [`Logger`](/docs/core/api/#logger). This logger is responsible for tracking output and ensuring that all subprocess output is buffered and redirected appropriately for a better debugging experience.

<aside>

This logger should always be used instead of directly writing to `console.log` or `process.stdout` unless you explicitly know that your output should be piped to another process (e.g. you want to write JSON to `stdout`).

</aside>

The `logger` instance is primarily available in command handlers via the [`HandlerExtra`](/docs/core/api/#handlerextra). Logger verbosity is controlled via the global counter argument `--verbosity`, or `-v`.

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

## Subprocesses

oneRepo includes advanced child process spawning via the [`run`](/docs/core/api/#run) and [`batch`](/docs/core/api/#batch) functions. These async functions work like Node.js [`child_process.spawn`](https://nodejs.org/docs/latest-v18.x/api/child_process.html#child_processspawncommand-args-options), but are promise-based asynchronous functions that handle redirecting and buffering output as well as failure tracking for you. These should be used in favor of the direct Node.js builtins.

If the command you're trying to run is installed by a third party node module through your package manager (NPM, Yarn, or pNPM), you are encouraged to use [`graph.packageManager.run`](/docs/core/api/#packagemanager) and [`graph.packageManager.batch`](/docs/core/api/#packagemanager) functions. These will determine the correct install path to the executable and avoid potential issues across package manager install locations.

### Run single processes

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

### Batching processes

Often it will make sense to run many things at once. The [`batch`](/docs/core/api/#batch) function handles automatic resource sharing and prevents running too many processes at once for your current machine.

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

## Automated tests

Avoiding writing tooling that is easily mis-interpreted and prone to breaking by writing functional tests around your custom commands. The oneRepo suite includes the ability to set up a mock environment to run commands with CLI flags and assert on their behaviors within various test runners.

To get started, install the `@onerepo/test-cli` package as a development dependency:

```sh
npm install --save-dev @onerepo/test-cli
```

```ts title="commands/__tests__/my-command.test.ts"
import * as oneRepo from 'onerepo';
import { getCommand } from '@onerepo/test-cli';
import * as MyCommand from '../my-command';

// Enable mocking oneRepo methods
jest.mock('onerepo', () => ({
	__esModule: true,
	...jest.requireActual('onerepo'),
}));

const { build, run } = getCommand(MyCommand);

describe('my-command', () => {
	test('can test the builder', async () => {
		const argv = await build('--arg1 --arg2=foo');

		expect(argv).toMatchObject({
			/* ... */
		});
	});

	test('can test the handler', async () => {
		jest.spyOn(oneRepo, 'run').mockResolvedValue(['', '']);
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

- Determining appropriate files and default setup for a single process: [@onerepo/plugin-eslint](https://github.com/paularmstrong/onerepo/blob/main/plugins/eslint/src/commands/eslint.ts)
- Batching multiple processes against affected or input workspaces: [@onerepo/plugin-typescript](https://github.com/paularmstrong/onerepo/blob/main/plugins/typescript/src/commands/typescript.ts)
