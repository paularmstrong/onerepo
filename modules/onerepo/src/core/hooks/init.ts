import { chmod, write } from '@onerepo/file';
import { run } from '@onerepo/subprocess';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = ['init', 'sync'] as const;

export const description = 'Initialize and sync git hook settings for this repository.';

type Argv = {
	'hooks-path': string;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs.usage(`$0 ${command[0]}`).option('hooks-path', {
		type: 'string',
		description: 'Tracked path to use for git hooks.',
		demandOption: true,
		hidden: true,
	});

export const handler: Handler<Argv> = async (argv, { graph, logger }) => {
	const { 'hooks-path': hooksPath } = argv;

	const setupStep = logger.createStep('Add shell files');
	const shFile = graph.root.resolve(hooksPath, '_/hooks.sh');
	await write(shFile, hooksSh, { step: setupStep });
	await chmod(shFile, 0o775, { step: setupStep });
	await write(graph.root.resolve(hooksPath, '_/.gitignore'), '*', { step: setupStep });
	await setupStep.end();

	await run({
		name: 'Sync git hooks',
		cmd: 'git',
		args: ['config', 'core.hooksPath', hooksPath],
	});
};

const hooksSh = `#!/usr/bin/env sh
if [ -z "$ONEREPO_SKIP_HOOKS" ]; then
  readonly hook_name="\${0##*/}"

  if [ "$ONEREPO_USE_HOOKS" = "0" ]; then
    exit 0
  fi

  readonly ONEREPO_SKIP_HOOKS=1
  export ONEREPO_SKIP_HOOKS

  if [ "\${SHELL##*/}" = "zsh" ]; then
    zsh --emulate sh -e "$0" "$@"
  else
    sh -e "$0" "$@"
  fi
  exitCode="$?"

  if [ $exitCode = 127 ]; then
    echo "oneRepo hooks - command not found in PATH=$PATH"
  fi

  exit $exitCode
fi
`;
