import { glob } from 'glob';
import { batch, file, builders } from 'onerepo';
import type { Builder, Handler, RunSpec, LogStep } from 'onerepo';
import type { Workspace } from '@onerepo/graph';

export const command = 'collect-content';

export const description = 'Generate docs for the oneRepo monorepo';

export const builder: Builder = (yargs) => builders.withAllInputs(yargs);

export const handler: Handler = async (argv, { graph, logger }) => {
	const { verbosity } = argv;
	const docs = graph.getByName('docs');

	const generators: Array<RunSpec> = [];

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
			{ step: readmeStep }
		);

		await writeChangelog(ws, docs, readmeStep);

		const outFile = docs.resolve('src', 'content', 'plugins', `${shortName}.md`);

		generators.push({
			name: `Generate for ${ws.name}`,
			cmd: process.argv[1],
			args: [
				'docgen',
				'--bin',
				bin,
				'--format',
				'markdown',
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
	}
	await readmeStep.end();

	const core = graph.getByName('core');
	const commands = await glob('*', { cwd: core.resolve('src/core') });
	const bin = core.resolve('bin', 'docgen.cjs');

	const coreDocs = logger.createStep('Getting core docs');
	for (const cmd of commands) {
		const outFile = docs.resolve(`src/content/core/${cmd}.md`);
		await file.copy(core.resolve('src/core', cmd, 'README.md'), outFile, { step: coreDocs });

		generators.push({
			name: `Generate for ${cmd}`,
			cmd: process.argv[1],
			args: [
				'docgen',
				'--bin',
				bin,
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
		{ step }
	);
}
