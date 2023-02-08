import pc from 'picocolors';
import inquirer from 'inquirer';
import write from '@changesets/write';
import { withAllInputs } from '@onerepo/cli';
import type { Builder, Handler, WithAllInputs } from '@onerepo/cli';

export const command = ['$0', 'add'];

export const description = 'Add a changeset';

type Argv = {
	type?: 'major' | 'minor' | 'patch';
} & WithAllInputs;

export const builder: Builder<Argv> = (yargs) =>
	withAllInputs(yargs).option('type', {
		type: 'string',
		choices: ['major', 'minor', 'patch'] as const,
		description:
			'Provide a semantic version bump type. If not given, a prompt will guide you through selecting the appropriate type.',
	});

export const handler: Handler<Argv> = async (argv, { getWorkspaces, graph, logger }) => {
	const { type } = argv;
	logger.inherit = true;

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
	'  Keep in mind that each changeset should be related to a single change. If you have made multiple changes, please run this command once for each change.'
)}
 `,
			choices,
			pageSize: choices.length,
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

	logger.inherit = false;

	const writeStep = logger.createStep('Write changeset');
	await write(
		{
			summary: contents,
			releases: chosen.map((name: string) => ({ name, type: semverType })),
		},
		graph.root.location
	);
	await writeStep.end();
};
