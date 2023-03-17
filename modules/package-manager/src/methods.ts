export interface IPackageManager {
	add(packages: string | Array<string>, opts?: { dev?: boolean }): Promise<void>;
	install(): Promise<void>;
	publishable<T extends { name: string; version: string }>(workspaces: Array<T>): Promise<Array<T>>;
	publish<T extends { name: string; location: string }>(opts?: {
		/**
		 * Workspaces to publish. If not provided or empty array, only the given workspace at `cwd` will be published. This type is generally compatible with {@link graph.Workspace}.
		 */
		workspaces?: Array<T>;
		/**
		 * Set the registry access level for the package
		 * @default 'public'
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
