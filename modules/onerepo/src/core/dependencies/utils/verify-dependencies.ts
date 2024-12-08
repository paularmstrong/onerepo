import * as actionsCore from '@actions/core';
import { coerce, eq, intersects, valid } from 'semver';
import type { Graph, Workspace } from '@onerepo/graph';
import type { Logger } from '@onerepo/logger';
import { read } from '@onerepo/file';

export async function verifyDependencies(
	mode: 'strict' | 'loose',
	graph: Graph,
	workspaces: Array<Workspace>,
	logger: Logger,
) {
	const dependencyStep = logger.createStep('Validating dependency trees');
	for (const workspace of workspaces) {
		const dependencies = { ...workspace.dependencies, ...workspace.devDependencies };

		const workspaceDependencies = graph.dependencies(workspace.name, true);
		const errs: Array<string> = [];

		for (const dependency of workspaceDependencies) {
			dependencyStep.log(`Checking ${dependency.name}`);
			for (const dep of Object.entries({
				...dependency.dependencies,
				...dependency.devDependencies,
				...(mode !== 'strict' ? dependency.peerDependencies : {}),
			})) {
				let version = dep[1];
				const name = dep[0];
				if (name in dependencies) {
					let message: string | null = null;

					try {
						const local = graph.getByName(name);
						// Verify this is not by alias
						if (local.name === name) {
							// private + private is okay, but not public + private
							if (local.private && !workspace.private && name in workspace.dependencies) {
								message = `Dependency "${name}" is a private workspace, but is used as a public production dependency. Either make this package publishable or move to development dependencies.`;
							}
							version = local.version ?? version;
						}
					} catch {
						// not a local workspace
					}
					dependencyStep.log(`Checking ${name}@${dependencies[name]} intersects ${version}`);

					if (!version.startsWith('workspace:') && !dependencies[name].startsWith('workspace:')) {
						if (valid(coerce(version))) {
							if (mode === 'loose' && !intersects(version, dependencies[name])) {
								message = `Dependency "${name}@${dependencies[name]}" does not intersect "${version}" as is required by Workspace dependency "${dependency.name}"`;
							} else if (mode === 'strict') {
								if (!eq(coerce(version)!, coerce(dependencies[name])!)) {
									message = `Dependency "${name}@${dependencies[name]}" expected to match "${version}" from Workspace dependency "${dependency.name}"`;
								}
							}
						}
					}

					if (message) {
						const contents = await read(workspace.resolve('package.json'), 'r', { step: dependencyStep });
						if (process.env.GITHUB_RUN_ID) {
							actionsCore.error(message, {
								file: workspace.resolve('package.json'),
								...getLocation(contents, `"${name}": "${dependencies[name]}"`),
							});
						}
						errs.push(message);
					}
				}
			}
		}

		if (errs.length) {
			const mismatch = `Version mismatches found in "${workspace.name}"`;
			dependencyStep.error(mismatch);
			for (const err of errs) {
				dependencyStep.error(` ↳ ${err}`);
			}
		}
	}
	await dependencyStep.end();
}

function getLocation(contents: string, search: string) {
	const index = contents.indexOf(search);
	const before = contents.substring(0, index);
	const lines = before.split('\n');
	const line = lines.length;
	const startColumn = lines[lines.length - 1].length;

	return { startLine: line, endLine: line, startColumn, endColumn: startColumn + search.length };
}
