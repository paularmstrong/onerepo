/**
 * Tasks can optionally include meta information or only be run if the configured `match` glob string matches the modified files. If no files match, the individual task will not be run.
 *
 * ```ts
 * export default {
 * 	tasks: {
 * 		'pre-commit': {
 * 			parallel: [
 * 				// Only run `astro check` if astro files have been modified
 * 				{ match: '*.astro', cmd: '$0 astro check' },
 * 				// Use a glob match with sequential tasks
 * 				{ match: '*.{ts,js}', cmd: ['$0 lint', '$0 format'] },
 * 			],
 * 		},
 * 	},
 * } satisfies Config;
 * ```
 * @group Config
 */
export type TaskDef = {
	/**
	 * Glob file match. This will force the `cmd` to run if any of the paths in the modified files list match the glob. Conversely, if no files are matched, the `cmd` _will not_ run.
	 */
	match?: string | Array<string>;
	/**
	 * String command(s) to run. If provided as an array of strings, each command will be run sequentially, waiting for the previous to succeed. If one command fails, the rest in the sequence will not be run.
	 *
	 * The commands can use replaced tokens:
	 * - `$0`: the oneRepo CLI for your repository
	 * - `${workspaces}`: replaced with a space-separated list of workspace names necessary for the given lifecycle
	 */
	cmd: string | Array<string>;
	/**
	 * Extra information that will be provided only when listing tasks with the `--list` option from the `tasks` command. This object is helpful when creating a matrix of runners with GitHub actions or similar CI pipelines.
	 */
	meta?: Record<string, unknown>;
};

/**
 * A Task can either be a string or {@link TaskDef | `TaskDef`} object with extra options, or an array of strings. If provided as an array of strings, each command will be run sequentially, waiting for the previous to succeed. If one command fails, the rest in the sequence will not be run.
 *
 * To run sequences of commands with `match` and `meta` information, you can pass an array of strings to the `cmd` property of a {@link TaskDef | `TaskDef`}.
 *
 * @group Config
 */
export type Task = string | TaskDef | Array<string>;

/**
 * Individual {@link Task | `Task`}s in any {@link Lifecycle | `Lifecycle`} may be grouped to run either serial (one after the other) or in parallel (multiple at the same time).
 * @group Config
 */
export type Tasks = {
	serial?: Array<Task>;
	parallel?: Array<Task>;
};
/**
 * oneRepo comes with a pre-configured list of common lifecycles for grouping [tasks](/core/tasks/).
 * @group Config
 */
export type Lifecycle =
	| 'pre-commit'
	| 'post-commit'
	| 'post-checkout'
	| 'pre-merge'
	| 'post-merge'
	| 'build'
	| 'pre-deploy'
	| 'pre-publish'
	| 'post-publish';

/**
 * @group Config
 */
export type TaskConfig<CustomLifecycles extends string | void = void> = Partial<
	Record<CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle, Tasks>
>;
