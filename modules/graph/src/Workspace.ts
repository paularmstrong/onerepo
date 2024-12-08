import path from 'node:path';
import defaults from 'defaults';
import { minimatch } from 'minimatch';
import type { Tasks, TaskConfig, WorkspaceConfig, RootConfig } from 'onerepo';
import { getPublishablePackageJson } from '@onerepo/package-manager';
import type { PackageJson } from '@onerepo/package-manager';

const defaultConfig: Required<WorkspaceConfig> = {
	codeowners: {},
	commands: {
		passthrough: {},
	},
	meta: {},
	tasks: {},
};

/**
 * @group Graph
 */
export class Workspace {
	#packageJson: PackageJson;
	#location: string;
	#rootLocation: string;
	#tasks: TaskConfig | null = null;
	#require: typeof require;
	#config?: Required<WorkspaceConfig | RootConfig>;

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
	 * A full deep copy of the `package.json` file for the Workspace. Modifications to this object will not be preserved on the Workspace.
	 */
	get packageJson(): PackageJson {
		return JSON.parse(JSON.stringify(this.#packageJson)) as PackageJson;
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
		return { ...this.#packageJson.dependencies };
	}

	/**
	 * Get the `package.json` defined development dependencies for the Workspace.
	 *
	 * @return Map of modules to their version.
	 */
	get devDependencies(): Record<string, string> {
		return { ...this.#packageJson.devDependencies };
	}

	/**
	 * Get the `package.json` defined peer dependencies for the Workspace.
	 *
	 * @return Map of modules to their version.
	 */
	get peerDependencies(): Record<string, string> {
		return { ...this.#packageJson.peerDependencies };
	}

	/**
	 * If a Workspace `package.json` is set to `private: true`, it will not be available to publish through NPM or other package management registries.
	 */
	get private() {
		return 'private' in this.#packageJson && Boolean(this.#packageJson.private);
	}

	/**
	 * Get the Workspace's configuration
	 */
	get config(): Required<WorkspaceConfig | RootConfig> {
		if (!this.#config) {
			try {
				const config = this.#require(this.resolve('onerepo.config'));
				if (this.isRoot) {
					this.#config = config as Required<RootConfig>;
				} else {
					this.#config = defaults(config.default ?? config, defaultConfig) as Required<WorkspaceConfig>;
				}
			} catch (e) {
				if (e && (e as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND') {
					this.#config = { ...defaultConfig } as Required<WorkspaceConfig>;
				} else {
					throw e;
				}
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
		return getPublishablePackageJson(this.#packageJson);
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
	 * Get the relative path of an absolute path to the Workspace’s location root
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
