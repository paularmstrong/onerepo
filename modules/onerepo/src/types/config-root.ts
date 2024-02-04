import type { Lifecycle, TaskConfig } from './tasks';
import type { Plugin } from './plugin';

/**
 * Setup configuration for the root of the repository.
 * @group Config
 */
export type RootConfig<CustomLifecycles extends string | void = void> = {
	changes?: {
		/**
		 * @default `'hash'`
		 *
		 * To generate human-readable unique filenames for change files, ensure [human-id](https://www.npmjs.com/package/human-id) is installed.
		 */
		filenames?: 'hash' | 'human';
		/**
		 * @default `'guided'`
		 *
		 * Change the prompt question & answer style when adding change entries.
		 * - `'guided'`: Gives more detailed explanations when release types.
		 * - `'semver'`: A simple choice list of semver release types.
		 */
		prompts?: 'guided' | 'semver';
		/**
		 * @default `{}`
		 *
		 * Override some formatting strings in generated changelog files.
		 *
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	root: true,
		 * 	changes: {
		 * 		formatting: {
		 * 			commit: '([${ref.short}](https://github.com/paularmstrong/onerepo/commit/${ref}))',
		 * 			footer: '> Full changelog [${fromRef.short}...${throughRef.short}](https://github.com/my-repo/commits/${fromRef}...${throughRef})'
		 * 		},
		 * 	},
		 * };
		 * ```
		 */
		formatting?: {
			/**
			 * @default `'(${ref.short})'`
			 *
			 * Format how the commit ref will appear at the end of the first line of each change entry.
			 *
			 * Available replacement strings:
			 * | Replacement | Description |
			 * | --- | --- |
			 * | `${ref.short}` | 8-character version of the commit ref |
			 * | `${ref}` | Full commit ref |
			 */
			commit?: string;
			/**
			 * @default `'_View git logs for full change list._'`
			 *
			 * Format the footer at the end of each version in the generated changelog files.
			 *
			 * Available replacement strings:
			 * | Replacement | Description |
			 * | --- | --- |
			 * | `${fromRef.short}` | 8-character version of the first commit ref in the version |
			 * | `${fromRef}` | Full commit ref of the first commit in the version |
			 * | `${through.short}` | 8-character version of the last commit ref in the version |
			 * | `${through}` | Full commit ref of the last commit in the version |
			 * | `${version}` | New version string |
			 */
			footer?: string;
		};
	};
	/**
	 * @default `{}`
	 *
	 * Map of paths to array of owners.
	 *
	 * When used with the [`codeowners` commands](/core/codeowners/), this configuration enables syncing configurations from Workspaces to the appropriate root level CODEOWNERS file given your [`vcsProvider`](#vcsprovider) as well as verifying that the root file is up to date.
	 *
	 * ```ts title="onerepo.config.ts"
	 * export default {
	 * 	root: true,
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
		 * A string to use as filepaths to subcommands. We'll look for commands in all Workspaces using this string. If any are found, they'll be available from the CLI.
		 *
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	root: true,
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
		 * When writing custom commands and Workspace-level subcommands, we may need to ignore certain files like tests, fixtures, and other helpers. Use a regular expression here to configure which files will be ignored when oneRepo parses and executes commands.
		 *
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	root: true,
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
	 * ```ts title="onerepo.config.ts"
	 * export default {
	 * 	root: true,
	 * 	head: 'develop',
	 * };
	 * ```
	 */
	head?: string;
	/**
	 * @default `[]`
	 *
	 * Array of fileglobs to ignore when calculating the changed Workspaces.
	 *
	 * Periodically we may find that there are certain files or types of files that we _know_ for a fact do not affect the validity of the repository or any code. When this happens and the files are modified, unnecessary tasks and processes will be spun up that don't have any bearing on the outcome of the change.
	 *
	 * To avoid extra processing, we can add file globs to ignore when calculated the afected Workspace graph.
	 *
	 * :::caution
	 * This configuration should be used sparingly and with caution. It is better to do too much work as opposed to not enough.
	 * :::
	 *
	 * ```ts title="onerepo.config.ts"
	 * export default {
	 * 	root: true,
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
	 * ```ts title="onerepo.config.ts"
	 * export default {
	 * 	root: true,
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
	 * Globally defined tasks per lifecycle. Tasks defined here will be assumed to run for all changes, regardless of affected Workspaces. Refer to the [`tasks` command](/core/tasks/) specifications for details and examples.
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
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	root: true,
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
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	root: true,
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
		 * File path for custom Graph and configuration file validation schema.
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
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	root: true,
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
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	root: true,
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
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	root: true,
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
	 * Override the URL used to visualize the Graph. The Graph data will be attached the the `g` query parameter as a JSON string of the DAG, compressed using zLib deflate.
	 */
	visualizationUrl?: string;
};
