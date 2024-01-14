/**
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
 * A Task can either be a string or TaskDef object with extra options, or an array of strings. If provided as an array of strings, each command will be run sequentially, waiting for the previous to succeed. If one command fails, the rest in the sequence will not be run.
 *
 * To run sequences of commands with `match` and `meta` information, you can pass an array of strings to the `cmd` property of a {@link TaskDef | `TaskDef`}.
 *
 * @group Config
 */
export type Task = string | TaskDef | Array<string>;

/**
 * @group Config
 */
export type Tasks = {
	serial?: Array<Task>;
	parallel?: Array<Task>;
};
/**
 * @group Config
 */
export type Lifecycle =
	| 'pre-commit'
	| 'post-commit'
	| 'post-checkout'
	| 'pre-merge'
	| 'post-merge'
	| 'build'
	| 'deploy'
	| 'publish';

/**
 * @group Config
 */
export type TaskConfig<CustomLifecycles extends string | void = void> = Partial<
	Record<CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle, Tasks>
>;
