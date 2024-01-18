import * as actionsCore from '@actions/core';
import semver from 'semver';
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

		const workspaceDependencies = graph.dependencies(workspace.name);
		const errs: Array<string> = [];

		for (const dependency of workspaceDependencies) {
			dependencyStep.log(`Checking ${dependency.name}`);
			for (const [name, version] of Object.entries({
				...dependency.dependencies,
				...dependency.devDependencies,
				...(mode !== 'strict' ? dependency.peerDependencies : {}),
			})) {
				if (name in dependencies) {
					if (version.startsWith('workspace:') || dependencies[name].startsWith('workspace:')) {
						continue;
					}
					dependencyStep.log(`Checking ${name}@${dependencies[name]} intersects ${version}`);
					let message: string | null = null;
					if (semver.valid(semver.coerce(version))) {
						if (mode === 'loose' && !semver.intersects(version, dependencies[name])) {
							message = `Dependency "${name}@${dependencies[name]}" does not intersect "${version}" as is required by Workspace dependency "${dependency.name}"`;
						} else if (mode === 'strict') {
							if (!semver.eq(semver.coerce(version)!, semver.coerce(dependencies[name])!)) {
								message = `Dependency "${name}@${dependencies[name]}" expected to match "${version}" from Workspace dependency "${dependency.name}"`;
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
