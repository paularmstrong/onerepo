import { getModifiedFiles } from '@onerepo/git';
import { run } from '@onerepo/subprocess';
import { builders } from '@onerepo/builders';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = 'vitest';

export const description = 'Run unit tests using Vitest';

type Args = {
	config: string;
	inspect: boolean;
	watch?: boolean;
} & builders.WithAffected &
	builders.WithWorkspaces;

export const builder: Builder<Args> = (yargs) =>
	builders
		.withAffected(builders.withWorkspaces(yargs))
		.usage(`$0 ${command} [options] -- [passthrough]`)
		.option('inspect', {
			type: 'boolean',
			description: 'Break for the the Node inspector to debug tests.',
			default: false,
		})
		.option('config', {
			type: 'string',
			description: 'Path to the vitest.config file, relative to the repo root.',
			default: './vitest.config.ts',
			hidden: true,
		})
		.option('watch', {
			description: 'Shortcut for vitest `--watch` mode.',
			type: 'boolean',
			default: false,
		})
		.example(`$0 ${command}`, 'Run only tests related to modified files.')
		.example(`$0 ${command} --watch`, 'Run vitest in --watch mode.')
		.example(`$0 ${command} --watch -- path/to/test.ts`, 'Run vitest in watch mode with a particular file.')
		.example(`$0 ${command} -w <workspace>`, 'Run all tests in a given workspace.')
		.epilogue(
			'This test commad will automatically attempt to run only the test files related to the changes in your git branch. By passing specific filepaths as extra passthrough arguments after two dashes (` -- `), you can further restrict the tests to those specific files only.',
		)
		.epilogue(
			'Additionally, any other [Vitest CLI options](https://jest.dev/guide/cli.html) can be used as passthrough arguments as well after an argument separator (two dashes ` -- `).',
		);

export const handler: Handler<Args> = async function handler(argv, { getWorkspaces }) {
	const { '--': other = [], affected, config, inspect, watch, workspaces } = argv;

	const args: Array<string> = ['node_modules/.bin/vitest', '--config', config];

	const wOther = other.indexOf('-w');
	const watchOther = other.indexOf('--watch');
	const idx = wOther > -1 ? wOther : watchOther > -1 ? watchOther : null;
	if (watch || idx !== null) {
		args.push('--watch');
		if (idx !== null) {
			other.splice(idx, 1);
		}
	} else {
		args.push('--no-watch');
	}

	if (inspect) {
		args.unshift('--inspect', '--inspect-brk');
	}
	const hasNonOptExtraArgs = other.length ? other.filter((o) => !o.startsWith('-')).length > 0 : false;

	if (!hasNonOptExtraArgs) {
		if (affected && !workspaces?.length) {
			const all = await getModifiedFiles();
			args.push(...all.filter((f) => !f.endsWith('.json')));
			args.push('related');
		} else {
			const workspaces = await getWorkspaces();
			workspaces.forEach((ws) => {
				args.push(ws.location);
			});
		}
	}

	args.push(...other);

	await run({
		name: 'Run tests',
		cmd: 'node',
		args,
		opts: { stdio: 'inherit' },
	});
};
