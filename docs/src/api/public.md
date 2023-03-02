---
title: 'API: public'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

onerepo

# onerepo

## Namespaces

- [file](/docs/core/api/modules/file/)
- [git](/docs/core/api/modules/git/)

## Classes

- [BatchError](/docs/core/api/classes/BatchError/)
- [LogStep](/docs/core/api/classes/LogStep/)
- [Logger](/docs/core/api/classes/Logger/)
- [Repository](/docs/core/api/classes/Repository/)
- [SubprocessError](/docs/core/api/classes/SubprocessError/)
- [Workspace](/docs/core/api/classes/Workspace/)

## Interfaces

- [App](/docs/core/api/interfaces/App/)
- [Config](/docs/core/api/interfaces/Config/)
- [DefaultArguments](/docs/core/api/interfaces/DefaultArguments/)
- [HandlerExtra](/docs/core/api/interfaces/HandlerExtra/)
- [LoggerOptions](/docs/core/api/interfaces/LoggerOptions/)
- [PackageJson](/docs/core/api/interfaces/PackageJson/)
- [PackageJsonWithLocation](/docs/core/api/interfaces/PackageJsonWithLocation/)
- [PrivatePackageJson](/docs/core/api/interfaces/PrivatePackageJson/)
- [PublicPackageJson](/docs/core/api/interfaces/PublicPackageJson/)
- [RunSpec](/docs/core/api/interfaces/RunSpec/)

## Variables

### logger

`Const` **logger**: [`Logger`](/docs/core/api/classes/Logger/)

This logger is a singleton instance for use across all of oneRepo and its commands.

Available as a root import:

```ts
import { logger } from 'onerepo';
```

Available as extras on Handler functions:

```ts
export const handler: Handler = (argv, { logger }) => {
	logger.log('Hello!');
};
```

#### Defined in

[modules/logger/src/index.ts:24](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts#L24)

## Functions

### batch

**batch**(`processes`): `Promise`<([`string`, `string`] \| `Error`)[]\>

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

| Name        | Type                                              |
| :---------- | :------------------------------------------------ |
| `processes` | [`RunSpec`](/docs/core/api/interfaces/RunSpec/)[] |

#### Returns

`Promise`<([`string`, `string`] \| `Error`)[]\>

#### Defined in

[modules/subprocess/src/index.ts:230](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L230)

---

### getAffected

**getAffected**(`graph`, `«destructured»?`): `Promise`<[`Workspace`](/docs/core/api/classes/Workspace/)[]\>

Get a list of the affected workspaces.

Typically, this should be used from the helpers provided by the command [`Handler`](#handler), in which case the first argument has been scoped for you already.

```ts
export const handler: Handler = (argv, { getAffected, logger }) => {
	const workspaces = await getAffected();
	for (const ws of workspaces) {
		logger.log(ws.name);
	}
};
```

#### Parameters

| Name             | Type                                                    |
| :--------------- | :------------------------------------------------------ |
| `graph`          | [`Repository`](/docs/core/api/classes/Repository/)      |
| `«destructured»` | [`GetterOptions`](/docs/core/api/public/#getteroptions) |

#### Returns

`Promise`<[`Workspace`](/docs/core/api/classes/Workspace/)[]\>

#### Defined in

[modules/builders/src/getters.ts:41](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L41)

---

### getFilepaths

**getFilepaths**(`graph`, `argv`, `«destructured»?`): `Promise`<`string`[]\>

Get a list of filepaths based on the input arguments made available with the builders [`withAffected`](#withaffected), [`withAllInputs`](#withallinputs), [`withFiles`](#withfiles), and [`withWorkspaces`](#withworkspaces).

When providing `--workspaces <names>`, the paths will be paths to the requested workspaces, not individual files.

Typically, this should be used from the helpers provided by the command [`Handler`](#handler), in which case the first argument has been scoped for you already.

```ts
export const handler: Handler = (argv, { getFilepaths, logger }) => {
	const filepaths = await getFilepaths();
	for (const files of filepaths) {
		logger.log(files);
	}
};
```

#### Parameters

| Name             | Type                                                    |
| :--------------- | :------------------------------------------------------ |
| `graph`          | [`Repository`](/docs/core/api/classes/Repository/)      |
| `argv`           | [`GetterArgv`](/docs/core/api/public/#getterargv)       |
| `«destructured»` | [`GetterOptions`](/docs/core/api/public/#getteroptions) |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[modules/builders/src/getters.ts:133](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L133)

---

### getGraph

**getGraph**(`workingDir?`): [`Repository`](/docs/core/api/classes/Repository/)

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `workingDir` | `string` |

#### Returns

[`Repository`](/docs/core/api/classes/Repository/)

#### Defined in

[modules/graph/src/index.ts:14](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/index.ts#L14)

---

### getRootPackageJson

**getRootPackageJson**(`searchLocation`): `Object`

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `searchLocation` | `string` |

#### Returns

`Object`

| Name       | Type                                                                  |
| :--------- | :-------------------------------------------------------------------- |
| `filePath` | `string`                                                              |
| `json`     | [`PrivatePackageJson`](/docs/core/api/interfaces/PrivatePackageJson/) |

#### Defined in

[modules/graph/src/index.ts:19](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/index.ts#L19)

---

### getWorkspaces

**getWorkspaces**(`graph`, `argv`, `«destructured»?`): `Promise`<[`Workspace`](/docs/core/api/classes/Workspace/)[]\>

Get a list of workspaces based on the input arguments made available with the builders [`withAffected`](#withaffected), [`withAllInputs`](#withallinputs), [`withFiles`](#withfiles), and [`withWorkspaces`](#withworkspaces).

Typically, this should be used from the helpers provided by the command [`Handler`](#handler), in which case the first argument has been scoped for you already.

```ts
export const handler: Handler = (argv, { getWorkspaces, logger }) => {
	const workspaces = await getWorkspaces();
	for (const ws of workspaces) {
		logger.log(ws.name);
	}
};
```

#### Parameters

| Name             | Type                                                    |
| :--------------- | :------------------------------------------------------ |
| `graph`          | [`Repository`](/docs/core/api/classes/Repository/)      |
| `argv`           | [`GetterArgv`](/docs/core/api/public/#getterargv)       |
| `«destructured»` | [`GetterOptions`](/docs/core/api/public/#getteroptions) |

#### Returns

`Promise`<[`Workspace`](/docs/core/api/classes/Workspace/)[]\>

#### Defined in

[modules/builders/src/getters.ts:79](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L79)

---

### run

**run**(`options`): `Promise`<[`string`, `string`]\>

Spawn a process and capture its `stdout` and `stderr` through a Logger Step. Most oneRepo commands will consist of at least one [`run()`](#run) or [`batch()`](#batch) processes.

#### Parameters

| Name      | Type                                            |
| :-------- | :---------------------------------------------- |
| `options` | [`RunSpec`](/docs/core/api/interfaces/RunSpec/) |

#### Returns

`Promise`<[`string`, `string`]\>

A promise with an array of `[stdout, stderr]`, as captured from the command run.

```ts
await run({
	name: 'Do some work',
	cmd: 'echo',
	args: ['"hello!"'],
});
```

#### Defined in

[modules/subprocess/src/index.ts:41](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L41)

---

### setup

**setup**(`config?`): `Promise`<[`App`](/docs/core/api/interfaces/App/)\>

Set up and run your command-line interface.

```js
setup({
	name: 'one',
	// ...config
}).then(({ run }) => run());
```

#### Parameters

| Name     | Type                                          |
| :------- | :-------------------------------------------- |
| `config` | [`Config`](/docs/core/api/interfaces/Config/) |

#### Returns

`Promise`<[`App`](/docs/core/api/interfaces/App/)\>

#### Defined in

[modules/core/src/index.ts:128](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L128)

---

### start

**start**(`options`): `ChildProcess`

Start a subprocess. For use when control over watching the stdout and stderr or long-running processes that are not expected to complete without SIGINT/SIGKILL.

#### Parameters

| Name      | Type                                                                             |
| :-------- | :------------------------------------------------------------------------------- |
| `options` | `Omit`<[`RunSpec`](/docs/core/api/interfaces/RunSpec/), `"name"` \| `"runDry"`\> |

#### Returns

`ChildProcess`

#### Defined in

[modules/subprocess/src/index.ts:136](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L136)

---

### stepWrapper

**stepWrapper**<`T`\>(`«destructured»`, `fn`): `Promise`<`T`\>

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name             | Type                                                                      |
| :--------------- | :------------------------------------------------------------------------ |
| `«destructured»` | `WrapperArgs`                                                             |
| `fn`             | (`step`: [`LogStep`](/docs/core/api/classes/LogStep/)) => `Promise`<`T`\> |

#### Returns

`Promise`<`T`\>

#### Defined in

[modules/logger/src/index.ts:31](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts#L31)

---

### sudo

**sudo**(`options`): `Promise`<[`string`, `string`]\>

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

| Name      | Type                                                                                         |
| :-------- | :------------------------------------------------------------------------------------------- |
| `options` | `Omit`<[`RunSpec`](/docs/core/api/interfaces/RunSpec/), `"opts"`\> & { `reason?`: `string` } |

#### Returns

`Promise`<[`string`, `string`]\>

#### Defined in

[modules/subprocess/src/index.ts:170](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L170)

---

### withAffected

**withAffected**<`T`\>(`yargs`): [`Yargs`](/docs/core/api/public/#yargs)<`T` & [`WithAffected`](/docs/core/api/public/#withaffected-1)\>

Adds the following input arguments to command [handler](#handler). Typically used in conjunction with getters like [`getAffected`](#getaffected), [`getFiles`](#getfiles), and [`getWorkspaces`](#getworkspaces).

- `--affected`
- `--from-ref`
- `--through-ref`

If all of `--all`, `--files`, and `--workspaces` were not passed, `--affected` will default to `true`.

See [`WithAffected`](#withaffected-1) for type safety.

```js
export const builder = (yargs) => withAffected(yargs);
```

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name    | Type                                          |
| :------ | :-------------------------------------------- |
| `yargs` | [`Yargs`](/docs/core/api/public/#yargs)<`T`\> |

#### Returns

[`Yargs`](/docs/core/api/public/#yargs)<`T` & [`WithAffected`](/docs/core/api/public/#withaffected-1)\>

#### Defined in

[modules/builders/src/with-affected.ts:17](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts#L17)

---

### withAllInputs

**withAllInputs**(`yargs`): [`Yargs`](/docs/core/api/public/#yargs)<[`WithAllInputs`](/docs/core/api/public/#withallinputs-1)\>

Helper to chain all of [`withAffected`](#withaffected), [`withFiles`](#withfiles), and [`withWorkspaces`](#withworkspaces) on a [`Builder`](#builder).

```js
export const builder = (yargs) => withAllInputs(yargs);
```

#### Parameters

| Name    | Type                                                                                          |
| :------ | :-------------------------------------------------------------------------------------------- |
| `yargs` | [`Yargs`](/docs/core/api/public/#yargs)<[`DefaultArgv`](/docs/core/api/public/#defaultargv)\> |

#### Returns

[`Yargs`](/docs/core/api/public/#yargs)<[`WithAllInputs`](/docs/core/api/public/#withallinputs-1)\>

#### Defined in

[modules/builders/src/with-all-inputs.ts:16](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-all-inputs.ts#L16)

---

### withFiles

**withFiles**<`T`\>(`yargs`): [`Yargs`](/docs/core/api/public/#yargs)<`T` & [`WithFiles`](/docs/core/api/public/#withfiles-1)\>

Adds the following input arguments to command [handler](#handler). Typically used in conjunction with getters like [`getFiles`](#getfiles).

- `--files`

See [`WithFiles`](#withfiles-1) for type safety.

```js
export const builder = (yargs) => withFiles(yargs);
```

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name    | Type                                          |
| :------ | :-------------------------------------------- |
| `yargs` | [`Yargs`](/docs/core/api/public/#yargs)<`T`\> |

#### Returns

[`Yargs`](/docs/core/api/public/#yargs)<`T` & [`WithFiles`](/docs/core/api/public/#withfiles-1)\>

#### Defined in

[modules/builders/src/with-files.ts:13](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-files.ts#L13)

---

### withWorkspaces

**withWorkspaces**<`T`\>(`yargs`): [`Yargs`](/docs/core/api/public/#yargs)<`T` & [`WithWorkspaces`](/docs/core/api/public/#withworkspaces-1)\>

Adds the following input arguments to command [handler](#handler). Typically used in conjunction with getters like [`getAffected`](#getaffected) [`getWorkspaces`](#getworkspaces).

- `--all`
- `--workspaces`

See [`WithWorkspaces`](#withworkspaces-1) for type safety.

```js
export const builder = (yargs) => withWorkspaces(yargs);
```

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name    | Type                                          |
| :------ | :-------------------------------------------- |
| `yargs` | [`Yargs`](/docs/core/api/public/#yargs)<`T`\> |

#### Returns

[`Yargs`](/docs/core/api/public/#yargs)<`T` & [`WithWorkspaces`](/docs/core/api/public/#withworkspaces-1)\>

#### Defined in

[modules/builders/src/with-workspaces.ts:14](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-workspaces.ts#L14)

## Type Aliases

### Arguments

**Arguments**<`T`\>: { [key in keyof T]: T[key] } & [`DefaultArguments`](/docs/core/api/interfaces/DefaultArguments/)

#### Type parameters

| Name | Type     |
| :--- | :------- |
| `T`  | `object` |

#### Defined in

[modules/types/src/index.ts:100](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L100)

---

### Argv

**Argv**<`T`\>: [`Arguments`](/docs/core/api/public/#arguments)<`T` & [`DefaultArgv`](/docs/core/api/public/#defaultargv)\>

Helper for combining local parsed arguments along with the default arguments provided by the oneRepo command module.

#### Type parameters

| Name | Type     |
| :--- | :------- |
| `T`  | `object` |

#### Defined in

[modules/types/src/index.ts:110](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L110)

---

### Builder

**Builder**<`U`\>: (`argv`: [`Yargs`](/docs/core/api/public/#yargs)) => `Yargv`<`U`\>

#### Type parameters

| Name | Type     |
| :--- | :------- |
| `U`  | `object` |

#### Type declaration

(`argv`): `Yargv`<`U`\>

Option argument parser for the given command. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for more, but note that only the object variant is not accepted – only function variants will be accepted in oneRepo commands.

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

##### Parameters

| Name   | Type                                    |
| :----- | :-------------------------------------- |
| `argv` | [`Yargs`](/docs/core/api/public/#yargs) |

##### Returns

`Yargv`<`U`\>

#### Defined in

[modules/types/src/index.ts:128](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L128)

---

### DefaultArgv

**DefaultArgv**: `Object`

Default arguments provided globally for all commands. These arguments are included by when using [`Builder`](#builder) and [`Handler`](#handler).

#### Type declaration

| Name        | Type      | Description                                                                                                                                                                                                                               |
| :---------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dry-run`   | `boolean` | Whether the command should run non-destructive dry-mode. This prevents all subprocesses, files, and git operations from running unless explicitly specified as safe to run. Also internally sets `process.env.ONE_REPO_DRY_RUN = 'true'`. |
| `silent`    | `boolean` | Silence all logger output. Prevents _all_ stdout and stderr output from the logger entirely.                                                                                                                                              |
| `verbosity` | `number`  | Verbosity level for the Logger. See Logger.verbosity for more information.                                                                                                                                                                |

#### Defined in

[modules/types/src/index.ts:20](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L20)

---

### GetterArgv

**GetterArgv**: `Object`

#### Type declaration

| Name          | Type       | Description                                                                                                 |
| :------------ | :--------- | :---------------------------------------------------------------------------------------------------------- |
| `affected?`   | `boolean`  | Whether to get the list of affected workspaces based on the other inputs of `all`, `files`, or `workspaces` |
| `all?`        | `boolean`  | Include _all_ workspaces or filepaths.                                                                      |
| `files?`      | `string`[] | A list of files to calculate the affected workspaces, or filepaths.                                         |
| `workspaces?` | `string`[] | A list of workspaces to calculate the affected workspaces or filepaths.                                     |

#### Defined in

[modules/builders/src/getters.ts:8](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L8)

---

### GetterOptions

**GetterOptions**: `Object`

#### Type declaration

| Name       | Type                                         | Description                                                                                      |
| :--------- | :------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| `from?`    | `string`                                     | Git ref to calculate changes _exclusively_ _since_.                                              |
| `ignore?`  | `string`[]                                   | List of files to not take into account when getting the list of files, workspaces, and affected. |
| `step?`    | [`LogStep`](/docs/core/api/classes/LogStep/) | Optional logger step to avoid creating a new                                                     |
| `through?` | `string`                                     | Git ref to calculate changes _inclusively_ _through_.                                            |

#### Defined in

[modules/types/src/index.ts:37](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L37)

---

### GraphSchemaValidators

**GraphSchemaValidators**: `Record`<`string`, `Record`<`string`, `Schema`\>\>

#### Defined in

[modules/core/src/core/graph/schema.ts:3](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/core/graph/schema.ts#L3)

---

### Handler

**Handler**<`T`\>: (`argv`: [`Argv`](/docs/core/api/public/#argv)<`T`\>, `extra`: [`HandlerExtra`](/docs/core/api/interfaces/HandlerExtra/)) => `Promise`<`void`\>

#### Type parameters

| Name | Type     |
| :--- | :------- |
| `T`  | `object` |

#### Type declaration

(`argv`, `extra`): `Promise`<`void`\>

Command handler that includes oneRepo tools like `graph`, `logger`, and more. This function is type-safe if `Argv` is correctly passed through to the type definition.

```ts
type Argv = {
	'with-tacos'?: boolean;
};
export const handler: Handler<Argv> = (argv, { logger }) => {
	const { 'with-tacos': withTacos } = argv;
	logger.log(withTacos ? 'Include tacos' : 'No tacos, thanks');
};
```

##### Parameters

| Name    | Type                                                      |
| :------ | :-------------------------------------------------------- |
| `argv`  | [`Argv`](/docs/core/api/public/#argv)<`T`\>               |
| `extra` | [`HandlerExtra`](/docs/core/api/interfaces/HandlerExtra/) |

##### Returns

`Promise`<`void`\>

#### Defined in

[modules/types/src/index.ts:143](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L143)

---

### Lifecycle

**Lifecycle**: `MakeLifecycles`<[`StandardLifecycles`](/docs/core/api/public/#standardlifecycles)\>

#### Defined in

[modules/types/src/index.ts:173](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L173)

---

### Plugin

**Plugin**: `PluginObject` \| (`config`: [`Config`](/docs/core/api/interfaces/Config/)) => `PluginObject`

#### Defined in

[modules/core/src/index.ts:46](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L46)

---

### PluginPrePostHandler

**PluginPrePostHandler**: (`argv`: [`Argv`](/docs/core/api/public/#argv)<[`DefaultArgv`](/docs/core/api/public/#defaultargv)\>, `extra`: [`HandlerExtra`](/docs/core/api/interfaces/HandlerExtra/)) => `Promise`<`void`\> \| `void`

#### Type declaration

(`argv`, `extra`): `Promise`<`void`\> \| `void`

##### Parameters

| Name    | Type                                                                                        |
| :------ | :------------------------------------------------------------------------------------------ |
| `argv`  | [`Argv`](/docs/core/api/public/#argv)<[`DefaultArgv`](/docs/core/api/public/#defaultargv)\> |
| `extra` | [`HandlerExtra`](/docs/core/api/interfaces/HandlerExtra/)                                   |

##### Returns

`Promise`<`void`\> \| `void`

#### Defined in

[modules/core/src/index.ts:30](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L30)

---

### StandardLifecycles

**StandardLifecycles**: `"commit"` \| `"checkout"` \| `"merge"` \| `"build"` \| `"deploy"` \| `"publish"`

#### Defined in

[modules/types/src/index.ts:171](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L171)

---

### Task

**Task**: `string` \| [`TaskDef`](/docs/core/api/public/#taskdef)

A Task can either be a string or TaskDef object with extra options.

#### Defined in

[modules/types/src/index.ts:164](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L164)

---

### TaskConfig

**TaskConfig**<`L`\>: `Partial`<`Record`<[`Lifecycle`](/docs/core/api/public/#lifecycle) \| `MakeLifecycles`<`L`\>, [`Tasks`](/docs/core/api/public/#tasks)\>\>

#### Type parameters

| Name | Type                       |
| :--- | :------------------------- |
| `L`  | extends `string` = `never` |

#### Defined in

[modules/types/src/index.ts:175](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L175)

---

### TaskDef

**TaskDef**: `Object`

#### Type declaration

| Name     | Type                           | Description                                                                                                                                                                                                              |
| :------- | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cmd`    | `string`                       | String command to run. Special values include: - `$0`: the oneRepo CLI for your repository - `${workspaces}`: replaced with a space-separated list of workspace names necessary for the given lifecycle                  |
| `match?` | `string`                       | Glob file match. This will force the `cmd` to run if any of the paths in the modified files list match the glob. Conversely, if no files are matched, the `cmd` _will not_ run.                                          |
| `meta?`  | `Record`<`string`, `unknown`\> | Extra information that will be provided only when listing tasks with the `--list` option from the `tasks` command. This object is helpful when creating a matrix of runners with GitHub actions or similar CI pipelines. |

#### Defined in

[modules/types/src/index.ts:145](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L145)

---

### Tasks

**Tasks**: `Object`

#### Type declaration

| Name          | Type                                    |
| :------------ | :-------------------------------------- |
| `parallel?`   | [`Task`](/docs/core/api/public/#task)[] |
| `sequential?` | [`Task`](/docs/core/api/public/#task)[] |

#### Defined in

[modules/types/src/index.ts:166](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L166)

---

### WithAffected

**WithAffected**: `Object`

To be paired with the [`withAffected()` builder](#withaffected). Adds types for arguments parsed.

```ts
type Argv = WithAffected & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => withAffected(yargs);
```

#### Type declaration

| Name           | Type      | Description                                                                                                         |
| :------------- | :-------- | :------------------------------------------------------------------------------------------------------------------ |
| `affected?`    | `boolean` | When used with builder helpers, will include all of the affected workspaces based on changes within the repository. |
| `from-ref?`    | `string`  | Git ref to calculate changes _exclusively_ _since_.                                                                 |
| `through-ref?` | `string`  | Git ref to calculate changes _inclusively_ _through_.                                                               |

#### Defined in

[modules/builders/src/with-affected.ts:54](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts#L54)

---

### WithAllInputs

**WithAllInputs**: [`WithAffected`](/docs/core/api/public/#withaffected-1) & [`WithFiles`](/docs/core/api/public/#withfiles-1) & [`WithWorkspaces`](/docs/core/api/public/#withworkspaces-1)

Helper to include all of [`WithAffected`](#withaffected-1), [`WithFiles`](#withfiles-1), and [`WithWorkspaces`](#withworkspaces-1) on builder [`Argv`](#argv).

```ts
type Argv = WithAllInputs & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => withAllInputs(yargs);
```

#### Defined in

[modules/builders/src/with-all-inputs.ts:30](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-all-inputs.ts#L30)

---

### WithFiles

**WithFiles**: `Object`

To be paired with the [`withFiles()` builder](#withfiles). Adds types for arguments parsed.

```ts
type Argv = WithFiles & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => withFiles(yargs);
```

#### Type declaration

| Name     | Type       | Description        |
| :------- | :--------- | :----------------- |
| `files?` | `string`[] | List of filepaths. |

#### Defined in

[modules/builders/src/with-files.ts:33](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-files.ts#L33)

---

### WithWorkspaces

**WithWorkspaces**: `Object`

To be paired with the [`withWorkspaces()` builder](#withworkspaces). Adds types for arguments parsed.

```ts
type Argv = WithWorkspaces & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => withWorkspaces(yargs);
```

#### Type declaration

| Name          | Type       | Description                                         |
| :------------ | :--------- | :-------------------------------------------------- |
| `all?`        | `boolean`  | Include _all_ workspaces.                           |
| `workspaces?` | `string`[] | One or more workspaces by `name` or `alias` string. |

#### Defined in

[modules/builders/src/with-workspaces.ts:41](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-workspaces.ts#L41)

---

### Yargs

**Yargs**<`T`\>: `Yargv`<`T`\>

A [yargs object](http://yargs.js.org/docs/).

#### Type parameters

| Name | Type                                                |
| :--- | :-------------------------------------------------- |
| `T`  | [`DefaultArgv`](/docs/core/api/public/#defaultargv) |

#### Defined in

[modules/types/src/index.ts:105](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L105)
