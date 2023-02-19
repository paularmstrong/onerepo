import path from 'path';
import glob from 'glob';
import { Graph as graph } from 'graph-data-structure';
import type { Serialized } from 'graph-data-structure';
import { Workspace } from './Workspace';
import type { PackageJson, PrivatePackageJson } from './Workspace';

const Dependency = {
	prod: 3,
	dev: 2,
	peer: 1,
};

export type SerializedGraph = Serialized;

export class Graph {
	#rootLocation: string;

	#graph = graph();
	#inverted = graph();
	#byName: Map<string, Workspace> = new Map();
	#nameByLocation: Map<string, string> = new Map();
	/**
	 * Separate map for aliases to locations to ensure the graph only uses fully qualified names
	 */
	#nameByAlias: Map<string, string> = new Map();

	constructor(location: string, packageJson: PrivatePackageJson, moduleRequire = require) {
		this.#rootLocation = location;
		this.#addWorkspace(location, packageJson);

		for (const pathGlob of packageJson.workspaces || []) {
			const locations = glob.sync(path.join(pathGlob, 'package.json'), { cwd: this.#rootLocation });
			for (const pkgLocation of locations) {
				const location = path.dirname(pkgLocation);
				const packageJson = moduleRequire(path.join(this.#rootLocation, pkgLocation));
				this.#addWorkspace(path.join(this.#rootLocation, location), packageJson);
			}
		}

		this.#byName.forEach((workspace, dependent) => {
			this.#addEdges(dependent, workspace.dependencies, Dependency.prod);
			this.#addEdges(dependent, workspace.devDependencies, Dependency.dev);
			this.#addEdges(dependent, workspace.peerDependencies, Dependency.peer);
		});
	}

	get serialized() {
		return this.#graph.serialize();
	}

	get workspaces(): Record<string, Workspace> {
		return Object.fromEntries(this.#byName);
	}

	get workspaceLocations() {
		return Array.from(this.#nameByLocation.keys());
	}

	get root() {
		return this.getByLocation(this.#rootLocation)!;
	}

	dependents<T extends string | Workspace>(sources?: T | Array<T>, includeSelf = false) {
		if (sources) {
			const names = (Array.isArray(sources) ? sources : [sources])
				.map((source) => (source instanceof Workspace ? source.name : this.getByName(source)!.name))
				.filter(Boolean);
			return this.getAllByName(this.#inverted.topologicalSort(names, includeSelf));
		}
		return this.getAllByName(this.#inverted.topologicalSort());
	}

	dependencies<T extends string | Workspace>(sources?: T | Array<T>, includeSelf = false) {
		if (sources) {
			const names = (Array.isArray(sources) ? sources : [sources])
				.map((source) => (source instanceof Workspace ? source.name : this.getByName(source)!.name))
				.filter(Boolean);
			return this.getAllByName(this.#graph.topologicalSort(names, includeSelf));
		}

		return this.getAllByName(this.#graph.topologicalSort());
	}

	affected<T extends string | Workspace>(source: T | Array<T>): Array<Workspace> {
		return this.dependents(source, true);
	}

	getByName(name: string): Workspace | null {
		if (this.#byName.has(name)) {
			return this.#byName.get(name)!;
		}

		if (this.#nameByAlias.has(name)) {
			const actualName = this.#nameByAlias.get(name)!;
			return this.#byName.get(actualName)!;
		}

		return null;
	}

	getAllByName(names: Array<string>): Array<Workspace> {
		return names.map((name) => this.getByName(name)).filter(Boolean) as Array<Workspace>;
	}

	getByLocation(location: string): Workspace | null {
		const segments = location.split(path.sep);

		while (segments.length) {
			const pathToCheck = path.join('/', ...segments);
			if (this.#nameByLocation.has(pathToCheck)) {
				const name = this.#nameByLocation.get(pathToCheck)!;
				return this.#byName.get(name)!;
			}
			segments.pop();
		}

		return null;
	}

	getAllByLocation(locations: Array<string>): Array<Workspace> {
		const workspaces = new Set<Workspace>();
		locations.forEach((location) => {
			const found = this.getByLocation(location);
			if (found) {
				workspaces.add(found);
			}
		});
		return Array.from(workspaces);
	}

	#addWorkspace(location: string, packageJson: PackageJson) {
		const workspace = new Workspace(this.#rootLocation, location, packageJson);
		this.#byName.set(workspace.name, workspace);
		workspace.aliases.forEach((alias) => {
			this.#nameByAlias.set(alias, workspace.name);
		});
		this.#nameByLocation.set(location, workspace.name);
		this.#graph.addNode(workspace.name);
		this.#inverted.addNode(workspace.name);
	}

	#addEdges(
		dependent: string,
		dependencies: Record<string, string>,
		weight: (typeof Dependency)[keyof typeof Dependency]
	) {
		for (const [dependency, version] of Object.entries(dependencies)) {
			if (this.#byName.has(dependency)) {
				if (!version.startsWith('workspace:') && version !== this.#byName.get(dependency)!.version) {
					throw new Error(`${dependent} does not use source version of ${dependency}`);
				}

				this.#graph.addEdge(dependent, dependency, weight);
				if (this.#graph.hasCycle()) {
					throw new Error(`Cycle found between ${dependent} and ${dependency}`);
				}

				this.#inverted.addEdge(dependency, dependent, weight);
				if (this.#graph.hasCycle()) {
					throw new Error(`Cycle found between ${dependent} and ${dependency}`);
				}
			}
		}
	}
}
