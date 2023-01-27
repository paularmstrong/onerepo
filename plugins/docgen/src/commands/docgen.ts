import type { Builder, Handler } from '@onerepo/cli';
import { file, git, run } from '@onerepo/cli';
import path from 'node:path';
import { toMarkdown } from '../markdown';

export const command = 'docgen';

export const description = 'Generate documentation for this CLI.';

interface Args {
	add: boolean;
	bin?: string;
	format: 'markdown' | 'json';
	'out-file'?: string;
	'out-workspace'?: string;
}

export const builder: Builder<Args> = (yargs) =>
	yargs
		.usage('$0 docgen [options]')
		.epilogue(
			'Help documentation should always be easy to find. This command will help automate the creation of docs for this commandline interface. If you are reading this somewhere that is not your terminal, there is a very good chance that this command was already run for you!'
		)
		.epilogue(
			'Add this command to your one Repo tasks on pre-commit to ensure that your documentation is always up-to-date.'
		)
		.option('add', {
			type: 'boolean',
			description: 'Add the output file to the git stage',
			default: false,
			implies: ['out-file'],
		})
		.option('bin', {
			type: 'string',
			description: 'Path to the OneRepo cli runner. Defaults to the current runner.',
		})
		.option('out-file', {
			type: 'string',
			description: 'File to write output to. If not provided, stdout will be used',
			implies: ['out-workspace'],
		})
		.option('out-workspace', {
			type: 'string',
			description: 'Workspace name to write the --out-file to',
			implies: ['out-file'],
		})
		.option('format', {
			type: 'string',
			choices: ['markdown', 'json'],
			default: 'json',
			description: 'Output format for documentation',
		} as const);

export const handler: Handler<Args> = async function handler(argv, { graph }) {
	const { add, bin = process.argv[1], format, 'out-file': outFile, 'out-workspace': wsName } = argv;

	let outPath = outFile;
	if (wsName && outFile) {
		const workspace = graph.getByName(wsName);
		if (!workspace) {
			throw new Error(`No workspace by name "${wsName}"`);
		}
		outPath = workspace.resolve(outFile);
	}

	const [out] = await run({
		name: 'Generating documentation',
		cmd: 'node',
		args: [path.join(__dirname, '..', 'bin.cjs'), '--runnable', bin, '--format', format],
	});

	const output = format === 'markdown' ? toMarkdown(JSON.parse(out)) : out;

	if (outPath) {
		await file.writeFile(outPath, output);
		if (add) {
			await git.updateIndex(outPath);
		}
	} else {
		process.stdout.write(output);
	}
};
