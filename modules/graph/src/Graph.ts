import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { getPackageManager, getPackageManagerName } from '@onerepo/package-manager';
import { globSync } from 'glob';
import { Graph as graph } from 'graph-data-structure';
import type { PackageManager, PackageJson } from '@onerepo/package-manager';
import { Workspace } from './Workspace';

/**
 * @group Graph
 */
export const DependencyType = {
	/**
	 * Production dependency (defined in `dependencies` of `package.json`)
	 */
	PROD: 3,
	/**
	 * Development-only dependency (defined in `devDependencies` keys of `package.json`)
	 */
	DEV: 2,
	/**
	 * Peer dependency (defined in `peerDependencies` key of `package.json`)
	 */
	PEER: 1,
} as const;

/**
 * Dependency type value.
 * @see {@link DependencyType | `DependencyType`}
 * @group Graph
 */
export type DepType = 1 | 2 | 3;

/**
 * Serialized representation of a Graph data structure. This is available from {@link Graph.serialized | `Graph.serialized`} and may not be very useful outside of specific visualization needs. It is also unstable and subject to change.
 *
 * @group Graph
 * @internal
 */
export type Serialized = {
	nodes: Array<{ id: string }>;
	links: Array<{
		/**
		 * {@link Workspace.name | Workspace name} for the source of the edge.
		 */
		source: string;
		/**
		 * {@link Workspace.name | Workspace name} for the target of the edge.
		 */
		target: string;
		/**
		 * Dependency type weight for the edge (prod, dev, or peer dependency).
		 */
		weight: DepType;
	}>;
};

/**
 * The oneRepo Graph is a representation of the entire repository’s {@link Workspace | `Workspaces`} and how they depend upon each other. Most commonly, you will want to use the Graph to get lists of Workspaces that either depend on some input or are dependencies thereof:
 *
 * ```ts
 * const workspacesToCheck = graph.affected('tacos');
 * for (const ws of workspacesToCheck) {
 * 	// verify no issues based on changes
 * }
 * ```
 *
 * The `Graph` also includes various helpers for determining workspaces based on filepaths, name, and other factors.
 *
 * @group Graph
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
	 * Separate map for aliases to locations to ensure the Graph only uses fully qualified names
	 */
	#nameByAlias: Map<string, string> = new Map();
	#require: typeof require;
	#packageManager: PackageManager;

	/**
	 * @internal
	 */
	constructor(location: string, packageJson: PackageJson, workspaces: Array<string>, moduleRequire = require) {
		this.#require = moduleRequire;
		this.#rootLocation = location;
		this.#addWorkspace(location, packageJson);

		for (const pathGlob of workspaces) {
			const locations = globSync(path.join(pathGlob, 'package.json'), { cwd: this.#rootLocation });
			for (const pkgLocation of locations.sort()) {
				const location = path.dirname(pkgLocation);
				const raw = readFileSync(path.join(this.#rootLocation, pkgLocation), 'utf-8');
				const packageJson = JSON.parse(raw);
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
	 * Get a serialized representation of the Graph. This is useful for creating visualizations of the Workspace Graph, but cannot be used to deserialize back to a full Graph object.
	 *
	 * This very same serialization method is used to help generate the [online Graph visualizer](https://onerepo.tools/visualize/).
	 *
	 * ```ts
	 * const { nodes, links } = graph.serialized;
	 * ```
	 * @internal
	 */
	get serialized(): Serialized {
		return this.#graph.serialize() as Serialized;
	}

	/**
	 * Get a list of all {@link Workspace | `Workspaces`} that are part of the repository {@Link Graph | `Graph`}.
	 *
	 * ```ts
	 * for (const workspace of graph.workspaces) {
	 * 	logger.info(workspace.name);
	 * }
	 * ```
	 */
	get workspaces(): Array<Workspace> {
		return Array.from(this.#byName.values());
	}

	/**
	 * This returns the {@link Workspace | `Workspace`} that is at the root of the repository.
	 *
	 * Regardless of how the `workspaces` are configured with the package manager, the root `package.json` is always registered as a Workspace.
	 *
	 * ```ts
	 * const root = graph.root;
	 * root.isRoot === true;
	 * ```
	 */
	get root() {
		return this.getByLocation(this.#rootLocation);
	}

	/**
	 * Get the {@link PackageManager} that this Graph depends on. This object allows you to run many common package management commands safely, agnostic of any particular flavor of package management. Works with npm, Yarn, and pnpm.
	 *
	 * ```ts
	 * await graph.packageManager.install();
	 * ```
	 */
	get packageManager() {
		return this.#packageManager;
	}

	/**
	 * Get all dependent {@link Workspace | `Workspaces`} of one or more input Workspaces or qualified names of Workspaces. This not only returns the direct dependents, but all dependents throughout the entire {@link Graph | `Graph`}. This returns the opposite result of {@link Graph.dependencies | `dependencies`}.
	 *
	 * ```ts
	 * for (const workspace of graph.dependents('tacos')) {
	 * 	logger.info(`"${workspace.name}" depends on "tacos"`);
	 * }
	 * ```
	 *
	 * @param sources One or more Workspaces by name or `Workspace` instance
	 * @param includeSelf Whether to include the `Workspaces` for the input `sources` in the return array.
	 * @param type Filter the dependents to a dependency type.
	 */
	dependents<T extends string | Workspace>(sources?: T | Array<T>, includeSelf = false, type?: DepType) {
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
	 * Get all dependency {@link Workspace | `Workspaces`} of one or more input Workspaces or qualified names of Workspaces. This not only returns the direct dependencies, but all dependencies throughout the entire {@link Graph | `Graph`}. This returns the opposite result of {@link Graph.dependents | `dependents`}.
	 *
	 * ```ts
	 * for (const workspace of graph.dependencies('tacos')) {
	 * 	logger.info(`"${workspace.name}" is a dependency of "tacos"`);
	 * }
	 * ```
	 *
	 * @param sources A list of {@link Workspace | `Workspaces`} by {@link Workspace#name | `name`}s or any available {@link Workspace#aliases | `aliases`}.
	 * @param includeSelf Whether to include the `Workspaces` for the input `sources` in the return array.
	 * @param type Filter the dependencies to a dependency type.
	 */
	dependencies<T extends string | Workspace>(sources?: T | Array<T>, includeSelf = false, type?: DepType) {
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
	 * Get a list of {@link Workspace | `Workspaces`} that will be affected by the given source(s). This is equivalent to `graph.dependents(sources, true)`. See also {@link Graph.dependents | `dependents`}.
	 *
	 * ```ts
	 * const dependents = graph.dependents(sources, true);
	 * const affected = graph.affected(sources);
	 *
	 * assert.isEqual(dependents, affecteed);
	 * ```
	 *
	 * @param sources A list of {@link Workspace | `Workspaces`} by {@link Workspace#name | `name`}s or any available {@link Workspace#aliases | `aliases`}.
	 * @param type Filter the dependents to a dependency type.
	 */
	affected<T extends string | Workspace>(source: T | Array<T>, type?: DepType): Array<Workspace> {
		return this.dependents(source, true, type);
	}

	/**
	 * Get a {@link Workspace | `Workspace`} by string name.
	 *
	 * ```ts
	 * const workspace = graph.getByName('my-cool-package');
	 * ```
	 *
	 * @param name A Workspace’s {@link Workspace.name | `name`} or any available {@link Workspace.aliases | `aliases`}.
	 * @throws `Error` if no Workspace exists with the given input `name`.
	 */
	getByName(name: string): Workspace {
		if (this.#byName.has(name)) {
			return this.#byName.get(name)!;
		}

		if (this.#nameByAlias.has(name)) {
			const actualName = this.#nameByAlias.get(name)!;
			return this.#byName.get(actualName)!;
		}

		throw new Error(`No Workspace available for the name "${name}"`);
	}

	/**
	 * Get a list of {@link Workspace | `Workspaces`} by string names.
	 *
	 * ```ts
	 * const workspaces = graph.getAllByName(['tacos', 'burritos']);
	 * ```
	 *
	 * @param names A list of Workspace {@link Workspace.name | `name`}s or any available {@link Workspace.aliases | `aliases`}.
	 */
	getAllByName(names: Array<string>): Array<Workspace> {
		return names.map((name) => this.getByName(name)).filter(Boolean) as Array<Workspace>;
	}

	/**
	 * Get the equivalent {@link Workspace | `Workspace`} for a filepath. This can be any location within a `Workspace`, not just its root.
	 *
	 * ```ts title="CommonJS compatible"
	 * // in Node.js
	 * graph.getByLocation(__dirname);
	 * ```
	 *
	 * ```ts title="ESM compatible"
	 * graph.getByLocation(import.meta.url);
	 * ```
	 *
	 * @param location A string or URL-based filepath.
	 * @throws `Error` if no Workspace can be found.
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

		throw new Error(`No Workspace was found for "${location}"`);
	}

	/**
	 * Get all Workspaces given an array of filepaths.
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
			} catch {
				// pass
			}
		});
		return Array.from(workspaces);
	}

	/**
	 * Get an isolated Graph of dependents from the list of sources
	 *
	 * @param sources A list of {@link Workspace | `Workspaces`} by {@link Workspace#name | `name`}s or any available {@link Workspace#aliases | `aliases`}.
	 * @param type Filter the Graph to a dependency type.
	 * @return This does not return a oneRepo `Graph`, but instead a graph-data-structure instance. See [graph-data-structure](https://www.npmjs.com/package/graph-data-structure) for usage information and help.
	 * @internal
	 */
	isolatedGraph(sources: Array<Workspace>, type?: DepType): ReturnType<typeof graph> {
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

	#addEdges(dependent: string, dependencies: Record<string, string>, weight: DepType) {
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
