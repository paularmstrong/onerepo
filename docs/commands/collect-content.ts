import glob from 'glob';
import { batch, file, builders } from 'onerepo';
import type { Builder, Handler, RunSpec } from 'onerepo';

export const command = 'collect-content';

export const description = 'Generate docs for the oneRepo monorepo';

export const builder: Builder = (yargs) => builders.withAllInputs(yargs);

export const handler: Handler = async (argv, { graph, logger }) => {
	const { verbosity } = argv;
	const docs = graph.getByName('docs');

	const generators: Array<RunSpec> = [];

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
title: "${ws.name}"
tool: ${'title' in ws.packageJson ? ws.packageJson.title : shortName}
description: ${ws.description ?? `Official oneRepo plugin for ${shortName}.`}
---

${readme}

## Usage
`,
			{ step: readmeStep }
		);

		let changelog = '';
		if (await file.exists(ws.resolve('CHANGELOG.md'), { step: readmeStep })) {
			changelog = await file.read(ws.resolve('CHANGELOG.md'), 'r', { step: readmeStep });
		}

		await file.write(
			docs.resolve('src', 'content', 'changelogs', `${shortName}.md`),
			`---
title: "${ws.name} Changelog"
description: ''
---

${changelog.replace(new RegExp(`^# ${ws.name}`, 'm'), '')}
`,
			{ step: readmeStep }
		);
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
	const commands = glob.sync('*', { cwd: core.resolve('src/core') });
	const bin = core.resolve('bin', 'docgen.cjs');

	const findStep = logger.createStep('Determining workspaces');
	for (const cmd of commands) {
		const outFile = docs.resolve('usage', `${cmd}.md`);

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
	await findStep.end();

	await batch(generators);
};
