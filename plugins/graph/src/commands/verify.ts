import { coerce, intersects, valid } from 'semver';
import type { Builder, Handler } from '@onerepo/types';

export const command = 'verify';

export const description = 'Verify the integrity of the repo’s dependency graph.';

export const builder: Builder = (yargs) => yargs.usage(`$0`);

export const handler: Handler = async function handler(argv, { graph, logger }) {
	for (const workspace of Object.values(graph.workspaces)) {
		const step = logger.createStep(`Validating ${workspace.name} tree`);
		const deps = workspace.dependencies;

		const dependencies = graph.getAllByName(graph.dependencies(workspace.name));

		for (const dependency of dependencies) {
			step.log(`Checking ${dependency.name}`);
			for (const [dep, version] of Object.entries(dependency.dependencies)) {
				if (dep in deps) {
					step.log(`Checking ${dep}@${deps[dep]} intersects ${version}`);
					if (valid(coerce(version)) && !intersects(version, deps[dep])) {
						step.error(
							`\`${dep}@${deps[dep]}\` does not satisfy \`${dep}@${version}\` as required by local dependency \`${dependency.name}\``
						);
					}
				}
			}
		}
		await step.end();
	}
};
