import path from 'node:path';
import pc from 'picocolors';
import type { Builder, Handler } from '@onerepo/yargs';
import type { WithAllInputs } from '@onerepo/builders';
import { withAllInputs } from '@onerepo/builders';
import ignore from 'ignore';
import cliui from 'cliui';
import type { Providers } from './get-codeowners';
import { getCodeowners, providers } from './get-codeowners';

export const command = 'show';

export const description = 'Show the code owners for files and Workspaces.';

type Argv = {
	format: 'plain' | 'json';
	list: boolean;
	provider: Providers;
} & WithAllInputs;

export const builder: Builder<Argv> = (yargs) =>
	withAllInputs(yargs.usage(`$0 ${command} [options]`))
		.option('format', {
			type: 'string',
			choices: ['plain', 'json'] as const,
			description: 'Choose how the results will be returned.',
			default: 'plain' as const,
		})
		.option('list', {
			type: 'boolean',
			default: false,
			description: 'Just list the owners without the files',
		})
		.option('provider', {
			type: 'string',
			choices: providers,
			demandOption: true,
			description: 'Codeowner provider determines where the CODEOWNERS file(s) will be written.',
			hidden: true,
		})
		.example(`$0 ${command}`, 'Show the codeowners for currently modified files.')
		.example(
			`$0 ${command} --list -w <workspace-name>`,
			'List the unique set of codeowners given an input `workspace-name`.',
		);

export const handler: Handler<Argv> = async (argv, { getFilepaths, graph, logger }) => {
	const { format, list } = argv;

	const gatherStep = logger.createStep('Gathering inputs');
	const files = await getFilepaths({ step: gatherStep });
	await gatherStep.end();

	const codeowners = getCodeowners(graph);

	const formatter = formatters[format](list);

	const result: Record<string, Array<string>> = {};
	for (const [pattern, owners] of Object.entries(codeowners)) {
		const matcher = ignore().add(pattern);
		for (const filepath of files) {
			if (matcher.ignores(path.isAbsolute(filepath) ? graph.root.relative(filepath) : filepath)) {
				if (!(filepath in result)) {
					result[filepath] = [];
				}
				result[filepath].push(...owners);
			}
		}
	}
	for (const [filepath, owners] of Object.entries(result)) {
		formatter.add(filepath, owners);
	}

	process.stdout.write(formatter.write());
};

type Formatter = (list: boolean) => {
	add: (filepath: string, owners: Array<string>) => void;
	write: () => string;
};

const plain: Formatter = (list) => {
	const width = Math.min(160, process.stdout.columns);
	const ui = cliui({ width });
	if (list) {
		ui.div(pc.cyan(pc.bold(pc.underline('Owners'))));
	} else {
		ui.div(pc.cyan(pc.bold(pc.underline('Filepath'))), pc.cyan(pc.bold(pc.underline('Owners'))));
	}
	const seen = new Set<string>();
	return {
		add: (filepath, owners) => {
			if (list) {
				for (const owner of owners) {
					if (!seen.has(owner)) {
						seen.add(owner);
						ui.div(` • ${owner}`);
					}
				}
				return;
			}
			ui.div(
				{ text: filepath, padding: [0, 1, 0, 0] },
				{ text: owners.join('\n'), padding: [0, 0, owners.length > 1 ? 1 : 0, 0] },
			);
		},
		write: () => `\n${ui.toString()}\n\n`,
	};
};

const json: Formatter = (list) => {
	const out: Record<string, Array<string>> = {};
	return {
		add: (filepath, owners) => {
			out[filepath] = owners;
		},
		write: () => {
			const output = list
				? Object.values(out)
						.flat()
						.filter((value, index, self) => self.indexOf(value) === index)
				: out;
			return `\n${JSON.stringify(output)}\n\n`;
		},
	};
};

const formatters: Record<Argv['format'], Formatter> = {
	plain: plain,
	json: json,
};
