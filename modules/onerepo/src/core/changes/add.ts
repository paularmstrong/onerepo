import inquirer from 'inquirer';
import pc from 'picocolors';
import { glob } from 'glob';
import { write } from '@onerepo/file';
import { getModifiedFiles, updateIndex } from '@onerepo/git';
import type { Builder, Handler } from '@onerepo/yargs';
import type { WithAffected, WithWorkspaces } from '@onerepo/builders';
import { withAffected, withWorkspaces } from '@onerepo/builders';
import type { ReleaseType } from 'semver';
import { getFilename } from './utils/filename';

export const command = ['add', '$0'];

export const description = 'Add changesets for modified Workspaces.';

type Argv = WithAffected &
	WithWorkspaces & {
		add: boolean;
		filenames: 'hash' | 'human';
		prompts: 'guided' | 'semver';
		type?: ReleaseType;
	};

export const builder: Builder<Argv> = (yargs) =>
	withAffected(withWorkspaces(yargs))
		.usage(`$0 ${command[0]} [options...]`)
		.option('add', {
			description: 'Add the modified `package.json` files to the git stage for committing.',
			type: 'boolean',
			default: true,
		})
		.option('type', {
			type: 'string',
			choices: ['major', 'minor', 'patch'] as Array<ReleaseType>,
			description:
				'Provide a semantic version bump type. If not given, a prompt will guide you through selecting the appropriate type.',
		})
		.option('filenames', {
			type: 'string',
			choices: ['hash', 'human'] as const,
			default: 'hash' as const,
			description:
				"Filename generation strategy for change files. If `'human'`, ensure you have the `human-id` package installed.",
			hidden: true,
		})
		.option('prompts', {
			type: 'string',
			choices: ['guided', 'semver'] as const,
			default: 'guided' as const,
			description: 'Change the prompt question & answer style when adding change entries.',
			hidden: true,
		})
		.hide('staged')
		.epilogue(
			`This command will prompt for appropriate Workspace(s), prompt for the release type, and request a descriptive change entry. Once all information has been entered, a change entry file will be created in the appropriate Workspace(s). Be sure to commit these files – they will be used later when you are ready to version and publish Workspaces to the registry for use outside of the Monorepo.`,
		);

export const handler: Handler<Argv> = async (argv, { getWorkspaces, graph, logger }) => {
	const { add, filenames: filenameMethod, prompts, type: inputType } = argv;

	const setup = logger.createStep('Gathering information');

	const workspaces = await getWorkspaces({ step: setup });
	const modifiedFiles = await getModifiedFiles({}, { step: setup });
	const currentlyModified = graph.getAllByLocation(modifiedFiles.map((f) => graph.root.resolve(f)));

	const choices: Array<inquirer.Separator | { name?: string; value: string }> = [
		...currentlyModified.filter((ws) => !ws.private).map((ws) => ({ value: ws.name })),
	];
	if (choices.length) {
		choices.unshift(
			new inquirer.Separator(`\n↗ Modified Workspaces\n${'⎯'.repeat(Math.min(60, process.stdout.columns))}`),
		);
	}

	const affected = workspaces.filter((ws) => !ws.private && !currentlyModified.includes(ws));
	if (affected.length) {
		choices.push(
			new inquirer.Separator(`\n→ Affected Workspaces\n${'⎯'.repeat(Math.min(60, process.stdout.columns))}`),
			...affected.map((ws) => ({ value: ws.name })),
		);
	}
	const publishable = graph.workspaces.filter(
		(ws) => !ws.private && !affected.includes(ws) && !currentlyModified.includes(ws),
	);
	if (publishable.length) {
		choices.push(
			new inquirer.Separator(`\n↪ Other Workspaces\n${'⎯'.repeat(Math.min(60, process.stdout.columns))}`),
			...publishable.map((ws) => ({ value: ws.name })),
		);
	}

	await setup.end();
	logger.pause();

	const { chosen } = await inquirer.prompt([
		{
			name: 'chosen',
			type: 'checkbox',
			prefix: '📦',
			message: `What Workspace(s) would you like to add a change entry to?
${pc.dim(
	'\n   Keep in mind that each changeset entry should be related to a single change. If you have made multiple changes, please run this command once for each change.\n',
)}
`,
			choices,
			pageSize: Math.min(choices.length + 2, 12),
			validate: (input) => {
				if (!input.length) {
					return `${pc.bold(pc.red('Error:'))} Please select at least one Workspace.`;
				}
				return true;
			},
		},
	]);

	let type: false | string | undefined = inputType;
	if (!type) {
		if (prompts === 'guided') {
			type = await guidedReleaseTypePrompt();
		} else if (prompts === 'semver') {
			type = await semverReleaseTypePrompt();
		}
		if (!type) {
			logger.error('No semantic version type chosen. Please re-run and try again.');
			return;
		}
	}

	const { contents } = await inquirer.prompt([
		{
			name: 'contents',
			type: 'editor',
			message: `Add a short changelog entry to explain the changes for ${chosen.join(', ')}.\n `,
			waitForUserInput: true,
			validate: (input) => {
				if (!input.trim()) {
					return `${pc.bold(
						pc.red('Error:'),
					)} Entry is empty. Please enter a description of the changes and save the opened file to continue.`;
				}
				return true;
			},
		},
	]);

	logger.unpause();

	const writeStep = logger.createStep('Write change entries');
	const filename = await getFilename(graph, contents, filenameMethod, { step: writeStep });
	const files: Array<string> = [];
	for (const workspaceName of chosen as Array<string>) {
		const workspace = graph.getByName(workspaceName);
		const currentFiles = await glob('*.md', { cwd: workspace.resolve('.changes') });
		const highestIndex = Math.max(
			-1,
			...currentFiles.reduce((memo, filename) => {
				const matches = filename.match(/^(\d+)-/);
				if (matches && matches.length > 1) {
					memo.push(parseInt(matches[1], 10));
				}
				return memo;
			}, [] as Array<number>),
		);
		const changesetFile = workspace.resolve(
			'.changes',
			`${(highestIndex + 1).toString().padStart(3, '0')}-${filename}.md`,
		);
		files.push(changesetFile);
		await write(
			changesetFile,
			`---
type: ${type}
---

${contents}`,
			{ step: writeStep },
		);
	}
	await writeStep.end();

	if (add) {
		await updateIndex(files);
	}
};

const typePrompts = () => ({
	patch: `🐞 Are ${pc.cyan(pc.bold('bug fixes'))} for existing features the ${pc.bold('only')} changes?`,
	minor: `🎁 Are there ${pc.green(
		pc.bold('new features'),
	)} that can be opted into that do not require modifications to existing integrations?`,
	major: `🚀 Are there any ${pc.red(pc.bold('breaking changes'))} that require developers to modify their code?`,
});

async function guidedReleaseTypePrompt() {
	let type: false | string | undefined;
	for (const [versionType, message] of Object.entries(typePrompts())) {
		type = await inquirer
			.prompt([
				{
					name: 'confirm',
					type: 'confirm',
					default: false,
					message,
				},
			])
			.then(({ confirm }) => (confirm ? versionType : undefined));
		if (type) {
			break;
		}
	}
	return type;
}

async function semverReleaseTypePrompt() {
	const { type } = await inquirer.prompt([
		{
			type: 'list',
			message: 'What type of release do these changes require?',
			choices: [
				{ value: 'patch', name: `🐞 Patch ${pc.dim('(0.0.')}${pc.bold(pc.green('X'))}${pc.dim(')')}` },
				{ value: 'minor', name: `🎁 Minor ${pc.dim('(0.')}${pc.bold(pc.yellow('X'))}${pc.dim('.0)')}` },
				{ value: 'major', name: `🚀 Major ${pc.dim('(')}${pc.bold(pc.red('X'))}${pc.dim('.0.0)')}` },
			],
			name: 'type',
		},
	]);

	return type;
}
