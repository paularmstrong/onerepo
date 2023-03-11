import { getModifiedFiles } from '@onerepo/git';
import { run } from '@onerepo/subprocess';
import type { Builder, Handler } from '@onerepo/yargs';
import { builders } from '@onerepo/builders';

export const command = 'vitest';

export const description = 'Run unit tests using Vitest';

type Args = {
	affected?: boolean;
	all?: boolean;
	config: string;
	inspect: boolean;
	workspaces?: Array<string>;
} & builders.WithAffected &
	builders.WithWorkspaces;

export const builder: Builder<Args> = (yargs) =>
	builders
		.withAffected(builders.withWorkspaces(yargs))
		.usage(`$0 ${command} [options] -- [passthrough]`)
		.example(`$0 ${command}`, 'Run only tests related to modified files.')
		.example(`$0 ${command} -- --watch`, 'Run vitest in --watch mode.')
		.example(`$0 ${command} -- -w path/to/test.ts`, 'Run vitest in watch mode with a particular file.')
		.epilogue(
			'This test commad will automatically attempt to run only the test files related to the changes in your git branch. By passing specific filepaths as extra passthrough arguments after two dashes (`--`), you can further restrict the tests to those specific files only.'
		)
		.epilogue(
			'Additionally, any other [Vitest CLI options](https://jest.dev/guide/cli.html) can be passed as passthrough arguments as well.'
		)
		.option('inspect', {
			type: 'boolean',
			description: 'Break for the the Node inspector to debug tests.',
			default: false,
		})
		.option('config', {
			type: 'string',
			description: 'Path to the jest.config file, relative to the repo root.',
			default: './jest.config.ts',
			hidden: true,
		});

export const handler: Handler<Args> = async function handler(argv, { getWorkspaces }) {
	const { '--': other = [], affected, config, inspect, workspaces } = argv;

	const related: Array<string> = [];
	const paths: Array<string> = [];

	const hasNonOptExtraArgs = other.length ? other.filter((o) => !o.startsWith('-')).length > 0 : false;

	if (!hasNonOptExtraArgs) {
		if (affected && !workspaces?.length) {
			const { all } = await getModifiedFiles();
			related.push(...all);
			related.unshift('related');
		} else {
			const workspaces = await getWorkspaces();
			workspaces.forEach((ws) => {
				paths.push(ws.location);
			});
		}
	}

	await run({
		name: 'Run tests',
		cmd: inspect ? 'node' : 'node_modules/.bin/vitest',
		args: [
			...(inspect ? ['--inspect', '--inspect-brk', 'node_modules/.bin/vitest'] : []),
			'--config',
			config,
			...related.filter((filepath) => !filepath.endsWith('.json')),
			...paths,
			...(other as Array<string>),
		],
		opts: { stdio: 'inherit' },
	});
};
