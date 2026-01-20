import type { TaskConfig } from './tasks.ts';

/**
 * @group Config
 */
export type WorkspaceConfig<CustomLifecycles extends string | void = void> = {
	/**
	 * @default `{}`.
	 * Map of paths to array of owners.
	 *
	 * When used with the [`codeowners` commands](/core/codeowners/), this configuration enables syncing configurations from Workspaces to the appropriate root level CODEOWNERS file given your `RootConfig.vcs.provider` as well as verifying that the root file is up to date.
	 *
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
	 * Configuration for custom commands. To configure the commands directory, see [`RootConfig` `commands.directory`](#commandsdirectory).
	 */
	commands?: {
		/**
		 * @default `{}`
		 *
		 * Enable commands from installed dependencies. Similar to running `npx <command>`, but pulled into the oneRepo CLI and able to be limited by Workspace. Passthrough commands _must_ have helpful descriptions.
		 *
		 * ```ts title="onerepo.config.ts"
		 * export default {
		 * 	commands: {
		 * 		passthrough: {
		 * 			astro: { description: 'Run Astro commands directly.' },
		 * 			start: { description: 'Run the Astro dev server.', command: 'astro dev --port=8000' },
		 * 		},
		 * 	},
		 * };
		 * ```
		 */
		passthrough: Record<string, { description: string; command?: string }>;
	};
	/**
	 * @default `{}`
	 * A place to put any custom information or configuration. A helpful space for you to extend Workspace configurations for your own custom commands.
	 *
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
	 * @default `{}`
	 * Tasks for this Workspace. These will be merged with global tasks and any other affected Workspace tasks. Refer to the [`tasks` command](/core/tasks/) specifications for details and examples.
	 *
	 * :::tip[Merging tasks]
	 * Each modified Workspace or Workspace that is affected by another Workspace's modifications will have its tasks evaluated and merged into the full set of tasks for each given lifecycle run. Check the [Tasks reference](/core/tasks/) to learn more.
	 * :::
	 */
	tasks?: TaskConfig<CustomLifecycles>;
};
