import path from 'node:path';
import { minimatch } from 'minimatch';
import type { Tasks, TaskConfig, WorkspaceConfig } from 'onerepo';

/**
 * @group Graph
 */
export class Workspace {
	#packageJson: PackageJson;
	#location: string;
	#rootLocation: string;
	#tasks: TaskConfig | null = null;
	#require: typeof require;
	#config?: WorkspaceConfig;

	/**
	 * @internal
	 */
	constructor(rootLocation: string, location: string, packageJson: PackageJson, moduleRequire = require) {
		this.#require = moduleRequire;
		this.#rootLocation = rootLocation;
		this.#location = location;
		this.#packageJson = packageJson;
	}

	/**
	 * The full `name` of the Workspace, as defined in its `package.json`
	 */
	get name() {
		return this.#packageJson.name;
	}

	/**
	 * Canonical to the `package.json` `"description"` field.
	 */
	get description() {
		return this.#packageJson.description;
	}

	/**
	 * Whether or not this Workspace is the root of the repository / Graph.
	 */
	get isRoot() {
		return this.#rootLocation === this.#location;
	}

	/**
	 * Absolute path on the current filesystem to the Workspace.
	 */
	get location() {
		return this.#location;
	}

	get version() {
		return this.#packageJson.version || undefined;
	}

	get main() {
		return this.#packageJson.main || 'index.js';
	}

	/**
	 * A full copy of the `package.json` file for the Workspace.
	 */
	get packageJson(): PackageJson {
		return { ...this.#packageJson };
	}

	/**
	 * Get module name scope if there is one, eg `@onerepo`
	 */
	get scope(): string {
		return this.name.includes('/') ? this.name.split('/')[0] : '';
	}

	/**
	 * Allow custom array of aliases.
	 * If the fully qualified package name is scoped, this will include the un-scoped name
	 */
	get aliases(): Array<string> {
		const shortName = this.name.includes('/') ? this.name.split('/')[1] : false;
		const aliases = [...(this.#packageJson.alias || [])];
		if (shortName) {
			aliases.push(shortName);
		}
		return aliases;
	}

	/**
	 * Get the `package.json` defined production dependencies for the Workspace.
	 *
	 * @return Map of modules to their version.
	 */
	get dependencies(): Record<string, string> {
		return { ...this.#packageJson.dependencies } || {};
	}

	/**
	 * Get the `package.json` defined development dependencies for the Workspace.
	 *
	 * @return Map of modules to their version.
	 */
	get devDependencies(): Record<string, string> {
		return { ...this.#packageJson.devDependencies } || {};
	}

	/**
	 * Get the `package.json` defined peer dependencies for the Workspace.
	 *
	 * @return Map of modules to their version.
	 */
	get peerDependencies(): Record<string, string> {
		return { ...this.#packageJson.peerDependencies } || {};
	}

	/**
	 * If a Workspace `package.json` is set to `private: true`, it will not be available to publish through NPM or other package management registries.
	 */
	get private() {
		return 'private' in this.#packageJson && Boolean(this.#packageJson.private);
	}

	/**
	 * Get the workspace's configuration
	 */
	get config(): WorkspaceConfig {
		if (!this.#config) {
			try {
				const config = this.#require(this.resolve('onerepo.config'));
				this.#config = (config.default ?? config) as WorkspaceConfig;
			} catch (e) {
				if (e && (e as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND') {
					return {};
				}
				throw e;
			}
		}
		return this.#config;
	}

	/**
	 * Get the task configuration as defined in the `onerepo.config.js` file at the root of the Workspace.
	 *
	 * @return If a config does not exist, an empty object will be given.
	 */
	get tasks(): TaskConfig {
		if (this.#tasks) {
			return this.#tasks;
		}

		this.#tasks = this.config.tasks ?? {};
		return this.#tasks;
	}

	get codeowners(): NonNullable<Required<WorkspaceConfig['codeowners']>> {
		return this.config.codeowners ?? {};
	}

	/**
	 * Get a version of the Workspace's `package.json` that is meant for publishing.
	 *
	 * This strips off `devDependencies` and applies appropriate {@link PublishConfig | `publishConfig`} values to the root of the `package.json`. This feature enables your monorepo to use source-dependencies and avoid manually building shared Workspaces for every change in order to see them take affect in dependent Workspaces.
	 *
	 * To take advantage of this, configure your `package.json` root level to point to source files and the `publishConfig` entries to point to the build location of those entrypoints.
	 * ```json collapse={2-4}
	 * {
	 * 	"name": "my-module",
	 * 	"license": "MIT",
	 * 	"type": "module",
	 * 	"main": "./src/index.ts",
	 * 	"publishConfig": {
	 * 		"access": "public",
	 * 		"main": "./dist/index.js",
	 * 		"typings": "./dist/index.d.ts"
	 * 	}
	 * }
	 * ```
	 */
	get publishablePackageJson() {
		if (this.#packageJson.private) {
			return null;
		}
		const { devDependencies, publishConfig = {}, ...rest } = this.#packageJson;

		const newPackageJson: PublicPackageJson = { ...rest, publishConfig: {} };

		for (const key in publishConfig) {
			if (publishConfigKeep.includes(key)) {
				// @ts-ignore
				newPackageJson.publishConfig[key] = publishConfig[key];
			} else {
				// @ts-ignore
				newPackageJson[key] = publishConfig[key];
			}
		}

		return newPackageJson;
	}

	getCodeowners(filepath: string): Array<string> {
		const relativePath = path.isAbsolute(filepath) ? this.relative(filepath) : filepath;
		const found = Object.keys(this.codeowners ?? {})
			.reverse()
			.find((ownerPath) => minimatch(relativePath, ownerPath));
		return this.codeowners && found ? this.codeowners[found] : [];
	}

	/**
	 * Get a list of Workspace tasks for the given lifecycle
	 */
	getTasks(lifecycle: string): Required<Tasks> {
		const empty = { parallel: [], serial: [] };
		if (lifecycle in this.tasks) {
			// @ts-ignore
			return { ...empty, ...this.tasks[lifecycle] };
		}
		return empty;
	}

	/**
	 * Resolve a full filepath within the Workspace given the path segments. Similar to Node.js's [path.resolve()](https://nodejs.org/dist/latest-v18.x/docs/api/path.html#pathresolvepaths).
	 *
	 * ```ts
	 * const main = workspace.resolve(workspace.main);
	 * ```
	 *
	 * @param pathSegments A sequence of paths or path segments
	 * @return Absolute path based on the input path segments
	 */
	resolve(...pathSegments: Array<string>): string {
		return path.resolve(this.#rootLocation, this.#location, ...pathSegments);
	}

	/**
	 * Get the relative path of an absolute path to the workspace’s location root
	 *
	 * ```ts
	 * const relativePath = workspace.relative('/some/absolute/path');
	 * ```
	 *
	 * @param to Absolute filepath
	 * @return Relative path to the workspace’s root location.
	 */
	relative(to: string): string {
		return path.relative(this.#location, to);
	}
}

/**
 * @group package.json
 */
export type Person = {
	name?: string;
	email?: string;
	url?: string;
};

/**
 * @group package.json
 */
export type BasePackageJson = {
	/**
	 * The full name for the {@link Workspace | `Workspace`}. This will be used within the package manager and publishable registry.
	 */
	name: string;
	description?: string;
	version?: string;
	keywords?: Array<string>;
	homepage?: string;
	bugs?: { url?: string; email?: string };
	license?: string;
	author?: string | Person;
	contributors?: Array<Person | string>;
	files?: Array<string>;
	main?: string;
	bin?: string | Record<string, string>;
	exports?: Record<string, string | { types?: string; default?: string; require?: string; import?: string }>;
	scripts?: Record<string, string>;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	peerDependenciesMeta?: Record<string, { optional: boolean }>;
	bundleDependencies?: Array<string>;
	optionalDependencies?: Array<string>;
	overrides?: Record<string, string>;
	engines?: Record<string, string>;
	os?: Array<string>;
	packageManager?: string;
	/**
	 * Enable's the {@link Graph | `Graph`} to look up {@link Workspace | `Workspace`}s by shorter names or common {@link Workspace.alias | aliases} used by teams. This enables much short command-line execution. See {@link Graph.getByName | `Graph.getByName`} and {@link Graph.getAllByName | `Graph.getAllByName`}.
	 */
	alias?: Array<string>;
};

/**
 * @group package.json
 */
export type PackageJson = PrivatePackageJson | PublicPackageJson;

/**
 * @group package.json
 */
export type PrivatePackageJson = {
	private: true;
	license?: 'UNLICENSED';
	workspaces?: Array<string>;
} & BasePackageJson;

/**
 * @group package.json
 */
export type PublicPackageJson = {
	private?: false;
	workspaces?: never;
	publishConfig?: PublishConfig;
} & BasePackageJson;

/**
 * The `publishConfig` should follow [NPM's guidelines](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#publishconfig), apart from the possible defined extra keys here. Anything defined here will be merged back to the root of the `package.json` at publish time.
 *
 * Use these keys to help differentiate between your repository's source-dependency entrypoints vs published module entrypoints.
 *
 * ```json collapse={2-4}
 * {
 * 	"name": "my-module",
 * 	"license": "MIT",
 * 	"type": "module",
 * 	"main": "./src/index.ts",
 * 	"publishConfig": {
 * 		"access": "public",
 * 		"main": "./dist/index.js",
 * 		"typings": "./dist/index.d.ts"
 * 	}
 * }
 * ```
 * @group package.json
 */
export type PublishConfig = {
	bin?: string | Record<string, string>;
	main?: string;
	module?: string;
	typings?: string;
	exports?: Record<string, string | { types?: string; default?: string; require?: string; import?: string }>;
	[key: (typeof publishConfigKeep)[number]]: unknown;
};

const publishConfigKeep = [
	'_auth',
	'access',
	'all',
	'allow-same-version',
	'audit',
	'audit-level',
	'auth-type',
	'before',
	'bin-links',
	'browser',
	'ca',
	'cache',
	'cafile',
	'call',
	'cidr',
	'color',
	'commit-hooks',
	'cpu',
	'depth',
	'description',
	'diff',
	'diff-dst-prefix',
	'diff-ignore-all-space',
	'diff-name-only',
	'diff-no-prefix',
	'diff-src-prefix',
	'diff-text',
	'diff-unified',
	'dry-run',
	'editor',
	'engine-strict',
	'fetch-retries',
	'fetch-retry-factor',
	'fetch-retry-maxtimeout',
	'fetch-retry-mintimeout',
	'fetch-timeout',
	'force',
	'foreground-scripts',
	'format-package-lock',
	'fund',
	'git',
	'git-tag-version',
	'global',
	'globalconfig',
	'heading',
	'https-proxy',
	'if-present',
	'ignore-scripts',
	'include',
	'include-staged',
	'include-workspace-root',
	'init-author-email',
	'init-author-name',
	'init-author-url',
	'init-license',
	'init-module',
	'init-version',
	'install-links',
	'install-strategy',
	'json',
	'legacy-peer-deps',
	'libc',
	'link',
	'local-address',
	'location',
	'lockfile-version',
	'loglevel',
	'logs-dir',
	'logs-max',
	'long',
	'maxsockets',
	'message',
	'node-options',
	'noproxy',
	'offline',
	'omit',
	'omit-lockfile-registry-resolved',
	'os',
	'otp',
	'pack-destination',
	'package',
	'package-lock',
	'package-lock-only',
	'parseable',
	'prefer-dedupe',
	'prefer-offline',
	'prefer-online',
	'prefix',
	'preid',
	'progress',
	'provenance',
	'provenance-file',
	'proxy',
	'read-only',
	'rebuild-bundle',
	'registry',
	'replace-registry-host',
	'save',
	'save-bundle',
	'save-dev',
	'save-exact',
	'save-optional',
	'save-peer',
	'save-prefix',
	'save-prod',
	'sbom-format',
	'sbom-type',
	'scope',
	'script-shell',
	'searchexclude',
	'searchlimit',
	'searchopts',
	'searchstaleness',
	'shell',
	'sign-git-commit',
	'sign-git-tag',
	'strict-peer-deps',
	'strict-ssl',
	'tag',
	'tag-version-prefix',
	'timing',
	'umask',
	'unicode',
	'update-notifier',
	'usage',
	'user-agent',
	'userconfig',
	'version',
	'versions',
	'viewer',
	'which',
	'workspace',
	'workspaces',
	'workspaces-update',
	'yes',
	'also',
	'cache-max',
	'cache-min',
	'cert',
	'dev',
	'global-style',
	'key',
	'legacy-bundling',
	'only',
	'optional',
	'production',
	'shrinkwrap',
];
