import path from 'node:path';
import glob from 'glob';
import minimatch from 'minimatch';
import { coerce, intersects, valid } from 'semver';
import type { Builder, Handler } from '@onerepo/yargs';
import Ajv from 'ajv/dist/2019';
import ajvErrors from 'ajv-errors';
import draft7 from 'ajv/dist/refs/json-schema-draft-07.json';
import type { GraphSchemaValidators } from '../schema';
import { defaultValidators } from '../schema';

export const command = 'verify';

export const description = 'Verify the integrity of the repo’s dependency graph.';

type Argv = {
	'custom-schema'?: string;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs.usage(`$0 verify`).option('custom-schema', {
		type: 'string',
		normalize: true,
		description: 'Path to a custom schema definition',
		hidden: true,
	});

export const handler: Handler<Argv> = async function handler(argv, { graph, logger }) {
	const { 'custom-schema': customSchema } = argv;

	const dependencyStep = logger.createStep('Validating dependency trees');
	for (const workspace of graph.workspaces) {
		const deps = workspace.dependencies;

		const dependencies = graph.dependencies(workspace.name);

		for (const dependency of dependencies) {
			dependencyStep.log(`Checking ${dependency.name}`);
			for (const [dep, version] of Object.entries(dependency.dependencies)) {
				if (dep in deps) {
					dependencyStep.log(`Checking ${dep}@${deps[dep]} intersects ${version}`);
					if (valid(coerce(version)) && !intersects(version, deps[dep])) {
						dependencyStep.error(
							`\`${dep}@${deps[dep]}\` does not satisfy \`${dep}@${version}\` as required by local dependency \`${dependency.name}\``
						);
					}
				}
			}
		}
	}
	await dependencyStep.end();

	const ajv = new Ajv({ allErrors: true });
	ajv.addMetaSchema(draft7);
	ajvErrors(ajv);

	importSchema(ajv, defaultValidators);

	logger.debug(`Getting custom schema '${customSchema}'`);
	if (customSchema) {
		const schema = require(customSchema);
		importSchema(ajv, schema.default ?? schema);
	}

	const availableSchema = Object.keys(ajv.schemas).filter((key) => key.includes(splitChar));

	for (const workspace of graph.workspaces) {
		const schemaStep = logger.createStep(`Validating ${workspace.name} json files`);
		const relativePath = path.relative(graph.root.location, workspace.location);
		for (const schemaKey of availableSchema) {
			const [locGlob, fileGlob] = schemaKey.split(splitChar);
			if (minimatch(relativePath, locGlob)) {
				const files = glob.sync(fileGlob, { cwd: workspace.location });
				files.forEach((file) => {
					schemaStep.debug(`Validating "${file}" against schema for "${locGlob}/${fileGlob}"`);
					const contents: Record<string, unknown> = require(workspace.resolve(file));
					const validate = ajv.getSchema(schemaKey)!;
					if (!validate(contents)) {
						validate.errors?.forEach((err) => {
							if (err.keyword === 'if') {
								return;
							}
							schemaStep.error(err.message);
						});
					}
				});
			}
		}
		await schemaStep.end();
	}
};

function importSchema(ajv: Ajv, GraphSchemaValidators: GraphSchemaValidators) {
	Object.entries(GraphSchemaValidators).forEach(([locglob, matches]) => {
		Object.entries(matches).forEach(([fileglob, schema]) => {
			ajv.addSchema(schema, `${locglob}${splitChar}${fileglob}`);
		});
	});
}

// This is a zero-width space.
const splitChar = '\u200b';
