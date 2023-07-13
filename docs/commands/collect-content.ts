import path from 'node:path';
import { glob } from 'glob';
import { batch, file, builders, run } from 'onerepo';
import type { Builder, Handler, RunSpec, LogStep } from 'onerepo';
import type { Workspace } from '@onerepo/graph';
import { options } from './typedoc';

export const command = 'collect-content';

export const description = 'Generate docs for the oneRepo monorepo';

export const builder: Builder = (yargs) => builders.withAllInputs(yargs);

export const handler: Handler = async (argv, { graph, logger }) => {
	const { verbosity } = argv;
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

	const generators: Array<RunSpec> = [
		{
			name: 'Generate internal CLI usage',
			cmd: process.argv[1],
			args: ['docgen'],
		},
	];

	const changelogStep = logger.createStep('Getting root changelog');
	await writeChangelog(graph.getByName('onerepo'), docs, changelogStep);
	await changelogStep.end();

	const readmeStep = logger.createStep('Building plugin docs');
	for (const ws of graph.workspaces) {
		const bin = ws.resolve('bin', 'docgen.cjs');
		if (!ws.name.startsWith('@onerepo/plugin-') || !(await file.exists(bin, { step: readmeStep }))) {
			continue;
		}

		const shortName = ws.name.replace('@onerepo/plugin-', '');
		const readme = await file.read(ws.resolve('README.md'), 'r', { step: readmeStep });

		await file.write(
			docs.resolve('src', 'content', 'plugins', `${shortName}.md`),
			`---
title: '${ws.name}'
shortname: '${shortName}'
tool: ${'title' in ws.packageJson ? ws.packageJson.title : shortName}
description: ${ws.description ?? `Official oneRepo plugin for ${shortName}.`}
version: '${ws.version}'
---

${readme}

## Usage

`,
			{ step: readmeStep },
		);

		await writeChangelog(ws, docs, readmeStep);

		const outFile = docs.resolve('src', 'content', 'plugins', `${shortName}.md`);

		generators.push(
			{
				name: `Generate for ${ws.name}`,
				cmd: bin,
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
			},
			{
				name: `Gen typedoc for ${ws.name}`,
				cmd: typedoc,
				args: [
					'--plugin',
					'typedoc-plugin-markdown',
					'--entryFileName',
					`${shortName}.md`,
					...options,
					'--out',
					path.join(typedocTempDir, shortName),
					ws.resolve('src/index.ts'),
				],
				opts: {
					cwd: ws.location,
				},
			},
		);
	}
	await readmeStep.end();

	const core = graph.getByName('core');
	const commands = await glob('*', { cwd: core.resolve('src/core') });

	const coreDocs = logger.createStep('Getting core docs');
	for (const cmd of commands) {
		const outFile = docs.resolve(`src/content/core/${cmd}.md`);
		await file.copy(core.resolve('src/core', cmd, 'README.md'), outFile, { step: coreDocs });

		generators.push({
			name: `Generate for ${cmd}`,
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
				cmd,
			],
			opts: {
				cwd: graph.root.location,
			},
			runDry: true,
		});
	}
	await coreDocs.end();

	await batch(generators);

	const pluginTypedoc = logger.createStep('Writing plugin configs');
	for (const ws of graph.workspaces) {
		const bin = ws.resolve('bin', 'docgen.cjs');
		if (!ws.name.startsWith('@onerepo/plugin-') || !(await file.exists(bin, { step: pluginTypedoc }))) {
			continue;
		}
		const shortName = ws.name.replace('@onerepo/plugin-', '');
		const contents = await file.read(path.join(typedocTempDir, shortName, `${shortName}.md`), 'r', {
			step: pluginTypedoc,
		});
		const sourceFixed = contents
			.replace(/^#+ Returns[^#]+/gm, '')
			.replace(/^#+ Source\n\n\[([a-zA-z]+)\.ts:\d+\]/gm, `**Source:** [${shortName}/$1.ts]`)
			// fix URLs to not poitn to /name.md
			.replace(new RegExp(`${shortName}.md#`, 'g'), '#');

		const splits = sourceFixed.split(/^## ([^\n]+)$/gm);
		const functionIndex = splits.indexOf('Functions') + 1;
		const typeIndex = splits.indexOf('Type Aliases') + 1;
		const functions = functionIndex > 0 ? splits[functionIndex] : '';
		const types = typeIndex > 0 ? splits[typeIndex] : '';

		await file.writeSafe(docs.resolve(`src/content/plugins/${shortName}.md`), `${functions}\n\n${types}`, {
			step: pluginTypedoc,
			sentinel: 'install-typedoc',
		});
	}
	await pluginTypedoc.end();

	const typedocs: Array<RunSpec> = [];
	for (const cmd of commands) {
		typedocs.push({
			name: `Gen typedoc for ${cmd}`,
			cmd: typedoc,
			args: [
				'--plugin',
				'typedoc-plugin-markdown',
				'--entryFileName',
				`${cmd}.md`,
				...options,
				'--out',
				path.join(typedocTempDir, cmd),
				core.resolve('src/core', cmd, 'index.ts'),
			],
			opts: {
				cwd: graph.root.location,
			},
		});
	}

	await batch(typedocs);

	const coreDocsTwo = logger.createStep('Getting core type docs');
	for (const cmd of commands) {
		const contents = await file.read(path.join(typedocTempDir, cmd, `${cmd}.md`), 'r', { step: coreDocsTwo });
		await file.writeSafe(
			docs.resolve(`src/content/core/${cmd}.md`),
			contents
				.replace(/[^]+#+ Type declaration/gm, '')
				.replace(/^#+ Source\n\n\[([a-zA-z]+)\.ts:\d+\]/gm, `**Source:** [${cmd}/$1.ts]`),
			{ step: coreDocsTwo, sentinel: 'usage-typedoc' },
		);
	}
	await coreDocsTwo.end();
};

async function writeChangelog(workspace: Workspace, docs: Workspace, step: LogStep) {
	let changelog = '';
	if (await file.exists(workspace.resolve('CHANGELOG.md'), { step })) {
		changelog = await file.read(workspace.resolve('CHANGELOG.md'), 'r', { step });
	}

	const shortName = workspace.name.replace('@onerepo/', '').replace('plugin-', '');

	await file.write(
		docs.resolve('src', 'content', 'changelogs', `${shortName}.md`),
		`---
title: "${workspace.name} Changelog"
description: ''
---

${changelog.replace(new RegExp(`^# ${workspace.name}`, 'm'), '')}
`,
		{ step },
	);
}
