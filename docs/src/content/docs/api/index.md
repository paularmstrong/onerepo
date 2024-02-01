---
title: oneRepo API
description: Full API documentation for oneRepo.
---

:::caution
oneRepo is in currently in public beta. Some APIs may not be specifically necessary and are subject to change.
:::

<!-- start-onerepo-sentinel -->
<!-- @generated SignedSource<<21e09a71336245d7478cb8fcf29e8228>> -->

## Namespaces

| Namespace                        | Description                                                                                                                                   |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| [builders](namespaces/builders/) | Builders and Getters work together as reusable ways to add optional command-line arguments that affect how Workspaces and files are retrived. |
| [file](namespaces/file/)         | File manipulation functions.                                                                                                                  |
| [git](namespaces/git/)           | This package is also canonically available from the `onerepo` package under the `git` namespace or methods directly from `@onerepo/git`:      |

## Commands

### Argv\<CommandArgv\>

```ts
type Argv<CommandArgv>: Arguments<CommandArgv & DefaultArgv>;
```

Helper for combining local parsed arguments along with the default arguments provided by the oneRepo command module.

**Type parameters:**

| Type parameter | Value    | Description                                                                                                                                |
| :------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `CommandArgv`  | `object` | Arguments that will be parsed for this command, always a union with [`DefaultArgv`](#defaultargv) and [`PositionalArgv`](#positionalargv). |

**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### Builder\<CommandArgv\>

```ts
type Builder<CommandArgv>: (yargs) => Yargv<CommandArgv>;
```

Option argument parser for the given command. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for more, but note that only the object variant is not accepted – only function variants will be accepted in oneRepo commands.

For common arguments that work in conjunction with [`HandlerExtra`](#handlerextra) methods like `getAffected()`, you can use helpers from the [! | `builders` namespace](namespaces/builders/), like [!withAffected | `builders.withAffected()`](namespaces/builders/).

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

**See also:**

- [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for general usage.
- Common extensions via the [`builders`](namespaces/builders/) namespace.

**Type parameters:**

| Type parameter | Value    | Description                                    |
| :------------- | :------- | :--------------------------------------------- |
| `CommandArgv`  | `object` | Arguments that will be parsed for this command |

**Parameters:**

| Parameter | Type    | Description                                                                                               |
| :-------- | :------ | :-------------------------------------------------------------------------------------------------------- |
| `yargs`   | `Yargs` | The Yargs instance. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) |

**Returns:** `Yargv`\<`CommandArgv`\>  
**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### DefaultArgv

```ts
type DefaultArgv: {
  dry-run: boolean;
  silent: boolean;
  skip-engine-check: boolean;
  verbosity: number;
};
```

Default arguments provided globally for all commands. These arguments are included by when using [`Builder`](#buildercommandargv) and [`Handler`](#handlercommandargv).

**Type declaration:**

##### dry-run

```ts
dry-run: boolean;
```

Whether the command should run non-destructive dry-mode. This prevents all subprocesses, files, and git operations from running unless explicitly specified as safe to run.

Also internally sets `process.env.ONEREPO_DRY_RUN = 'true'`.

**Default:** `false`

##### silent

```ts
silent: boolean;
```

Silence all logger output. Prevents _all_ stdout and stderr output from the logger entirely.

**Default:** `false`

##### skip-engine-check

```ts
skip-engine-check: boolean;
```

Skip the engines check. When `false`, oneRepo will the current process's node version with the range for `engines.node` as defined in `package.json`. If not defined in the root `package.json`, this will be skipped.

**Default:** `false`

##### verbosity

```ts
verbosity: number;
```

Verbosity level for the Logger. See Logger.verbosity for more information.

**Default:** `3`  
**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### Handler\<CommandArgv\>

```ts
type Handler<CommandArgv>: (argv, extra) => Promise<void>;
```

Command handler that includes oneRepo tools like `graph`, `logger`, and more. This function is type-safe if `Argv` is correctly passed through to the type definition.

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

**See also:**

- [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for general usage.
- [`HandlerExtra`](#handlerextra) for extended extra arguments provided above and beyond the scope of Yargs.

**Type parameters:**

| Type parameter | Value    | Description                                                                                                                                |
| :------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `CommandArgv`  | `object` | Arguments that will be parsed for this command. DefaultArguments will be automatically merged into this object for use within the handler. |

**Parameters:**

| Parameter | Type                                        |
| :-------- | :------------------------------------------ |
| `argv`    | [`Argv`](#argvcommandargv)\<`CommandArgv`\> |
| `extra`   | [`HandlerExtra`](#handlerextra)             |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### HandlerExtra

```ts
type HandlerExtra: {
  getAffected: (opts?) => Promise<Workspace[]>;
  getFilepaths: (opts?) => Promise<string[]>;
  getWorkspaces: (opts?) => Promise<Workspace[]>;
  graph: Graph;
  logger: Logger;
};
```

Commands in oneRepo extend beyond what Yargs is able to provide by adding a second argument to the handler.

All extras are available as the second argument on your [`Handler`](#handlercommandargv)

```ts
export const handler: Handler = (argv, { getAffected, getFilepaths, getWorkspace, logger }) => {
	logger.warn('Nothing to do!');
};
```

Overriding the affected threshold in `getFilepaths`

```ts
export const handler: Handler = (argv, { getFilepaths }) => {
	const filepaths = await getFilepaths({ affectedThreshold: 0 });
};
```

**Type declaration:**

##### getAffected

```ts
getAffected: (opts?) => Promise<Workspace[]>;
```

Get the affected Workspaces based on the current state of the repository.

This is a wrapped implementation of [`builders.getAffected`](namespaces/builders/#getaffected) that does not require passing the `graph` argument.

**Parameters:**

| Parameter | Type                                                  |
| :-------- | :---------------------------------------------------- |
| `opts`?   | [`GetterOptions`](namespaces/builders/#getteroptions) |

**Returns:** `Promise`\<[`Workspace`](#workspace)[]\>

##### getFilepaths

```ts
getFilepaths: (opts?) => Promise<string[]>;
```

Get the affected filepaths based on the current inputs and state of the repository. Respects manual inputs provided by [`builders.withFiles`](namespaces/builders/#withfiles) if provided.

This is a wrapped implementation of [`builders.getFilepaths`](namespaces/builders/#getfilepaths) that does not require the `graph` and `argv` arguments.

**Note:** that when used with `--affected`, there is a default limit of 100 files before this will switch to returning affected Workspace paths. Use `affectedThreshold: 0` to disable the limit.  
**Parameters:**

| Parameter | Type                                                          |
| :-------- | :------------------------------------------------------------ |
| `opts`?   | [`FileGetterOptions`](namespaces/builders/#filegetteroptions) |

**Returns:** `Promise`\<`string`[]\>

##### getWorkspaces

```ts
getWorkspaces: (opts?) => Promise<Workspace[]>;
```

Get the affected Workspaces based on the current inputs and the state of the repository.
This function differs from `getAffected` in that it respects all input arguments provided by
[`builders.withWorkspaces`](namespaces/builders/#withworkspaces), [`builders.withFiles`](namespaces/builders/#withfiles) and [`builders.withAffected`](namespaces/builders/#withaffected).

This is a wrapped implementation of [`builders.getWorkspaces`](namespaces/builders/#getworkspaces) that does not require the `graph` and `argv` arguments.

**Parameters:**

| Parameter | Type                                                  |
| :-------- | :---------------------------------------------------- |
| `opts`?   | [`GetterOptions`](namespaces/builders/#getteroptions) |

**Returns:** `Promise`\<[`Workspace`](#workspace)[]\>

##### graph

```ts
graph: Graph;
```

The full monorepo graph.Graph | `graph.Graph`.

##### logger

```ts
logger: Logger;
```

Standard [`Logger`](#logger). This should _always_ be used in place of `console.log` methods unless you have
a specific need to write to standard out differently.

**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### PositionalArgv

```ts
type PositionalArgv: {
  $0: string;
  --: string[];
  _: (string | number)[];
};
```

Always present in Builder and Handler arguments as parsed by Yargs.

**Type declaration:**

##### $0

```ts
$0: string;
```

The script name or node command. Similar to `process.argv[1]`

##### --

```ts
--: string[];
```

Any content that comes after " -- " gets populated here. These are useful for spreading through to spawned `run` functions that may take extra options that you don't want to enumerate and validate.

##### \_

```ts
_: (string | number)[];
```

Positionals / non-option arguments. These will only be filled if you include `.positional()` or `.strictCommands(false)` in your `Builder`.

**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

## Config

### Config\<CustomLifecycles\>

```ts
type Config<CustomLifecycles>: RootConfig<CustomLifecycles> | WorkspaceConfig<CustomLifecycles>;
```

Picks the correct config type between `RootConfig` and `WorkspaceConfig` based on whether the `root` property is set. Use this to help ensure your configs do not have any incorrect keys or values.

Satisfy a `RootConfig`:

```ts
import type { Config } from 'onerepo';

export default {
	root: true,
} satisfies Config;
```

Satisfy a `WorkspaceConfig` with custom lifecycles on tasks:

```ts
import type { Config } from 'onerepo';

export default {
	tasks: {
		stage: {
			serial: ['$0 build'],
		},
	},
} satisfies Config<'stage'>;
```

**Type parameters:**

| Type parameter                                | Value  |
| :-------------------------------------------- | :----- |
| `CustomLifecycles` extends `string` \| `void` | `void` |

**Source:** [modules/onerepo/src/types/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/index.ts)

---

### Lifecycle

```ts
type Lifecycle:
  | "pre-commit"
  | "post-commit"
  | "post-checkout"
  | "pre-merge"
  | "post-merge"
  | "build"
  | "deploy"
  | "publish";
```

oneRepo comes with a pre-configured list of common lifecycles for grouping [tasks](/core/tasks/).

**Source:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### RootConfig\<CustomLifecycles\>

```ts
type RootConfig<CustomLifecycles>: {
  codeowners: Record<string, string[]>;
  commands: {
     directory: string | false;
     ignore: RegExp;
  };
  dependencies: {
     dedupe: boolean;
     mode: "strict" | "loose" | "off";
  };
  head: string;
  ignore: string[];
  meta: Record<string, unknown>;
  plugins: Plugin[];
  root: true;
  taskConfig: {
     lifecycles: CustomLifecycles[];
     stashUnstaged: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
  };
  tasks: TaskConfig<CustomLifecycles>;
  templateDir: string;
  validation: {
     schema: string | null;
  };
  vcs: {
     autoSyncHooks: boolean;
     hooksPath: string;
     provider: "github" | "gitlab" | "bitbucket" | "gitea";
  };
  visualizationUrl: string;
};
```

Setup configuration for the root of the repository.

**Type parameters:**

| Type parameter                                | Value  |
| :-------------------------------------------- | :----- |
| `CustomLifecycles` extends `string` \| `void` | `void` |

**Type declaration:**

##### codeowners?

```ts
codeowners?: Record<string, string[]>;
```

**Default:** `{}`

Map of paths to array of owners.

When used with the [`codeowners` commands](/core/codeowners/), this configuration enables syncing configurations from Workspaces to the appropriate root level CODEOWNERS file given your [`vcsProvider`](#vcsprovider) as well as verifying that the root file is up to date.

```ts title="onerepo.config.ts"
export default {
	codeowners: {
		'*': ['@my-team', '@person'],
		scripts: ['@infra-team'],
	},
};
```

##### commands?

```ts
commands?: {
  directory: string | false;
  ignore: RegExp;
};
```

Configuration for custom commands.

##### commands.directory?

```ts
commands.directory?: string | false;
```

**Default:** `'commands'`

A string to use as filepaths to subcommands. We'll look for commands in all Workspaces using this string. If any are found, they'll be available from the CLI.

```ts title="onerepo.config.ts"
export default {
	commands: {
		directory: 'commands',
	},
};
```

Given the preceding configuration, commands will be searched for within the `commands/` directory at the root of the repository as well as a directory of the same name at the root of each workspace:

- `<root>/commands/*`
- `<root>/<workspaces>/commands/*`

##### commands.ignore?

```ts
commands.ignore?: RegExp;
```

**Default:** `/(/__\w+__/|\.test\.|\.spec\.|\.config\.)/`

Prevent reading matched files in the `commands.directory` as commands.

When writing custom commands and Workspace-level subcommands, we may need to ignore certain files like tests, fixtures, and other helpers. Use a regular expression here to configure which files will be ignored when oneRepo parses and executes commands.

```ts title="onerepo.config.ts"
export default {
	commands: {
		ignore: /(/__\w+__/|\.test\.|\.spec\.|\.config\.)/,
	},
};
```

##### dependencies?

```ts
dependencies?: {
  dedupe: boolean;
  mode: "strict" | "loose" | "off";
};
```

##### dependencies.dedupe?

```ts
dependencies.dedupe?: boolean;
```

**Default:** `true`

When modifying dependencies using the `one dependencies` command, a `dedupe` will automatically be run to reduce duplicate package versions that overlap the requested ranges. Set this to `false` to disable this behavior.

##### dependencies.mode?

```ts
dependencies.mode?: "strict" | "loose" | "off";
```

**Default:** `'loose'`

The dependency mode will be used for node module dependency management and verification.

- `off`: No validation will occur. Everything goes.
- `loose`: Reused third-party dependencies will be required to have semantic version overlap across unique branches of the Graph.
- `strict`: Versions of all dependencies across each discrete Workspace dependency tree must be strictly equal.

##### head?

```ts
head?: string;
```

**Default:** `'main'`

The default branch of your repo? Probably `main`, but it might be something else, so it's helpful to put that here so that we can determine changed files accurately.

```ts title="onerepo.config.ts"
export default {
	head: 'develop',
};
```

##### ignore?

```ts
ignore?: string[];
```

**Default:** `[]`

Array of fileglobs to ignore when calculating the changed Workspaces.

Periodically we may find that there are certain files or types of files that we _know_ for a fact do not affect the validity of the repository or any code. When this happens and the files are modified, unnecessary tasks and processes will be spun up that don't have any bearing on the outcome of the change.

To avoid extra processing, we can add file globs to ignore when calculated the afected Workspace graph.

:::caution
This configuration should be used sparingly and with caution. It is better to do too much work as opposed to not enough.
:::

```ts title="onerepo.config.ts"
export default {
	ignore: ['.changeset/*', '.github/*'],
};
```

##### meta?

```ts
meta?: Record<string, unknown>;
```

**Default:** `{}`

A place to put any custom information or configuration. A helpful space for you to extend Workspace configurations for your own custom commands.

```ts title="onerepo.config.ts"
export default {
	meta: {
		tacos: 'are delicious',
	},
};
```

##### plugins?

```ts
plugins?: Plugin[];
```

**Default:** `[]`

Add shared commands and extra handlers. See the [official plugin list](https://onerepo.tools/plugins/) for more information.

```ts title="onerepo.config.ts"
import { eslint } from '@onerepo/plugins-eslint';
export default {
	plugins: [eslint()],
};
```

##### root

```ts
root: true;
```

Must be set to `true` in order to denote that this is the root of the repository.

##### taskConfig?

```ts
taskConfig?: {
  lifecycles: CustomLifecycles[];
  stashUnstaged: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
};
```

Optional extra configuration for `tasks`.

##### taskConfig.lifecycles?

```ts
taskConfig.lifecycles?: CustomLifecycles[];
```

**Default:** `[]`

Additional `task` lifecycles to make available.

See [`Lifecycle`](#lifecycle) for a list of pre-configured lifecycles.

```ts title="onerepo.config.ts"
export default {
	tasks: {
		lifecycles: ['deploy-staging'],
	},
};
```

##### taskConfig.stashUnstaged?

```ts
taskConfig.stashUnstaged?: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
```

**Default:** `['pre-commit']`
Stash unstaged changes before running these tasks and re-apply them after the task has completed.

```ts title="onerepo.config.ts"
export default {
	tasks: {
		stashUnstaged: ['pre-commit', 'post-checkout'],
	},
};
```

##### tasks?

```ts
tasks?: TaskConfig<CustomLifecycles>;
```

**Default:** `{}`

Globally defined tasks per lifecycle. Tasks defined here will be assumed to run for all changes, regardless of affected Workspaces. Refer to the [`tasks` command](/core/tasks/) specifications for details and examples.

##### templateDir?

```ts
templateDir?: string;
```

**Default:** `'./config/templates'`
Folder path for `generate` templates.

##### validation?

```ts
validation?: {
  schema: string | null;
};
```

##### validation.schema?

```ts
validation.schema?: string | null;
```

**Default:** `undefined`

File path for custom Graph and configuration file validation schema.

##### vcs?

```ts
vcs?: {
  autoSyncHooks: boolean;
  hooksPath: string;
  provider: "github" | "gitlab" | "bitbucket" | "gitea";
};
```

Version control system settings.

##### vcs.autoSyncHooks?

```ts
vcs.autoSyncHooks?: boolean;
```

**Default:** `false`

Automatically set and sync oneRepo-managed git hooks. Change the directory for your git hooks with the [`vcs.hooksPath`](#vcshookspath) setting. Refer to the [Git hooks documentation](/core/hooks/) to learn more.

```ts title="onerepo.config.ts"
export defualt {
	vcs: {
		autoSyncHooks: false,
	}
};
```

##### vcs.hooksPath?

```ts
vcs.hooksPath?: string;
```

**Default:** `'.hooks'`

Modify the default git hooks path for the repository. This will automatically be synchronized via `one hooks sync` unless explicitly disabled by setting [`vcs.autoSyncHooks`](#vcsautosynchooks) to `false`.

```ts title="onerepo.config.ts"
export defualt {
	vcs: {
		hooksPath: '.githooks',
	}
};
```

##### vcs.provider?

```ts
vcs.provider?: "github" | "gitlab" | "bitbucket" | "gitea";
```

**Default:** `'github'`

The provider will be factored in to various commands, like `CODEOWNERS` generation.

```ts title="onerepo.config.ts"
export default {
	vcs: {
		provider: 'github',
	},
};
```

##### visualizationUrl?

```ts
visualizationUrl?: string;
```

**Default:** `'https://onerepo.tools/visualize/'`

Override the URL used to visualize the Graph. The Graph data will be attached the the `g` query parameter as a JSON string of the DAG, compressed using zLib deflate.

**Source:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

---

### Task

```ts
type Task: string | TaskDef | string[];
```

A Task can either be a string or [`TaskDef`](#taskdef) object with extra options, or an array of strings. If provided as an array of strings, each command will be run sequentially, waiting for the previous to succeed. If one command fails, the rest in the sequence will not be run.

To run sequences of commands with `match` and `meta` information, you can pass an array of strings to the `cmd` property of a [`TaskDef`](#taskdef).

**Source:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### TaskConfig\<CustomLifecycles\>

```ts
type TaskConfig<CustomLifecycles>: Partial<Record<CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle, Tasks>>;
```

**Type parameters:**

| Type parameter                                | Value  |
| :-------------------------------------------- | :----- |
| `CustomLifecycles` extends `string` \| `void` | `void` |

**Source:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### TaskDef

```ts
type TaskDef: {
  cmd: string | string[];
  match: string | string[];
  meta: Record<string, unknown>;
};
```

Tasks can optionally include meta information or only be run if the configured `match` glob string matches the modified files. If no files match, the individual task will not be run.

```ts
export default {
	tasks: {
		'pre-commit': {
			parallel: [
				// Only run `astro check` if astro files have been modified
				{ match: '*.astro', cmd: '$0 astro check' },
				// Use a glob match with sequential tasks
				{ match: '*.{ts,js}', cmd: ['$0 lint', '$0 format'] },
			],
		},
	},
} satisfies Config;
```

**Type declaration:**

##### cmd

```ts
cmd: string | string[];
```

String command(s) to run. If provided as an array of strings, each command will be run sequentially, waiting for the previous to succeed. If one command fails, the rest in the sequence will not be run.

The commands can use replaced tokens:

- `$0`: the oneRepo CLI for your repository
- `${workspaces}`: replaced with a space-separated list of Workspace names necessary for the given lifecycle

##### match?

```ts
match?: string | string[];
```

Glob file match. This will force the `cmd` to run if any of the paths in the modified files list match the glob. Conversely, if no files are matched, the `cmd` _will not_ run.

##### meta?

```ts
meta?: Record<string, unknown>;
```

Extra information that will be provided only when listing tasks with the `--list` option from the `tasks` command. This object is helpful when creating a matrix of runners with GitHub actions or similar CI pipelines.

**Source:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### Tasks

```ts
type Tasks: {
  parallel: Task[];
  serial: Task[];
};
```

Individual [`Task`](#task)s in any [`Lifecycle`](#lifecycle) may be grouped to run either serial (one after the other) or in parallel (multiple at the same time).

**Type declaration:**

##### parallel?

```ts
parallel?: Task[];
```

##### serial?

```ts
serial?: Task[];
```

**Source:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### WorkspaceConfig\<CustomLifecycles\>

```ts
type WorkspaceConfig<CustomLifecycles>: {
  codeowners: Record<string, string[]>;
  commands: {
     passthrough: Record<string, {
        command: string;
        description: string;
     }>;
  };
  meta: Record<string, unknown>;
  tasks: TaskConfig<CustomLifecycles>;
};
```

**Type parameters:**

| Type parameter                                | Value  |
| :-------------------------------------------- | :----- |
| `CustomLifecycles` extends `string` \| `void` | `void` |

**Type declaration:**

##### codeowners?

```ts
codeowners?: Record<string, string[]>;
```

**Default:** `{}`.
Map of paths to array of owners.

When used with the [`codeowners` commands](/core/codeowners/), this configuration enables syncing configurations from Workspaces to the appropriate root level CODEOWNERS file given your `RootConfig.vcs.provider` as well as verifying that the root file is up to date.

```ts title="onerepo.config.ts"
export default {
	codeowners: {
		'*': ['@my-team', '@person'],
		scripts: ['@infra-team'],
	},
};
```

##### commands?

```ts
commands?: {
  passthrough: Record<string, {
     command: string;
     description: string;
  }>;
};
```

Configuration for custom commands. To configure the commands directory, see [`RootConfig` `commands.directory`](#commandsdirectory).

##### commands.passthrough

```ts
commands.passthrough: Record<string, {
  command: string;
  description: string;
}>;
```

**Default:** `{}`

Enable commands from installed dependencies. Similar to running `npx <command>`, but pulled into the oneRepo CLI and able to be limited by workspace. Passthrough commands _must_ have helpful descriptions.

```ts title="onerepo.config.ts"
export default {
	commands: {
		passthrough: {
			astro: { description: 'Run Astro commands directly.' },
			start: { description: 'Run the Astro dev server.', command: 'astro dev --port=8000' },
		},
	},
};
```

##### meta?

```ts
meta?: Record<string, unknown>;
```

**Default:** `{}`
A place to put any custom information or configuration. A helpful space for you to extend Workspace configurations for your own custom commands.

```ts title="onerepo.config.ts"
export default {
	meta: {
		tacos: 'are delicious',
	},
};
```

##### tasks?

```ts
tasks?: TaskConfig<CustomLifecycles>;
```

**Default:** `{}`
Tasks for this Workspace. These will be merged with global tasks and any other affected Workspace tasks. Refer to the [`tasks` command](/core/tasks/) specifications for details and examples.

:::tip[Merging tasks]
Each modified Workspace or Workspace that is affected by another Workspace's modifications will have its tasks evaluated and merged into the full set of tasks for each given lifecycle run. Check the [Tasks reference](/core/tasks/) to learn more.
:::

**Source:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)

## Graph

### getGraph()

```ts
getGraph(workingDir?): Graph
```

Get the [`Graph`](#graph) given a particular root working directory. If the working directory is not a monorepo's root, an empty `Graph` will be given in its place.

```ts
const graph = getGraph(process.cwd());
assert.ok(graph.isRoot);
```

**Parameters:**

| Parameter     | Type     |
| :------------ | :------- |
| `workingDir`? | `string` |

**Returns:** [`Graph`](#graph)  
**Source:** [modules/graph/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/index.ts)

---

### Graph

The oneRepo Graph is a representation of the entire repository’s [`Workspaces`](#workspace) and how they depend upon each other. Most commonly, you will want to use the Graph to get lists of Workspaces that either depend on some input or are dependencies thereof:

```ts
const workspacesToCheck = graph.affected('tacos');
for (const ws of workspacesToCheck) {
	// verify no issues based on changes
}
```

The `Graph` also includes various helpers for determining workspaces based on filepaths, name, and other factors.

#### Accessors

##### packageManager

```ts
get packageManager(): PackageManager
```

Get the [PackageManager](#packagemanager-1) that this Graph depends on. This object allows you to run many common package management commands safely, agnostic of any particular flavor of package management. Works with npm, Yarn, and pnpm.

```ts
await graph.packageManager.install();
```

**Returns:** [`PackageManager`](#packagemanager-1)  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### root

```ts
get root(): Workspace
```

This returns the [`Workspace`](#workspace) that is at the root of the repository.

Regardless of how the `workspaces` are configured with the package manager, the root `package.json` is always registered as a Workspace.

```ts
const root = graph.root;
root.isRoot === true;
```

**Returns:** [`Workspace`](#workspace)  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### workspaces

```ts
get workspaces(): Workspace[]
```

Get a list of all [`Workspaces`](#workspace) that are part of the repository graph.

```ts
for (const workspace of graph.workspaces) {
	logger.info(workspace.name);
}
```

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

#### Methods

##### affected()

```ts
affected<T>(source, type?): Workspace[]
```

Get a list of [`Workspaces`](#workspace) that will be affected by the given source(s). This is equivalent to `graph.dependents(sources, true)`. See also [`dependents`](#dependents).

```ts
const dependents = graph.dependents(sources, true);
const affected = graph.affected(sources);

assert.isEqual(dependents, affecteed);
```

**Type parameters:**

| Type parameter                                    |
| :------------------------------------------------ |
| `T` extends `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter | Type                  | Description                                 |
| :-------- | :-------------------- | :------------------------------------------ |
| `source`  | `T` \| `T`[]          | -                                           |
| `type`?   | [`DepType`](#deptype) | Filter the dependents to a dependency type. |

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### dependencies()

```ts
dependencies<T>(
   sources?,
   includeSelf?,
   type?): Workspace[]
```

Get all dependency [`Workspaces`](#workspace) of one or more input Workspaces or qualified names of Workspaces. This not only returns the direct dependencies, but all dependencies throughout the entire [`Graph`](#graph). This returns the opposite result of [`dependents`](#dependents).

```ts
for (const workspace of graph.dependencies('tacos')) {
	logger.info(`"${workspace.name}" is a dependency of "tacos"`);
}
```

**Type parameters:**

| Type parameter                                    |
| :------------------------------------------------ |
| `T` extends `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter      | Type                  | Description                                                                                      |
| :------------- | :-------------------- | :----------------------------------------------------------------------------------------------- |
| `sources`?     | `T` \| `T`[]          | A list of [`Workspaces`](#workspace) by [`name`](#name)s or any available [`aliases`](#aliases). |
| `includeSelf`? | `boolean`             | Whether to include the `Workspaces` for the input `sources` in the return array.                 |
| `type`?        | [`DepType`](#deptype) | Filter the dependencies to a dependency type.                                                    |

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### dependents()

```ts
dependents<T>(
   sources?,
   includeSelf?,
   type?): Workspace[]
```

Get all dependent [`Workspaces`](#workspace) of one or more input Workspaces or qualified names of Workspaces. This not only returns the direct dependents, but all dependents throughout the entire [`Graph`](#graph). This returns the opposite result of [`dependencies`](#dependencies).

```ts
for (const workspace of graph.dependents('tacos')) {
	logger.info(`"${workspace.name}" depends on "tacos"`);
}
```

**Type parameters:**

| Type parameter                                    |
| :------------------------------------------------ |
| `T` extends `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter      | Type                  | Description                                                                      |
| :------------- | :-------------------- | :------------------------------------------------------------------------------- |
| `sources`?     | `T` \| `T`[]          | One or more Workspaces by name or `Workspace` instance                           |
| `includeSelf`? | `boolean`             | Whether to include the `Workspaces` for the input `sources` in the return array. |
| `type`?        | [`DepType`](#deptype) | Filter the dependents to a dependency type.                                      |

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### getAllByLocation()

```ts
getAllByLocation(locations): Workspace[]
```

Get all Workspaces given an array of filepaths.

```ts
const workspaces = graph.getAllByLocation([__dirname, 'file:///foo/bar']);
```

**Parameters:**

| Parameter   | Type       | Description                                                   |
| :---------- | :--------- | :------------------------------------------------------------ |
| `locations` | `string`[] | A list of filepath strings. May be file URLs or string paths. |

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### getAllByName()

```ts
getAllByName(names): Workspace[]
```

Get a list of [`Workspaces`](#workspace) by string names.

```ts
const workspaces = graph.getAllByName(['tacos', 'burritos']);
```

**Parameters:**

| Parameter | Type       | Description                                                                  |
| :-------- | :--------- | :--------------------------------------------------------------------------- |
| `names`   | `string`[] | A list of Workspace [`name`](#name)s or any available [`aliases`](#aliases). |

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### getByLocation()

```ts
getByLocation(location): Workspace
```

Get the equivalent [`Workspace`](#workspace) for a filepath. This can be any location within a `Workspace`, not just its root.

```ts title="CommonJS compatible"
// in Node.js
graph.getByLocation(__dirname);
```

```ts title="ESM compatible"
graph.getByLocation(import.meta.url);
```

**Parameters:**

| Parameter  | Type     | Description                     |
| :--------- | :------- | :------------------------------ |
| `location` | `string` | A string or URL-based filepath. |

**Returns:** [`Workspace`](#workspace)

###### Throws

`Error` if no Workspace can be found.

**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### getByName()

```ts
getByName(name): Workspace
```

Get a [`Workspace`](#workspace) by string name.

```ts
const workspace = graph.getByName('my-cool-package');
```

**Parameters:**

| Parameter | Type     | Description                                                           |
| :-------- | :------- | :-------------------------------------------------------------------- |
| `name`    | `string` | A Workspace’s [`name`](#name) or any available [`aliases`](#aliases). |

**Returns:** [`Workspace`](#workspace)

###### Throws

`Error` if no Workspace exists with the given input `name`.

**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

---

### Workspace

#### Accessors

##### aliases

```ts
get aliases(): string[]
```

Allow custom array of aliases.
If the fully qualified package name is scoped, this will include the un-scoped name

**Returns:** `string`[]  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### codeowners

```ts
get codeowners(): Required<Record<string, string[]>>
```

**Returns:** `Required`\<`Record`\<`string`, `string`[]\>\>  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### config

```ts
get config(): Required<WorkspaceConfig | RootConfig>
```

Get the workspace's configuration

**Returns:** `Required`\<[`WorkspaceConfig`](#workspaceconfigcustomlifecycles) \| [`RootConfig`](#rootconfigcustomlifecycles)\>  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### dependencies

```ts
get dependencies(): Record<string, string>
```

Get the `package.json` defined production dependencies for the Workspace.

**Returns:** `Record`\<`string`, `string`\>

Map of modules to their version.

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### description

```ts
get description(): undefined | string
```

Canonical to the `package.json` `"description"` field.

**Returns:** `undefined` \| `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### devDependencies

```ts
get devDependencies(): Record<string, string>
```

Get the `package.json` defined development dependencies for the Workspace.

**Returns:** `Record`\<`string`, `string`\>

Map of modules to their version.

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### isRoot

```ts
get isRoot(): boolean
```

Whether or not this Workspace is the root of the repository / Graph.

**Returns:** `boolean`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### location

```ts
get location(): string
```

Absolute path on the current filesystem to the Workspace.

**Returns:** `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### main

```ts
get main(): string
```

**Returns:** `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### name

```ts
get name(): string
```

The full `name` of the Workspace, as defined in its `package.json`

**Returns:** `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### packageJson

```ts
get packageJson(): PackageJson
```

A full copy of the `package.json` file for the Workspace.

**Returns:** [`PackageJson`](#packagejson-1)  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### peerDependencies

```ts
get peerDependencies(): Record<string, string>
```

Get the `package.json` defined peer dependencies for the Workspace.

**Returns:** `Record`\<`string`, `string`\>

Map of modules to their version.

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### private

```ts
get private(): boolean
```

If a Workspace `package.json` is set to `private: true`, it will not be available to publish through NPM or other package management registries.

**Returns:** `boolean`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### publishablePackageJson

```ts
get publishablePackageJson(): null | PublicPackageJson
```

Get a version of the Workspace's `package.json` that is meant for publishing.

This strips off `devDependencies` and applies appropriate [`publishConfig`](#publishconfig) values to the root of the `package.json`. This feature enables your monorepo to use source-dependencies and avoid manually building shared Workspaces for every change in order to see them take affect in dependent Workspaces.

To take advantage of this, configure your `package.json` root level to point to source files and the `publishConfig` entries to point to the build location of those entrypoints.

```json collapse={2-4}
{
	"name": "my-module",
	"license": "MIT",
	"type": "module",
	"main": "./src/index.ts",
	"publishConfig": {
		"access": "public",
		"main": "./dist/index.js",
		"typings": "./dist/index.d.ts"
	}
}
```

**Returns:** `null` \| [`PublicPackageJson`](#publicpackagejson)  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### scope

```ts
get scope(): string
```

Get module name scope if there is one, eg `@onerepo`

**Returns:** `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### tasks

```ts
get tasks(): Partial<Record<Lifecycle, Tasks>>
```

Get the task configuration as defined in the `onerepo.config.js` file at the root of the Workspace.

**Returns:** `Partial`\<`Record`\<[`Lifecycle`](#lifecycle), [`Tasks`](#tasks)\>\>

If a config does not exist, an empty object will be given.

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### version

```ts
get version(): undefined | string
```

**Returns:** `undefined` \| `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

#### Methods

##### getCodeowners()

```ts
getCodeowners(filepath): string[]
```

**Parameters:**

| Parameter  | Type     |
| :--------- | :------- |
| `filepath` | `string` |

**Returns:** `string`[]  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### getTasks()

```ts
getTasks(lifecycle): Required<Tasks>
```

Get a list of Workspace tasks for the given lifecycle

**Parameters:**

| Parameter   | Type     |
| :---------- | :------- |
| `lifecycle` | `string` |

**Returns:** `Required`\<[`Tasks`](#tasks)\>  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### relative()

```ts
relative(to): string
```

Get the relative path of an absolute path to the workspace’s location root

```ts
const relativePath = workspace.relative('/some/absolute/path');
```

**Parameters:**

| Parameter | Type     | Description       |
| :-------- | :------- | :---------------- |
| `to`      | `string` | Absolute filepath |

**Returns:** `string`

Relative path to the workspace’s root location.

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### resolve()

```ts
resolve(...pathSegments): string
```

Resolve a full filepath within the Workspace given the path segments. Similar to Node.js's [path.resolve()](https://nodejs.org/dist/latest-v18.x/docs/api/path.html#pathresolvepaths).

```ts
const main = workspace.resolve(workspace.main);
```

**Parameters:**

| Parameter         | Type       | Description                          |
| :---------------- | :--------- | :----------------------------------- |
| ...`pathSegments` | `string`[] | A sequence of paths or path segments |

**Returns:** `string`

Absolute path based on the input path segments

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

---

### DependencyType

```ts
const DependencyType: {
	DEV: 2;
	PEER: 1;
	PROD: 3;
};
```

**Type declaration:**

##### DEV

```ts
readonly DEV: 2;
```

Development-only dependency (defined in `devDependencies` keys of `package.json`)

##### PEER

```ts
readonly PEER: 1;
```

Peer dependency (defined in `peerDependencies` key of `package.json`)

##### PROD

```ts
readonly PROD: 3;
```

Production dependency (defined in `dependencies` of `package.json`)

**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

---

### DepType

```ts
type DepType: 1 | 2 | 3;
```

Dependency type value.

**See also:**
[`DependencyType`](#dependencytype)

**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

---

### GraphSchemaValidators

```ts
type GraphSchemaValidators: Record<string, Record<string, Schema & {
  $required: boolean;
  } | (workspace, graph) => Schema & {
  $required: boolean;
}>>;
```

Definition for `graph verify` JSON schema validators.

See [“Validating configurations”](/core/graph/#validating-configurations) for more examples and use cases.

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

**Source:** [modules/onerepo/src/core/graph/schema.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/graph/schema.ts)

## Logger

### bufferSubLogger()

```ts
bufferSubLogger(step): {
  end: () => Promise<void>;
  logger: Logger;
}
```

Create a new Logger instance that has its output buffered up to a LogStep.

```ts
const step = logger.createStep(name, { writePrefixes: false });
const subLogger = bufferSubLogger(step);
const substep = subLogger.logger.createStep('Sub-step');
substep.warning('This gets buffered');
await substep.end();
await subLogger.end();
await step.en();
```

**Parameters:**

| Parameter | Type                  |
| :-------- | :-------------------- |
| `step`    | [`LogStep`](#logstep) |

**Returns:** `Object`

> ##### end
>
> ```ts
> end: () => Promise<void>;
> ```
>
> ###### Returns
>
> `Promise`\<`void`\>
>
> ##### logger
>
> ```ts
> logger: Logger;
> ```

**Source:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)

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

**Parameters:**

| Parameter | Type                                           |
| :-------- | :--------------------------------------------- |
| `opts`?   | `Partial`\<[`LoggerOptions`](#loggeroptions)\> |

**Returns:** [`Logger`](#logger)  
**Source:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)

---

### stepWrapper()

```ts
stepWrapper<T>(options, fn): Promise<T>
```

For cases where multiple processes need to be completed, but should be joined under a single [`LogStep`](#logstep) to avoid too much noisy output, this safely wraps an asynchronous function and handles step creation and completion, unless a `step` override is given.

```ts
export async function exists(filename: string, { step }: Options = {}) {
	return stepWrapper({ step, name: 'Step fallback name' }, (step) => {
		return; // do some work
	});
}
```

**Type parameters:**

| Type parameter |
| :------------- |
| `T`            |

**Parameters:**

| Parameter       | Type                                                  |
| :-------------- | :---------------------------------------------------- |
| `options`       | \{ `name`: `string`; `step`: [`LogStep`](#logstep); } |
| `options.name`  | `string`                                              |
| `options.step`? | [`LogStep`](#logstep)                                 |
| `fn`            | (`step`) => `Promise`\<`T`\>                          |

**Returns:** `Promise`\<`T`\>  
**Source:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)

---

### LogStep

Log steps should only be created via the [`logger.createStep()`](#createstep) method.

```ts
const step = logger.createStep('Do some work');
// ... long task with a bunch of potential output
await step.end();
```

#### Properties

| Property     | Type      | Description                                                                                                                                                                     |
| :----------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hasError`   | `boolean` | Whether or not an error has been sent to the step. This is not necessarily indicative of uncaught thrown errors, but solely on whether `.error()` has been called in this step. |
| `hasInfo`    | `boolean` | Whether or not an info message has been sent to this step.                                                                                                                      |
| `hasLog`     | `boolean` | Whether or not a log message has been sent to this step.                                                                                                                        |
| `hasWarning` | `boolean` | Whether or not a warning has been sent to this step.                                                                                                                            |

#### Methods

##### end()

```ts
end(): Promise<void>
```

Finish this step and flush all buffered logs. Once a step is ended, it will no longer accept any logging output and will be effectively removed from the base logger. Consider this method similar to a destructor or teardown.

```ts
await step.end();
```

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

#### Logging

##### debug()

```ts
debug(contents): void
```

Extra debug logging when verbosity greater than or equal to 4.

```ts
step.debug('Log this content when verbosity is >= 4');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged debug information:

```ts
step.debug(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### error()

```ts
error(contents): void
```

Log an error. This will cause the root logger to include an error and fail a command.

```ts
step.error('Log this content when verbosity is >= 1');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged error:

```ts
step.error(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### info()

```ts
info(contents): void
```

Log an informative message. Should be used when trying to convey information with a user that is important enough to always be returned.

```ts
step.info('Log this content when verbosity is >= 1');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:

```ts
step.info(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### log()

```ts
log(contents): void
```

General logging information. Useful for light informative debugging. Recommended to use sparingly.

```ts
step.log('Log this content when verbosity is >= 3');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:

```ts
step.log(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### timing()

```ts
timing(start, end): void
```

Log timing information between two [Node.js performance mark names](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#performancemarkname-options).

**Parameters:**

| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `start`   | `string` | A `PerformanceMark` entry name |
| `end`     | `string` | A `PerformanceMark` entry name |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### warn()

```ts
warn(contents): void
```

Log a warning. Does not have any effect on the command run, but will be called out.

```ts
step.warn('Log this content when verbosity is >= 2');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged warning:

```ts
step.warn(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

---

### Logger

The oneRepo logger helps build commands and capture output from spawned subprocess in a way that's both delightful to the end user and includes easy to scan and follow output.

All output will be redirected from `stdout` to `stderr` to ensure order of output and prevent confusion of what output can be piped and written to files.

If the current terminal is a TTY, output will be buffered and asynchronous steps will animated with a progress logger.

See [`HandlerExtra`](#handlerextra) for access the the global Logger instance.

#### Accessors

##### hasError

```ts
get hasError(): boolean
```

Whether or not an error has been sent to the logger or any of its steps. This is not necessarily indicative of uncaught thrown errors, but solely on whether `.error()` has been called in the `Logger` or any `Step` instance.

**Returns:** `boolean`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### hasInfo

```ts
get hasInfo(): boolean
```

Whether or not an info message has been sent to the logger or any of its steps.

**Returns:** `boolean`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### hasLog

```ts
get hasLog(): boolean
```

Whether or not a log message has been sent to the logger or any of its steps.

**Returns:** `boolean`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### hasWarning

```ts
get hasWarning(): boolean
```

Whether or not a warning has been sent to the logger or any of its steps.

**Returns:** `boolean`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### verbosity

```ts
get verbosity(): Verbosity
```

Get the logger's verbosity level

```ts
set verbosity(value): void
```

Recursively applies the new verbosity to the logger and all of its active steps.

**Parameters:**

| Parameter | Type                        |
| :-------- | :-------------------------- |
| `value`   | [`Verbosity`](#verbosity-1) |

**Returns:** [`Verbosity`](#verbosity-1)  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### writable

```ts
get writable(): boolean
```

**Returns:** `boolean`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

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

**Parameters:**

| Parameter                          | Type                             | Description                                                                   |
| :--------------------------------- | :------------------------------- | :---------------------------------------------------------------------------- |
| `name`                             | `string`                         | The name to be written and wrapped around any output logged to this new step. |
| `__namedParameters`?               | \{ `writePrefixes`: `boolean`; } | -                                                                             |
| `__namedParameters.writePrefixes`? | `boolean`                        | -                                                                             |

**Returns:** [`LogStep`](#logstep)  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

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

**Parameters:**

| Parameter | Type      |
| :-------- | :-------- |
| `write`?  | `boolean` |

**Returns:** `void`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### unpause()

```ts
unpause(): void
```

Unpause the logger and resume writing buffered logs to `stderr`. See [`logger.pause()`](#pause) for more information.

**Returns:** `void`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

#### Logging

##### debug()

```ts
debug(contents): void
```

Extra debug logging when verbosity greater than or equal to 4.

```ts
logger.debug('Log this content when verbosity is >= 4');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged debug information:

```ts
logger.debug(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**See also:**
[`debug()`](#debug) This is a pass-through for the main step’s [`debug()`](#debug) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### error()

```ts
error(contents): void
```

Log an error. This will cause the root logger to include an error and fail a command.

```ts
logger.error('Log this content when verbosity is >= 1');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged error:

```ts
logger.error(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**See also:**
[`error()`](#error) This is a pass-through for the main step’s [`error()`](#error) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### info()

```ts
info(contents): void
```

Should be used to convey information or instructions through the log, will log when verbositu >= 1

```ts
logger.info('Log this content when verbosity is >= 1');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:

```ts
logger.info(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**See also:**
[`info()`](#info) This is a pass-through for the main step’s [`info()`](#info) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### log()

```ts
log(contents): void
```

General logging information. Useful for light informative debugging. Recommended to use sparingly.

```ts
logger.log('Log this content when verbosity is >= 3');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:

```ts
logger.log(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**See also:**
[`log()`](#log) This is a pass-through for the main step’s [`log()`](#log) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### timing()

```ts
timing(start, end): void
```

Log timing information between two [Node.js performance mark names](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#performancemarkname-options).

**Parameters:**

| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `start`   | `string` | A `PerformanceMark` entry name |
| `end`     | `string` | A `PerformanceMark` entry name |

**Returns:** `void`  
**See also:**
[`timing()`](#timing) This is a pass-through for the main step’s [`timing()`](#timing) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### warn()

```ts
warn(contents): void
```

Log a warning. Does not have any effect on the command run, but will be called out.

```ts
logger.warn('Log this content when verbosity is >= 2');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged warning:

```ts
logger.warn(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**See also:**
[`warn()`](#warn) This is a pass-through for the main step’s [`warn()`](#warn) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

---

### LoggerOptions

```ts
type LoggerOptions: {
  stream: Writable;
  verbosity: Verbosity;
};
```

**Type declaration:**

##### stream?

```ts
stream?: Writable;
```

Advanced – override the writable stream in order to pipe logs elsewhere. Mostly used for dependency injection for `@onerepo/test-cli`.

##### verbosity

```ts
verbosity: Verbosity;
```

Control how much and what kind of output the Logger will provide.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

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

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

## Package management

### getLockfile()

```ts
getLockfile(cwd): string | null
```

Get the absolute path for the package manager's lock file for this repository.

**Parameters:**

| Parameter | Type     |
| :-------- | :------- |
| `cwd`     | `string` |

**Returns:** `string` \| `null`  
**Source:** [modules/package-manager/src/get-package-manager.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/get-package-manager.ts)

---

### getPackageManager()

```ts
getPackageManager(type): PackageManager
```

Get the [`PackageManager`](#packagemanager-1) for the given package manager type (NPM, PNPm, or Yarn)

**Parameters:**

| Parameter | Type                            |
| :-------- | :------------------------------ |
| `type`    | `"yarn"` \| `"npm"` \| `"pnpm"` |

**Returns:** [`PackageManager`](#packagemanager-1)  
**Source:** [modules/package-manager/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/index.ts)

---

### getPackageManagerName()

```ts
getPackageManagerName(cwd, fromPkgJson?): "npm" | "pnpm" | "yarn"
```

Get the package manager for the current working directory with _some_ confidence

**Parameters:**

| Parameter      | Type     | Description                                                                   |
| :------------- | :------- | :---------------------------------------------------------------------------- |
| `cwd`          | `string` | Current working directory. Should be the root of the module/repository.       |
| `fromPkgJson`? | `string` | Value as defined in a package.json file, typically the `packageManager` value |

**Returns:** `"npm"` \| `"pnpm"` \| `"yarn"`  
**Source:** [modules/package-manager/src/get-package-manager.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/get-package-manager.ts)

---

### PackageManager

Implementation details for all package managers. This interface defines a subset of common methods typically needed when interacting with a monorepo and its dependency graph.Graph | `graph.Graph` & graph.Workspace | `graph.Workspace`s.

#### Methods

##### add()

```ts
add(packages, opts?): Promise<void>
```

Add one or more packages from external registries

**Parameters:**

| Parameter   | Type                   | Description                                                                      |
| :---------- | :--------------------- | :------------------------------------------------------------------------------- |
| `packages`  | `string` \| `string`[] | One or more packages, by name and/or `'name@version'`.                           |
| `opts`?     | \{ `dev`: `boolean`; } | Various options to pass while installing the packages                            |
| `opts.dev`? | `boolean`              | Set to true to install as a `devDependency`.<br /><br />**Default**<br />`false` |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### batch()

```ts
batch(processes): Promise<(Error | [string, string])[]>
```

Batch commands from npm packages as a batch of subprocesses using the package manager. Alternative to batching with `npm exec` and compatible APIs.

**Parameters:**

| Parameter   | Type                    |
| :---------- | :---------------------- |
| `processes` | [`RunSpec`](#runspec)[] |

**Returns:** `Promise`\<(`Error` \| [`string`, `string`])[]\>  
**See also:**
[`batch`](#batch) for general subprocess batching.

**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### dedupe()

```ts
dedupe(): Promise<void>
```

Reduce duplication in the package tree by checking overlapping ranges.

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### info()

```ts
info(name, opts?): Promise<null | NpmInfo>
```

Get standard information about a package

**Parameters:**

| Parameter | Type                               |
| :-------- | :--------------------------------- |
| `name`    | `string`                           |
| `opts`?   | `Partial`\<[`RunSpec`](#runspec)\> |

**Returns:** `Promise`\<`null` \| [`NpmInfo`](#npminfo)\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### install()

```ts
install(cwd?): Promise<string>
```

Install current dependencies as listed in the package manager's lock file

**Parameters:**

| Parameter | Type     |
| :-------- | :------- |
| `cwd`?    | `string` |

**Returns:** `Promise`\<`string`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### loggedIn()

```ts
loggedIn(opts?): Promise<boolean>
```

Check if the current user is logged in to the external registry

**Parameters:**

| Parameter        | Type                                          | Description                                                                                                                                         |
| :--------------- | :-------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opts`?          | \{ `registry`: `string`; `scope`: `string`; } | -                                                                                                                                                   |
| `opts.registry`? | `string`                                      | The base URL of your NPM registry. PNPM and NPM ignore scope and look up per-registry.                                                              |
| `opts.scope`?    | `string`                                      | When using Yarn, lookups are done by registry configured by scope. This value must be included if you have separate registries for separate scopes. |

**Returns:** `Promise`\<`boolean`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### publish()

```ts
publish<T>(opts?): Promise<void>
```

Publish Workspaces to the external registry

**Type parameters:**

| Type parameter                                      |
| :-------------------------------------------------- |
| `T` extends [`MinimalWorkspace`](#minimalworkspace) |

**Parameters:**

| Parameter          | Type                                                                                                                 | Description                                                                                                                                                                              |
| :----------------- | :------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opts`?            | \{ `access`: `"restricted"` \| `"public"`; `cwd`: `string`; `otp`: `string`; `tag`: `string`; `workspaces`: `T`[]; } | -                                                                                                                                                                                        |
| `opts.access`?     | `"restricted"` \| `"public"`                                                                                         | Set the registry access level for the package<br /><br />**Default**<br />inferred from Workspaces `publishConfig.access` or `'public'`                                                  |
| `opts.cwd`?        | `string`                                                                                                             | Command working directory. Defaults to the repository root.                                                                                                                              |
| `opts.otp`?        | `string`                                                                                                             | This is a one-time password from a two-factor authenticator.                                                                                                                             |
| `opts.tag`?        | `string`                                                                                                             | If you ask npm to install a package and don't tell it a specific version, then it will install the specified tag.<br /><br />**Default**<br />`'latest'`                                 |
| `opts.workspaces`? | `T`[]                                                                                                                | Workspaces to publish. If not provided or empty array, only the given Workspace at `cwd` will be published. This type is generally compatible with graph.Workspace \| `graph.Workspace`. |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### publishable()

```ts
publishable<T>(workspaces): Promise<T[]>
```

Filter Workspaces to the set of those that are actually publishable. This will check both whether the package is not marked as "private" and if the current version is not in the external registry.

**Type parameters:**

| Type parameter                                      |
| :-------------------------------------------------- |
| `T` extends [`MinimalWorkspace`](#minimalworkspace) |

**Parameters:**

| Parameter    | Type  | Description                                                      |
| :----------- | :---- | :--------------------------------------------------------------- |
| `workspaces` | `T`[] | List of compatible graph.Workspace \| `graph.Workspace` objects. |

**Returns:** `Promise`\<`T`[]\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### remove()

```ts
remove(packages): Promise<void>
```

Remove one or more packages.

**Parameters:**

| Parameter  | Type                   | Description                   |
| :--------- | :--------------------- | :---------------------------- |
| `packages` | `string` \| `string`[] | One or more packages, by name |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### run()

```ts
run(opts): Promise<[string, string]>
```

Run a command from an npm package as a subprocess using the package manager. Alternative to `npm exec` and compatible APIs.

**Parameters:**

| Parameter | Type                  |
| :-------- | :-------------------- |
| `opts`    | [`RunSpec`](#runspec) |

**Returns:** `Promise`\<[`string`, `string`]\>  
**See also:**
[`batch`](#batch) for general subprocess running.

**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

---

### MinimalWorkspace

```ts
type MinimalWorkspace: {
  location: string;
  name: string;
  private: boolean;
  version: string;
};
```

**Type declaration:**

##### location?

```ts
location?: string;
```

##### name

```ts
name: string;
```

##### private?

```ts
private?: boolean;
```

##### version?

```ts
version?: string;
```

**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

---

### NpmInfo

```ts
type NpmInfo: {
  dependencies: Record<string, string>;
  dist-tags: {
   [key: string]: string;   latest: string;
  };
  homepage: string;
  license: string;
  name: string;
  version: string;
  versions: string[];
};
```

**Type declaration:**

##### dependencies

```ts
dependencies: Record<string, string>;
```

##### dist-tags

```ts
dist-tags: {
[key: string]: string;   latest: string;
};
```

###### Index signature

\[`key`: `string`\]: `string`

##### dist-tags.latest

```ts
dist-tags.latest: string;
```

##### homepage

```ts
homepage: string;
```

##### license

```ts
license: string;
```

##### name

```ts
name: string;
```

##### version

```ts
version: string;
```

##### versions

```ts
versions: string[];
```

**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

## Plugins

### Plugin

```ts
type Plugin: PluginObject | (config, graph) => PluginObject;
```

**Source:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

---

### PluginObject

```ts
type PluginObject: {
  shutdown: (argv) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;
  startup: (argv) => Promise<void> | void;
  yargs: (yargs, visitor) => Yargs;
};
```

**Type declaration:**

##### shutdown?

```ts
shutdown?: (argv) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;
```

Runs just before the application process is exited. Allows returning data that will be merged with all other shutdown handlers.

**Parameters:**

| Parameter | Type                                                        |
| :-------- | :---------------------------------------------------------- |
| `argv`    | [`Argv`](#argvcommandargv)\<[`DefaultArgv`](#defaultargv)\> |

**Returns:** `Promise`\<`Record`\<`string`, `unknown`\> \| `void`\> \| `Record`\<`string`, `unknown`\> \| `void`

##### startup?

```ts
startup?: (argv) => Promise<void> | void;
```

Runs before any and all commands after argument parsing. This is similar to global Yargs middleware, but guaranteed to have the fully resolved and parsed arguments.

Use this function for setting up global even listeners like `PerformanceObserver`, `process` events, etc.

**Parameters:**

| Parameter | Type                                                        |
| :-------- | :---------------------------------------------------------- |
| `argv`    | [`Argv`](#argvcommandargv)\<[`DefaultArgv`](#defaultargv)\> |

**Returns:** `Promise`\<`void`\> \| `void`

##### yargs?

```ts
yargs?: (yargs, visitor) => Yargs;
```

A function that is called with the CLI's `yargs` object and a visitor.
It is important to ensure every command passed through the `visitor` to enable all of the features of oneRepo. Without this step, you will not have access to the Workspace graph, affected list, and much more.

**Parameters:**

| Parameter | Type                                                    |
| :-------- | :------------------------------------------------------ |
| `yargs`   | `Yargs`                                                 |
| `visitor` | `NonNullable`\<`RequireDirectoryOptions`\[`"visit"`\]\> |

**Returns:** `Yargs`  
**Source:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

## Subprocess

### batch()

```ts
batch(processes): Promise<([string, string] | Error)[]>
```

Batch multiple subprocesses, similar to `Promise.all`, but only run as many processes at a time fulfilling N-1 cores. If there are more processes than cores, as each process finishes, a new process will be picked to run, ensuring maximum CPU usage at all times.

If any process throws a `SubprocessError`, this function will reject with a `BatchError`, but only after _all_ processes have completed running.

Most oneRepo commands will consist of at least one [`run()`](#run-1) or [`batch()`](#batch-1) processes.

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

**Parameters:**

| Parameter   | Type                                                   |
| :---------- | :----------------------------------------------------- |
| `processes` | ([`RunSpec`](#runspec) \| [`PromiseFn`](#promisefn))[] |

**Returns:** `Promise`\<([`string`, `string`] \| `Error`)[]\>

#### Throws

[`BatchError`](#batcherror) An object that includes a list of all of the [`SubprocessError`](#subprocesserror)s thrown.

**See also:**
[`PackageManager.batch`](#batch) to safely batch executables exposed from third party modules.

**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### run()

```ts
run(options): Promise<[string, string]>
```

Spawn a process and capture its `stdout` and `stderr` through a Logger Step. Most oneRepo commands will consist of at least one [`run()` ](#run-1) or [`batch()`](#batch-1) processes.

The `run()` command is an async wrapper around Node.js’s [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) and has a very similar API, with some additions. This command will buffer and catch all `stdout` and `stderr` responses.

```ts
await run({
	name: 'Do some work',
	cmd: 'echo',
	args: ['"hello!"'],
});
```

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

**Dry-run:**

By default, `run()` will respect oneRepo’s `--dry-run` option (see [`DefaultArgv`](#defaultargv), `process.env.ONEREPO_DRY_RUN`). When set, the process will not be spawned, but merely log information about what would run instead. To continue running a command, despite the `--dry-run` option being set, use `runDry: true`:

```ts
await run({
	name: 'Run dry',
	cmd: 'echo',
	args: ['"hello"'],
	runDry: true,
});
```

**Parameters:**

| Parameter | Type                  |
| :-------- | :-------------------- |
| `options` | [`RunSpec`](#runspec) |

**Returns:** `Promise`\<[`string`, `string`]\>

A promise with an array of `[stdout, stderr]`, as captured from the command run.

#### Throws

[`SubprocessError`](#subprocesserror) if not `skipFailures` and the spawned process does not exit cleanly (with code `0`)

**See also:**
[`PackageManager.run`](#run) to safely run executables exposed from third party modules.

**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### start()

```ts
start(options): ChildProcess
```

Start a subprocess. For use when control over watching the stdout and stderr or long-running processes that are not expected to complete without SIGINT/SIGKILL.

**Parameters:**

| Parameter | Type                                                    |
| :-------- | :------------------------------------------------------ |
| `options` | `Omit`\<[`RunSpec`](#runspec), `"name"` \| `"runDry"`\> |

**Returns:** `ChildProcess`  
**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

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

**Parameters:**

| Parameter | Type                                                                 |
| :-------- | :------------------------------------------------------------------- |
| `options` | `Omit`\<[`RunSpec`](#runspec), `"opts"`\> & \{ `reason`: `string`; } |

**Returns:** `Promise`\<[`string`, `string`]\>  
**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### BatchError

#### Extends

- `Error`

#### Constructors

##### new BatchError(errors, options)

```ts
new BatchError(errors, options?): BatchError
```

**Parameters:**

| Parameter  | Type                                                  |
| :--------- | :---------------------------------------------------- |
| `errors`   | (`string` \| [`SubprocessError`](#subprocesserror))[] |
| `options`? | `ErrorOptions`                                        |

**Returns:** [`BatchError`](#batcherror)

###### Overrides

`Error.constructor`

**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

#### Properties

| Modifier | Property             | Type                                                  | Description                                                                                                                        | Inherited from            |
| :------- | :------------------- | :---------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :------------------------ |
| `public` | `cause?`             | `unknown`                                             | -                                                                                                                                  | `Error.cause`             |
| `public` | `errors`             | (`string` \| [`SubprocessError`](#subprocesserror))[] | -                                                                                                                                  | -                         |
| `public` | `message`            | `string`                                              | -                                                                                                                                  | `Error.message`           |
| `public` | `name`               | `string`                                              | -                                                                                                                                  | `Error.name`              |
| `static` | `prepareStackTrace?` | (`err`, `stackTraces`) => `any`                       | Optional override for formatting stack traces<br /><br />**See**<br />https://v8.dev/docs/stack-trace-api#customizing-stack-traces | `Error.prepareStackTrace` |
| `public` | `stack?`             | `string`                                              | -                                                                                                                                  | `Error.stack`             |
| `static` | `stackTraceLimit`    | `number`                                              | -                                                                                                                                  | `Error.stackTraceLimit`   |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Create .stack property on a target object

**Parameters:**

| Parameter         | Type       |
| :---------------- | :--------- |
| `targetObject`    | `object`   |
| `constructorOpt`? | `Function` |

**Returns:** `void`

###### Inherited from

`Error.captureStackTrace`

**Source:** node_modules/@types/node/globals.d.ts:21

---

### SubprocessError

#### Extends

- `Error`

#### Constructors

##### new SubprocessError(message, options)

```ts
new SubprocessError(message, options?): SubprocessError
```

**Parameters:**

| Parameter  | Type           |
| :--------- | :------------- |
| `message`  | `string`       |
| `options`? | `ErrorOptions` |

**Returns:** [`SubprocessError`](#subprocesserror)

###### Overrides

`Error.constructor`

**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

#### Properties

| Modifier | Property             | Type                            | Description                                                                                                                        | Inherited from            |
| :------- | :------------------- | :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------- | :------------------------ |
| `public` | `cause?`             | `unknown`                       | -                                                                                                                                  | `Error.cause`             |
| `public` | `message`            | `string`                        | -                                                                                                                                  | `Error.message`           |
| `public` | `name`               | `string`                        | -                                                                                                                                  | `Error.name`              |
| `static` | `prepareStackTrace?` | (`err`, `stackTraces`) => `any` | Optional override for formatting stack traces<br /><br />**See**<br />https://v8.dev/docs/stack-trace-api#customizing-stack-traces | `Error.prepareStackTrace` |
| `public` | `stack?`             | `string`                        | -                                                                                                                                  | `Error.stack`             |
| `static` | `stackTraceLimit`    | `number`                        | -                                                                                                                                  | `Error.stackTraceLimit`   |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Create .stack property on a target object

**Parameters:**

| Parameter         | Type       |
| :---------------- | :--------- |
| `targetObject`    | `object`   |
| `constructorOpt`? | `Function` |

**Returns:** `void`

###### Inherited from

`Error.captureStackTrace`

**Source:** node_modules/@types/node/globals.d.ts:21

---

### PromiseFn

```ts
type PromiseFn: () => Promise<[string, string]>;
```

**Returns:** `Promise`\<[`string`, `string`]\>  
**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### RunSpec

```ts
type RunSpec: {
  args: string[];
  cmd: string;
  name: string;
  opts: SpawnOptions;
  runDry: boolean;
  skipFailures: boolean;
  step: LogStep;
};
```

The core configuration for [`run`](#run-1), [`start`](#start), [`sudo`](#sudo), and [`batch`](#batch-1) subprocessing.

**Type declaration:**

##### args?

```ts
args?: string[];
```

Arguments to pass to the executable. All arguments must be separate string entries.

Beware that some commands have different ways of parsing arguments.

Typically, it is safest to have separate entries in the `args` array for the flag and its value:

```
args: ['--some-flag', 'some-flags-value']
```

However, if an argument parser is implemented in a non-standard way, the flag and its value may need to be a single entry:

```
args: ['--some-flag=some-flags-value']
```

##### cmd

```ts
cmd: string;
```

The command to run. This should be an available executable or path to an executable.

##### name

```ts
name: string;
```

A friendly name for the Step in log output.

##### opts?

```ts
opts?: SpawnOptions;
```

See the [Node.js `child_process.spawn()` documentation](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) for available options.

##### runDry?

```ts
runDry?: boolean;
```

Skip the `--dry-run` check and run this command anyway.

##### skipFailures?

```ts
skipFailures?: boolean;
```

Prevents throwing a [`SubprocessError`](#subprocesserror) in the event of the process failing and exiting with an unclean state.

##### step?

```ts
step?: LogStep;
```

Pass a custom [`LogStep`](#logstep) to bundle this process input & output into another step instead of creating a new one.

**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

## package.json

### BasePackageJson

```ts
type BasePackageJson: {
  alias: string[];
  author: string | Person;
  bin: string | Record<string, string>;
  bugs: {
     email: string;
     url: string;
  };
  bundleDependencies: string[];
  contributors: (Person | string)[];
  dependencies: Record<string, string>;
  description: string;
  devDependencies: Record<string, string>;
  engines: Record<string, string>;
  exports: Record<string, string | {
     default: string;
     import: string;
     require: string;
     types: string;
  }>;
  files: string[];
  homepage: string;
  keywords: string[];
  license: string;
  main: string;
  name: string;
  optionalDependencies: string[];
  os: string[];
  overrides: Record<string, string>;
  packageManager: string;
  peerDependencies: Record<string, string>;
  peerDependenciesMeta: Record<string, {
     optional: boolean;
  }>;
  scripts: Record<string, string>;
  version: string;
};
```

**Type declaration:**

##### alias?

```ts
alias?: string[];
```

Enable's the [`Graph`](#graph) to look up [`Workspace`](#workspace)s by shorter names or common Workspace.alias | aliases used by teams. This enables much short command-line execution. See [`Graph.getByName`](#getbyname) and [`Graph.getAllByName`](#getallbyname).

##### author?

```ts
author?: string | Person;
```

##### bin?

```ts
bin?: string | Record<string, string>;
```

##### bugs?

```ts
bugs?: {
  email: string;
  url: string;
};
```

##### bugs.email?

```ts
bugs.email?: string;
```

##### bugs.url?

```ts
bugs.url?: string;
```

##### bundleDependencies?

```ts
bundleDependencies?: string[];
```

##### contributors?

```ts
contributors?: (Person | string)[];
```

##### dependencies?

```ts
dependencies?: Record<string, string>;
```

##### description?

```ts
description?: string;
```

##### devDependencies?

```ts
devDependencies?: Record<string, string>;
```

##### engines?

```ts
engines?: Record<string, string>;
```

##### exports?

```ts
exports?: Record<string, string | {
  default: string;
  import: string;
  require: string;
  types: string;
}>;
```

##### files?

```ts
files?: string[];
```

##### homepage?

```ts
homepage?: string;
```

##### keywords?

```ts
keywords?: string[];
```

##### license?

```ts
license?: string;
```

##### main?

```ts
main?: string;
```

##### name

```ts
name: string;
```

The full name for the [`Workspace`](#workspace). This will be used within the package manager and publishable registry.

##### optionalDependencies?

```ts
optionalDependencies?: string[];
```

##### os?

```ts
os?: string[];
```

##### overrides?

```ts
overrides?: Record<string, string>;
```

##### packageManager?

```ts
packageManager?: string;
```

##### peerDependencies?

```ts
peerDependencies?: Record<string, string>;
```

##### peerDependenciesMeta?

```ts
peerDependenciesMeta?: Record<string, {
  optional: boolean;
}>;
```

##### scripts?

```ts
scripts?: Record<string, string>;
```

##### version?

```ts
version?: string;
```

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

---

### PackageJson

```ts
type PackageJson: PrivatePackageJson | PublicPackageJson;
```

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

---

### Person

```ts
type Person: {
  email: string;
  name: string;
  url: string;
};
```

**Type declaration:**

##### email?

```ts
email?: string;
```

##### name?

```ts
name?: string;
```

##### url?

```ts
url?: string;
```

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

---

### PrivatePackageJson

```ts
type PrivatePackageJson: {
  license: "UNLICENSED";
  private: true;
  workspaces: string[];
  } & BasePackageJson;
```

**Type declaration:**

##### license?

```ts
license?: "UNLICENSED";
```

##### private

```ts
private: true;
```

##### workspaces?

```ts
workspaces?: string[];
```

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

---

### PublicPackageJson

```ts
type PublicPackageJson: {
  private: false;
  publishConfig: PublishConfig;
  workspaces: never;
  } & BasePackageJson;
```

**Type declaration:**

##### private?

```ts
private?: false;
```

##### publishConfig?

```ts
publishConfig?: PublishConfig;
```

##### workspaces?

```ts
workspaces?: never;
```

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

---

### PublishConfig

```ts
type PublishConfig: {
[key: typeof publishConfigKeep[number]]: unknown;   bin: string | Record<string, string>;
  exports: Record<string, string | {
     default: string;
     import: string;
     require: string;
     types: string;
  }>;
  main: string;
  module: string;
  typings: string;
};
```

The `publishConfig` should follow [NPM's guidelines](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#publishconfig), apart from the possible defined extra keys here. Anything defined here will be merged back to the root of the `package.json` at publish time.

Use these keys to help differentiate between your repository's source-dependency entrypoints vs published module entrypoints.

```json collapse={2-4}
{
	"name": "my-module",
	"license": "MIT",
	"type": "module",
	"main": "./src/index.ts",
	"publishConfig": {
		"access": "public",
		"main": "./dist/index.js",
		"typings": "./dist/index.d.ts"
	}
}
```

#### Index signature

\[`key`: _typeof_ `publishConfigKeep`\[`number`\]\]: `unknown`

**Type declaration:**

##### bin?

```ts
bin?: string | Record<string, string>;
```

##### exports?

```ts
exports?: Record<string, string | {
  default: string;
  import: string;
  require: string;
  types: string;
}>;
```

##### main?

```ts
main?: string;
```

##### module?

```ts
module?: string;
```

##### typings?

```ts
typings?: string;
```

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

<!-- end-onerepo-sentinel -->
