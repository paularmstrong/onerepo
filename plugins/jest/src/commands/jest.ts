import { getMergeBase, getStatus } from '@onerepo/git';
import { run } from '@onerepo/subprocess';
import type { Builder, Handler } from '@onerepo/yargs';
import { builders } from '@onerepo/builders';

export const command = 'jest';

export const description = 'Run unit tests using Vitest';

type Args = {
	affected?: boolean;
	all?: boolean;
	config: string;
	inspect: boolean;
	watch?: boolean;
	workspaces?: Array<string>;
} & builders.WithAffected &
	builders.WithWorkspaces;

export const builder: Builder<Args> = (yargs) =>
	builders
		.withAffected(builders.withWorkspaces(yargs))
		.usage(`$0 ${command} [options] -- [passthrough]`)
		.option('watch', {
			description: 'Shortcut for jest --watch mode',
			type: 'boolean',
			default: false,
		})
		.example(`$0 ${command}`, 'Run only tests related to modified files.')
		.example(`$0 ${command} --watch`, 'Runs jest in --watch mode.')
		.example(`$0 ${command} -w -- path/to/test.ts`, 'Run vitest in watch mode with a particular file.')
		.epilogue(
			'This test commad will automatically attempt to run only the test files related to the changes in your working state. If you have un-committed changes, only those related to files that are in a modified state will be run. If there are no un-committed changes, test files related to those modified since your git merge-base will be run. By passing specific filepaths as extra passthrough arguments after two dashes (`--`), you can further restrict the tests to those files and paths.'
		)
		.epilogue(
			'Additionally, any other [Jest CLI options](https://jestjs.io/docs/cli) can be passed as passthrough arguments as well.'
		)
		.option('inspect', {
			type: 'boolean',
			description: 'Break for the the Node inspector to debug tests.',
			default: false,
		})
		.option('config', {
			type: 'string',
			description: 'Path to the jest.config file, relative to the repo root.',
			default: './jest.config.js',
			hidden: true,
		});

export const handler: Handler<Args> = async function handler(argv, { getWorkspaces }) {
	const { '--': other = [], affected, config, inspect, watch, workspaces } = argv;

	const args: Array<string> = ['node_modules/.bin/jest', '--config', config];

	if (inspect) {
		args.unshift('--inspect', '--inspect-brk');
	}
	if (watch) {
		args.push('--watch');
	}

	const hasNonOptExtraArgs = other.length ? other.filter((o) => !o.startsWith('-')).length > 0 : false;

	if (!hasNonOptExtraArgs) {
		if (affected && !workspaces?.length) {
			const status = await getStatus();
			if (status) {
				args.push('--onlyChanged');
			} else {
				args.push('--changedSince', await getMergeBase());
			}
		} else {
			const workspaces = await getWorkspaces();
			args.push(...workspaces.map((ws) => ws.location));
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
