import pc from 'picocolors';
import inquirer from 'inquirer';
import changesetWrite from '@changesets/write';
import { updateIndex } from '@onerepo/git';
import { builders } from '@onerepo/builders';
import type { Builder, Handler } from '@onerepo/yargs';

// Changesets does not properly document its ESM exports in package.json, so this gets funky
const writeChangeset = ('default' in changesetWrite ? changesetWrite.default : changesetWrite) as typeof changesetWrite;

export const command = ['$0', 'add'];

export const description = 'Add a changeset';

type Argv = {
	add: boolean;
	type?: 'major' | 'minor' | 'patch';
} & builders.WithAllInputs;

export const builder: Builder<Argv> = (yargs) =>
	builders
		.withAllInputs(yargs)
		.usage('$0 add [options]')
		.option('add', {
			description: 'Add the modified `package.json` files to the git stage for committing.',
			type: 'boolean',
			default: true,
		})
		.option('type', {
			type: 'string',
			choices: ['major', 'minor', 'patch'] as const,
			description:
				'Provide a semantic version bump type. If not given, a prompt will guide you through selecting the appropriate type.',
		});

export const handler: Handler<Argv> = async (argv, { getWorkspaces, graph, logger }) => {
	const { add, type } = argv;
	logger.pause();

	const workspaces = await getWorkspaces();
	const choices = workspaces.reduce((memo, ws) => {
		if (ws.private) {
			return memo;
		}
		memo.push(ws.name);
		return memo;
	}, [] as Array<string>);

	const { chosen, major, minor, patch } = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'chosen',
			prefix: '📦',
			message: `What workspaces would you like to add a changeset for?
${pc.dim(
	'  Keep in mind that each changeset entry should be related to a single change. If you have made multiple changes, please run this command once for each change.'
)}
 `,
			choices: [
				...choices,
				new inquirer.Separator('⎯'.repeat(20)),
				{ name: 'More…', value: '_OTHER_' },
				new inquirer.Separator('⎯'.repeat(20)),
			],
			pageSize: choices.length + 2,
		},
		{
			type: 'checkbox',
			name: 'other',
			prefix: '📦',
			message: `What ${pc.bold('other')} workspaces would you like to add a changeset for as well?`,
			choices: graph.workspaces.map((ws) => ws.name).sort(),
			when: ({ chosen }) => chosen.includes('_OTHER_'),
			filter: (input, answers) => {
				answers.chosen.splice(answers.chosen.indexOf('_OTHER_'), 1);
				answers.chosen.push(...input.filter((name: string) => !answers.chosen.includes(name)));
			},
			pageSize: Math.min(12, graph.workspaces.length),
		},
		{
			type: 'confirm',
			name: 'patch',
			default: false,
			prefix: '🐞',
			message: `Are ${pc.cyan(pc.bold('bug fixes'))} for existing features the ${pc.bold('only')} changes?`,
			when: (state) => !type && state.chosen.length,
		},
		{
			type: 'confirm',
			name: 'minor',
			default: false,
			prefix: '🎁',
			message: `Are there ${pc.green(
				pc.bold('new features')
			)} that can be opted into that do not require modifications to existing integrations?`,
			when: (state) => !type && state.chosen.length && !state.patch,
		},
		{
			type: 'confirm',
			name: 'major',
			default: false,
			prefix: '🚀',
			message: `Are there any ${pc.red(pc.bold('breaking changes'))} that require developers to modify their code?`,
			when: (state) => !type && state.chosen.length && !state.patch && !state.minor,
		},
	]);

	if (!chosen.length) {
		logger.error('No workspaces were chosen for changesets. Please try again.');
		return;
	}

	const semverType: Argv['type'] | null = type ?? (major ? 'major' : minor ? 'minor' : patch ? 'patch' : null);

	if (!semverType) {
		logger.error('No semantic version type chosen. Please re-run and try again.');
		return;
	}

	logger.debug({ chosen, semverType });

	const { contents } = await inquirer.prompt([
		{
			type: 'editor',
			name: 'contents',
			message: `Add a short changelog entry to explain the changes for ${chosen.join(', ')}.\n `,
			waitForUserInput: true,
		},
	]);

	logger.unpause();

	const writeStep = logger.createStep('Write changeset');
	const uniqueId = await writeChangeset(
		{
			summary: contents,
			releases: chosen.map((name: string) => ({ name, type: semverType })),
		},
		graph.root.location
	);
	await writeStep.end();

	if (add) {
		await updateIndex(graph.root.resolve('.changeset', `${uniqueId}.md`));
	}
};
