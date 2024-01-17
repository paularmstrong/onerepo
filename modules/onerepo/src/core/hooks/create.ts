import { chmod, exists, write } from '@onerepo/file';
import { updateIndex } from '@onerepo/git';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = ['create'];

export const description = 'Create git hooks';

type Argv = {
	add: boolean;
	hook: Array<keyof typeof defaultHooks>;
	'hooks-path': string;
	overwrite: boolean;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs
		.usage(`$0 ${command[0]}`)
		.option('add', {
			type: 'boolean',
			default: true,
			description: 'Add the hooks to the git stage for committing.',
		})
		.option('hook', {
			type: 'array',
			string: true,
			description: 'The git hook to create. Omit this option to auto-create recommended hooks.',
			choices: Object.keys(defaultHooks) as Array<keyof typeof defaultHooks>,
			default: recommendedHooks,
		})
		.option('hooks-path', {
			type: 'string',
			description: 'Tracked path to use for git hooks. This option is defaulted via the oneRepo root config.',
			demandOption: true,
			hidden: true,
		})
		.option('overwrite', {
			type: 'boolean',
			description: 'Overwrite existing hooks',
			default: false,
		});

export const handler: Handler<Argv> = async (argv, { graph, logger }) => {
	const { add, 'hooks-path': hooksPath, hook: requestedHooks, overwrite } = argv;

	for (const hook of requestedHooks) {
		const hookStep = logger.createStep(`Add ${hook} hook`);
		const hookFile = graph.root.resolve(hooksPath, hook);

		if (!overwrite && (await exists(hookFile, { step: hookStep }))) {
			hookStep.info(
				`Skipping because the hook already exists. Bypass by re-running this command with the "--overwrite" flag.`,
			);
			await hookStep.end();
			continue;
		}
		const hookSh = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/hooks.sh"

${defaultHooks[hook] ?? '# add your hook command here'}
`;

		await write(hookFile, hookSh, { step: hookStep });
		await chmod(hookFile, 0o775, { step: hookStep });
		await hookStep.end();
	}

	if (add) {
		await updateIndex(graph.root.resolve(hooksPath));
	}
};

export const defaultHooks = {
	'applypatch-msg': null,
	'pre-applypatch': null,
	'post-applypatch': null,
	'pre-commit': 'one tasks --lifecycle=pre-commit',
	'pre-merge-commit': null,
	'prepare-commit-msg': null,
	'commit-msg': null,
	'post-commit': 'one tasks --lifecycle=post-commit',
	'pre-rebase': null,
	'post-checkout': `# If the third argument is "1", then we have switched branches
if [ $3 = '1' ]; then
  one tasks --lifecycle=post-checkout
fi`,
	'post-merge': 'one tasks --lifecycle=post-merge',
	'pre-receive': null,
	update: null,
	'post-receive': null,
	'post-update': null,
	'pre-auto-gc': null,
	'post-rewrite': 'one tasks --lifecycle=post-checkout',
	'pre-push': null,
	'proc-receive': null,
	'push-to-checkout': null,
} as const;

export const recommendedHooks: Array<keyof typeof defaultHooks> = [
	'pre-commit',
	'post-checkout',
	'post-merge',
	'post-rewrite',
];
