import type { Lifecycle, TaskConfig } from './tasks';
import type { Plugin } from './plugin';

/**
 * Setup configuration for the root of the repository.
 * @group Config
 */
export type RootConfig<CustomLifecycles extends string | void = void> = {
	/**
	 * @default `{}`
	 *
	 * Map of paths to array of owners.
	 *
	 * When used with the [`codeowners` commands](/core/codeowners/), this configuration enables syncing configurations from workspaces to the appropriate root level CODEOWNERS file given your [`vcsProvider`](#vcsprovider) as well as verifying that the root file is up to date.
	 *
	 * @example
	 * ```ts title="onerepo.config.ts"
	 * export default {
	 * 	codeowners: {
	 * 		'*': ['@my-team', '@person'],
	 * 		scripts: ['@infra-team'],
	 * 	},
	 * }
	 * ```
	 */
	codeowners?: Record<string, Array<string>>;
	/**
	 * Configuration for custom commands.
	 */
	commands?: {
		/**
		 * @default `'commands'`
		 *
		 * A string to use as filepaths to subcommands. We'll look for commands in all workspaces using this string. If any are found, they'll be available from the CLI.
		 *
		 * @example
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	commands: {
		 * 		directory: 'commands',
		 * 	},
		 * };
		 * ```
		 *
		 * Given the preceding configuration, commands will be searched for within the `commands/` directory at the root of the repository as well as a directory of the same name at the root of each workspace:
		 *
		 * - `<root>/commands/*`
		 * - `<root>/<workspaces>/commands/*`
		 */
		directory?: string | false;
		/**
		 * @default `/(\/__\w+__\/|\.test\.|\.spec\.|\.config\.)/`
		 *
		 * Prevent reading matched files in the `commands.directory` as commands.
		 *
		 * When writing custom commands and workspace-level subcommands, we may need to ignore certain files like tests, fixtures, and other helpers. Use a regular expression here to configure which files will be ignored when oneRepo parses and executes commands.
		 *
		 * @example
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	commands: {
		 * 		ignore: /(\/__\w+__\/|\.test\.|\.spec\.|\.config\.)/,
		 * 	},
		 * };
		 * ```
		 */
		ignore?: RegExp;
	};
	dependencies?: {
		/**
		 * @default `'loose'`
		 *
		 * The dependency mode will be used for node module dependency management and verification.
		 * - \`off\`: No validation will occur. Everything goes.
		 * - \`loose\`: Reused third-party dependencies will be required to have semantic version overlap across unique branches of the Graph.
		 * - \`strict\`: Versions of all dependencies across each discrete Workspace dependency tree must be strictly equal.

		 */
		mode?: 'strict' | 'loose' | 'off';
		/**
		 * @default `true`
		 *
		 * When modifying dependencies using the `one dependencies` command, a `dedupe` will automatically be run to reduce duplicate package versions that overlap the requested ranges. Set this to `false` to disable this behavior.
		 */
		dedupe?: boolean;
	};
	/**
	 * @default `'main'`
	 *
	 * The default branch of your repo? Probably `main`, but it might be something else, so it's helpful to put that here so that we can determine changed files accurately.
	 *
	 * @example
	 * ```ts title="onerepo.config.ts"
	 * export default {
	 *   head: 'develop',
	 * };
	 * ```
	 */
	head?: string;
	/**
	 * @default `[]`
	 *
	 * Array of fileglobs to ignore when calculating the changed workspaces.
	 *
	 * Periodically we may find that there are certain files or types of files that we _know_ for a fact do not affect the validity of the repository or any code. When this happens and the files are modified, unnecessary tasks and processes will be spun up that don't have any bearing on the outcome of the change.
	 *
	 * To avoid extra processing, we can add file globs to ignore when calculated the afected workspace graph.
	 *
	 * :::caution
	 * This configuration should be used sparingly and with caution. It is better to do too much work as opposed to not enough.
	 * :::
	 *
	 * @example
	 * ```ts title="onerepo.config.ts"
	 * export default {
	 * 	ignore: ['.changeset/*', '.github/\*'],
	 * };
	 * ```
	 */
	ignore?: Array<string>;
	/**
	 * @default `{}`
	 *
	 * A place to put any custom information or configuration. A helpful space for you to extend Workspace configurations for your own custom commands.
	 *
	 * @example
	 * ```ts title="onerepo.config.ts"
	 * export default {
	 * 	meta: {
	 * 		tacos: 'are delicious',
	 * 	},
	 * };
	 * ```
	 */
	meta?: Record<string, unknown>;
	/**
	 * @default `[]`
	 *
	 * Add shared commands and extra handlers. See the [official plugin list](https://onerepo.tools/plugins/) for more information.
	 *
	 * @example
	 * ```ts title="onerepo.config.ts"
	 * import { eslint } from '@onerepo/plugins-eslint';
	 * export default {
	 * 	plugins: [
	 * 		eslint(),
	 * 	],
	 * };
	 * ```
	 */
	plugins?: Array<Plugin>;
	/**
	 * Must be set to `true` in order to denote that this is the root of the repository.
	 */
	root: true;
	/**
	 * @default `{}`
	 *
	 * Globally defined tasks per lifecycle. Tasks defined here will be assumed to run for all changes, regardless of affected workspaces. Refer to the [`tasks` command](/core/tasks/) specifications for details and examples.
	 */
	tasks?: TaskConfig<CustomLifecycles>;
	/**
	 * Optional extra configuration for `tasks`.
	 */
	taskConfig?: {
		/**
		 * @default `[]`
		 *
		 * Additional `task` lifecycles to make available.
		 *
		 * See [`Lifecycle`](#lifecycle) for a list of pre-configured lifecycles.
		 *
		 * @example
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	tasks: {
		 * 		lifecycles: ['deploy-staging'],
		 * 	},
		 * };
		 * ```
		 */
		lifecycles?: Array<CustomLifecycles>;
		/**
		 * @default `['pre-commit']`
		 * Stash unstaged changes before running these tasks and re-apply them after the task has completed.
		 * @example
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	tasks: {
		 * 		stashUnstaged: ['pre-commit', 'post-checkout'],
		 * 	},
		 * };
		 * ```
		 */
		stashUnstaged?: Array<CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle>;
	};
	/**
	 * @default `'./config/templates'`
	 * Folder path for `generate` templates.
	 */
	templateDir?: string;
	validation?: {
		/**
		 * @default `undefined`
		 *
		 * File path for custom graph and configuration file validation schema.
		 */
		schema?: string | null;
	};
	/**
	 * Version control system settings.
	 */
	vcs?: {
		/**
		 * @default `false`
		 *
		 * Automatically set and sync oneRepo-managed git hooks. Change the directory for your git hooks with the [`vcs.hooksPath`](#vcshookspath) setting. Refer to the [Git hooks documentation](/core/hooks/) to learn more.
		 *
		 * @example
		 * ```ts title="onerepo.config.ts"
		 * export defualt {
		 * 	vcs: {
		 * 		autoSyncHooks: false,
		 * 	}
		 * };
		 * ```
		 */
		autoSyncHooks?: boolean;
		/**
		 * @default `'.hooks'`
		 *
		 * Modify the default git hooks path for the repository. This will automatically be synchronized via `one hooks sync` unless explicitly disabled by setting [`vcs.autoSyncHooks`](#vcsautosynchooks) to `false`.
		 *
		 * @example
		 * ```ts title="onerepo.config.ts"
		 * export defualt {
		 * 	vcs: {
		 * 		hooksPath: '.githooks',
		 * 	}
		 * };
		 * ```
		 */
		hooksPath?: string;
		/**
		 * @default `'github'`
		 *
		 * The provider will be factored in to various commands, like `CODEOWNERS` generation.
		 *
		 * @example
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	vcs: {
		 * 		provider: 'github',
		 * 	},
		 * };
		 * ```
		 */
		provider?: 'github' | 'gitlab' | 'bitbucket' | 'gitea';
	};
	/**
	 * @default `'https://onerepo.tools/visualize/'`
	 *
	 * Override the URL used to visualize the Graph. The graph data will be attached the the `g` query parameter as a JSON string of the DAG, compressed using zLib deflate.
	 */
	visualizationUrl?: string;
};
