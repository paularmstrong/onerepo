import path from 'node:path';
import { updateIndex } from '@onerepo/git';
import { write, writeSafe } from '@onerepo/file';
import type { Argv as Yargv } from 'yargs';
import type { Handler } from '@onerepo/yargs';
import type { Plugin, App } from '@onerepo/core';
import type { Config } from '../../types';
import { toMarkdown } from './markdown';
import { Yargs } from './yargs';
import type { Docs } from './yargs';

/**
 * Full configuration options for the Docgen core command.
 * @group Core
 */
export type Options = {
	/**
	 * Default output format for the documentation
	 * @default 'markdown'
	 */
	format?: 'markdown' | 'json';
	/**
	 * Override the name of the command.
	 * @default `'docgen'`
	 */
	name?: string | Array<string>;
	/**
	 * If set, a file will be written by default to the given location (in the given `outWorkspace`)
	 */
	outFile?: string;
	/**
	 * If `outFile` is also set, the generated documentation will be written out.
	 */
	outWorkspace?: string;
	/**
	 * Set to true to amend content to the given file using the {@link file.writeSafe | `file.writeSafe`} method.
	 */
	safeWrite?: boolean;
};

interface Args {
	add: boolean;
	format: 'markdown' | 'json';
	'heading-level'?: number;
	'out-file'?: string;
	'out-workspace'?: string;
	'safe-write'?: boolean;
	command?: string;
}

export const docgen = (opts: Options = {}, fn: (c: Config, y: Yargv) => Promise<App>, config: Config): Plugin => {
	if (typeof opts.outFile === 'string' && (!opts.outFile || path.isAbsolute(opts.outFile))) {
		throw new Error('Invalid path specified for `core.docgen.outFile`. Path must be relative, eg, "./docs/usage.md"');
	}

	return {
		yargs: (yargs, visitor) => {
			const handler: Handler<Args> = async function handler(argv, { graph, logger }) {
				const {
					add,
					format,
					'heading-level': headingLevel,
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

				const parseStep = logger.createStep('Parse commands');
				const docsYargs = new Yargs(parseStep);
				await fn(
					config,
					// @ts-ignore
					docsYargs,
				);
				docsYargs._rootPath = config.root as string;
				docsYargs._commandDirectory = (config.subcommandDir as string) ?? 'commands';
				const docs = docsYargs._serialize();
				await parseStep.end();

				let outputDocs: Docs | undefined = docs;
				if (command) {
					if (command in docs.commands) {
						outputDocs = docs.commands[command];
					} else {
						outputDocs = Object.values(docs.commands).find((cmd) => cmd.aliases?.includes(command));
					}
				}

				if (!outputDocs) {
					logger.error(`Could not find command "${command}" in CLI`);
					return;
				}

				const output = format === 'markdown' ? `${toMarkdown(outputDocs, headingLevel)}` : JSON.stringify(outputDocs);

				if (outPath) {
					if (safeWrite) {
						await writeSafe(outPath, output, { sentinel: `auto-generated-from-cli${command ? `-${command}` : ''}` });
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

			const command = opts.name ?? 'docgen';
			const description = `Generate documentation for the \`${config.name}\` cli.`;
			const { handler: wrappedHandler } = visitor({ command, description, handler });

			return yargs.command(
				command,
				description,
				(yargs) =>
					yargs
						.usage(`$0 ${Array.isArray(command) ? command[0] : command} [options]`)
						.epilogue(
							'Help documentation should always be easy to find. This command will help automate the creation of docs for this command-line interface. If you are reading this somewhere that is not your terminal, there is a very good chance that this command was already run for you!',
						)
						.epilogue(
							'Add this command to your one Repo tasks on pre-commit to ensure that your documentation is always up-to-date.',
						)
						.option('add', {
							type: 'boolean',
							description: 'Add the output file to the git stage',
							default: false,
						})
						.option('out-file', {
							type: 'string',
							description: 'File to write output to. If not provided, stdout will be used',
							default: 'outFile' in opts ? opts.outFile : undefined,
						})
						.option('out-workspace', {
							type: 'string',
							description: 'Workspace name to write the --out-file to',
							default: 'outWorkspace' in opts ? opts.outWorkspace : undefined,
						})
						.option('format', {
							type: 'string',
							choices: ['markdown', 'json'],
							default: opts.format ?? 'markdown',
							description: 'Output format for documentation',
						} as const)
						.option('heading-level', {
							type: 'number',
							min: 1,
							max: 5,
							description: 'Heading level to start at for Markdown output',
						})
						.option('safe-write', {
							type: 'boolean',
							description: 'Write documentation to a portion of the file with start and end sentinels.',
							default: opts.safeWrite ?? false,
						})
						.option('command', {
							type: 'string',
							hidden: true,
							description: 'Start at the given command, skip the root and any others',
						}),
				wrappedHandler,
			);
		},
	};
};
