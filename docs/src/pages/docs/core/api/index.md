---
layout: '../../../../layouts/Docs.astro'
title: Writing oneRepo commands
---

# Writing oneRepo commands

Commands all have 4 minimum requirements to be exported:

| Export        | Type                      | Description                                                                                                                                                                                                                       | Required |
| ------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `name`        | `string \| Array<string>` | The command’s name. If provided as an array, all values will be considered aliases for the same command.<br><br>Any value can also be `'$0'`, which is a special token that allows this command to be the default for the parent. | ✅       |
| `description` | `string \| false`         | A help description. If set to `false`, the command will be hidden from help documentation when not using `--help --show-advanced`                                                                                                 | ✅       |
| `builder`     | `Builder<T>`              | A function that helps parse the command-line arguments                                                                                                                                                                            | ✅       |
| `handler`     | `Handler<T>`              | Asynchronous function that is invoked for the command                                                                                                                                                                             | ✅       |

## Basic example

```ts title="./commands/basic.ts"
import type { Builder, Handler } from 'onerepo';

export const name = 'basic';

export const description = 'A basic command that shows the minimum requirements for writing commands with oneRepo';

export const builder: Builder = (yargs) => yargs.usage(`$0 ${name}`);

export const handler: Handler = (argv, { logger }) => {
	logger.warn('Nothing to do!');
};
```

## Handler extra

Commands in oneRepo extend beyond what Yargs is able to provide by adding a second argument to the handler.

```ts
type HandlerExtra = {
	/**
	 * Get the affected workspaces based on the current state of the repository.
	 */
	getAffected: (opts?: GetterOptions) => Promise<Array<Workspace>>;
	/**
	 * Get the affected filepaths based on the current inputs and state of the repository.
	 */
	getFilepaths: (opts?: GetterOptions) => Promise<Array<string>>;
	/**
	 * Get the affected workspaces based on the current inputs and the state of the repository.
	 * This function differs from `getAffected` in that it respects input arguments provided by
	 * `withWorkspaces`, `withFiles` and `withAffected`.
	 */
	getWorkspaces: (opts?: GetterOptions) => Promise<Array<Workspace>>;
	/**
	 * The Repository Graph
	 */
	graph: Repository;
	/**
	 * Standard logger. This should _always_ be used in place of console.log unless you have
	 * a specific need to write to standard out differently.
	 */
	logger: Logger;
};
```

## Tips

### Helpful documentation

The more explanation and context that you can provide, the better it will be for your peers using commands. Consider adding [epilogues](http://yargs.js.org/docs/#api-reference-epiloguestr) and [examples](http://yargs.js.org/docs/#api-reference-examplecmd-desc) along with the required `description`

You can also generate Markdown documentation of the full CLI using [@onerepo/plugin-docgen](http://localhost:8888/docs/plugins/docgen/)!
