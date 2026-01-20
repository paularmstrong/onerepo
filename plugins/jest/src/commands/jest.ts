import { builders, git, run } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = ['jest', 'test'];

export const description = 'Run tests using Jest.';

type Args = {
	config: string;
	inspect: boolean;
	pretty: boolean;
	watch?: boolean;
	/**
	 * This option is provided camel-case as an exception to match Jest's argument casing.
	 */
	passWithNoTests: boolean;
} & builders.WithAffected &
	builders.WithWorkspaces;

export const builder: Builder<Args> = (yargs) =>
	builders
		.withAffected(builders.withWorkspaces(yargs))
		.usage(`$0 ${command[0]} [options...] -- [passthrough]`)
		.option('config', {
			type: 'string',
			description: 'Path to the jest.config file, relative to the repo root.',
			default: './jest.config.js',
			hidden: true,
		})
		.option('inspect', {
			type: 'boolean',
			description: 'Break for the the Node inspector to debug tests.',
			default: false,
		})
		.option('pretty', {
			type: 'boolean',
			default: true,
			description: 'Control Jest’s `--colors` flag.',
		})
		.option('watch', {
			description: 'Shortcut for jest `--watch` mode.',
			type: 'boolean',
			default: false,
		})
		.option('passWithNoTests', {
			type: 'boolean',
			default: true,
			description: 'Allows the test suite to pass when no files are found. See plugin configuration to disable.',
			hidden: true,
		})
		.example(`$0 ${command}`, 'Run only tests related to modified files.')
		.example(`$0 ${command} --watch`, 'Runs jest in --watch mode against the currently affected files.')
		.example(`$0 ${command} --watch -- path/to/test.ts`, 'Run Jest in watch mode against a particular file.')
		.example(
			`$0 ${command} -- --runInBand --detectOpenHandles`,
			'Pass any other Jest CLI options after the argument separator.',
		)
		.epilogue(
			'This test commad will automatically attempt to run only the test files related to the changes in your working state. If you have un-committed changes, only those related to files that are in a modified state will be run. If there are no un-committed changes, test files related to those modified since your git merge-base will be run. By passing specific filepaths as extra passthrough arguments an argument separator (two dasshes ` -- `), you can further restrict the tests to those files and paths.',
		)
		.epilogue(
			'Additionally, any other [Jest CLI options](https://jestjs.io/docs/cli) can be passed as passthrough arguments as well after an argument separator (two dashes ` -- `)',
		);

export const handler: Handler<Args> = async function handler(argv, { getWorkspaces }) {
	const { '--': other = [], all, affected, config, inspect, passWithNoTests, pretty, watch, workspaces } = argv;

	const args: Array<string> = ['node_modules/.bin/jest', '--config', config, pretty ? '--colors' : '--no-colors'];

	if (inspect) {
		args.unshift('--inspect', '--inspect-brk');
	}
	if (watch) {
		args.push('--watch');
	}
	if (passWithNoTests) {
		args.push('--passWithNoTests');
	}

	const hasNonOptExtraArgs = other.length ? other.filter((o) => !o.startsWith('-')).length > 0 : false;

	if (!hasNonOptExtraArgs) {
		if (affected && !workspaces?.length) {
			if (!(await git.isClean())) {
				args.push('--onlyChanged');
			} else {
				args.push('--changedSince', (await git.getMergeBase()) ?? 'head');
			}
		} else if (all) {
			args.push('.');
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
