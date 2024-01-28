import initJiti from 'jiti';
import cjson from 'cjson';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
import yaml from 'js-yaml';
import { read } from '@onerepo/file';
// NB: important to keep extension because AJV does not properly declare this export
import Ajv from 'ajv/dist/2019.js';
import type { AnySchema } from 'ajv';
import ajvErrors from 'ajv-errors';
import type { Builder, Handler } from '@onerepo/yargs';
import type { Graph, Workspace } from '@onerepo/graph';
import { verifyDependencies } from '../dependencies/utils/verify-dependencies';
import { epilogue } from '../dependencies/verify';
import { defaultValidators } from './schema';
import type { GraphSchemaValidators } from './schema';

export const command = 'verify';

export const description = 'Verify the integrity of the repo’s dependency Graph and files in each Workspace.';

type Argv = {
	'custom-schema'?: string;
	mode: 'strict' | 'loose' | 'off';
};

export const builder: Builder<Argv> = (yargs) =>
	yargs
		.usage(`$0 verify`)
		.epilogue(
			'This command will first validate dependencies across Workspace Graph trees using the given `--mode` as well as Workspace configuration file integrity using the repo’s defined JSON schema validators.',
		)
		.epilogue(epilogue)
		.option('custom-schema', {
			type: 'string',
			normalize: true,
			description: 'Path to a custom JSON schema definition',
			hidden: true,
		})
		.option('mode', {
			type: 'string',
			description: 'Dependency overlap validation method.',
			choices: ['strict', 'loose', 'off'] as const,
			default: 'loose' as const,
		});

export const handler: Handler<Argv> = async function handler(argv, { graph, logger }) {
	const { 'custom-schema': customSchema, mode } = argv;

	if (mode !== 'off') {
		await verifyDependencies(mode, graph, graph.workspaces, logger);
	}

	// esbuild cannot import json files correctly unless bundling externals
	// Just as well, AJV doesn't properly document its exported files for ESM verification
	// So for a myriad of reasons, this needs to be a runtime requires
	const require = initJiti(import.meta.url, { interopDefault: true });
	const draft7 = require('ajv/dist/refs/json-schema-draft-07.json');

	const ajv = new Ajv({ allErrors: true });
	ajv.addMetaSchema(draft7);
	ajvErrors(ajv);
	ajv.addVocabulary(['$required']);

	let availableSchema = importSchema({}, defaultValidators);

	logger.debug(`Getting custom schema '${customSchema}'`);
	if (customSchema) {
		const custom = require(customSchema);
		availableSchema = importSchema(availableSchema, custom.default ?? custom);
	}

	for (const workspace of graph.workspaces) {
		const schemaStep = logger.createStep(`Validating ${workspace.name}`);
		const relativePath = graph.root.relative(workspace.location);

		// Build a map so the log output is nicer if there are multiple schema for the same file
		const map: Record<string, Array<string>> = {};
		for (const schemaKey of Object.keys(availableSchema)) {
			const rawSchema = availableSchema[schemaKey];
			const schema = typeof rawSchema === 'function' ? rawSchema(workspace, graph) : rawSchema;
			const required = schema.$required;
			const [locGlob, fileGlob] = schemaKey.split(splitChar);
			// Check if this schema applies to this workspace
			if (minimatch(relativePath, locGlob)) {
				// get all files according to the schema in the workspace
				const files = await glob(fileGlob, { cwd: workspace.location });
				if (required && files.length === 0) {
					const msg = `❓ Missing required file matching pattern "${schemaKey.split(splitChar)[1]}"`;
					schemaStep.error(msg);
					writeGithubError(msg);
				}
				for (const file of files) {
					if (!(file in map)) {
						map[file] = [];
					}
					map[file].push(schemaKey);
				}
			}
		}

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
						schemaStep.error(`  ↳ ${err.message}`);
						writeGithubError(err.message, graph.root.relative(workspace.resolve(file)));
					});
				}
			}
		}
		await schemaStep.end();
	}
};

function importSchema(
	ajv: Record<string, ExtendedSchema | ((ws: Workspace, graph: Graph) => ExtendedSchema)>,
	GraphSchemaValidators: GraphSchemaValidators,
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

type ExtendedSchema = AnySchema & { $required?: boolean };

function writeGithubError(message: string | undefined, filename?: string) {
	if (process.env.GITHUB_RUN_ID) {
		process.stderr.write(`::error${filename ? ` file=${filename}` : ''}::${message}\n`);
	}
}
