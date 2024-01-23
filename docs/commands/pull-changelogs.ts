import { file, builders, git } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = ['changelogs', 'pull-changelogs'];

export const description = 'Update changelogs from source files';

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
	const { add } = argv;
	const docs = graph.getByName('docs');

	const collectStep = logger.createStep('Collect changelogs');
	const workspaces = await getWorkspaces({ step: collectStep });
	const changelogs: Record<string, string> = {};
	for (const ws of workspaces) {
		if (
			ws.private ||
			!(ws.name.startsWith('onerepo') && ws.name.startsWith('@onerepo')) ||
			!(await file.exists(ws.resolve('CHANGELOG.md'), { step: collectStep }))
		) {
			continue;
		}
		const changelog = await file.read(ws.resolve('CHANGELOG.md'), 'r', { step: collectStep });
		changelogs[ws.name] = changelog;
	}
	await collectStep.end();

	const writeStep = logger.createStep('Write changelogs');

	for (const [name, doc] of Object.entries(changelogs)) {
		const output = docs.resolve(`src/content/docs/changelogs/${name === 'onerepo' ? 'index' : name}.mdx`);
		const ws = graph.getByName(name);
		if (!(await file.exists(output, { step: writeStep }))) {
			await file.write(
				output,
				`---
title: '${ws.name} changelog'
sidebar:
  label: ${ws.aliases[0] ?? ws.name}
  attrs:
    target: _blank
tableOfContents:
  maxHeadingLevel: 2
---
`,
				{ step: writeStep },
			);
		}
		await file.writeSafe(output, doc, {
			step: writeStep,
			sign: true,
		});
	}
	await writeStep.end();

	if (add) {
		await git.updateIndex(docs.resolve('src/content/docs/changelogs/*'));
	}
};
