---
title: oneRepo API
---

<!-- start-onerepo-sentinel -->
<!-- @generated SignedSource<<782daf606be9d5ef24b225857954b63c>> -->

## Namespaces

| Namespace                        | Description                                                                                                                                   |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| [builders](namespaces/builders/) | Builders and Getters work together as reusable ways to add optional command-line arguments that affect how workspaces and files are retrived. |
| [file](namespaces/file/)         | File manipulation functions.                                                                                                                  |
| [git](namespaces/git/)           | This package is also canonically available from the `onerepo` package under the `git` namespace or methods directly from `@onerepo/git`:      |
| [graph](namespaces/graph/)       | -                                                                                                                                             |

## References

### Graph

Re-exports [Graph](namespaces/graph/#graph)

### Tasks

Re-exports [Tasks](namespaces/graph/#tasks-1)

### Workspace

Re-exports [Workspace](namespaces/graph/#workspace)

## Type Aliases

### Config

```ts
type Config: RootConfig | WorkspaceConfig;
```

#### Source

[modules/onerepo/src/types.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types.ts#L74)

## Command type aliases

### Argv\<CommandArgv\>

```ts
type Argv<CommandArgv>: Arguments<CommandArgv & DefaultArgv>;
```

Helper for combining local parsed arguments along with the default arguments provided by the oneRepo command module.

#### Type parameters

• **CommandArgv** = `object`

Arguments that will be parsed for this command, always a union with [`DefaultArgv`](#defaultargv) and [`PositionalArgv`](#positionalargv).

#### Source

[modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts#L109)

---

### Builder\<CommandArgv\>

```ts
type Builder<CommandArgv>: (yargs) => Yargv<CommandArgv>;
```

#### Type parameters

• **CommandArgv** = `object`

Arguments that will be parsed for this command

Option argument parser for the given command. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for more, but note that only the object variant is not accepted – only function variants will be accepted in oneRepo commands.

For common arguments that work in conjunction with [`HandlerExtra`](#handlerextra) methods like `getAffected()`, you can use helpers from the [! | `builders` namespace](namespaces/builders/), like [!withAffected | `builders.withAffected()`](namespaces/builders/).

#### Parameters

• **yargs**: `Yargs`

The Yargs instance. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule)

#### Returns

`Yargv`\<`CommandArgv`\>

#### Example

```ts
type Argv = {
	'with-tacos'?: boolean;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs.usage(`$0 ${command}`).option('with-tacos', {
		description: 'Include tacos',
		type: 'boolean',
	});
```

#### See

- [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for general usage.
- Common extensions via the [`builders`](namespaces/builders/) namespace.

#### Source

[modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts#L194)

---

### DefaultArgv

```ts
type DefaultArgv: Object;
```

Default arguments provided globally for all commands. These arguments are included by when using [`Builder`](#buildercommandargv) and [`Handler`](#handlercommandargv).

#### Type declaration

| Member              | Type      | Description                                                                                                                                                                                                                                                                              |
| :------------------ | :-------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dry-run`           | `boolean` | Whether the command should run non-destructive dry-mode. This prevents all subprocesses, files, and git operations from running unless explicitly specified as safe to run.<br /><br />Also internally sets `process.env.ONE_REPO_DRY_RUN = 'true'`.<br /><br />**Default**<br />`false` |
| `silent`            | `boolean` | Silence all logger output. Prevents _all_ stdout and stderr output from the logger entirely.<br /><br />**Default**<br />`false`                                                                                                                                                         |
| `skip-engine-check` | `boolean` | Skip the engines check. When `false`, oneRepo will the current process's node version with the range for `engines.node` as defined in `package.json`. If not defined in the root `package.json`, this will be skipped.<br /><br />**Default**<br />`false`                               |
| `verbosity`         | `number`  | Verbosity level for the Logger. See Logger.verbosity for more information.<br /><br />**Default**<br />`3`                                                                                                                                                                               |

#### Source

[modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts#L42)

---

### Handler\<CommandArgv\>

```ts
type Handler<CommandArgv>: (argv, extra) => Promise<void>;
```

#### Type parameters

• **CommandArgv** = `object`

Arguments that will be parsed for this command. DefaultArguments will be automatically merged into this object for use within the handler.

Command handler that includes oneRepo tools like `graph`, `logger`, and more. This function is type-safe if `Argv` is correctly passed through to the type definition.

#### Parameters

• **argv**: [`Argv`](#argvcommandargv)\<`CommandArgv`\>

• **extra**: [`HandlerExtra`](#handlerextra)

#### Returns

`Promise`\<`void`\>

#### Example

```ts
type Argv = {
	'with-tacos'?: boolean;
};
export const handler: Handler<Argv> = (argv, { logger }) => {
	const { 'with-tacos': withTacos, '--': passthrough } = argv;
	logger.log(withTacos ? 'Include tacos' : 'No tacos, thanks');
	logger.debug(passthrough);
};
```

#### See

- [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for general usage.
- [`HandlerExtra`](#handlerextra) for extended extra arguments provided above and beyond the scope of Yargs.

#### Source

[modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts#L217)

---

### HandlerExtra

```ts
type HandlerExtra: Object;
```

Commands in oneRepo extend beyond what Yargs is able to provide by adding a second argument to the handler.

#### Example

All extras are available as the second argument on your [`Handler`](#handlercommandargv)

```ts
export const handler: Handler = (argv, { getAffected, getFilepaths, getWorkspace, logger }) => {
	logger.warn('Nothing to do!');
};
```

#### Example

Overriding the affected threshold in `getFilepaths`

```ts
export const handler: Handler = (argv, { getFilepaths }) => {
	const filepaths = await getFilepaths({ affectedThreshold: 0 });
};
```

#### Type declaration

| Member          | Type                                                                   | Description                                                                                                                                                             |
| :-------------- | :--------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getAffected`   | (`opts`?) => `Promise`\<[`Workspace`](namespaces/graph/#workspace)[]\> | -                                                                                                                                                                       |
| `getFilepaths`  | (`opts`?) => `Promise`\<`string`[]\>                                   | -                                                                                                                                                                       |
| `getWorkspaces` | (`opts`?) => `Promise`\<[`Workspace`](namespaces/graph/#workspace)[]\> | -                                                                                                                                                                       |
| `graph`         | [`Graph`](namespaces/graph/#graph)                                     | The full monorepo [`graph.Graph`](namespaces/graph/#graph).                                                                                                             |
| `logger`        | [`Logger`](#logger)                                                    | Standard [`Logger`](#logger). This should _always_ be used in place of `console.log` methods unless you have<br />a specific need to write to standard out differently. |

#### Source

[modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts#L129)

---

### PositionalArgv

```ts
type PositionalArgv: Object;
```

Always present in Builder and Handler arguments as parsed by Yargs.

#### Type declaration

| Member | Type                     | Description                                                                                                                                                                                           |
| :----- | :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$0`   | `string`                 | The script name or node command. Similar to `process.argv[1]`                                                                                                                                         |
| `--`   | `string`[]               | Any content that comes after " -- " gets populated here. These are useful for spreading through to spawned `run` functions that may take extra options that you don't want to enumerate and validate. |
| `_`    | (`string` \| `number`)[] | Positionals / non-option arguments. These will only be filled if you include `.positional()` or `.strictCommands(false)` in your `Builder`.                                                           |

#### Source

[modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts#L71)

## Core

### CodeownersOptions

```ts
type CodeownersOptions: Object;
```

Full configuration options for the Codeowners core command.

#### Example

Configuration

```ts title="./onerepo.config.ts"
export default {
	core: {
		codeowners: {
			provider: 'github',
		},
	},
};
```

#### Type declaration

| Member     | Type        | Description                                                                                                                     |
| :--------- | :---------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `provider` | `Providers` | Repository host/provider. This determines where and how codeowners files will be written<br /><br />**Default**<br />`'github'` |

#### Source

[modules/onerepo/src/core/codeowners/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/codeowners/index.ts#L18)

---

### CoreConfig

```ts
type CoreConfig: Object;
```

#### Type declaration

| Member       | Type                                      | Description                                                                      |
| :----------- | :---------------------------------------- | :------------------------------------------------------------------------------- |
| `codeowners` | [`CodeownersOptions`](#codeownersoptions) | Configuration options fopr the [Codeowners](/docs/core/codeowners/) core module. |
| `generate`   | [`GenerateOptions`](#generateoptions)     | Configuration options fopr the [Generate](/docs/core/generate/) core module.     |
| `graph`      | [`GraphOptions`](#graphoptions)           | Configuration options fopr the [Graph](/docs/core/graph/) core module.           |
| `tasks`      | [`TasksOptions`](#tasksoptions)           | Configuration options fopr the [Tasks](/docs/core/tasks/) core module.           |

#### Source

[modules/onerepo/src/types.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types.ts#L16)

---

### GenerateOptions

```ts
type GenerateOptions: Object;
```

Full configuration options for the Generate core command.

#### Type declaration

| Member         | Type     | Description                    |
| :------------- | :------- | :----------------------------- |
| `templatesDir` | `string` | Folder path to find templates. |

#### Source

[modules/onerepo/src/core/generate/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/generate/index.ts#L6)

---

### GraphOptions

```ts
type GraphOptions: Object;
```

Full configuration options for the Graph core command.

#### Type declaration

| Member         | Type                 | Description                                                               |
| :------------- | :------------------- | :------------------------------------------------------------------------ |
| `customSchema` | `string`             | File path to a custom schema for the `verify` command.                    |
| `dependencies` | `"loose"` \| `"off"` | Method for dependency verification.<br /><br />**Default**<br />`'loose'` |

#### Source

[modules/onerepo/src/core/graph/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/graph/index.ts#L6)

---

### GraphSchemaValidators

```ts
type GraphSchemaValidators: Record<string, Record<string, Schema & Object | (workspace, graph) => Schema & Object>>;
```

Definition for `graph verify` JSON schema validators.

See [“Validating configurations”](/docs/core/graph/#validating-configurations) for more examples and use cases.

#### Example

```ts
import type { GraphSchemaValidators } from 'onerepo';

export default {
	'**': {
		'package.json': {
			type: 'object',
			$required: true,
			properties: {
				name: { type: 'string' },
			},
			required: ['name'],
		},
	},
} satisfies GraphSchemaValidators;
```

#### Source

[modules/onerepo/src/core/graph/schema.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/graph/schema.ts#L28)

---

### Plugin

```ts
type Plugin: PluginObject | (config) => PluginObject;
```

#### Source

[modules/onerepo/src/types.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types.ts#L107)

---

### PluginObject

```ts
type PluginObject: Object;
```

#### Type declaration

| Member     | Type                                                                                                            | Description |
| :--------- | :-------------------------------------------------------------------------------------------------------------- | :---------- |
| `shutdown` | (`argv`) => `Promise`\<`Record`\<`string`, `unknown`\> \| `void`\> \| `Record`\<`string`, `unknown`\> \| `void` | -           |
| `startup`  | (`argv`) => `Promise`\<`void`\> \| `void`                                                                       | -           |
| `yargs`    | (`yargs`, `visitor`) => `Yargs`                                                                                 | -           |

#### Source

[modules/onerepo/src/types.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types.ts#L78)

---

### RootConfig

```ts
type RootConfig: Omit<WorkspaceConfig, "root"> & Object;
```

Setup configuration for the oneRepo command-line interface.

#### Type declaration

| Member           | Type                                          | Description                                                                                                                                                                                                       |
| :--------------- | :-------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `core`           | [`CoreConfig`](#coreconfig)                   | Core plugin configuration. These plugins will be added automatically unless the value specified is `false`<br /><br />**Default**<br />`{}`                                                                       |
| `head`           | `string`                                      | What's the default branch of your repo? Probably `main`, but it might be something else, so it's helpful to put that here so that we can determine changed files accurately.<br /><br />**Default**<br />`'main'` |
| `ignoreCommands` | `RegExp`                                      | When using subcommandDir, include a regular expression here to ignore files.<br /><br />**Default**<br />`/(/__\w+__/\|\.test\.\|\.spec\.\|\.config\.)/`                                                          |
| `plugins`        | [`Plugin`](#plugin)[]                         | Add shared commands and extra handlers. See the [official plugin list](https://onerepo.tools/docs/plugins/) for more information.<br /><br />**Default**<br />`[]`                                                |
| `root`           | `true`                                        | Must be set to `true` in order to denote that this is the root of the repository.                                                                                                                                 |
| `subcommandDir`  | `string` \| `false`                           | A string to use as filepaths to subcommands. We'll look for commands in all workspaces using this string. If any are found, they'll be available from the CLI.<br /><br />**Default**<br />`'commands'`           |
| `tasks`          | [`TaskConfig`](namespaces/graph/#taskconfigl) | Globally defined tasks per lifecycle<br /><br />**Default**<br />`{}`                                                                                                                                             |

#### Source

[modules/onerepo/src/types.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types.ts#L38)

---

### TasksOptions

```ts
type TasksOptions: Object;
```

Full configuration options for the Tasks core command.

#### Type declaration

| Member       | Type       | Description                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :----------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ignore`     | `string`[] | Array of fileglobs to ignore when calculating the changed workspaces.<br /><br />**Default**<br />`['.changesets/*']`                                                                                                                                                                                                                                                                                                           |
| `lifecycles` | `string`[] | Additional lifecycles to make available.                                                                                                                                                                                                                                                                                                                                                                                        |
| `stagedOnly` | `string`[] | Default to use `--staged` behavior for these lifecycles. When set, unstaged changes will be backed up and omitted before determining and running tasks. The unstaged changes will be re-applied after task run completion or SIGKILL event is received.<br /><br />Note that it is still important to include `--staged` in individual tasks to run in the `onerepo.config` files.<br /><br />**Default**<br />`['pre-commit']` |

#### Source

[modules/onerepo/src/core/tasks/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/tasks/index.ts#L6)

## Logger

### LogStep

Log steps should only be created via the [`logger.createStep()`](#createstep) method.

```ts
const step = logger.createStep('Do some work');
// ... long task with a bunch of potential output
await step.end();
```

#### Properties

| Property     | Type      | Description                                                                                                                                                                     | Source                                                                                                                |
| :----------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------- |
| `hasError`   | `boolean` | Whether or not an error has been sent to the step. This is not necessarily indicative of uncaught thrown errors, but solely on whether `.error()` has been called in this step. | [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L27) |
| `hasInfo`    | `boolean` | Whether or not an info message has been sent to this step.                                                                                                                      | [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L35) |
| `hasLog`     | `boolean` | Whether or not a log message has been sent to this step.                                                                                                                        | [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L39) |
| `hasWarning` | `boolean` | Whether or not a warning has been sent to this step.                                                                                                                            | [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L31) |

#### Methods

##### end()

```ts
end(): Promise<void>
```

Finish this step and flush all buffered logs. Once a step is ended, it will no longer accept any logging output and will be effectively removed from the base logger. Consider this method similar to a destructor or teardown.

```ts
await step.end();
```

###### Returns

`Promise`\<`void`\>

###### Source

[modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L87)

#### Logging

##### debug()

```ts
debug(contents): void
```

Extra debug logging when verbosity greater than or equal to 4.

###### Parameters

• **contents**: `unknown`

Any value that can be converted to a string for writing to `stderr`.

###### Returns

`void`

###### Source

[modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L126)

##### error()

```ts
error(contents): void
```

Log an error. This will cause the root logger to include an error and fail a command.

###### Parameters

• **contents**: `unknown`

Any value that can be converted to a string for writing to `stderr`.

###### Returns

`void`

###### Source

[modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L105)

##### info()

```ts
info(contents): void
```

Log an informative message. Should be used when trying to convey information with a user that is important enough to always be returned.

###### Parameters

• **contents**: `unknown`

Any value that can be converted to a string for writing to `stderr`.

###### Returns

`void`

###### Source

[modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L98)

##### log()

```ts
log(contents): void
```

General logging information. Useful for light informative debugging. Recommended to use sparingly.

###### Parameters

• **contents**: `unknown`

Any value that can be converted to a string for writing to `stderr`.

###### Returns

`void`

###### Source

[modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L119)

##### timing()

```ts
timing(start, end): void
```

Log timing information between two [Node.js performance mark names](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#performancemarkname-options).

###### Parameters

• **start**: `string`

A `PerformanceMark` entry name

• **end**: `string`

A `PerformanceMark` entry name

###### Returns

`void`

###### Source

[modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L134)

##### warn()

```ts
warn(contents): void
```

Log a warning. Does not have any effect on the command run, but will be called out.

###### Parameters

• **contents**: `unknown`

Any value that can be converted to a string for writing to `stderr`.

###### Returns

`void`

###### Source

[modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L112)

---

### Logger

The oneRepo logger helps build commands and capture output from spawned subprocess in a way that's both delightful to the end user and includes easy to scan and follow output.

All output will be redirected from `stdout` to `stderr` to ensure order of output and prevent confusion of what output can be piped and written to files.

You should not need to construct instances of the `Logger` directly, but instead import a singleton instead:

If the current terminal is a TTY, output will be buffered and asynchronous steps will animated with a progress logger.

See [`HandlerExtra`](#handlerextra) for access the the global Logger instance.

#### Accessors

##### hasError

```ts
get hasError(): boolean
```

Whether or not an error has been sent to the logger or any of its steps. This is not necessarily indicative of uncaught thrown errors, but solely on whether `.error()` has been called in the `Logger` or any `Step` instance.

###### Returns

`boolean`

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L63)

##### hasInfo

```ts
get hasInfo(): boolean
```

Whether or not an info message has been sent to the logger or any of its steps.

###### Returns

`boolean`

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L71)

##### hasLog

```ts
get hasLog(): boolean
```

Whether or not a log message has been sent to the logger or any of its steps.

###### Returns

`boolean`

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L75)

##### hasWarning

```ts
get hasWarning(): boolean
```

Whether or not a warning has been sent to the logger or any of its steps.

###### Returns

`boolean`

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L67)

##### verbosity

```ts
get verbosity(): Verbosity
```

Get the logger's verbosity level

```ts
set verbosity(value): void
```

Recursively applies the new verbosity to the logger and all of its active steps.

###### Parameters

• **value**: [`Verbosity`](#verbosity-1)

###### Returns

[`Verbosity`](#verbosity-1)

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L54)

##### writable

```ts
get writable(): boolean
```

###### Returns

`boolean`

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L59)

#### Methods

##### createStep()

```ts
createStep(name, __namedParameters?): LogStep
```

Create a sub-step, [`LogStep`](#logstep), for the logger. This and any other step will be tracked and required to finish before exit.

```ts
const step = logger.createStep('Do fun stuff');
// do some work
await step.end();
```

###### Parameters

• **name**: `string`

The name to be written and wrapped around any output logged to this new step.

• **\_\_namedParameters?**: `Object`

• **\_\_namedParameters\.writePrefixes?**: `boolean`

###### Returns

[`LogStep`](#logstep)

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L107)

##### pause()

```ts
pause(write?): void
```

When the terminal is a TTY, steps are automatically animated with a progress indicator. There are times when it's necessary to stop this animation, like when needing to capture user input from `stdin`. Call the `pause()` method before requesting input and [`logger.unpause()`](#unpause) when complete.

This process is also automated by the [`run()`](#run-1) function when `stdio` is set to `pipe`.

```ts
logger.pause();
// capture input
logger.unpause();
```

###### Parameters

• **write?**: `boolean`

###### Returns

`void`

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L91)

##### unpause()

```ts
unpause(): void
```

Unpause the logger and resume writing buffered logs to `stderr`. See [`logger.pause()`](#pause) for more information.

###### Returns

`void`

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L95)

#### Logging

##### debug()

```ts
debug(contents): void
```

Extra debug logging when verbosity greater than or equal to 4.

###### Parameters

• **contents**: `unknown`

Any value that can be converted to a string for writing to `stderr`.

###### Returns

`void`

###### See

[`debug()`](#debug) This is a pass-through for the main step’s [`debug()`](#debug) method.

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L149)

##### error()

```ts
error(contents): void
```

Log an error. This will cause the root logger to include an error and fail a command.

###### Parameters

• **contents**: `unknown`

Any value that can be converted to a string for writing to `stderr`.

###### Returns

`void`

###### See

[`error()`](#error) This is a pass-through for the main step’s [`error()`](#error) method.

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L133)

##### info()

```ts
info(contents): void
```

Should be used to convey information or instructions through the log, will log when verbositu >= 1

###### Parameters

• **contents**: `unknown`

Any value that can be converted to a string for writing to `stderr`.

###### Returns

`void`

###### See

[`info()`](#info) This is a pass-through for the main step’s [`info()`](#info) method.

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L125)

##### log()

```ts
log(contents): void
```

General logging information. Useful for light informative debugging. Recommended to use sparingly.

###### Parameters

• **contents**: `unknown`

Any value that can be converted to a string for writing to `stderr`.

###### Returns

`void`

###### See

[`log()`](#log) This is a pass-through for the main step’s [`log()`](#log) method.

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L117)

##### timing()

```ts
timing(start, end): void
```

Log timing information between two [Node.js performance mark names](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#performancemarkname-options).

###### Parameters

• **start**: `string`

A `PerformanceMark` entry name

• **end**: `string`

A `PerformanceMark` entry name

###### Returns

`void`

###### See

[`timing()`](#timing) This is a pass-through for the main step’s [`timing()`](#timing) method.

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L158)

##### warn()

```ts
warn(contents): void
```

Log a warning. Does not have any effect on the command run, but will be called out.

###### Parameters

• **contents**: `unknown`

Any value that can be converted to a string for writing to `stderr`.

###### Returns

`void`

###### See

[`warn()`](#warn) This is a pass-through for the main step’s [`warn()`](#warn) method.

###### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L141)

---

### bufferSubLogger()

```ts
bufferSubLogger(step): Object
```

Create a new Logger instance that has its output buffered up to a LogStep.

#### Parameters

• **step**: [`LogStep`](#logstep)

#### Returns

`Object`

> | Member   | Type                      | Description |
> | :------- | :------------------------ | :---------- |
> | `end`    | () => `Promise`\<`void`\> | -           |
> | `logger` | [`Logger`](#logger)       | -           |

#### Example

```ts
const step = logger.createStep(name, { writePrefixes: false });
const subLogger = bufferSubLogger(step);
const substep = subLogger.logger.createStep('Sub-step');
substep.warning('This gets buffered');
await substep.end();
await subLogger.end();
await step.en();
```

#### Source

[modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts#L57)

---

### getLogger()

```ts
getLogger(opts?): Logger
```

This gets the logger singleton for use across all of oneRepo and its commands.

Available directly as [`HandlerExtra`](#handlerextra) on [`Handler`](#handlercommandargv) functions:

```ts
export const handler: Handler = (argv, { logger }) => {
	logger.log('Hello!');
};
```

#### Parameters

• **opts?**: `Partial`\<[`LoggerOptions`](#loggeroptions)\>

#### Returns

[`Logger`](#logger)

#### Source

[modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts#L17)

---

### stepWrapper()

```ts
stepWrapper<T>(options, fn): Promise<T>
```

For cases where multiple processes need to be completed, but should be joined under a single [`LogStep`](#logstep) to avoid too much noisy output, this safely wraps an asynchronous function and handles step creation and completion, unless a `step` override is given.

#### Type parameters

• **T**

#### Parameters

• **options**: `Object`

• **options\.name**: `string`

• **options\.step?**: [`LogStep`](#logstep)

• **fn**: (`step`) => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

#### Example

```ts
export async function exists(filename: string, { step }: Options = {}) {
	return stepWrapper({ step, name: 'Step fallback name' }, (step) => {
		return; // do some work
	});
}
```

#### Source

[modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts#L37)

---

### LoggerOptions

```ts
type LoggerOptions: Object;
```

#### Type declaration

| Member      | Type                        | Description                                                                                                                            |
| :---------- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `stream`    | `Writable`                  | Advanced – override the writable stream in order to pipe logs elsewhere. Mostly used for dependency injection for `@onerepo/test-cli`. |
| `verbosity` | [`Verbosity`](#verbosity-1) | Control how much and what kind of output the Logger will provide.                                                                      |

#### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L22)

---

### Verbosity

```ts
type Verbosity:
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5;
```

Control the verbosity of the log output

| Value  | What        | Description                                      |
| ------ | ----------- | ------------------------------------------------ |
| `<= 0` | Silent      | No output will be read or written.               |
| `>= 1` | Error, Info |                                                  |
| `>= 2` | Warnings    |                                                  |
| `>= 3` | Log         |                                                  |
| `>= 4` | Debug       | `logger.debug()` will be included                |
| `>= 5` | Timing      | Extra performance timing metrics will be written |

#### Source

[modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L18)

## Package management

### getLockfile()

```ts
getLockfile(cwd): string | null
```

Get the absolute path for the package manager's lock file for this repository.

#### Parameters

• **cwd**: `string`

#### Returns

`string` \| `null`

#### Source

[modules/package-manager/src/get-package-manager.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/get-package-manager.ts#L14)

---

### getPackageManager()

```ts
getPackageManager(type): PackageManager
```

Get the [`PackageManager`](#packagemanager) for the given package manager type (NPM, PNPm, or Yarn)

#### Parameters

• **type**: `"yarn"` \| `"npm"` \| `"pnpm"`

#### Returns

[`PackageManager`](#packagemanager)

#### Source

[modules/package-manager/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/index.ts#L8)

---

### getPackageManagerName()

```ts
getPackageManagerName(cwd, fromPkgJson?): "npm" | "pnpm" | "yarn"
```

Get the package manager for the current working directory with _some_ confidence

#### Parameters

• **cwd**: `string`

Current working directory. Should be the root of the module/repository.

• **fromPkgJson?**: `string`

Value as defined in a package.json file, typically the `packageManager` value

#### Returns

`"npm"` \| `"pnpm"` \| `"yarn"`

#### Source

[modules/package-manager/src/get-package-manager.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/get-package-manager.ts#L9)

---

### PackageManager

Implementation details for all package managers. This interface defines a subset of common methods typically needed when interacting with a monorepo and its dependency [`graph.Graph`](namespaces/graph/#graph) & [`graph.Workspace`](namespaces/graph/#workspace)s.

#### Methods

##### add()

```ts
add(packages, opts?): Promise<void>
```

Add one or more packages from external registries

###### Parameters

• **packages**: `string` \| `string`[]

One or more packages, by name and/or `'name@version'`.

• **opts?**: `Object`

Various options to pass while installing the packages

• **opts\.dev?**: `boolean`

Set to true to install as a `devDependency`.

**Default**

```ts
false;
```

###### Returns

`Promise`\<`void`\>

###### Source

[modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts#L13)

##### batch()

```ts
batch(processes): Promise<(Error | [string, string])[]>
```

Batch commands from npm packages as a batch of subprocesses using the package manager. Alternative to batching with `npm exec` and compatible APIs.

###### Parameters

• **processes**: [`RunSpec`](#runspec)[]

###### Returns

`Promise`\<(`Error` \| [`string`, `string`])[]\>

###### See

[`batch`](#batch) for general subprocess batching.

###### Source

[modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts#L24)

##### install()

```ts
install(cwd?): Promise<string>
```

Install current dependencies as listed in the package manager's lock file

###### Parameters

• **cwd?**: `string`

###### Returns

`Promise`\<`string`\>

###### Source

[modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts#L33)

##### loggedIn()

```ts
loggedIn(opts?): Promise<boolean>
```

Check if the current user is logged in to the external registry

###### Parameters

• **opts?**: `Object`

• **opts\.registry?**: `string`

The base URL of your NPM registry. PNPM and NPM ignore scope and look up per-registry.

• **opts\.scope?**: `string`

When using Yarn, lookups are done by registry configured by scope. This value must be included if you have separate registries for separate scopes.

###### Returns

`Promise`\<`boolean`\>

###### Source

[modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts#L37)

##### publish()

```ts
publish<T>(opts?): Promise<void>
```

Publish workspaces to the external registry

###### Type parameters

• **T** extends [`MinimalWorkspace`](#minimalworkspace)

###### Parameters

• **opts?**: `Object`

• **opts\.access?**: `"restricted"` \| `"public"`

Set the registry access level for the package

**Default**
inferred from workspaces `publishConfig.access` or `'public'`

• **opts\.cwd?**: `string`

Command working directory. Defaults to the repository root.

• **opts\.otp?**: `string`

This is a one-time password from a two-factor authenticator.

• **opts\.tag?**: `string`

If you ask npm to install a package and don't tell it a specific version, then it will install the specified tag.

**Default**

```ts
'latest';
```

• **opts\.workspaces?**: `T`[]

Workspaces to publish. If not provided or empty array, only the given workspace at `cwd` will be published. This type is generally compatible with [`graph.Workspace`](namespaces/graph/#workspace).

###### Returns

`Promise`\<`void`\>

###### Source

[modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts#L55)

##### publishable()

```ts
publishable<T>(workspaces): Promise<T[]>
```

Filter workspaces to the set of those that are actually publishable. This will check both whether the package is not marked as "private" and if the current version is not in the external registry.

###### Type parameters

• **T** extends [`MinimalWorkspace`](#minimalworkspace)

###### Parameters

• **workspaces**: `T`[]

List of compatible [`graph.Workspace`](namespaces/graph/#workspace) objects.

###### Returns

`Promise`\<`T`[]\>

###### Source

[modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts#L51)

##### remove()

```ts
remove(packages): Promise<void>
```

Remove one or more packages.

###### Parameters

• **packages**: `string` \| `string`[]

One or more packages, by name

###### Returns

`Promise`\<`void`\>

###### Source

[modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts#L83)

##### run()

```ts
run(opts): Promise<[string, string]>
```

Run a command from an npm package as a subprocess using the package manager. Alternative to `npm exec` and compatible APIs.

###### Parameters

• **opts**: [`RunSpec`](#runspec)

###### Returns

`Promise`\<[`string`, `string`]\>

###### See

[`batch`](#batch) for general subprocess running.

###### Source

[modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts#L29)

---

### MinimalWorkspace

```ts
type MinimalWorkspace: Object;
```

#### Type declaration

| Member     | Type      | Description |
| :--------- | :-------- | :---------- |
| `location` | `string`  | -           |
| `name`     | `string`  | -           |
| `private`  | `boolean` | -           |
| `version`  | `string`  | -           |

#### Source

[modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts#L88)

## Subprocess

### BatchError

#### Extends

- `Error`

#### Constructors

##### new BatchError(errors, options)

```ts
new BatchError(errors, options?): BatchError
```

###### Parameters

• **errors**: (`string` \| [`SubprocessError`](#subprocesserror))[]

• **options?**: `ErrorOptions`

###### Returns

[`BatchError`](#batcherror)

###### Overrides

`Error.constructor`

###### Source

[modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L159)

#### Properties

| Modifier | Property             | Type                                                  | Description | Inheritance               | Source                                                                                                                     |
| :------- | :------------------- | :---------------------------------------------------- | :---------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------- |
| `public` | `cause?`             | `unknown`                                             | -           | `Error.cause`             | node_modules/typescript/lib/lib.es2022.error.d.ts:24                                                                       |
| `public` | `errors`             | (`string` \| [`SubprocessError`](#subprocesserror))[] | -           | -                         | [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L158) |
| `public` | `message`            | `string`                                              | -           | `Error.message`           | node_modules/typescript/lib/lib.es5.d.ts:1076                                                                              |
| `public` | `name`               | `string`                                              | -           | `Error.name`              | node_modules/typescript/lib/lib.es5.d.ts:1075                                                                              |
| `static` | `prepareStackTrace?` | (`err`, `stackTraces`) => `any`                       | -           | `Error.prepareStackTrace` | node_modules/@types/node/globals.d.ts:28                                                                                   |
| `public` | `stack?`             | `string`                                              | -           | `Error.stack`             | node_modules/typescript/lib/lib.es5.d.ts:1077                                                                              |
| `static` | `stackTraceLimit`    | `number`                                              | -           | `Error.stackTraceLimit`   | node_modules/@types/node/globals.d.ts:30                                                                                   |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Create .stack property on a target object

###### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

###### Returns

`void`

###### Inherited from

`Error.captureStackTrace`

###### Source

node_modules/@types/node/globals.d.ts:21

---

### SubprocessError

#### Extends

- `Error`

#### Constructors

##### new SubprocessError(message, options)

```ts
new SubprocessError(message, options?): SubprocessError
```

###### Parameters

• **message**: `string`

• **options?**: `ErrorOptions`

###### Returns

[`SubprocessError`](#subprocesserror)

###### Overrides

`Error.constructor`

###### Source

[modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L152)

#### Properties

| Modifier | Property             | Type                            | Description | Inheritance               | Source                                               |
| :------- | :------------------- | :------------------------------ | :---------- | :------------------------ | :--------------------------------------------------- |
| `public` | `cause?`             | `unknown`                       | -           | `Error.cause`             | node_modules/typescript/lib/lib.es2022.error.d.ts:24 |
| `public` | `message`            | `string`                        | -           | `Error.message`           | node_modules/typescript/lib/lib.es5.d.ts:1076        |
| `public` | `name`               | `string`                        | -           | `Error.name`              | node_modules/typescript/lib/lib.es5.d.ts:1075        |
| `static` | `prepareStackTrace?` | (`err`, `stackTraces`) => `any` | -           | `Error.prepareStackTrace` | node_modules/@types/node/globals.d.ts:28             |
| `public` | `stack?`             | `string`                        | -           | `Error.stack`             | node_modules/typescript/lib/lib.es5.d.ts:1077        |
| `static` | `stackTraceLimit`    | `number`                        | -           | `Error.stackTraceLimit`   | node_modules/@types/node/globals.d.ts:30             |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Create .stack property on a target object

###### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

###### Returns

`void`

###### Inherited from

`Error.captureStackTrace`

###### Source

node_modules/@types/node/globals.d.ts:21

---

### batch()

```ts
batch(processes): Promise<([string, string] | Error)[]>
```

Batch multiple subprocesses, similar to `Promise.all`, but only run as many processes at a time fulfilling N-1 cores. If there are more processes than cores, as each process finishes, a new process will be picked to run, ensuring maximum CPU usage at all times.

If any process throws a `SubprocessError`, this function will reject with a `BatchError`, but only after _all_ processes have completed running.

Most oneRepo commands will consist of at least one [`run()`](#run) or [`batch()`](#batch) processes.

```ts
const processes: Array<RunSpec> = [
	{ name: 'Say hello', cmd: 'echo', args: ['"hello"'] },
	{ name: 'Say world', cmd: 'echo', args: ['"world"'] },
];

const results = await batch(processes);

expect(results).toEqual([
	['hello', ''],
	['world', ''],
]);
```

#### Parameters

• **processes**: ([`RunSpec`](#runspec) \| [`PromiseFn`](#promisefn))[]

#### Returns

`Promise`\<([`string`, `string`] \| `Error`)[]\>

#### Throws

[`BatchError`](#batcherror) An object that includes a list of all of the [`SubprocessError`](#subprocesserror)s thrown.

#### See

[`PackageManager.batch`](#batch) to safely batch executables exposed from third party modules.

#### Source

[modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L147)

---

### run()

```ts
run(options): Promise<[string, string]>
```

Spawn a process and capture its `stdout` and `stderr` through a Logger Step. Most oneRepo commands will consist of at least one [`run()`](#run) or [`batch()`](#batch) processes.

The `run()` command is an async wrapper around Node.js’s [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) and has a very similar API, with some additions. This command will buffer and catch all `stdout` and `stderr` responses.

```ts
await run({
	name: 'Do some work',
	cmd: 'echo',
	args: ['"hello!"'],
});
```

#### Parameters

• **options**: [`RunSpec`](#runspec)

#### Returns

`Promise`\<[`string`, `string`]\>

A promise with an array of `[stdout, stderr]`, as captured from the command run.

#### Example

**Skipping failures:**

If a subprocess fails when called through `run()`, a [`SubprocessError`](#subprocesserror) will be thrown. Some third-party tooling will exit with error codes as an informational tool. While this is discouraged, there’s nothing we can do about how they’ve been chosen to work. To prevent throwing errors, but still act on the `stderr` response, include the `skipFailures` option:

```ts
const [stdout, stderr] = await run({
	name: 'Run dry',
	cmd: 'echo',
	args: ['"hello"'],
	skipFailures: true,
});

logger.error(stderr);
```

#### Example

**Dry-run:**

By default, `run()` will respect oneRepo’s `--dry-run` option (see [`DefaultArgv`](#defaultargv), `process.env.ONE_REPO_DRY_RUN`). When set, the process will not be spawned, but merely log information about what would run instead. To continue running a command, despite the `--dry-run` option being set, use `runDry: true`:

```ts
await run({
	name: 'Run dry',
	cmd: 'echo',
	args: ['"hello"'],
	runDry: true,
});
```

#### Throws

[`SubprocessError`](#subprocesserror) if not `skipFailures` and the spawned process does not exit cleanly (with code `0`)

#### See

[`PackageManager.run`](#run) to safely run executables exposed from third party modules.

#### Source

[modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L99)

---

### start()

```ts
start(options): ChildProcess
```

Start a subprocess. For use when control over watching the stdout and stderr or long-running processes that are not expected to complete without SIGINT/SIGKILL.

#### Parameters

• **options**: `Omit`\<[`RunSpec`](#runspec), `"name"` \| `"runDry"`\>

#### Returns

`ChildProcess`

#### Source

[modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L105)

---

### sudo()

```ts
sudo(options): Promise<[string, string]>
```

This function is similar to `run`, but can request and run with elevated `sudo` permissions. This function should not be used unless you absolutely _know_ that you will need to spawn an executable with elevated permissions.

This function will first check if `sudo` permissions are valid. If not, the logger will warn the user that sudo permissions are being requested and properly pause the animated logger while the user enters their password directly through `stdin`. If permissions are valid, no warning will be given.

```ts
await sudo({
	name: 'Change permissions',
	cmd: 'chmod',
	args: ['a+x', '/usr/bin/thing'],
	reason: 'When prompted, please type your password and hit [RETURN] to allow `thing` to be run later',
});
```

#### Parameters

• **options**: `Omit`\<[`RunSpec`](#runspec), `"opts"`\> & `Object`

#### Returns

`Promise`\<[`string`, `string`]\>

#### Source

[modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L122)

---

### PromiseFn

```ts
type PromiseFn: () => Promise<[string, string]>;
```

#### Returns

`Promise`\<[`string`, `string`]\>

#### Source

[modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L7)

---

### RunSpec

```ts
type RunSpec: Object;
```

The core configuration for [`run`](#run-1), [`start`](#start), [`sudo`](#sudo), and [`batch`](#batch-1) subprocessing.

#### Type declaration

| Member         | Type                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `args`         | `string`[]            | Arguments to pass to the executable. All arguments must be separate string entries.<br /><br />Beware that some commands have different ways of parsing arguments.<br /><br />Typically, it is safest to have separate entries in the `args` array for the flag and its value:<br />`args: ['--some-flag', 'some-flags-value']`<br />However, if an argument parser is implemented in a non-standard way, the flag and its value may need to be a single entry:<br />`args: ['--some-flag=some-flags-value']` |
| `cmd`          | `string`              | The command to run. This should be an available executable or path to an executable.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `name`         | `string`              | A friendly name for the Step in log output.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `opts`         | `SpawnOptions`        | See the [Node.js `child_process.spawn()` documentation](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) for available options.                                                                                                                                                                                                                                                                                                                                              |
| `runDry`       | `boolean`             | Skip the `--dry-run` check and run this command anyway.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `skipFailures` | `boolean`             | Prevents throwing a [`SubprocessError`](#subprocesserror) in the event of the process failing and exiting with an unclean state.                                                                                                                                                                                                                                                                                                                                                                              |
| `step`         | [`LogStep`](#logstep) | Pass a custom [`LogStep`](#logstep) to bundle this process input & output into another step instead of creating a new one.                                                                                                                                                                                                                                                                                                                                                                                    |

#### Source

[modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L12)

<!-- end-onerepo-sentinel -->
