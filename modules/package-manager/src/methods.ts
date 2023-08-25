import type { RunSpec } from '@onerepo/subprocess';

/**
 * Implementation details for all package managers. This interface defines a subset of common methods typically needed when interacting with a monorepo and its dependency {@link graph.Graph | `graph.Graph`} & {@link graph.Workspace | `graph.Workspace`}s.
 *
 * @group Package management
 */
export interface PackageManager {
	/**
	 * Add one or more packages from external registries
	 * @param packages One or more packages, by name and/or `'name@version'`.
	 * @param opts Various options to pass while installing the packages
	 */
	add(
		packages: string | Array<string>,
		opts?: {
			/**
			 * Set to true to install as a `devDependency`.
			 * @default false
			 */
			dev?: boolean;
		},
	): Promise<void>;

	/**
	 * Batch commands from npm packages as a batch of subprocesses using the package manager. Alternative to batching with `npm exec` and compatible APIs.
	 * @see {@link batch | `batch`} for general subprocess batching.
	 */
	batch(processes: Array<RunSpec>): Promise<Array<[string, string] | Error>>;

	/**
	 * Run a command from an npm package as a subprocess using the package manager. Alternative to `npm exec` and compatible APIs.
	 * @see {@link batch | `batch`} for general subprocess running.
	 */
	run(opts: RunSpec): Promise<[string, string]>;

	/**
	 * Install current dependencies as listed in the package manager's lock file
	 */
	install(cwd?: string): Promise<string>;

	/**
	 * Check if the current user is logged in to the external registry
	 */
	loggedIn(opts?: {
		/**
		 * When using Yarn, lookups are done by registry configured by scope. This value must be included if you have separate registries for separate scopes.
		 */
		scope?: string;
		/**
		 * The base URL of your NPM registry. PNPM and NPM ignore scope and look up per-registry.
		 */
		registry?: string;
	}): Promise<boolean>;

	/**
	 * Filter workspaces to the set of those that are actually publishable. This will check both whether the package is not marked as "private" and if the current version is not in the external registry.
	 * @param workspaces List of compatible {@link graph.Workspace | `graph.Workspace`} objects.
	 */
	publishable<T extends MinimalWorkspace>(workspaces: Array<T>): Promise<Array<T>>;

	/**
	 * Publish workspaces to the external registry
	 */
	publish<T extends MinimalWorkspace>(opts?: {
		/**
		 * Workspaces to publish. If not provided or empty array, only the given workspace at `cwd` will be published. This type is generally compatible with {@link graph.Workspace | `graph.Workspace`}.
		 */
		workspaces?: Array<T>;
		/**
		 * Set the registry access level for the package
		 * @default inferred from workspaces `publishConfig.access` or `'public'`
		 */
		access?: 'restricted' | 'public';
		/**
		 * Command working directory. Defaults to the repository root.
		 */
		cwd?: string;
		/**
		 * This is a one-time password from a two-factor authenticator.
		 */
		otp?: string;
		/**
		 * If you ask npm to install a package and don't tell it a specific version, then it will install the specified tag.
		 * @default 'latest'
		 */
		tag?: string;
	}): Promise<void>;

	/**
	 * Remove one or more packages.
	 * @param packages One or more packages, by name
	 */
	remove(packages: string | Array<string>): Promise<void>;
}

/**
 * @group Package management
 */
export interface MinimalWorkspace {
	name: string;
	version?: string;
	private?: boolean;
	location?: string;
}
