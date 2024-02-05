import { glob } from 'glob';
import yaml from 'js-yaml';
import { read, write } from '@onerepo/file';
import type { Builder, Handler } from '@onerepo/yargs';
import { batch } from '@onerepo/subprocess';
import { getFilename } from './utils/filename';

export const command = ['migrate'];

export const description = 'Migrate from Changesets to oneRepo changes.';

type Argv = {
	filenames: 'hash' | 'human';
};

export const builder: Builder<Argv> = (yargs) =>
	yargs.usage(`$0 ${command[0]}`).option('filenames', {
		type: 'string',
		choices: ['hash', 'human'] as const,
		default: 'hash' as const,
		description:
			"Filename generation strategy for change files. If `'human'`, ensure you have the `human-id` package installed.",
		hidden: true,
	});

export const handler: Handler<Argv> = async (argv, { graph, logger }) => {
	const { filenames: filenameMethod } = argv;
	const setup = logger.createStep('Gathering information');

	const changesetFiles = await glob('.changeset/*.md', { cwd: graph.root.location });

	const changesetFileContents = await batch(
		changesetFiles.map(
			(filepath) => () =>
				read(graph.root.resolve(filepath), 'r', { step: setup }).then((contents) => {
					const matches = contents.match(/^---\n(.*)\n---\n+(.*)/ms);
					if (!matches) {
						throw new Error(`File is not valid changeset: ${filepath}`);
					}
					return [matches[1], matches[2]];
				}),
		),
	);

	await setup.end();

	for (const index in changesetFiles) {
		const changesetFilename = changesetFiles[index];
		const step = logger.createStep(`Migrating ${changesetFilename}`);
		const fileContents = changesetFileContents[index];
		if (fileContents instanceof Error) {
			step.error(fileContents);
			await step.end();
			continue;
		}
		const [frontmatter, contents] = fileContents as [string, string];
		const info = yaml.load(frontmatter) as Record<string, string>;
		const workspaces = graph.getAllByName(Object.keys(info));
		const filename = await getFilename(graph, contents, filenameMethod, { step });
		for (const ws of workspaces) {
			if (ws.private) {
				step.warn(`Not adding changeset "${changesetFilename}" to private workspace ${ws.name}`);
				continue;
			}
			await write(
				ws.resolve(`.changes/${index.toString().padStart(3, '0')}-${filename}.md`),
				`---
type: ${info[ws.name]}
---

${contents}`,
				{ step },
			);
		}
		await step.end();
	}

	logger.info(`It is now safe to delete the Changesets directory "${graph.root.resolve('.changesets')}".`);
};
