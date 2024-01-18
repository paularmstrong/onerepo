## Writing your own plugins

Keep in mind that you may not need a plugin if your need is specific to your own repository and can be accomplished using a local [command](/docs/commands/) instead. However, if you would like to write a shared plugin for use across other monorepos using **oneRepo**, please continue.

### Anatomy of a plugin:

```ts
type PluginObject = {
	/**
	 * A function that is called with the CLI's `yargs` object and a visitor.
	 * It is important to ensure every command passed through the `visitor` to enable all of the features of oneRepo. Without this step, you will not have access to the workspace graph, affected list, and much more.
	 */
	yargs?: (yargs: Yargs, visitor: NonNullable<RequireDirectoryOptions['visit']>) => Yargs;
	/**
	 * Runs before any and all commands after argument parsing. This is similar to global Yargs middleware, but guaranteed to have the fully resolved and parsed arguments.
	 *
	 * Use this function for setting up global even listeners like `PerformanceObserver`, `process` events, etc.
	 */
	startup?: (argv: Argv<DefaultArgv>) => Promise<void> | void;
	/**
	 * Runs just before the application process is exited. Allows returning data that will be merged with all other shutdown handlers.
	 */
	shutdown?: (argv: Argv<DefaultArgv>) => Promise<Record<string, unknown> | void>;
};
```

```ts
import path from 'node:path';
import type { Plugin } from 'onerepo';

type Options = {
	name?: string | Array<string>;
};

export function changesets(opts: Options = {}): Plugin {
	const name = opts.name ?? ['changesets', 'change'];
	return () => ({
		yargs: (yargs) => {
			return yargs.command(
				name,
				'Manage changesets',
				(yargs) =>
					yargs
						.usage(`$0 ${Array.isArray(name) ? name[0] : name} <command> [options]`)
						.commandDir(path.join(__dirname, 'commands'))
						.demandCommand(1),
				() => {},
			);
		},
	});
}
```
