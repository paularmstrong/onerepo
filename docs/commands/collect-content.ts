import path from 'node:path';
import { glob } from 'glob';
import { batch, file, builders, run, git } from 'onerepo';
import type { Builder, Handler, RunSpec } from 'onerepo';

export const command = 'collect-content';

export const description = 'Generate docs for the oneRepo monorepo';

type Argv = {
	add: boolean;
};

export const builder: Builder<Argv> = (yargs) =>
	builders.withAllInputs(yargs).option('add', {
		type: 'boolean',
		description: 'Add files to the git index',
		default: false,
	});

export const handler: Handler<Argv> = async (argv, { getWorkspaces, graph, logger }) => {
	const { $0, add, verbosity } = argv;
	const docs = graph.getByName('docs');

	const [typedoc] = await run({
		name: 'Get bin',
		cmd: 'yarn',
		args: ['bin', 'typedoc'],
		opts: {
			cwd: docs.location,
		},
		runDry: true,
	});
	const typedocTempDir = await file.makeTempDir('typedoc');

	await run({
		name: 'Update TSC prebuild',
		cmd: $0,
		args: ['tsc'],
	});

	const generators: Array<RunSpec> = [
		{
			name: 'Generate internal CLI usage',
			cmd: process.argv[1],
			args: ['docgen'],
		},
	];

	const copyStep = logger.createStep('Copy project files');
	const projectFiles = { 'CODE_OF_CONDUCT.md': 'code-of-conduct.mdx', 'CONTRIBUTING.md': 'contributing.mdx' };
	for (const [original, doc] of Object.entries(projectFiles)) {
		const contents = await file.read(graph.root.resolve(original), 'r', { step: copyStep });
		await file.writeSafe(docs.resolve('src/content/docs/project', doc), contents.replace(/# [^\n]+\n\n/m, ''), {
			step: copyStep,
			sign: true,
		});
	}
	await copyStep.end();

	const workspaces = await getWorkspaces();

	const pluginStep = logger.createStep('Building plugin docs');
	for (const ws of workspaces) {
		if (!ws.name.startsWith('@onerepo/plugin-')) {
			continue;
		}

		const shortName = ws.name.replace('@onerepo/plugin-', '');
		const outFile = docs.resolve('src/content/docs/plugins', `${shortName}.mdx`);

		const contents = await file.read(outFile, 'r', { step: pluginStep });

		await file.write(
			outFile,
			contents.replace(/version: (?:[^\n]+)/, () => `version: ${ws.version}`),
			{ step: pluginStep },
		);

		generators.push({
			name: `Docgen for ${ws.name}`,
			cmd: process.argv[1],
			args: [
				'docgen',
				'--format',
				'markdown',
				'--heading-level',
				'3',
				'--out-file',
				outFile,
				'--out-workspace',
				'docs',
				`-${'v'.repeat(verbosity)}`,
				'--safe-write',
				'--command',
				shortName,
			],
		});

		generators.push({
			name: `Typedoc for ${ws.name}`,
			cmd: typedoc,
			args: [
				'--plugin',
				'typedoc-plugin-markdown',
				'--useCodeBlocks',
				'true',
				'--entryFileName',
				`${shortName}.md`,
				'--options',
				docs.resolve('typedoc.cjs'),
				'--out',
				path.join(typedocTempDir, shortName),
				ws.resolve('src/index.ts'),
			],
			opts: {
				cwd: ws.location,
			},
		});
	}
	await pluginStep.end();

	if (workspaces.includes(graph.getByName('onerepo'))) {
		const core = graph.getByName('onerepo');
		const commands = await glob('*', { cwd: core.resolve('src/core') });

		const coreDocs = logger.createStep('Getting core docs');
		for (const cmd of commands) {
			const outFile = docs.resolve(`src/content/docs/core/${cmd}.mdx`);

			generators.push({
				name: `Docgen for ${cmd}`,
				cmd: process.argv[1],
				args: [
					'docgen',
					'--use-defaults',
					'--format',
					'markdown',
					'--heading-level',
					'3',
					'--out-file',
					outFile,
					'--out-workspace',
					'docs',
					`-${'v'.repeat(verbosity)}`,
					'--safe-write',
					'--command',
					cmd,
				],
				opts: {
					cwd: graph.root.location,
				},
				runDry: true,
			});
		}
		await coreDocs.end();

		const configTypes = [
			['root', core.resolve('src/types/config-root.ts'), await file.makeTempDir('root')],
			['workspace', core.resolve('src/types/config-workspace.ts'), await file.makeTempDir('workspace')],
		];
		for (const [name, loc, tmpDir] of configTypes) {
			generators.push({
				name: `Typedoc for ${name} config`,
				cmd: typedoc,
				args: [
					'--plugin',
					'typedoc-plugin-markdown',
					'--useCodeBlocks',
					'false',
					'--sort',
					'required-first',
					'--sort',
					'source-order',
					'--typeDeclarationFormat',
					'list',
					'--expandObjects',
					'false',
					'--entryFileName',
					`${name}.md`,
					'--options',
					docs.resolve('typedoc.cjs'),
					'--out',
					tmpDir,
					loc,
				],
				opts: {
					cwd: graph.root.location,
				},
			});
		}

		await batch(generators);

		const pluginTypedoc = logger.createStep('Writing plugin configs');
		for (const ws of workspaces) {
			if (!ws.name.startsWith('@onerepo/plugin-')) {
				continue;
			}
			const shortName = ws.name.replace('@onerepo/plugin-', '');
			const contents = await file.read(path.join(typedocTempDir, shortName, `${shortName}.md`), 'r', {
				step: pluginTypedoc,
			});
			const sourceFixed = contents
				.replace(/^#+ Returns[^#]+/gm, '')
				.replace(/^#+ Source\n\n[^\n]+/gm, '')
				.replace(/^#+ Defined in\n\n[^\n]+/gm, '')
				.replace(/\n\n#+ Default\n\n([^\n]+)/gm, '\n- **Default:** $1\n')
				// fix URLs to not point to /name.md
				.replace(new RegExp(`${shortName}.md#`, 'g'), '#');

			const splits = sourceFixed.split(/^## ([^\n]+)$/gm);
			const functionIndex = splits.indexOf('Functions') + 1;
			const typeIndex = splits.indexOf('Type Aliases') + 1;
			const functions = functionIndex > 0 ? splits[functionIndex] : '';
			const types = typeIndex > 0 ? splits[typeIndex] : '';

			await file.writeSafe(docs.resolve(`src/content/docs/plugins/${shortName}.mdx`), `${functions}\n\n${types}`, {
				step: pluginTypedoc,
				sentinel: 'install-typedoc',
				sign: true,
			});
		}
		await pluginTypedoc.end();

		const coreDocsTwo = logger.createStep('Getting core type docs');
		for (const [name, , tmpDir] of configTypes) {
			const contents = await file.read(path.join(tmpDir, `${name}.md`), 'r', { step: coreDocsTwo });
			await file.writeSafe(
				docs.resolve(`src/content/docs/docs/config.mdx`),
				contents
					.replace(/#+ Config[.\n]*/, '')
					.replace(/#+ Type parameters[.\n]*/, '')
					.replace(/#+ Type declaration[.\n]*/, '')
					.replace(/^##/gm, '#')
					.replace(/^## /gm, '### ')
					.replace(/^#+ Source\n\n[^\n]+/gm, '')
					.replace(/\n\n#+ Default\n\n([^\n]+)/gm, '\n- **Default:** $1\n')
					.replace(/^> \*\*[^:]+: /gm, '- **Type:** '),
				{ step: coreDocsTwo, sentinel: `usage-typedoc-${name}`, sign: true },
			);
		}
		await coreDocsTwo.end();

		if (add) {
			await git.updateIndex(docs.resolve('src/content/docs/core'));
			await git.updateIndex(docs.resolve('src/content/docs/plugins'));
		}
	}
};
