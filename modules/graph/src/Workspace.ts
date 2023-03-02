import path from 'node:path';
import type { TaskConfig, Tasks } from '@onerepo/types';

export class Workspace {
	#packageJson: PackageJson;
	#location: string;
	#rootLocation: string;
	#tasks: TaskConfig | null = null;
	#require: typeof require;

	/**
	 * @private
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
	 * Whether or not this workspace is the root of the repository / Graph.
	 */
	get isRoot() {
		return this.#rootLocation === this.#location;
	}

	/**
	 * Absolute path on the current filesystem to the workspace.
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

	get publishConfig(): PublishConfig {
		return ('publishConfig' in this.packageJson ? this.packageJson.publishConfig : {}) as PublishConfig;
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
	 * Get the `package.json` defined production dependencies for the workspace.
	 *
	 * @return Map of modules to their version.
	 */
	get dependencies(): Record<string, string> {
		return { ...this.#packageJson.dependencies } || {};
	}

	/**
	 * Get the `package.json` defined development dependencies for the workspace.
	 *
	 * @return Map of modules to their version.
	 */
	get devDependencies(): Record<string, string> {
		return { ...this.#packageJson.devDependencies } || {};
	}

	/**
	 * Get the `package.json` defined peer dependencies for the workspace.
	 *
	 * @return Map of modules to their version.
	 */
	get peerDependencies(): Record<string, string> {
		return { ...this.#packageJson.peerDependencies } || {};
	}

	/**
	 * If a workspace `package.json` is set to `private: true`, it will not be available to publish through NPM or other package management registries.
	 */
	get private() {
		return 'private' in this.#packageJson && Boolean(this.#packageJson.private);
	}

	/**
	 * Get the task configuration as defined in the `onerepo.config.js` file at the root of the workspace.
	 *
	 * @return If a config does not exist, an empty object will be given.
	 */
	get tasks(): TaskConfig {
		if (this.#tasks) {
			return this.#tasks;
		}
		try {
			const mod = this.#require(this.resolve('onerepo.config'));
			this.#tasks = mod.default ?? mod ?? {};
			return this.#tasks!;
		} catch (e) {
			return {} as TaskConfig;
		}
	}

	/**
	 * Get a list of Workspace tasks for the given lifecycle
	 */
	getTasks(lifecycle: string): Required<Tasks> {
		const empty = { parallel: [], sequential: [] };
		if (lifecycle in this.tasks) {
			// @ts-ignore
			return { ...empty, ...this.tasks[lifecycle] };
		}
		return empty;
	}

	/**
	 * Resolve a full filepath within the workspace given the path segments. Similar to Node.js's [path.resolve()](https://nodejs.org/dist/latest-v18.x/docs/api/path.html#pathresolvepaths).
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

interface Person {
	name?: string;
	email?: string;
	url?: string;
}

export interface PackageJson {
	name: string;
	description?: string;
	version?: string;
	keywords?: Array<string>;
	homepage?: string;
	bugs?: { url?: string; email?: string };
	license: string;
	author?: string | Person;
	contributors?: Array<Person | string>;
	files?: Array<string>;
	main?: string;
	bin?: string | Record<string, string>;
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
	// Custom
	alias?: Array<string>;
}

export interface PrivatePackageJson extends PackageJson {
	private: true;
	license: 'UNLICENSED';
	workspaces?: Array<string>;
}

type PublishConfig = {
	access?: 'public' | 'restricted';
	registry?: string;
	[key: string]: unknown;
};

export interface PublicPackageJson extends PackageJson {
	private?: false;
	publishConfig?: PublishConfig;
}

export interface PackageJsonWithLocation extends PackageJson {
	location: string;
}
