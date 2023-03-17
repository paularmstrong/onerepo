export interface IPackageManager {
	add(packages: string | Array<string>, opts?: { dev?: boolean }): Promise<void>;
	install(): Promise<void>;
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
	publishable<T extends MinimalWorkspace>(workspaces: Array<T>): Promise<Array<T>>;
	publish<T extends MinimalWorkspace>(opts?: {
		/**
		 * Workspaces to publish. If not provided or empty array, only the given workspace at `cwd` will be published. This type is generally compatible with {@link graph.Workspace}.
		 */
		workspaces?: Array<T>;
		/**
		 * Set the registry access level for the package
		 * @default 'public' inferred from workspaces publishConfig.access
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
	remove(packages: string | Array<string>): Promise<void>;
}

export interface MinimalWorkspace {
	name: string;
	version?: string;
	private?: boolean;
	location?: string;
}
