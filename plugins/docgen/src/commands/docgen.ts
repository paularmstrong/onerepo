import type { Builder, Handler } from '@onerepo/types';
import { updateIndex } from '@onerepo/git';
import { write, writeSafe } from '@onerepo/file';
import { run } from '@onerepo/subprocess';
import path from 'node:path';
import { toMarkdown } from '../markdown';
import type { Docs } from '../yargs';

export const command = 'docgen';

export const description = 'Generate documentation for this CLI.';

interface Args {
	add: boolean;
	bin?: string;
	format: 'markdown' | 'json';
	'out-file'?: string;
	'out-workspace'?: string;
	'safe-write'?: boolean;
	command?: string;
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
		} as const)
		.option('safe-write', {
			type: 'boolean',
			description: 'Write documentation to a portion of the file with start and end sentinels.',
		})
		.option('command', {
			type: 'string',
			hidden: true,
			description: 'Start at the given command, skip the root and any others',
		});

export const handler: Handler<Args> = async function handler(argv, { graph, logger }) {
	const {
		add,
		bin = process.argv[1],
		format,
		'out-file': outFile,
		'out-workspace': wsName,
		'safe-write': safeWrite,
		command,
	} = argv;

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
		args: [path.join(__dirname, '..', 'bin.cjs'), '--runnable', path.resolve(bin)],
	});

	const docs = JSON.parse(out) as Docs;
	let outputDocs: Docs | undefined = docs;
	if (command) {
		if (command in docs.commands) {
			outputDocs = docs.commands[command];
		} else {
			outputDocs = Object.values(docs.commands).find((cmd) => cmd.aliases?.includes(command));
		}
	}

	if (!outputDocs) {
		logger.error(`Coulid not find command "${command}" in CLI`);
		return;
	}

	const output = format === 'markdown' ? toMarkdown(outputDocs) : JSON.stringify(outputDocs);

	if (outPath) {
		if (safeWrite) {
			await writeSafe(outPath, output);
		} else {
			await write(outPath, output);
		}
		if (add) {
			await updateIndex(outPath);
		}
	} else {
		await new Promise<void>((resolve) => {
			process.stdout.write(output, () => {
				resolve();
			});
		});
	}
};
