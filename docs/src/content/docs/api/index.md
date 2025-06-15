---
title: oneRepo API
description: Full API documentation for oneRepo.
---

<!-- start-onerepo-sentinel -->
<!-- @generated SignedSource<<a6932a01bd47cc83a10fac8f3d491eaf>> -->

## Namespaces

| Namespace                                | Description                                                                                   |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| [builders](onerepo/namespaces/builders/) | Common and reusable command-line option builders.                                             |
| [file](onerepo/namespaces/file/)         | File manipulation functions.                                                                  |
| [git](onerepo/namespaces/git/)           | Special handlers for managing complex queries and manipulation of the git repository's state. |

## Variables

### defaultConfig

```ts
const defaultConfig: Required<RootConfig>;
```

**Defined in:** [modules/onerepo/src/setup/setup.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/setup/setup.ts)

---

### restoreCursor

```ts
const restoreCursor: typeof restoreCursorDefault;
```

**Defined in:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)

## Commands

### Argv\<CommandArgv\>

```ts
type Argv<CommandArgv> = Arguments<CommandArgv & DefaultArgv>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Helper for combining local parsed arguments along with the default arguments provided by the oneRepo command module.

#### Type Parameters

| Type Parameter | Default type | Description                                                                                                                                    |
| -------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `CommandArgv`  | `object`     | Arguments that will be parsed for this command, always a union with [\`DefaultArgv\`](#defaultargv) and [\`PositionalArgv\`](#positionalargv). |

---

### Builder()\<CommandArgv\>

```ts
type Builder<CommandArgv> = (yargs) => Yargv<CommandArgv>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Option argument parser for the given command. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for more, but note that only the object variant is not accepted – only function variants will be accepted in oneRepo commands.

For common arguments that work in conjunction with [\`HandlerExtra\`](#handlerextra) methods like `getAffected()`, you can use helpers from the [\`builders\` namespace](onerepo/namespaces/builders/), like [\`builders.withAffected()\`](onerepo/namespaces/builders/#withaffected).

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

#### Type Parameters

| Type Parameter | Default type | Description                                    |
| -------------- | ------------ | ---------------------------------------------- |
| `CommandArgv`  | `object`     | Arguments that will be parsed for this command |

**Parameters:**

| Parameter | Type    | Description                                                                                               |
| --------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `yargs`   | `Yargs` | The Yargs instance. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) |

**Returns:** `Yargv`\<`CommandArgv`\>  
**See also:**

- [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for general usage.
- Common extensions via the [\`builders\`](onerepo/namespaces/builders/) namespace.

---

### DefaultArgv

```ts
type DefaultArgv = {
  dry-run: boolean;
  quiet: boolean;
  skip-engine-check: boolean;
  verbosity: number;
};
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)  
**Default:** arguments provided globally for all commands. These arguments are included by when using [\`Builder\`](#builder) and [\`Handler\`](#handler).

#### Properties

##### dry-run

```ts
dry-run: boolean;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Whether the command should run non-destructive dry-mode. This prevents all subprocesses, files, and git operations from running unless explicitly specified as safe to run.

Also internally sets `process.env.ONEREPO_DRY_RUN = 'true'`.

**Default:** `false`

##### quiet

```ts
quiet: boolean;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Silence all logger output. Prevents _all_ stdout and stderr output from the logger entirely.

**Default:** `false`

##### skip-engine-check

```ts
skip-engine-check: boolean;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Skip the engines check. When `false`, oneRepo will the current process's node version with the range for `engines.node` as defined in `package.json`. If not defined in the root `package.json`, this will be skipped.

**Default:** `false`

##### verbosity

```ts
verbosity: number;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Verbosity level for the Logger. See Logger.verbosity for more information.

**Default:** `3`

---

### Handler()\<CommandArgv\>

```ts
type Handler<CommandArgv> = (argv, extra) => Promise<void>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

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

#### Type Parameters

| Type Parameter | Default type | Description                                                                                                                                |
| -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `CommandArgv`  | `object`     | Arguments that will be parsed for this command. DefaultArguments will be automatically merged into this object for use within the handler. |

**Parameters:**

| Parameter | Type                             |
| --------- | -------------------------------- |
| `argv`    | [`Argv`](#argv)\<`CommandArgv`\> |
| `extra`   | [`HandlerExtra`](#handlerextra)  |

**Returns:** `Promise`\<`void`\>  
**See also:**

- [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for general usage.
- [\`HandlerExtra\`](#handlerextra) for extended extra arguments provided above and beyond the scope of Yargs.

---

### HandlerExtra

```ts
type HandlerExtra = {
	config: Required<RootConfig>;
	getAffected: (opts?) => Promise<Workspace[]>;
	getFilepaths: (opts?) => Promise<string[]>;
	getWorkspaces: (opts?) => Promise<Workspace[]>;
	graph: Graph;
	logger: Logger;
};
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Commands in oneRepo extend beyond what Yargs is able to provide by adding a second argument to the handler.

All extras are available as the second argument on your [\`Handler\`](#handler)

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

#### Properties

##### config

```ts
config: Required<RootConfig>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

This repository’s oneRepo [config](#rootconfig), resolved with all defaults.

##### getAffected()

```ts
getAffected: (opts?) => Promise<Workspace[]>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Get the affected Workspaces based on the current state of the repository.

This is a wrapped implementation of [\`builders.getAffected\`](onerepo/namespaces/builders/#getaffected) that does not require passing the `graph` argument.

**Parameters:**

| Parameter | Type                                                          |
| --------- | ------------------------------------------------------------- |
| `opts?`   | [`GetterOptions`](onerepo/namespaces/builders/#getteroptions) |

**Returns:** `Promise`\<[`Workspace`](#workspace)[]\>

##### getFilepaths()

```ts
getFilepaths: (opts?) => Promise<string[]>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Get the affected filepaths based on the current inputs and state of the repository. Respects manual inputs provided by [\`builders.withFiles\`](onerepo/namespaces/builders/#withfiles) if provided.

This is a wrapped implementation of [\`builders.getFilepaths\`](onerepo/namespaces/builders/#getfilepaths) that does not require the `graph` and `argv` arguments.

**Note:** that when used with `--affected`, there is a default limit of 100 files before this will switch to returning affected Workspace paths. Use `affectedThreshold: 0` to disable the limit.  
**Parameters:**

| Parameter | Type                                                                  |
| --------- | --------------------------------------------------------------------- |
| `opts?`   | [`FileGetterOptions`](onerepo/namespaces/builders/#filegetteroptions) |

**Returns:** `Promise`\<`string`[]\>

##### getWorkspaces()

```ts
getWorkspaces: (opts?) => Promise<Workspace[]>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Get the affected Workspaces based on the current inputs and the state of the repository.
This function differs from `getAffected` in that it respects all input arguments provided by
[\`builders.withWorkspaces\`](onerepo/namespaces/builders/#withworkspaces), [\`builders.withFiles\`](onerepo/namespaces/builders/#withfiles) and [\`builders.withAffected\`](onerepo/namespaces/builders/#withaffected).

This is a wrapped implementation of [\`builders.getWorkspaces\`](onerepo/namespaces/builders/#getworkspaces) that does not require the `graph` and `argv` arguments.

**Parameters:**

| Parameter | Type                                                          |
| --------- | ------------------------------------------------------------- |
| `opts?`   | [`GetterOptions`](onerepo/namespaces/builders/#getteroptions) |

**Returns:** `Promise`\<[`Workspace`](#workspace)[]\>

##### graph

```ts
graph: Graph;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

The full monorepo [\`Graph\`](#graph).

##### logger

```ts
logger: Logger;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Standard [\`Logger\`](#logger). This should _always_ be used in place of `console.log` methods unless you have
a specific need to write to standard out differently.

---

### PositionalArgv

```ts
type PositionalArgv = {
  _: (string | number)[];
  --: string[];
  $0: string;
};
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Always present in Builder and Handler arguments as parsed by Yargs.

#### Properties

##### \_

```ts
_: (string | number)[];
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Positionals / non-option arguments. These will only be filled if you include `.positional()` or `.strictCommands(false)` in your `Builder`.

##### --

```ts
--: string[];
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

Any content that comes after " -- " gets populated here. These are useful for spreading through to spawned `run` functions that may take extra options that you don't want to enumerate and validate.

##### $0

```ts
$0: string;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

The script name or node command. Similar to `process.argv[1]`

## Config

### Config\<CustomLifecycles\>

```ts
type Config<CustomLifecycles> = RootConfig<CustomLifecycles> | WorkspaceConfig<CustomLifecycles>;
```

**Defined in:** [modules/onerepo/src/types/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/index.ts)

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

#### Type Parameters

| Type Parameter                                  | Default type |
| ----------------------------------------------- | ------------ |
| `CustomLifecycles` _extends_ `string` \| `void` | `void`       |

---

### Lifecycle

```ts
type Lifecycle =
	| 'pre-commit'
	| 'post-commit'
	| 'post-checkout'
	| 'pre-merge'
	| 'post-merge'
	| 'pre-push'
	| 'build'
	| 'pre-deploy'
	| 'pre-publish'
	| 'post-publish';
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

oneRepo comes with a pre-configured list of common lifecycles for grouping [tasks](/core/tasks/).

---

### RootConfig\<CustomLifecycles\>

```ts
type RootConfig<CustomLifecycles> = {
	changes?: {
		filenames?: 'hash' | 'human';
		formatting?: {
			commit?: string;
			footer?: string;
		};
		prompts?: 'guided' | 'semver';
	};
	codeowners?: Record<string, string[]>;
	commands?: {
		directory?: string | false;
		ignore?: RegExp;
	};
	dependencies?: {
		dedupe?: boolean;
		mode?: 'strict' | 'loose' | 'off';
	};
	head?: string;
	ignore?: string[];
	meta?: Record<string, unknown>;
	plugins?: Plugin[];
	root: true;
	taskConfig?: {
		lifecycles?: CustomLifecycles[];
		stashUnstaged?: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
	};
	tasks?: TaskConfig<CustomLifecycles>;
	templateDir?: string;
	validation?: {
		schema?: string | null;
	};
	vcs?: {
		autoSyncHooks?: boolean;
		hooksPath?: string;
		provider?: 'github' | 'gitlab' | 'bitbucket' | 'gitea';
	};
	visualizationUrl?: string;
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

Setup configuration for the root of the repository.

#### Type Parameters

| Type Parameter                                  | Default type |
| ----------------------------------------------- | ------------ |
| `CustomLifecycles` _extends_ `string` \| `void` | `void`       |

#### Properties

##### changes?

```ts
optional changes: {
  filenames?: "hash" | "human";
  formatting?: {
     commit?: string;
     footer?: string;
  };
  prompts?: "guided" | "semver";
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

###### filenames?

```ts
optional filenames: "hash" | "human";
```

**Default:** `'hash'`

To generate human-readable unique filenames for change files, ensure [human-id](https://www.npmjs.com/package/human-id) is installed.

###### formatting?

```ts
optional formatting: {
  commit?: string;
  footer?: string;
};
```

**Default:** `{}`

Override some formatting strings in generated changelog files.

```ts title="onerepo.config.ts"
export default {
	root: true,
	changes: {
		formatting: {
			commit: '([${ref.short}](https://github.com/paularmstrong/onerepo/commit/${ref}))',
			footer:
				'> Full changelog [${fromRef.short}...${throughRef.short}](https://github.com/my-repo/commits/${fromRef}...${throughRef})',
		},
	},
};
```

###### formatting.commit?

```ts
optional commit: string;
```

**Default:** `'(${ref.short})'`

Format how the commit ref will appear at the end of the first line of each change entry.

Available replacement strings:
| Replacement | Description |
| --- | --- |
| `${ref.short}` | 8-character version of the commit ref |
| `${ref}` | Full commit ref |

###### formatting.footer?

```ts
optional footer: string;
```

**Default:** `'_View git logs for full change list._'`

Format the footer at the end of each version in the generated changelog files.

Available replacement strings:
| Replacement | Description |
| --- | --- |
| `${fromRef.short}` | 8-character version of the first commit ref in the version |
| `${fromRef}` | Full commit ref of the first commit in the version |
| `${through.short}` | 8-character version of the last commit ref in the version |
| `${through}` | Full commit ref of the last commit in the version |
| `${version}` | New version string |

###### prompts?

```ts
optional prompts: "guided" | "semver";
```

**Default:** `'guided'`

Change the prompt question & answer style when adding change entries.

- `'guided'`: Gives more detailed explanations when release types.
- `'semver'`: A simple choice list of semver release types.

##### codeowners?

```ts
optional codeowners: Record<string, string[]>;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)  
**Default:** `{}`

Map of paths to array of owners.

When used with the [`codeowners` commands](https://onerepo.tools/core/codeowners/), this configuration enables syncing configurations from Workspaces to the appropriate root level CODEOWNERS file given your [`vcsProvider`](#vcsprovider) as well as verifying that the root file is up to date.

```ts title="onerepo.config.ts"
export default {
	root: true,
	codeowners: {
		'*': ['@my-team', '@person'],
		scripts: ['@infra-team'],
	},
};
```

##### commands?

```ts
optional commands: {
  directory?: string | false;
  ignore?: RegExp;
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

Configuration for custom commands.

###### directory?

```ts
optional directory: string | false;
```

**Default:** `'commands'`

A string to use as filepaths to subcommands. We'll look for commands in all Workspaces using this string. If any are found, they'll be available from the CLI.

```ts title="onerepo.config.ts"
export default {
	root: true,
	commands: {
		directory: 'commands',
	},
};
```

Given the preceding configuration, commands will be searched for within the `commands/` directory at the root of the repository as well as a directory of the same name at the root of each Workspace:

- `<root>/commands/*`
- `<root>/<workspaces>/commands/*`

###### ignore?

```ts
optional ignore: RegExp;
```

**Default:** `/(/__\w+__/|\.test\.|\.spec\.|\.config\.)/`

Prevent reading matched files in the `commands.directory` as commands.

When writing custom commands and Workspace-level subcommands, we may need to ignore certain files like tests, fixtures, and other helpers. Use a regular expression here to configure which files will be ignored when oneRepo parses and executes commands.

```ts title="onerepo.config.ts"
export default {
	root: true,
	commands: {
		ignore: /(/__\w+__/|\.test\.|\.spec\.|\.config\.)/,
	},
};
```

##### dependencies?

```ts
optional dependencies: {
  dedupe?: boolean;
  mode?: "strict" | "loose" | "off";
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

###### dedupe?

```ts
optional dedupe: boolean;
```

**Default:** `true`

When modifying dependencies using the `one dependencies` command, a `dedupe` will automatically be run to reduce duplicate package versions that overlap the requested ranges. Set this to `false` to disable this behavior.

###### mode?

```ts
optional mode: "strict" | "loose" | "off";
```

**Default:** `'loose'`

The dependency mode will be used for node module dependency management and verification.

- `off`: No validation will occur. Everything goes.
- `loose`: Reused third-party dependencies will be required to have semantic version overlap across unique branches of the Graph.
- `strict`: Versions of all dependencies across each discrete Workspace dependency tree must be strictly equal.

##### head?

```ts
optional head: string;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)  
**Default:** `'main'`

The default branch of your repo? Probably `main`, but it might be something else, so it's helpful to put that here so that we can determine changed files accurately.

```ts title="onerepo.config.ts"
export default {
	root: true,
	head: 'develop',
};
```

##### ignore?

```ts
optional ignore: string[];
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)  
**Default:** `[]`

Array of fileglobs to ignore when calculating the changed Workspaces.

Periodically we may find that there are certain files or types of files that we _know_ for a fact do not affect the validity of the repository or any code. When this happens and the files are modified, unnecessary tasks and processes will be spun up that don't have any bearing on the outcome of the change.

To avoid extra processing, we can add file globs to ignore when calculated the afected Workspace graph.

:::caution
This configuration should be used sparingly and with caution. It is better to do too much work as opposed to not enough.
:::

```ts title="onerepo.config.ts"
export default {
	root: true,
	ignore: ['.github/\*'],
};
```

##### meta?

```ts
optional meta: Record<string, unknown>;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)  
**Default:** `{}`

A place to put any custom information or configuration. A helpful space for you to extend Workspace configurations for your own custom commands.

```ts title="onerepo.config.ts"
export default {
	root: true,
	meta: {
		tacos: 'are delicious',
	},
};
```

##### plugins?

```ts
optional plugins: Plugin[];
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)  
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

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

Must be set to `true` in order to denote that this is the root of the repository.

##### taskConfig?

```ts
optional taskConfig: {
  lifecycles?: CustomLifecycles[];
  stashUnstaged?: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

Optional extra configuration for `tasks`.

###### lifecycles?

```ts
optional lifecycles: CustomLifecycles[];
```

**Default:** `[]`

Additional `task` lifecycles to make available.

See [\`Lifecycle\`](#lifecycle) for a list of pre-configured lifecycles.

```ts title="onerepo.config.ts"
export default {
	root: true,
	tasks: {
		lifecycles: ['deploy-staging'],
	},
};
```

###### stashUnstaged?

```ts
optional stashUnstaged: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
```

**Default:** `['pre-commit']`
Stash unstaged changes before running these tasks and re-apply them after the task has completed.

```ts title="onerepo.config.ts"
export default {
	root: true,
	tasks: {
		stashUnstaged: ['pre-commit', 'post-checkout'],
	},
};
```

##### tasks?

```ts
optional tasks: TaskConfig<CustomLifecycles>;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)  
**Default:** `{}`

Globally defined tasks per lifecycle. Tasks defined here will be assumed to run for all changes, regardless of affected Workspaces. Refer to the [`tasks` command](https://onerepo.tools/core/tasks/) specifications for details and examples.

##### templateDir?

```ts
optional templateDir: string;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)  
**Default:** `'./config/templates'`

Folder path for [`generate` command’s](https://onerepo.tools/core/generate/) templates.

##### validation?

```ts
optional validation: {
  schema?: string | null;
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

###### schema?

```ts
optional schema: string | null;
```

**Default:** `undefined`

File path for custom Graph and configuration file validation schema.

##### vcs?

```ts
optional vcs: {
  autoSyncHooks?: boolean;
  hooksPath?: string;
  provider?: "github" | "gitlab" | "bitbucket" | "gitea";
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

Version control system settings.

###### autoSyncHooks?

```ts
optional autoSyncHooks: boolean;
```

**Default:** `false`

Automatically set and sync oneRepo-managed git hooks. Change the directory for your git hooks with the [`vcs.hooksPath`](#vcshookspath) setting. Refer to the [Git hooks documentation](https://onerepo.tools/core/hooks/) to learn more.

```ts title="onerepo.config.ts"
export default {
	root: true,
	vcs: {
		autoSyncHooks: false,
	},
};
```

###### hooksPath?

```ts
optional hooksPath: string;
```

**Default:** `'.hooks'`

Modify the default git hooks path for the repository. This will automatically be synchronized via `one hooks sync` unless explicitly disabled by setting [`vcs.autoSyncHooks`](#vcsautosynchooks) to `false`.

```ts title="onerepo.config.ts"
export default {
	root: true,
	vcs: {
		hooksPath: '.githooks',
	},
};
```

###### provider?

```ts
optional provider: "github" | "gitlab" | "bitbucket" | "gitea";
```

**Default:** `'github'`

The provider will be factored in to various commands, like `CODEOWNERS` generation.

```ts title="onerepo.config.ts"
export default {
	root: true,
	vcs: {
		provider: 'github',
	},
};
```

##### visualizationUrl?

```ts
optional visualizationUrl: string;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)  
**Default:** `'https://onerepo.tools/visualize/'`

Override the URL used to visualize the Graph. The Graph data will be attached the the `g` query parameter as a JSON string of the DAG, compressed using zLib deflate.

---

### Task

```ts
type Task = string | TaskDef | string[];
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

A Task can either be a string or [\`TaskDef\`](#taskdef) object with extra options, or an array of strings. If provided as an array of strings, each command will be run sequentially, waiting for the previous to succeed. If one command fails, the rest in the sequence will not be run.

To run sequences of commands with `match` and `meta` information, you can pass an array of strings to the `cmd` property of a [\`TaskDef\`](#taskdef).

---

### TaskConfig\<CustomLifecycles\>

```ts
type TaskConfig<CustomLifecycles> = Partial<
	Record<CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle, Tasks>
>;
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

#### Type Parameters

| Type Parameter                                  | Default type |
| ----------------------------------------------- | ------------ |
| `CustomLifecycles` _extends_ `string` \| `void` | `void`       |

---

### TaskDef

```ts
type TaskDef = {
	cmd: string | string[];
	match?: string | string[];
	meta?: Record<string, unknown>;
};
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

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

#### Properties

##### cmd

```ts
cmd: string | string[];
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

String command(s) to run. If provided as an array of strings, each command will be run sequentially, waiting for the previous to succeed. If one command fails, the rest in the sequence will not be run.

The commands can use replaced tokens:

- `$0`: the oneRepo CLI for your repository
- `${workspaces}`: replaced with a space-separated list of Workspace names necessary for the given lifecycle

##### match?

```ts
optional match: string | string[];
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

Glob file match. This will force the `cmd` to run if any of the paths in the modified files list match the glob. Conversely, if no files are matched, the `cmd` _will not_ run.

##### meta?

```ts
optional meta: Record<string, unknown>;
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

Extra information that will be provided only when listing tasks with the `--list` option from the `tasks` command. This object is helpful when creating a matrix of runners with GitHub actions or similar CI pipelines.

---

### Tasks

```ts
type Tasks = {
	parallel?: Task[];
	serial?: Task[];
};
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

Individual [\`Task\`](#task)s in any [\`Lifecycle\`](#lifecycle) may be grouped to run either serial (one after the other) or in parallel (multiple at the same time).

#### Properties

##### parallel?

```ts
optional parallel: Task[];
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

##### serial?

```ts
optional serial: Task[];
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### WorkspaceConfig\<CustomLifecycles\>

```ts
type WorkspaceConfig<CustomLifecycles> = {
	codeowners?: Record<string, string[]>;
	commands?: {
		passthrough: Record<
			string,
			{
				command?: string;
				description: string;
			}
		>;
	};
	meta?: Record<string, unknown>;
	tasks?: TaskConfig<CustomLifecycles>;
};
```

**Defined in:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)

#### Type Parameters

| Type Parameter                                  | Default type |
| ----------------------------------------------- | ------------ |
| `CustomLifecycles` _extends_ `string` \| `void` | `void`       |

#### Properties

##### codeowners?

```ts
optional codeowners: Record<string, string[]>;
```

**Defined in:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)  
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
optional commands: {
  passthrough: Record<string, {
     command?: string;
     description: string;
  }>;
};
```

**Defined in:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)

Configuration for custom commands. To configure the commands directory, see [`RootConfig` `commands.directory`](#commandsdirectory).

###### passthrough

```ts
passthrough: Record<
	string,
	{
		command?: string;
		description: string;
	}
>;
```

**Default:** `{}`

Enable commands from installed dependencies. Similar to running `npx <command>`, but pulled into the oneRepo CLI and able to be limited by Workspace. Passthrough commands _must_ have helpful descriptions.

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
optional meta: Record<string, unknown>;
```

**Defined in:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)  
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
optional tasks: TaskConfig<CustomLifecycles>;
```

**Defined in:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)  
**Default:** `{}`
Tasks for this Workspace. These will be merged with global tasks and any other affected Workspace tasks. Refer to the [`tasks` command](/core/tasks/) specifications for details and examples.

:::tip[Merging tasks]
Each modified Workspace or Workspace that is affected by another Workspace's modifications will have its tasks evaluated and merged into the full set of tasks for each given lifecycle run. Check the [Tasks reference](/core/tasks/) to learn more.
:::

## Graph

### getGraph()

```ts
function getGraph(workingDir?): Graph;
```

**Defined in:** [modules/graph/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/index.ts)

Get the [\`Graph\`](#graph) given a particular root working directory. If the working directory is not a monorepo's root, an empty `Graph` will be given in its place.

```ts
const graph = getGraph(process.cwd());
assert.ok(graph.isRoot);
```

**Parameters:**

| Parameter     | Type     |
| ------------- | -------- |
| `workingDir?` | `string` |

**Returns:** [`Graph`](#graph)

---

### Graph

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

The oneRepo Graph is a representation of the entire repository’s [\`Workspaces\`](#workspace) and how they depend upon each other. Most commonly, you will want to use the Graph to get lists of Workspaces that either depend on some input or are dependencies thereof:

```ts
const workspacesToCheck = graph.affected('tacos');
for (const ws of workspacesToCheck) {
	// verify no issues based on changes
}
```

The `Graph` also includes various helpers for determining workspaces based on filepaths, name, and other factors.

#### Accessors

##### packageManager

###### Get Signature

```ts
get packageManager(): PackageManager;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

Get the [PackageManager](#packagemanager-1) that this Graph depends on. This object allows you to run many common package management commands safely, agnostic of any particular flavor of package management. Works with npm, Yarn, and pnpm.

```ts
await graph.packageManager.install();
```

**Returns:** [`PackageManager`](#packagemanager-1)

##### root

###### Get Signature

```ts
get root(): Workspace;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

This returns the [\`Workspace\`](#workspace) that is at the root of the repository.

Regardless of how the `workspaces` are configured with the package manager, the root `package.json` is always registered as a Workspace.

```ts
const root = graph.root;
root.isRoot === true;
```

**Returns:** [`Workspace`](#workspace)

##### workspaces

###### Get Signature

```ts
get workspaces(): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

Get a list of all [\`Workspaces\`](#workspace) that are part of the repository Graph \| \`Graph\`.

```ts
for (const workspace of graph.workspaces) {
	logger.info(workspace.name);
}
```

**Returns:** [`Workspace`](#workspace)[]

#### Methods

##### affected()

```ts
affected<T>(source, type?): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

Get a list of [\`Workspaces\`](#workspace) that will be affected by the given source(s). This is equivalent to `graph.dependents(sources, true)`. See also [\`dependents\`](#dependents).

```ts
const dependents = graph.dependents(sources, true);
const affected = graph.affected(sources);

assert.isEqual(dependents, affecteed);
```

###### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `T` _extends_ `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter | Type                  | Description                                 |
| --------- | --------------------- | ------------------------------------------- |
| `source`  | `T` \| `T`[]          | -                                           |
| `type?`   | [`DepType`](#deptype) | Filter the dependents to a dependency type. |

**Returns:** [`Workspace`](#workspace)[]

##### dependencies()

```ts
dependencies<T>(
   sources?,
   includeSelf?,
   type?): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

Get all dependency [\`Workspaces\`](#workspace) of one or more input Workspaces or qualified names of Workspaces. This not only returns the direct dependencies, but all dependencies throughout the entire [\`Graph\`](#graph). This returns the opposite result of [\`dependents\`](#dependents).

```ts
for (const workspace of graph.dependencies('tacos')) {
	logger.info(`"${workspace.name}" is a dependency of "tacos"`);
}
```

###### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `T` _extends_ `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter      | Type                  | Description                                                                                            |
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------------ |
| `sources?`     | `T` \| `T`[]          | A list of [\`Workspaces\`](#workspace) by [\`name\`](#name)s or any available [\`aliases\`](#aliases). |
| `includeSelf?` | `boolean`             | Whether to include the `Workspaces` for the input `sources` in the return array.                       |
| `type?`        | [`DepType`](#deptype) | Filter the dependencies to a dependency type.                                                          |

**Returns:** [`Workspace`](#workspace)[]

##### dependents()

```ts
dependents<T>(
   sources?,
   includeSelf?,
   type?): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

Get all dependent [\`Workspaces\`](#workspace) of one or more input Workspaces or qualified names of Workspaces. This not only returns the direct dependents, but all dependents throughout the entire [\`Graph\`](#graph). This returns the opposite result of [\`dependencies\`](#dependencies).

```ts
for (const workspace of graph.dependents('tacos')) {
	logger.info(`"${workspace.name}" depends on "tacos"`);
}
```

###### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `T` _extends_ `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter      | Type                  | Description                                                                      |
| -------------- | --------------------- | -------------------------------------------------------------------------------- |
| `sources?`     | `T` \| `T`[]          | One or more Workspaces by name or `Workspace` instance                           |
| `includeSelf?` | `boolean`             | Whether to include the `Workspaces` for the input `sources` in the return array. |
| `type?`        | [`DepType`](#deptype) | Filter the dependents to a dependency type.                                      |

**Returns:** [`Workspace`](#workspace)[]

##### getAllByLocation()

```ts
getAllByLocation(locations): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

Get all Workspaces given an array of filepaths.

```ts
const workspaces = graph.getAllByLocation([__dirname, 'file:///foo/bar']);
```

**Parameters:**

| Parameter   | Type       | Description                                                   |
| ----------- | ---------- | ------------------------------------------------------------- |
| `locations` | `string`[] | A list of filepath strings. May be file URLs or string paths. |

**Returns:** [`Workspace`](#workspace)[]

##### getAllByName()

```ts
getAllByName(names): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

Get a list of [\`Workspaces\`](#workspace) by string names.

```ts
const workspaces = graph.getAllByName(['tacos', 'burritos']);
```

**Parameters:**

| Parameter | Type       | Description                                                                      |
| --------- | ---------- | -------------------------------------------------------------------------------- |
| `names`   | `string`[] | A list of Workspace [\`name\`](#name)s or any available [\`aliases\`](#aliases). |

**Returns:** [`Workspace`](#workspace)[]

##### getByLocation()

```ts
getByLocation(location): Workspace;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

Get the equivalent [\`Workspace\`](#workspace) for a filepath. This can be any location within a `Workspace`, not just its root.

```ts title="CommonJS compatible"
// in Node.js
graph.getByLocation(__dirname);
```

```ts title="ESM compatible"
graph.getByLocation(import.meta.url);
```

**Parameters:**

| Parameter  | Type     | Description                     |
| ---------- | -------- | ------------------------------- |
| `location` | `string` | A string or URL-based filepath. |

**Returns:** [`Workspace`](#workspace)

###### Throws

`Error` if no Workspace can be found.

##### getByName()

```ts
getByName(name): Workspace;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

Get a [\`Workspace\`](#workspace) by string name.

```ts
const workspace = graph.getByName('my-cool-package');
```

**Parameters:**

| Parameter | Type     | Description                                                               |
| --------- | -------- | ------------------------------------------------------------------------- |
| `name`    | `string` | A Workspace’s [\`name\`](#name) or any available [\`aliases\`](#aliases). |

**Returns:** [`Workspace`](#workspace)

###### Throws

`Error` if no Workspace exists with the given input `name`.

---

### Workspace

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

#### Accessors

##### aliases

###### Get Signature

```ts
get aliases(): string[];
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Allow custom array of aliases.
If the fully qualified package name is scoped, this will include the un-scoped name

**Returns:** `string`[]

##### codeowners

###### Get Signature

```ts
get codeowners(): NonNullable<Required<WorkspaceConfig["codeowners"]>>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `NonNullable`\<`Required`\<[`WorkspaceConfig`](#workspaceconfig-1)\[`"codeowners"`\]\>\>

##### config

###### Get Signature

```ts
get config(): Required<RootConfig | WorkspaceConfig>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Get the Workspace's configuration

**Returns:** `Required`\<[`RootConfig`](#rootconfig) \| [`WorkspaceConfig`](#workspaceconfig-1)\>

##### dependencies

###### Get Signature

```ts
get dependencies(): Record<string, string>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Get the `package.json` defined production dependencies for the Workspace.

**Returns:** `Record`\<`string`, `string`\>

Map of modules to their version.

##### description

###### Get Signature

```ts
get description(): undefined | string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Canonical to the `package.json` `"description"` field.

**Returns:** `undefined` \| `string`

##### devDependencies

###### Get Signature

```ts
get devDependencies(): Record<string, string>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Get the `package.json` defined development dependencies for the Workspace.

**Returns:** `Record`\<`string`, `string`\>

Map of modules to their version.

##### isRoot

###### Get Signature

```ts
get isRoot(): boolean;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Whether or not this Workspace is the root of the repository / Graph.

**Returns:** `boolean`

##### location

###### Get Signature

```ts
get location(): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Absolute path on the current filesystem to the Workspace.

**Returns:** `string`

##### main

###### Get Signature

```ts
get main(): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `string`

##### name

###### Get Signature

```ts
get name(): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

The full `name` of the Workspace, as defined in its `package.json`

**Returns:** `string`

##### packageJson

###### Get Signature

```ts
get packageJson(): PackageJson;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

A full deep copy of the `package.json` file for the Workspace. Modifications to this object will not be preserved on the Workspace.

**Returns:** [`PackageJson`](#packagejson-1)

##### peerDependencies

###### Get Signature

```ts
get peerDependencies(): Record<string, string>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Get the `package.json` defined peer dependencies for the Workspace.

**Returns:** `Record`\<`string`, `string`\>

Map of modules to their version.

##### private

###### Get Signature

```ts
get private(): boolean;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

If a Workspace `package.json` is set to `private: true`, it will not be available to publish through NPM or other package management registries.

**Returns:** `boolean`

##### publishablePackageJson

###### Get Signature

```ts
get publishablePackageJson(): null | PublicPackageJson;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Get a version of the Workspace's `package.json` that is meant for publishing.

This strips off `devDependencies` and applies appropriate [\`publishConfig\`](#publishconfig) values to the root of the `package.json`. This feature enables your monorepo to use source-dependencies and avoid manually building shared Workspaces for every change in order to see them take affect in dependent Workspaces.

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

##### scope

###### Get Signature

```ts
get scope(): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Get module name scope if there is one, eg `@onerepo`

**Returns:** `string`

##### tasks

###### Get Signature

```ts
get tasks(): TaskConfig;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Get the task configuration as defined in the `onerepo.config.js` file at the root of the Workspace.

**Returns:** [`TaskConfig`](#taskconfig-1)

If a config does not exist, an empty object will be given.

##### version

###### Get Signature

```ts
get version(): undefined | string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `undefined` \| `string`

#### Methods

##### getCodeowners()

```ts
getCodeowners(filepath): string[];
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Parameters:**

| Parameter  | Type     |
| ---------- | -------- |
| `filepath` | `string` |

**Returns:** `string`[]

##### getTasks()

```ts
getTasks(lifecycle): Required<Tasks>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Get a list of Workspace tasks for the given lifecycle

**Parameters:**

| Parameter   | Type     |
| ----------- | -------- |
| `lifecycle` | `string` |

**Returns:** `Required`\<[`Tasks`](#tasks-2)\>

##### relative()

```ts
relative(to): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Get the relative path of an absolute path to the Workspace’s location root

```ts
const relativePath = workspace.relative('/some/absolute/path');
```

**Parameters:**

| Parameter | Type     | Description       |
| --------- | -------- | ----------------- |
| `to`      | `string` | Absolute filepath |

**Returns:** `string`

Relative path to the workspace’s root location.

##### resolve()

```ts
resolve(...pathSegments): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

Resolve a full filepath within the Workspace given the path segments. Similar to Node.js's [path.resolve()](https://nodejs.org/dist/latest-v18.x/docs/api/path.html#pathresolvepaths).

```ts
const main = workspace.resolve(workspace.main);
```

**Parameters:**

| Parameter         | Type       | Description                          |
| ----------------- | ---------- | ------------------------------------ |
| ...`pathSegments` | `string`[] | A sequence of paths or path segments |

**Returns:** `string`

Absolute path based on the input path segments

---

### DependencyType

```ts
const DependencyType: {
	DEV: 2;
	PEER: 1;
	PROD: 3;
};
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

#### Type declaration

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

---

### DepType

```ts
type DepType = 1 | 2 | 3;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

Dependency type value.

**See also:**
[\`DependencyType\`](#dependencytype)

---

### GraphSchemaValidators

```ts
type GraphSchemaValidators = Record<string, Record<string,
  | Schema & {
  $required?: boolean;
}
  | (workspace, graph) => Schema & {
  $required?: boolean;
}>>;
```

**Defined in:** [modules/onerepo/src/core/graph/schema.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/graph/schema.ts)

Definition for `graph verify` JSON schema validators.

See [“Validating configurations”](/core/graph/#verifying-configurations) for more examples and use cases.

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

## Logger

### bufferSubLogger()

```ts
function bufferSubLogger(step): {
	end: () => Promise<void>;
	logger: Logger;
};
```

**Defined in:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)  
**<span class="tag danger">Alpha</span>**

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
| --------- | --------------------- |
| `step`    | [`LogStep`](#logstep) |

**Returns:** ```ts
{
end: () => Promise<void>;
logger: Logger;
}

````

##### end()

```ts
end: () => Promise<void>;
````

**Returns:** `Promise`\<`void`\>

##### logger

```ts
logger: Logger;
```

---

### getLogger()

```ts
function getLogger(opts?): Logger;
```

**Defined in:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)

This gets the logger singleton for use across all of oneRepo and its commands.

Available directly as [\`HandlerExtra\`](#handlerextra) on [\`Handler\`](#handler) functions:

```ts
export const handler: Handler = (argv, { logger }) => {
	logger.log('Hello!');
};
```

**Parameters:**

| Parameter | Type                                           |
| --------- | ---------------------------------------------- |
| `opts?`   | `Partial`\<[`LoggerOptions`](#loggeroptions)\> |

**Returns:** [`Logger`](#logger)

---

### stepWrapper()

```ts
function stepWrapper<T>(options, fn): Promise<T>;
```

**Defined in:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)

For cases where multiple processes need to be completed, but should be joined under a single [\`LogStep\`](#logstep) to avoid too much noisy output, this safely wraps an asynchronous function and handles step creation and completion, unless a `step` override is given.

```ts
export async function exists(filename: string, { step }: Options = {}) {
	return stepWrapper({ step, name: 'Step fallback name' }, (step) => {
		return; // do some work
	});
}
```

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

**Parameters:**

| Parameter       | Type                                                    |
| --------------- | ------------------------------------------------------- |
| `options`       | \{ `name`: `string`; `step?`: [`LogStep`](#logstep); \} |
| `options.name`  | `string`                                                |
| `options.step?` | [`LogStep`](#logstep)                                   |
| `fn`            | (`step`) => `Promise`\<`T`\>                            |

**Returns:** `Promise`\<`T`\>

---

### Logger

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

The oneRepo logger helps build commands and capture output from spawned subprocess in a way that's both delightful to the end user and includes easy to scan and follow output.

All output will be redirected from `stdout` to `stderr` to ensure order of output and prevent confusion of what output can be piped and written to files.

If the current terminal is a TTY, output will be buffered and asynchronous steps will animated with a progress logger.

See [\`HandlerExtra\`](#handlerextra) for access the the global Logger instance.

#### Properties

##### id

```ts
id: string;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

#### Accessors

##### captureAll

###### Get Signature

```ts
get captureAll(): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**<span class="tag danger">Experimental</span>**

**Returns:** `boolean`

##### hasError

###### Get Signature

```ts
get hasError(): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Whether or not an error has been sent to the logger or any of its steps. This is not necessarily indicative of uncaught thrown errors, but solely on whether `.error()` has been called in the `Logger` or any `Step` instance.

**Returns:** `boolean`

##### hasInfo

###### Get Signature

```ts
get hasInfo(): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Whether or not an info message has been sent to the logger or any of its steps.

**Returns:** `boolean`

##### hasLog

###### Get Signature

```ts
get hasLog(): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Whether or not a log message has been sent to the logger or any of its steps.

**Returns:** `boolean`

##### hasWarning

###### Get Signature

```ts
get hasWarning(): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Whether or not a warning has been sent to the logger or any of its steps.

**Returns:** `boolean`

##### verbosity

###### Get Signature

```ts
get verbosity(): Verbosity;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Get the logger's verbosity level

**Returns:** [`Verbosity`](#verbosity-5)

###### Set Signature

```ts
set verbosity(value): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Applies the new verbosity to the main logger and any future steps.

**Parameters:**

| Parameter | Type                        |
| --------- | --------------------------- |
| `value`   | [`Verbosity`](#verbosity-5) |

**Returns:** `void`

##### writable

###### Get Signature

```ts
get writable(): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Returns:** `boolean`

#### Methods

##### createStep()

```ts
createStep(name, opts?): LogStep;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Create a sub-step, [\`LogStep\`](#logstep), for the logger. This and any other step will be tracked and required to finish before exit.

```ts
const step = logger.createStep('Do fun stuff');
// do some work
await step.end();
```

**Parameters:**

| Parameter             | Type                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                | `string`                                                                                                | The name to be written and wrapped around any output logged to this new step.                                                                                                                                                                                                                                                                                                                   |
| `opts?`               | \{ `description?`: `string`; `verbosity?`: [`Verbosity`](#verbosity-5); `writePrefixes?`: `boolean`; \} | -                                                                                                                                                                                                                                                                                                                                                                                               |
| `opts.description?`   | `string`                                                                                                | Optionally include extra information for performance tracing on this step. This description will be passed through to the [`performanceMark.detail`](https://nodejs.org/docs/latest-v20.x/api/perf_hooks.html#performancemarkdetail) recorded internally for this step. Use a [Performance Writer plugin](https://onerepo.tools/plugins/performance-writer/) to read and work with this detail. |
| `opts.verbosity?`     | [`Verbosity`](#verbosity-5)                                                                             | Override the default logger verbosity. Any changes while this step is running to the default logger will result in this step’s verbosity changing as well.                                                                                                                                                                                                                                      |
| `opts.writePrefixes?` | `boolean`                                                                                               | **Deprecated** This option no longer does anything and will be removed in v2.0.0                                                                                                                                                                                                                                                                                                                |

**Returns:** [`LogStep`](#logstep)

##### pause()

```ts
pause(): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

When the terminal is a TTY, steps are automatically animated with a progress indicator. There are times when it's necessary to stop this animation, like when needing to capture user input from `stdin`. Call the `pause()` method before requesting input and [\`logger.unpause()\`](#unpause) when complete.

This process is also automated by the [\`run()\`](#run) function when `stdio` is set to `pipe`.

```ts
logger.pause();
// capture input
logger.unpause();
```

**Returns:** `void`

##### unpause()

```ts
unpause(): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Unpause the logger and uncork writing buffered logs to the output stream. See [\`logger.pause()\`](#pause) for more information.

**Returns:** `void`

##### waitForClear()

```ts
waitForClear(): Promise<boolean>;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Returns:** `Promise`\<`boolean`\>

#### Logging

##### debug()

```ts
debug(contents): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Extra debug logging when verbosity greater than or equal to 4.

```ts
logger.debug('Log this content when verbosity is >= 4');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged debug information:

```ts
logger.debug(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
```

**Parameters:**

| Parameter  | Type      | Description                                                                                                                                                                                   |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. If a function is given with no arguments, the function will be executed and its response will be stringified for output. |

**Returns:** `void`  
**See also:**
[\`debug()\`](#debug-2) This is a pass-through for the main step’s [\`debug()\`](#debug-2) method.

##### error()

```ts
error(contents): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Log an error. This will cause the root logger to include an error and fail a command.

```ts
logger.error('Log this content when verbosity is >= 1');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged error:

```ts
logger.error(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
```

**Parameters:**

| Parameter  | Type      | Description                                                                                                                                                                                   |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. If a function is given with no arguments, the function will be executed and its response will be stringified for output. |

**Returns:** `void`  
**See also:**
[\`error()\`](#error-2) This is a pass-through for the main step’s [\`error()\`](#error-2) method.

##### info()

```ts
info(contents): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Should be used to convey information or instructions through the log, will log when verbositu >= 1

```ts
logger.info('Log this content when verbosity is >= 1');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:

```ts
logger.info(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
```

**Parameters:**

| Parameter  | Type      | Description                                                                                                                                                                                   |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. If a function is given with no arguments, the function will be executed and its response will be stringified for output. |

**Returns:** `void`  
**See also:**
[\`info()\`](#info-2) This is a pass-through for the main step’s [\`info()\`](#info-2) method.

##### log()

```ts
log(contents): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

General logging information. Useful for light informative debugging. Recommended to use sparingly.

```ts
logger.log('Log this content when verbosity is >= 3');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:

```ts
logger.log(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
```

**Parameters:**

| Parameter  | Type      | Description                                                                                                                                                                                   |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. If a function is given with no arguments, the function will be executed and its response will be stringified for output. |

**Returns:** `void`  
**See also:**
[\`log()\`](#log-2) This is a pass-through for the main step’s [\`log()\`](#log-2) method.

##### timing()

```ts
timing(start, end): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Log timing information between two [Node.js performance mark names](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#performancemarkname-options).

**Parameters:**

| Parameter | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `start`   | `string` | A `PerformanceMark` entry name |
| `end`     | `string` | A `PerformanceMark` entry name |

**Returns:** `void`  
**See also:**
[\`timing()\`](#timing-2) This is a pass-through for the main step’s [\`timing()\`](#timing-2) method.

##### warn()

```ts
warn(contents): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Log a warning. Does not have any effect on the command run, but will be called out.

```ts
logger.warn('Log this content when verbosity is >= 2');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged warning:

```ts
logger.warn(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
```

**Parameters:**

| Parameter  | Type      | Description                                                                                                                                                                                   |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. If a function is given with no arguments, the function will be executed and its response will be stringified for output. |

**Returns:** `void`  
**See also:**
[\`warn()\`](#warn-2) This is a pass-through for the main step’s [\`warn()\`](#warn-2) method.

##### write()

```ts
write(
   chunk,
   encoding?,
   cb?): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Write directly to the Logger's output stream, bypassing any formatting and verbosity filtering.

:::caution[Advanced]
Since [LogStep](#logstep) implements a [Node.js duplex stream](https://nodejs.org/docs/latest-v20.x/api/stream.html#class-streamduplex), it is possible to use internal `write`, `read`, `pipe`, and all other available methods, but may not be fully recommended.
:::

**Parameters:**

| Parameter   | Type                |
| ----------- | ------------------- |
| `chunk`     | `any`               |
| `encoding?` | `BufferEncoding`    |
| `cb?`       | (`error`) => `void` |

**Returns:** `boolean`  
**See also:**
[\`LogStep.write\`](#write-2).

---

### LogStep

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

LogSteps are an enhancement of [Node.js duplex streams](https://nodejs.org/docs/latest-v20.x/api/stream.html#class-streamduplex) that enable writing contextual messages to the program's output.

Always create steps using the [\`logger.createStep()\`](#createstep) method so that they are properly tracked and linked to the parent logger. Creating a LogStep directly may result in errors and unintentional side effects.

```ts
const myStep = logger.createStep();
// Do work
myStep.info('Did some work');
myStep.end();
```

#### Extends

- `Duplex`

#### Properties

##### verbosity

```ts
verbosity: Verbosity;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

#### Accessors

##### hasError

###### Get Signature

```ts
get hasError(): boolean;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Whether this step has logged an error message.

**Returns:** `boolean`

##### hasInfo

###### Get Signature

```ts
get hasInfo(): boolean;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Whether this step has logged an info-level message.

**Returns:** `boolean`

##### hasLog

###### Get Signature

```ts
get hasLog(): boolean;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Whether this step has logged a log-level message.

**Returns:** `boolean`

##### hasWarning

###### Get Signature

```ts
get hasWarning(): boolean;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Whether this step has logged a warning message.

**Returns:** `boolean`

#### Methods

##### end()

```ts
end(callback?): this;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Signal the end of this step. After this method is called, it will no longer accept any more logs of any variety and will be removed from the parent Logger's queue.

Failure to call this method will result in a warning and potentially fail oneRepo commands. It is important to ensure that each step is cleanly ended before returning from commands.

```ts
const myStep = logger.createStep('My step');
// do work
myStep.end();
```

**Parameters:**

| Parameter   | Type         |
| ----------- | ------------ |
| `callback?` | () => `void` |

**Returns:** `this`

###### Overrides

```ts
Duplex.end;
```

#### Logging

##### debug()

```ts
debug(contents): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Log a debug message for this step. Debug messages will only be written to the program output if the [\`verbosity\`](#verbosity) is set to 4 or greater.

```ts
const step = logger.createStep('My step');
step.debug('This message will be recorded and written out as an "DBG" labeled message');
step.end();
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged debug information:

```ts
step.debug(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
```

**Parameters:**

| Parameter  | Type      | Description                                                                                                                                                                                               |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents` | `unknown` | Any value may be logged as a debug message, but will be stringified upon output. If a function is given with no arguments, the function will be executed and its response will be stringified for output. |

**Returns:** `void`

##### error()

```ts
error(contents): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Log an error message for this step. Any error log will cause the entire command run in oneRepo to fail and exit with code `1`. Error messages will only be written to the program output if the [\`verbosity\`](#verbosity) is set to 1 or greater – even if not written, the command will still fail and include an exit code.

```ts
const step = logger.createStep('My step');
step.error('This message will be recorded and written out as an "ERR" labeled message');
step.end();
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged error:

```ts
step.error(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
```

**Parameters:**

| Parameter  | Type      | Description                                                                                                                                                                                        |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents` | `unknown` | Any value may be logged as an error, but will be stringified upon output. If a function is given with no arguments, the function will be executed and its response will be stringified for output. |

**Returns:** `void`

##### info()

```ts
info(contents): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Log an informative message for this step. Info messages will only be written to the program output if the [\`verbosity\`](#verbosity) is set to 1 or greater.

```ts
const step = logger.createStep('My step');
step.info('This message will be recorded and written out as an "INFO" labeled message');
step.end();
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:

```ts
step.info(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
```

**Parameters:**

| Parameter  | Type      | Description                                                                                                                                                                                    |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents` | `unknown` | Any value may be logged as info, but will be stringified upon output. If a function is given with no arguments, the function will be executed and its response will be stringified for output. |

**Returns:** `void`

##### log()

```ts
log(contents): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Log a message for this step. Log messages will only be written to the program output if the [\`verbosity\`](#verbosity) is set to 3 or greater.

```ts
const step = logger.createStep('My step');
step.log('This message will be recorded and written out as an "LOG" labeled message');
step.end();
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:

```ts
step.log(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
```

**Parameters:**

| Parameter  | Type      | Description                                                                                                                                                                            |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents` | `unknown` | Any value may be logged, but will be stringified upon output. If a function is given with no arguments, the function will be executed and its response will be stringified for output. |

**Returns:** `void`

##### timing()

```ts
timing(start, end): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Log extra performance timing information.

Timing information will only be written to the program output if the [\`verbosity\`](#verbosity) is set to 5.

```ts
const myStep = logger.createStep('My step');
performance.mark('start');
// do work
performance.mark('end');
myStep.timing('start', 'end');
myStep.end();
```

**Parameters:**

| Parameter | Type     |
| --------- | -------- |
| `start`   | `string` |
| `end`     | `string` |

**Returns:** `void`

##### warn()

```ts
warn(contents): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Log a warning message for this step. Warnings will _not_ cause oneRepo commands to fail. Warning messages will only be written to the program output if the [\`verbosity\`](#verbosity) is set to 2 or greater.

```ts
const step = logger.createStep('My step');
step.warn('This message will be recorded and written out as a "WRN" labeled message');
step.end();
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged warning:

```ts
step.warn(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
```

**Parameters:**

| Parameter  | Type      | Description                                                                                                                                                                                         |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents` | `unknown` | Any value may be logged as a warning, but will be stringified upon output. If a function is given with no arguments, the function will be executed and its response will be stringified for output. |

**Returns:** `void`

##### write()

```ts
write(
   chunk,
   encoding?,
   cb?): boolean;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Write directly to the step's stream, bypassing any formatting and verbosity filtering.

:::caution[Advanced]
Since [LogStep](#logstep) implements a [Node.js duplex stream](https://nodejs.org/docs/latest-v20.x/api/stream.html#class-streamduplex) in `objectMode`, it is possible to use internal `write`, `read`, `pipe`, and all other available methods, but may not be fully recommended.
:::

**Parameters:**

| Parameter   | Type                       |
| ----------- | -------------------------- |
| `chunk`     | `string` \| `LoggedBuffer` |
| `encoding?` | `BufferEncoding`           |
| `cb?`       | (`error`) => `void`        |

**Returns:** `boolean`

###### Overrides

```ts
Duplex.write;
```

---

### LoggerOptions

```ts
type LoggerOptions = {
	captureAll?: boolean;
	stream?: Writable | LogStep;
	verbosity: Verbosity;
};
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

#### Properties

##### captureAll?

```ts
optional captureAll: boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**<span class="tag danger">Experimental</span>**

##### stream?

```ts
optional stream: Writable | LogStep;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Advanced – override the writable stream in order to pipe logs elsewhere. Mostly used for dependency injection for `@onerepo/test-cli`.

##### verbosity

```ts
verbosity: Verbosity;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

Control how much and what kind of output the Logger will provide.

---

### LogStepOptions

```ts
type LogStepOptions = {
	description?: string;
	name: string;
	verbosity: Verbosity;
};
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

#### Properties

##### description?

```ts
optional description: string;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Optionally include extra information for performance tracing on this step. This description will be passed through to the [`performanceMark.detail`](https://nodejs.org/docs/latest-v20.x/api/perf_hooks.html#performancemarkdetail) recorded internally for this step.

Use a [Performance Writer plugin](https://onerepo.tools/plugins/performance-writer/) to read and work with this detail.

##### name

```ts
name: string;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

Wraps all step output within the name provided for the step.

##### verbosity

```ts
verbosity: Verbosity;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

The verbosity for this step, inherited from its parent [Logger](#logger).

---

### Verbosity

```ts
type Verbosity = 0 | 1 | 2 | 3 | 4 | 5;
```

**Defined in:** [modules/logger/src/types.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/types.ts)

Control the verbosity of the log output

| Value  | What        | Description                                      |
| ------ | ----------- | ------------------------------------------------ |
| `<= 0` | Silent      | No output will be read or written.               |
| `>= 1` | Error, Info |                                                  |
| `>= 2` | Warnings    |                                                  |
| `>= 3` | Log         |                                                  |
| `>= 4` | Debug       | `logger.debug()` will be included                |
| `>= 5` | Timing      | Extra performance timing metrics will be written |

## Package management

### getLockfile()

```ts
function getLockfile(cwd): null | string;
```

**Defined in:** [modules/package-manager/src/get-package-manager.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/get-package-manager.ts)

Get the absolute path for the package manager's lock file for this repository.

**Parameters:**

| Parameter | Type     |
| --------- | -------- |
| `cwd`     | `string` |

**Returns:** `null` \| `string`

---

### getPackageManager()

```ts
function getPackageManager(type): PackageManager;
```

**Defined in:** [modules/package-manager/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/index.ts)

Get the [\`PackageManager\`](#packagemanager-1) for the given package manager type (NPM, PNPm, or Yarn)

**Parameters:**

| Parameter | Type                            |
| --------- | ------------------------------- |
| `type`    | `"pnpm"` \| `"npm"` \| `"yarn"` |

**Returns:** [`PackageManager`](#packagemanager-1)

---

### getPackageManagerName()

```ts
function getPackageManagerName(cwd, fromPkgJson?): 'pnpm' | 'npm' | 'yarn';
```

**Defined in:** [modules/package-manager/src/get-package-manager.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/get-package-manager.ts)

Get the package manager for the current working directory with _some_ confidence

**Parameters:**

| Parameter      | Type     | Description                                                                   |
| -------------- | -------- | ----------------------------------------------------------------------------- |
| `cwd`          | `string` | Current working directory. Should be the root of the module/repository.       |
| `fromPkgJson?` | `string` | Value as defined in a package.json file, typically the `packageManager` value |

**Returns:** `"pnpm"` \| `"npm"` \| `"yarn"`

---

### PackageManager

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

Implementation details for all package managers. This interface defines a subset of common methods typically needed when interacting with a monorepo and its dependency [\`Graph\`](#graph) & [\`Workspace\`](#workspace)s.

#### Methods

##### add()

```ts
add(packages, opts?): Promise<void>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

Add one or more packages from external registries

**Parameters:**

| Parameter   | Type                     | Description                                                      |
| ----------- | ------------------------ | ---------------------------------------------------------------- |
| `packages`  | `string` \| `string`[]   | One or more packages, by name and/or `'name@version'`.           |
| `opts?`     | \{ `dev?`: `boolean`; \} | Various options to pass while installing the packages            |
| `opts.dev?` | `boolean`                | Set to true to install as a `devDependency`. **Default** `false` |

**Returns:** `Promise`\<`void`\>

##### batch()

```ts
batch(processes): Promise<(Error | [string, string])[]>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

Batch commands from npm packages as a batch of subprocesses using the package manager. Alternative to batching with `npm exec` and compatible APIs.

**Parameters:**

| Parameter   | Type                    |
| ----------- | ----------------------- |
| `processes` | [`RunSpec`](#runspec)[] |

**Returns:** `Promise`\<(`Error` \| \[`string`, `string`\])[]\>  
**See also:**
[\`batch\`](#batch-3) for general subprocess batching.

##### dedupe()

```ts
dedupe(): Promise<void>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

Reduce duplication in the package tree by checking overlapping ranges.

**Returns:** `Promise`\<`void`\>

##### info()

```ts
info(name, opts?): Promise<null | NpmInfo>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

Get standard information about a package

**Parameters:**

| Parameter | Type                               |
| --------- | ---------------------------------- |
| `name`    | `string`                           |
| `opts?`   | `Partial`\<[`RunSpec`](#runspec)\> |

**Returns:** `Promise`\<`null` \| [`NpmInfo`](#npminfo)\>

##### install()

```ts
install(cwd?): Promise<string>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

Install current dependencies as listed in the package manager's lock file

**Parameters:**

| Parameter | Type     |
| --------- | -------- |
| `cwd?`    | `string` |

**Returns:** `Promise`\<`string`\>

##### loggedIn()

```ts
loggedIn(opts?): Promise<boolean>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

Check if the current user is logged in to the external registry

**Parameters:**

| Parameter        | Type                                             | Description                                                                                                                                         |
| ---------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opts?`          | \{ `registry?`: `string`; `scope?`: `string`; \} | -                                                                                                                                                   |
| `opts.registry?` | `string`                                         | The base URL of your NPM registry. PNPM and NPM ignore scope and look up per-registry.                                                              |
| `opts.scope?`    | `string`                                         | When using Yarn, lookups are done by registry configured by scope. This value must be included if you have separate registries for separate scopes. |

**Returns:** `Promise`\<`boolean`\>

##### publish()

```ts
publish<T>(opts): Promise<void>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

Publish Workspaces to the external registry

###### Type Parameters

| Type Parameter                                        |
| ----------------------------------------------------- |
| `T` _extends_ [`MinimalWorkspace`](#minimalworkspace) |

**Parameters:**

| Parameter         | Type                                                                                                                      | Description                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opts`            | \{ `access?`: `"restricted"` \| `"public"`; `cwd?`: `string`; `otp?`: `string`; `tag?`: `string`; `workspaces`: `T`[]; \} | -                                                                                                                                                                               |
| `opts.access?`    | `"restricted"` \| `"public"`                                                                                              | Set the registry access level for the package **Default** inferred from Workspaces `publishConfig.access` or `'public'`                                                         |
| `opts.cwd?`       | `string`                                                                                                                  | Command working directory. Defaults to the repository root.                                                                                                                     |
| `opts.otp?`       | `string`                                                                                                                  | This is a one-time password from a two-factor authenticator.                                                                                                                    |
| `opts.tag?`       | `string`                                                                                                                  | If you ask npm to install a package and don't tell it a specific version, then it will install the specified tag. **Default** `'latest'`                                        |
| `opts.workspaces` | `T`[]                                                                                                                     | Workspaces to publish. If not provided or empty array, only the given Workspace at `cwd` will be published. This type is generally compatible with [\`Workspace\`](#workspace). |

**Returns:** `Promise`\<`void`\>

##### publishable()

```ts
publishable<T>(workspaces): Promise<T[]>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

Filter Workspaces to the set of those that are actually publishable. This will check both whether the package is not marked as "private" and if the current version is not in the external registry.

###### Type Parameters

| Type Parameter                                        |
| ----------------------------------------------------- |
| `T` _extends_ [`MinimalWorkspace`](#minimalworkspace) |

**Parameters:**

| Parameter    | Type  | Description                                             |
| ------------ | ----- | ------------------------------------------------------- |
| `workspaces` | `T`[] | List of compatible [\`Workspace\`](#workspace) objects. |

**Returns:** `Promise`\<`T`[]\>

##### remove()

```ts
remove(packages): Promise<void>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

Remove one or more packages.

**Parameters:**

| Parameter  | Type                   | Description                   |
| ---------- | ---------------------- | ----------------------------- |
| `packages` | `string` \| `string`[] | One or more packages, by name |

**Returns:** `Promise`\<`void`\>

##### run()

```ts
run(opts): Promise<[string, string]>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

Run a command from an npm package as a subprocess using the package manager. Alternative to `npm exec` and compatible APIs.

**Parameters:**

| Parameter | Type                  |
| --------- | --------------------- |
| `opts`    | [`RunSpec`](#runspec) |

**Returns:** `Promise`\<\[`string`, `string`\]\>  
**See also:**
[\`batch\`](#batch-3) for general subprocess running.

---

### MinimalWorkspace

```ts
type MinimalWorkspace = {
	location?: string;
	name: string;
	private?: boolean;
	version?: string;
};
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

#### Properties

##### location?

```ts
optional location: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### name

```ts
name: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### private?

```ts
optional private: boolean;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### version?

```ts
optional version: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

---

### NpmInfo

```ts
type NpmInfo = {
  dependencies: Record<string, string>;
  dist-tags: {
   [key: string]: string;
     latest: string;
  };
  homepage: string;
  license: string;
  name: string;
  version: string;
  versions: string[];
};
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

#### Properties

##### dependencies

```ts
dependencies: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### dist-tags

```ts
dist-tags: {
[key: string]: string;
  latest: string;
};
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

###### Index Signature

```ts
[key: string]: string
```

###### latest

```ts
latest: string;
```

##### homepage

```ts
homepage: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### license

```ts
license: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### name

```ts
name: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### version

```ts
version: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### versions

```ts
versions: string[];
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

## Plugins

### Plugin

```ts
type Plugin =
  | PluginObject
  | (config, graph) => PluginObject;
```

**Defined in:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

---

### PluginObject

```ts
type PluginObject = {
	shutdown?: (argv) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;
	startup?: (argv) => Promise<void> | void;
	yargs?: (yargs, visitor) => Yargs;
};
```

**Defined in:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

#### Properties

##### shutdown()?

```ts
optional shutdown: (argv) =>
  | Promise<Record<string, unknown> | void>
  | Record<string, unknown>
  | void;
```

**Defined in:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

Runs just before the application process is exited. Allows returning data that will be merged with all other shutdown handlers.

**Parameters:**

| Parameter | Type                                             |
| --------- | ------------------------------------------------ |
| `argv`    | [`Argv`](#argv)\<[`DefaultArgv`](#defaultargv)\> |

**Returns:** \| `Promise`\<`Record`\<`string`, `unknown`\> \| `void`\>
\| `Record`\<`string`, `unknown`\>
\| `void`

##### startup()?

```ts
optional startup: (argv) => Promise<void> | void;
```

**Defined in:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

Runs before any and all commands after argument parsing. This is similar to global Yargs middleware, but guaranteed to have the fully resolved and parsed arguments.

Use this function for setting up global even listeners like `PerformanceObserver`, `process` events, etc.

**Parameters:**

| Parameter | Type                                             |
| --------- | ------------------------------------------------ |
| `argv`    | [`Argv`](#argv)\<[`DefaultArgv`](#defaultargv)\> |

**Returns:** `Promise`\<`void`\> \| `void`

##### yargs()?

```ts
optional yargs: (yargs, visitor) => Yargs;
```

**Defined in:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

A function that is called with the CLI's `yargs` object and a visitor.
It is important to ensure every command passed through the `visitor` to enable all of the features of oneRepo. Without this step, you will not have access to the Workspace Graph, affected list, and much more.

**Parameters:**

| Parameter | Type                                                    |
| --------- | ------------------------------------------------------- |
| `yargs`   | `Yargs`                                                 |
| `visitor` | `NonNullable`\<`RequireDirectoryOptions`\[`"visit"`\]\> |

**Returns:** `Yargs`

## Subprocess

### batch()

```ts
function batch(processes, options?): Promise<(Error | [string, string])[]>;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

Batch multiple subprocesses, similar to `Promise.all`, but only run as many processes at a time fulfilling N-1 cores. If there are more processes than cores, as each process finishes, a new process will be picked to run, ensuring maximum CPU usage at all times.

If any process throws a `SubprocessError`, this function will reject with a `BatchError`, but only after _all_ processes have completed running.

Most oneRepo commands will consist of at least one [\`run()\`](#run) or [\`batch()\`](#batch) processes.

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
| ----------- | ------------------------------------------------------ |
| `processes` | ([`RunSpec`](#runspec) \| [`PromiseFn`](#promisefn))[] |
| `options?`  | [`BatchOptions`](#batchoptions)                        |

**Returns:** `Promise`\<(`Error` \| \[`string`, `string`\])[]\>

#### Throws

[\`BatchError\`](#batcherror) An object that includes a list of all of the [\`SubprocessError\`](#subprocesserror)s thrown.

**See also:**
[\`PackageManager.batch\`](#batch-3) to safely batch executables exposed from third party modules.

---

### run()

```ts
function run(options): Promise<[string, string]>;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

Spawn a process and capture its `stdout` and `stderr` through a Logger Step. Most oneRepo commands will consist of at least one [\`run()\`](#run) or [\`batch()\`](#batch) processes.

The `run()` command is an async wrapper around Node.js’s [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) and has a very similar API, with some additions. This command will buffer and catch all `stdout` and `stderr` responses.

```ts
await run({
	name: 'Do some work',
	cmd: 'echo',
	args: ['"hello!"'],
});
```

**Skipping failures:**

If a subprocess fails when called through `run()`, a [\`SubprocessError\`](#subprocesserror) will be thrown. Some third-party tooling will exit with error codes as an informational tool. While this is discouraged, there’s nothing we can do about how they’ve been chosen to work. To prevent throwing errors, but still act on the `stderr` response, include the `skipFailures` option:

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

By default, `run()` will respect oneRepo’s `--dry-run` option (see [\`DefaultArgv\`](#defaultargv), `process.env.ONEREPO_DRY_RUN`). When set, the process will not be spawned, but merely log information about what would run instead. To continue running a command, despite the `--dry-run` option being set, use `runDry: true`:

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
| --------- | --------------------- |
| `options` | [`RunSpec`](#runspec) |

**Returns:** `Promise`\<\[`string`, `string`\]\>

A promise with an array of `[stdout, stderr]`, as captured from the command run.

#### Throws

[\`SubprocessError\`](#subprocesserror) if not `skipFailures` and the spawned process does not exit cleanly (with code `0`)

**See also:**
[\`PackageManager.run\`](#run-3) to safely run executables exposed from third party modules.

---

### runTasks()

```ts
function runTasks(lifecycle, args, graph, logger?): Promise<void>;
```

**Defined in:** [modules/onerepo/src/core/tasks/run-tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/tasks/run-tasks.ts)  
**<span class="tag danger">Alpha</span>**

Run Lifecycle tasks in commands other than the `one tasks` command. Use this function when you have a command triggering a Lifecycle in non-standard ways.

```ts
await runTasks('pre-publish', ['-w', 'my-workspace'], graph);
```

**Parameters:**

| Parameter   | Type                      | Description                                                                                        |
| ----------- | ------------------------- | -------------------------------------------------------------------------------------------------- |
| `lifecycle` | [`Lifecycle`](#lifecycle) | The individual Lifecycle to trigger.                                                               |
| `args`      | `string`[]                | Array of string arguments as if passed in from the command-line.                                   |
| `graph`     | [`Graph`](#graph)         | The current repository [Graph](#graph).                                                            |
| `logger?`   | [`Logger`](#logger)       | Optional [Logger](#logger) instance. Defaults to the current `Logger` (usually there is only one). |

**Returns:** `Promise`\<`void`\>

---

### start()

```ts
function start(options): ChildProcess;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

Start a subprocess. For use when control over watching the stdout and stderr or long-running processes that are not expected to complete without SIGINT/SIGKILL.

**Parameters:**

| Parameter | Type                                                    |
| --------- | ------------------------------------------------------- |
| `options` | `Omit`\<[`RunSpec`](#runspec), `"runDry"` \| `"name"`\> |

**Returns:** `ChildProcess`

---

### sudo()

```ts
function sudo(options): Promise<[string, string]>;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

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

| Parameter | Type                                                                   |
| --------- | ---------------------------------------------------------------------- |
| `options` | `Omit`\<[`RunSpec`](#runspec), `"opts"`\> & \{ `reason?`: `string`; \} |

**Returns:** `Promise`\<\[`string`, `string`\]\>

---

### BatchError

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new BatchError(errors, options?): BatchError;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)  
**Parameters:**

| Parameter  | Type                                                  |
| ---------- | ----------------------------------------------------- |
| `errors`   | (`string` \| [`SubprocessError`](#subprocesserror))[] |
| `options?` | `ErrorOptions`                                        |

**Returns:** [`BatchError`](#batcherror)

###### Overrides

```ts
Error.constructor;
```

#### Properties

##### errors

```ts
errors: (string | SubprocessError)[];
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### SubprocessError

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new SubprocessError(message, options?): SubprocessError;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)  
**Parameters:**

| Parameter  | Type           |
| ---------- | -------------- |
| `message`  | `string`       |
| `options?` | `ErrorOptions` |

**Returns:** [`SubprocessError`](#subprocesserror)

###### Overrides

```ts
Error.constructor;
```

---

### BatchOptions

```ts
type BatchOptions = {
	maxParallel?: number;
};
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

Options for running [\`batch()\`](#batch) subprocesses.

#### Properties

##### maxParallel?

```ts
optional maxParallel: number;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

The absolute maximum number of subprocesses to batch. This amount will always be limited by the number of CPUs/cores available on the current machine.

**Default:** `deterministic` Number of CPUs - 1

---

### PromiseFn()

```ts
type PromiseFn = () => Promise<[string, string]>;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)  
**Returns:** `Promise`\<\[`string`, `string`\]\>

---

### RunSpec

```ts
type RunSpec = {
	args?: string[];
	cmd: string;
	name: string;
	opts?: SpawnOptions;
	runDry?: boolean;
	skipFailures?: boolean;
	step?: LogStep;
};
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

The core configuration for [\`run\`](#run), [\`start\`](#start), [\`sudo\`](#sudo), and [\`batch\`](#batch) subprocessing.

#### Properties

##### args?

```ts
optional args: string[];
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

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

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

The command to run. This should be an available executable or path to an executable.

##### name

```ts
name: string;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

A friendly name for the Step in log output.

##### opts?

```ts
optional opts: SpawnOptions;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

See the [Node.js `child_process.spawn()` documentation](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) for available options.

##### runDry?

```ts
optional runDry: boolean;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

Skip the `--dry-run` check and run this command anyway.

##### skipFailures?

```ts
optional skipFailures: boolean;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

Prevents throwing a [\`SubprocessError\`](#subprocesserror) in the event of the process failing and exiting with an unclean state.

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

Pass a custom [\`LogStep\`](#logstep) to bundle this process input & output into another step instead of creating a new one.

## package.json

### getPublishablePackageJson()

```ts
function getPublishablePackageJson(input): PublicPackageJson;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

Return a deep copy of a `package.json` suitabkle for publishing. Moves all non-standard `publishConfig` keys to the root of the `package.json` and deletes `devDependencies`.

**Parameters:**

| Parameter | Type                                      |
| --------- | ----------------------------------------- |
| `input`   | [`PublicPackageJson`](#publicpackagejson) |

**Returns:** [`PublicPackageJson`](#publicpackagejson)

---

### BasePackageJson

```ts
type BasePackageJson = {
	alias?: string[];
	author?: string | Person;
	bin?: string | Record<string, string>;
	bugs?: {
		email?: string;
		url?: string;
	};
	bundleDependencies?: string[];
	contributors?: (Person | string)[];
	dependencies?: Record<string, string>;
	description?: string;
	devDependencies?: Record<string, string>;
	engines?: Record<string, string>;
	exports?: Record<
		string,
		| string
		| {
				default?: string;
				import?: string;
				require?: string;
				types?: string;
		  }
	>;
	files?: string[];
	homepage?: string;
	keywords?: string[];
	license?: string;
	main?: string;
	name: string;
	optionalDependencies?: string[];
	os?: string[];
	overrides?: Record<string, string>;
	packageManager?: string;
	peerDependencies?: Record<string, string>;
	peerDependenciesMeta?: Record<
		string,
		{
			optional: boolean;
		}
	>;
	scripts?: Record<string, string>;
	version?: string;
};
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

#### Properties

##### alias?

```ts
optional alias: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

Enable's the [\`Graph\`](#graph) to look up [\`Workspace\`](#workspace)s by shorter names or common [\`aliases\`](#aliases) used by teams. This enables much short command-line execution. See [\`Graph.getByName\`](#getbyname) and [\`Graph.getAllByName\`](#getallbyname).

##### author?

```ts
optional author: string | Person;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### bin?

```ts
optional bin: string | Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### bugs?

```ts
optional bugs: {
  email?: string;
  url?: string;
};
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

###### email?

```ts
optional email: string;
```

###### url?

```ts
optional url: string;
```

##### bundleDependencies?

```ts
optional bundleDependencies: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### contributors?

```ts
optional contributors: (Person | string)[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### dependencies?

```ts
optional dependencies: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### description?

```ts
optional description: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### devDependencies?

```ts
optional devDependencies: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### engines?

```ts
optional engines: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### exports?

```ts
optional exports: Record<string,
  | string
  | {
  default?: string;
  import?: string;
  require?: string;
  types?: string;
}>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### files?

```ts
optional files: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### homepage?

```ts
optional homepage: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### keywords?

```ts
optional keywords: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### license?

```ts
optional license: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### main?

```ts
optional main: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### name

```ts
name: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

The full name for the [\`Workspace\`](#workspace). This will be used within the package manager and publishable registry.

##### optionalDependencies?

```ts
optional optionalDependencies: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### os?

```ts
optional os: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### overrides?

```ts
optional overrides: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### packageManager?

```ts
optional packageManager: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### peerDependencies?

```ts
optional peerDependencies: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### peerDependenciesMeta?

```ts
optional peerDependenciesMeta: Record<string, {
  optional: boolean;
}>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### scripts?

```ts
optional scripts: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### version?

```ts
optional version: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### PackageJson

```ts
type PackageJson = PrivatePackageJson | PublicPackageJson;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### Person

```ts
type Person = {
	email?: string;
	name?: string;
	url?: string;
};
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

#### Properties

##### email?

```ts
optional email: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### name?

```ts
optional name: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### url?

```ts
optional url: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### PrivatePackageJson

```ts
type PrivatePackageJson = {
	license?: 'UNLICENSED';
	private: true;
	workspaces?: string[];
} & BasePackageJson;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

#### Type declaration

##### license?

```ts
optional license: "UNLICENSED";
```

##### private

```ts
private: true;
```

##### workspaces?

```ts
optional workspaces: string[];
```

---

### PublicPackageJson

```ts
type PublicPackageJson = {
	private?: false;
	publishConfig?: PublishConfig;
	workspaces?: never;
} & BasePackageJson;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

#### Type declaration

##### private?

```ts
optional private: false;
```

##### publishConfig?

```ts
optional publishConfig: PublishConfig;
```

##### workspaces?

```ts
optional workspaces: never;
```

---

### PublishConfig

```ts
type PublishConfig = {
	[key: string]: unknown;
	bin?: string | Record<string, string>;
	exports?: Record<
		string,
		| string
		| {
				default?: string;
				import?: string;
				require?: string;
				types?: string;
		  }
	>;
	main?: string;
	module?: string;
	typings?: string;
};
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

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

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### bin?

```ts
optional bin: string | Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### exports?

```ts
optional exports: Record<string,
  | string
  | {
  default?: string;
  import?: string;
  require?: string;
  types?: string;
}>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### main?

```ts
optional main: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### module?

```ts
optional module: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### typings?

```ts
optional typings: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

<!-- end-onerepo-sentinel -->
