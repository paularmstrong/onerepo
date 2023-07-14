import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { getPackageManager, getPackageManagerName } from '@onerepo/package-manager';
import { globSync } from 'glob';
import { Graph as graph } from 'graph-data-structure';
import type { Serialized } from 'graph-data-structure';
import type { PackageManager } from '@onerepo/package-manager';
import { Workspace } from './Workspace';
import type { PackageJson, PrivatePackageJson } from './Workspace';

export const enum DependencyType {
	/**
	 * Production dependency (defined in `dependencies` of `package.json`)
	 */
	PROD = 3,
	/**
	 * Development-only dependency (defined in `devDependencies` keys of `package.json`)
	 */
	DEV = 2,
	/**
	 * Peer dependency (defined in `peerDependencies` key of `package.json`)
	 */
	PEER = 1,
}

export type { Serialized };

/**
 * The oneRepo Graph is a representation of the entire repository’s workspaces and how they depend upon each other. Most commonly, you will want to use the graph to get lists of workspaces that either depend on some input or are dependencies thereof:
 *
 * ```ts
 * const workspacesToCheck = graph.affected('tacos');
 * for (const ws of workspacesToCheck) {
 * 	// verify no issues based on changes
 * }
 * ```
 *
 * The `Graph` also includes various helpers for determining workspaces based on filepaths, name, and other factors.
 */
export class Graph {
	#rootLocation: string;

	#graph = graph();
	#inverted = graph();

	#prodGraph = graph();
	#invertedProdGraph = graph();

	#devGraph = graph();
	#invertedDevGraph = graph();

	#byName: Map<string, Workspace> = new Map();
	#nameByLocation: Map<string, string> = new Map();
	/**
	 * Separate map for aliases to locations to ensure the graph only uses fully qualified names
	 */
	#nameByAlias: Map<string, string> = new Map();
	#require: typeof require;
	#packageManager: PackageManager;

	/**
	 * @internal
	 */
	constructor(location: string, packageJson: PrivatePackageJson, workspaces: Array<string>, moduleRequire = require) {
		this.#require = moduleRequire;
		this.#rootLocation = location;
		this.#addWorkspace(location, packageJson);

		for (const pathGlob of workspaces) {
			const locations = globSync(path.join(pathGlob, 'package.json'), { cwd: this.#rootLocation });
			for (const pkgLocation of locations.sort()) {
				const location = path.dirname(pkgLocation);
				const packageJson = moduleRequire(path.join(this.#rootLocation, pkgLocation));
				this.#addWorkspace(path.join(this.#rootLocation, location), packageJson);
			}
		}

		this.#byName.forEach((workspace, dependent) => {
			this.#addEdges(dependent, workspace.dependencies, DependencyType.PROD);
			this.#addEdges(dependent, workspace.devDependencies, DependencyType.DEV);
			this.#addEdges(dependent, workspace.peerDependencies, DependencyType.PEER);
		});

		this.#packageManager = getPackageManager(getPackageManagerName(location, packageJson.packageManager));
	}

	/**
	 * Get a serialized representation of the graph
	 */
	get serialized(): Serialized {
		return this.#graph.serialize();
	}

	/**
	 * All workspaces that are part of the repository graph.
	 */
	get workspaces(): Array<Workspace> {
		return Array.from(this.#byName.values());
	}

	/**
	 * Get the workspace that is at the root of the repository.
	 */
	get root() {
		return this.getByLocation(this.#rootLocation);
	}

	/**
	 * Get the package manager that this Graph depends on.
	 */
	get packageManager() {
		return this.#packageManager;
	}

	/**
	 * Get a list of workspaces that depend on the given input sources.
	 *
	 * ```ts
	 * const tacoDependents = graph.dependents('tacos');
	 * ```
	 *
	 * @param sources One or more workspaces by name or `Workspace` instance
	 * @param includeSelf Whether to include the `Workspaces` for the input `sources` in the return array.
	 * @param type Filter the dependents to a dependency type.
	 */
	dependents<T extends string | Workspace>(sources?: T | Array<T>, includeSelf = false, type?: DependencyType) {
		const graph =
			type === DependencyType.PROD
				? this.#invertedProdGraph
				: type === DependencyType.DEV
				? this.#invertedDevGraph
				: this.#inverted;

		if (sources) {
			const names = (Array.isArray(sources) ? sources : [sources]).map((source) =>
				source instanceof Workspace ? source.name : this.getByName(source).name,
			);

			return this.getAllByName(graph.topologicalSort(names, includeSelf));
		}

		return this.getAllByName(graph.topologicalSort());
	}
	/**
	 * Get a list of workspaces that are dependencies of the given input sources.
	 *
	 * ```ts
	 * const tacoDependencies = graph.dependencies('tacos');
	 * ```
	 *
	 * @param sources One or more workspaces by name or `Workspace` instance
	 * @param includeSelf Whether to include the `Workspaces` for the input `sources` in the return array.
	 * @param type Filter the dependencies to a dependency type.
	 */
	dependencies<T extends string | Workspace>(sources?: T | Array<T>, includeSelf = false, type?: DependencyType) {
		const graph =
			type === DependencyType.PROD ? this.#prodGraph : type === DependencyType.DEV ? this.#devGraph : this.#graph;

		if (sources) {
			const names = (Array.isArray(sources) ? sources : [sources]).map((source) =>
				source instanceof Workspace ? source.name : this.getByName(source).name,
			);
			return this.getAllByName(graph.topologicalSort(names, includeSelf));
		}

		return this.getAllByName(graph.topologicalSort());
	}

	/**
	 * Get a list of workspaces that will be affected by the given source(s). This is equivalent to `graph.dependents(sources, true)`.
	 *
	 * ```ts
	 * const dependents = graph.dependents(sources, true);
	 * const affected = graph.affected(sources);
	 *
	 * assert.isEqual(dependents, affecteed);
	 * ```
	 *
	 * @param sources One or more workspaces by name or `Workspace` instance
	 * @param type Filter the dependents to a dependency type.
	 */
	affected<T extends string | Workspace>(source: T | Array<T>, type?: DependencyType): Array<Workspace> {
		return this.dependents(source, true, type);
	}

	/**
	 * Get a workspace by string name. This can be either the full package name or one of its `aliases`
	 *
	 * ```ts
	 * const workspace = graph.getByName('my-cool-package');
	 * ```
	 *
	 * @param name A Workspace’s {@link Workspace#name} or any available {@link Workspace#aliases}.
	 */
	getByName(name: string): Workspace {
		if (this.#byName.has(name)) {
			return this.#byName.get(name)!;
		}

		if (this.#nameByAlias.has(name)) {
			const actualName = this.#nameByAlias.get(name)!;
			return this.#byName.get(actualName)!;
		}

		throw new Error(`No workspace available for the name "${name}"`);
	}

	/**
	 * Get a list of workspaces by name or alias
	 *
	 * ```ts
	 * const workspaces = graph.getAllByName(['tacos', 'burritos']);
	 * ```
	 *
	 * @param names A list of workspace {@link Workspace#name}s or any available {@link Workspace#aliases}.
	 */
	getAllByName(names: Array<string>): Array<Workspace> {
		return names.map((name) => this.getByName(name)).filter(Boolean) as Array<Workspace>;
	}

	/**
	 * Get the equivalent Workspace for a filepath. This can be any location within a Workspace, not just its root.
	 *
	 * ```ts
	 * // in Node.js
	 * graph.getByLocation(__dirname);
	 *
	 * // in pure ESM
	 * graph.getByLocation(import.meta.url);
	 * ```
	 *
	 * @param location A filepath string. May be a file URL or string path.
	 *
	 */
	getByLocation(location: string): Workspace {
		const locationPath = location.startsWith('file:') ? fileURLToPath(location) : location;

		const segments = locationPath.split(path.sep);

		while (segments.length) {
			const pathToCheck = path.join('/', ...segments);
			if (this.#nameByLocation.has(pathToCheck)) {
				const name = this.#nameByLocation.get(pathToCheck)!;
				return this.#byName.get(name)!;
			}
			segments.pop();
		}

		throw new Error(`No workspace was found for "${location}"`);
	}

	/**
	 * Get all workspaces given an array of filepaths.
	 *
	 * ```ts
	 * const workspaces = graph.getAllByLocation([__dirname, 'file:///foo/bar']);
	 * ```
	 *
	 * @param locations A list of filepath strings. May be file URLs or string paths.
	 */
	getAllByLocation(locations: Array<string>): Array<Workspace> {
		const workspaces = new Set<Workspace>();
		locations.forEach((location) => {
			try {
				const found = this.getByLocation(location);
				workspaces.add(found);
			} catch (e) {
				// pass
			}
		});
		return Array.from(workspaces);
	}

	/**
	 * Get an isolated graph of dependents from the list of sources
	 *
	 * @param sources A list of workspace {@link Workspace#name}s or any available {@link Workspace#aliases}.
	 * @param type Filter the graph to a dependency type.
	 * @return This does not return a oneRepo `Graph`, but instead a graph-data-structure instance. See [graph-data-structure](https://www.npmjs.com/package/graph-data-structure) for usage information and help.
	 */
	isolatedGraph(sources: Array<Workspace>, type?: DependencyType): ReturnType<typeof graph> {
		const returnGraph = graph();

		const inverted =
			type === DependencyType.DEV
				? this.#invertedDevGraph
				: type === DependencyType.PROD
				? this.#invertedProdGraph
				: this.#inverted;

		const addAdjacent = (ws: Workspace) => {
			const adjacent = inverted.adjacent(ws.name);
			for (const adj of adjacent) {
				const dependent = this.getByName(adj)!;
				returnGraph.addNode(adj);
				if (ws.name in dependent.dependencies) {
					if (!returnGraph.hasEdge(dependent.name, ws.name)) {
						returnGraph.addEdge(dependent.name, ws.name, DependencyType.PROD);
					}
				}
				if (ws.name in dependent.devDependencies) {
					if (!returnGraph.hasEdge(dependent.name, ws.name)) {
						returnGraph.addEdge(dependent.name, ws.name, DependencyType.DEV);
					}
				}
				if (ws.name in dependent.peerDependencies) {
					if (!returnGraph.hasEdge(dependent.name, ws.name)) {
						returnGraph.addEdge(dependent.name, ws.name, DependencyType.PEER);
					}
				}
				addAdjacent(dependent);
			}
		};

		for (const ws of sources) {
			returnGraph.addNode(ws.name);
			addAdjacent(ws);
		}

		return returnGraph;
	}

	#addWorkspace(location: string, packageJson: PackageJson) {
		const workspace = new Workspace(this.#rootLocation, location, packageJson, this.#require);
		this.#byName.set(workspace.name, workspace);
		workspace.aliases.forEach((alias) => {
			if (this.#nameByAlias.has(alias)) {
				throw new Error(
					`Cannot add alias "${alias}" for ${workspace.name} because it is already used for ${this.#nameByAlias.get(
						alias,
					)}.`,
				);
			}
			this.#nameByAlias.set(alias, workspace.name);
		});
		this.#nameByLocation.set(location, workspace.name);

		this.#graph.addNode(workspace.name);
		this.#inverted.addNode(workspace.name);

		this.#prodGraph.addNode(workspace.name);
		this.#invertedProdGraph.addNode(workspace.name);

		this.#devGraph.addNode(workspace.name);
		this.#invertedDevGraph.addNode(workspace.name);
	}

	#addEdges(dependent: string, dependencies: Record<string, string>, weight: DependencyType) {
		for (const [dependency, version] of Object.entries(dependencies)) {
			if (this.#byName.has(dependency)) {
				if (!version.startsWith('workspace:') && version !== this.#byName.get(dependency)!.version) {
					// While it is not _recommended_ to use non-source versions, it is still possible and allowed – edges just won't be created here.
					// `graph verify` will throw an error here, unless dependency verification is turned off.
					continue;
				}

				this.#graph.addEdge(dependent, dependency, weight);
				const graph = weight === DependencyType.DEV ? this.#devGraph : this.#prodGraph;
				graph.addEdge(dependent, dependency);

				if (this.#graph.hasCycle()) {
					throw new Error(
						`Cyclical dependencies are not allowed. Please correct the cycle between ${dependent} and ${dependency}`,
					);
				}

				this.#inverted.addEdge(dependency, dependent, weight);
				const inverted = weight === DependencyType.DEV ? this.#invertedDevGraph : this.#invertedProdGraph;
				inverted.addEdge(dependency, dependent);

				if (this.#inverted.hasCycle()) {
					throw new Error(
						`Cyclical dependencies are not allowed. Please correct the cycle between ${dependent} and ${dependency}`,
					);
				}
			}
		}
	}
}
