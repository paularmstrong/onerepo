import { createRequire } from 'node:module';
import cjson from 'cjson';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
import yaml from 'js-yaml';
import semver from 'semver';
import { read } from '@onerepo/file';
// NB: important to keep extension because AJV does not properly declare this export
import Ajv from 'ajv/dist/2019.js';
import type { AnySchema } from 'ajv';
import ajvErrors from 'ajv-errors';
import type { Builder, Handler } from '@onerepo/yargs';
import type { Graph, Workspace } from '@onerepo/graph';
import { defaultValidators } from '../schema';
import type { GraphSchemaValidators } from '../schema';

export const command = 'verify';

export const description = 'Verify the integrity of the repo’s dependency graph and files in each workspace.';

type Argv = {
	'custom-schema'?: string;
	dependencies: 'loose' | 'off';
};

export const builder: Builder<Argv> = (yargs) =>
	yargs
		.usage(`$0 verify`)
		.epilogue(
			`Dependencies across workspaces can be validated using one of the various methods:

- \`off\`: No validation will occur. Everything goes.
- \`loose\`: Reused third-party dependencies will be required to have semantic version overlap across unique branches of the Graph.
`
		)
		.option('custom-schema', {
			type: 'string',
			normalize: true,
			description: 'Path to a custom JSON schema definition',
			hidden: true,
		})
		.option('dependencies', {
			type: 'string',
			description: 'Dependency overlap validation method.',
			choices: ['loose', 'off'],
			default: 'loose',
		} as const);

export const handler: Handler<Argv> = async function handler(argv, { graph, logger }) {
	const { 'custom-schema': customSchema, dependencies: validationType } = argv;

	if (validationType !== 'off') {
		const dependencyStep = logger.createStep('Validating dependency trees');
		for (const workspace of graph.workspaces) {
			const deps = { ...workspace.dependencies, ...workspace.devDependencies, ...workspace.peerDependencies };

			const dependencies = graph.dependencies(workspace.name);
			const errs: Array<string> = [];

			for (const dependency of dependencies) {
				dependencyStep.log(`Checking ${dependency.name}`);
				for (const [dep, version] of Object.entries({
					...dependency.dependencies,
					...dependency.devDependencies,
					...dependency.peerDependencies,
				})) {
					if (dep in deps) {
						dependencyStep.log(`Checking ${dep}@${deps[dep]} intersects ${version}`);
						if (version.startsWith('workspace:') || deps[dep].startsWith('workspace:')) {
							continue;
						}
						if (semver.valid(semver.coerce(version)) && !semver.intersects(version, deps[dep])) {
							errs.push(
								`depends on "${dep}@${deps[dep]}", but other dependency "${dependency.name}" requires non-intersecting version "${version}"`
							);
						}
					}
				}
			}
			if (errs.length) {
				dependencyStep.error(`Version mismatches found in "${workspace.name}"`);
				for (const err of errs) {
					dependencyStep.error(` ↳ ${err}`);
				}
			}
		}
		await dependencyStep.end();
	}

	// esbuild cannot import json files correctly unless bundling externals
	// Just as well, AJV doesn't properly document its exported files for ESM verification
	// So for a myriad of reasons, this needs to be a runtime requires
	const require = createRequire(import.meta?.url ?? __dirname);
	const draft7 = require('ajv/dist/refs/json-schema-draft-07.json');

	const ajv = new Ajv({ allErrors: true });
	ajv.addMetaSchema(draft7);
	ajvErrors(ajv);

	let availableSchema = importSchema({}, defaultValidators);

	logger.debug(`Getting custom schema '${customSchema}'`);
	if (customSchema) {
		const custom = require(customSchema);
		availableSchema = importSchema(availableSchema, custom.default ?? custom);
	}

	// const availableSchema = Object.keys(ajv.schemas).filter((key) => key.includes(splitChar));

	for (const workspace of graph.workspaces) {
		const relativePath = graph.root.relative(workspace.location);

		// Build a map so the log output is nicer if there are multiple schema for the same file
		const map: Record<string, Array<string>> = {};
		for (const schemaKey of Object.keys(availableSchema)) {
			const [locGlob, fileGlob] = schemaKey.split(splitChar);
			// Check if this schema applies to this workspace
			if (minimatch(relativePath, locGlob)) {
				// get all files according to the schema in the workspace
				const files = await glob(fileGlob, { cwd: workspace.location });
				for (const file of files) {
					if (!(file in map)) {
						map[file] = [];
					}
					map[file].push(schemaKey);
				}
			}
		}

		const schemaStep = logger.createStep(`Validating ${workspace.name}`);
		for (const [file, fileSchema] of Object.entries(map)) {
			for (const schemaKey of fileSchema) {
				schemaStep.debug(`Using schema for "${schemaKey}"`);
				let contents: Record<string, unknown> = {};
				if (file.endsWith('json')) {
					const rawContents: string = await read(workspace.resolve(file), 'r', { step: schemaStep });
					contents = cjson.parse(rawContents);
				} else if (minimatch(file, '**/*.{js,ts,cjs,mjs}')) {
					contents = require(workspace.resolve(file));
				} else if (minimatch(file, '**/*.{yml,yaml}')) {
					const rawContents: string = await read(workspace.resolve(file), 'r', { step: schemaStep });
					contents = yaml.load(rawContents) as Record<string, unknown>;
				} else {
					schemaStep.error(`Unable to read file with unknown type: ${workspace.resolve(file)}`);
				}

				const schema = availableSchema[schemaKey];
				const valid = ajv.validate(typeof schema === 'function' ? schema(workspace, graph) : schema, contents)!;
				if (!valid) {
					schemaStep.error(`Errors in ${workspace.resolve(file)}:`);
					ajv.errors?.forEach((err) => {
						if (err.keyword === 'if') {
							return;
						}
						if (process.env.NODE_ENV === 'test') {
							throw new Error(err.message);
						}

						schemaStep.error(`  ↳ ${err.message}`);
					});
				}
			}
		}
		await schemaStep.end();
	}
};

function importSchema(
	ajv: Record<string, AnySchema | ((ws: Workspace, graph: Graph) => AnySchema)>,
	GraphSchemaValidators: GraphSchemaValidators
) {
	Object.entries(GraphSchemaValidators).forEach(([locglob, matches]) => {
		Object.entries(matches).forEach(([fileglob, schema]) => {
			ajv[`${locglob}${splitChar}${fileglob}`] = schema;
		});
	});

	return ajv;
}

// This is a zero-width space.
const splitChar = '\u200b';
