import path from 'node:path';
import { git, file, corePlugins, internalSetup } from 'onerepo';
import type { Builder, Handler, Plugin } from 'onerepo';
import { toMarkdown } from './markdown';
import { Yargs } from './yargs';
import type { Docs } from './yargs';

/**
 * Full configuration options for the Docgen core command.
 *
 * ```js title="onerepo.config.ts"
 * import { docgen } from '@onerepo/plugin-docgen';
 *
 * export default {
 * 	plugins: [
 *    docgen({
 *      format: 'markdown',
 * 			outFile: './docs/cli.md',
 *      safeWrite: true,
 *    }),
 *  ],
 * };
 * ```
 */
export type Options = {
	/**
	 * Default output format for the documentation
	 * @default `'markdown'`
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
	'use-defaults'?: boolean;
}

/**
 * Include the `eslint` plugin in your oneRepo plugin setup:
 *
 *
 * ```js title="onerepo.config.ts" {1,4}
 * import { docgen } from '@onerepo/plugin-docgen';
 *
 * export default {
 * 	plugins: [docgen()],
 * };
 * ```
 */
export const docgen = (opts: Options = {}): Plugin => {
	if (typeof opts.outFile === 'string' && (!opts.outFile || path.isAbsolute(opts.outFile))) {
		throw new Error(
			'Invalid path specified for `outFile`. Path must be relative to the repository root, eg, "./docs/usage.md"',
		);
	}

	return (rootConfig) => ({
		yargs: (yargs, visitor) => {
			if (process.env.ONEREPO_DOCGEN) {
				for (const key of Object.keys(opts)) {
					opts[key as keyof Options] = undefined;
				}
			}

			const command = opts.name ?? 'docgen';
			const description = `Generate documentation for the oneRepo cli.`;
			const builder: Builder<Args> = (yargs) =>
				yargs
					.usage(`$0 ${Array.isArray(command) ? command[0] : command} [options...]`)
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
					})
					.option('use-defaults', {
						type: 'boolean',
						hidden: true,
						description: 'Use the oneRepo default configuration. Helpful for generating default documentation.',
					});

			const handler: Handler<Args> = async function handler(argv, { graph, logger }) {
				const {
					add,
					format,
					'heading-level': headingLevel,
					'out-file': outFile,
					'out-workspace': wsName,
					'safe-write': safeWrite,
					command,
					'use-defaults': useDefaults,
				} = argv;

				let outPath = outFile;
				if (wsName && outFile) {
					const workspace = graph.getByName(wsName);
					if (!workspace) {
						throw new Error(`No Workspace by name "${wsName}"`);
					}
					outPath = workspace.resolve(outFile);
				}

				if (command) {
					process.env.ONEREPO_DOCGEN = command;
				}

				const parseStep = logger.createStep('Parse commands');
				const docsYargs = new Yargs(parseStep);
				await internalSetup({
					root: graph.root.location,
					config: useDefaults && command !== 'docgen' ? { root: true } : rootConfig,
					// @ts-ignore
					yargs: docsYargs,
					corePlugins,
				});
				docsYargs._rootPath = graph.root.location;
				docsYargs._commandDirectory = rootConfig.commands.directory ? rootConfig.commands.directory : 'commands';
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
					logger.warn(`Could not find command "${command}" in CLI`);
					return;
				}

				const output = format === 'markdown' ? `${toMarkdown(outputDocs, headingLevel)}` : JSON.stringify(outputDocs);

				if (outPath) {
					if (safeWrite) {
						await file.writeSafe(outPath, output, {
							sentinel: `auto-generated-from-cli${command ? `-${command}` : ''}`,
							sign: true,
						});
					} else {
						await file.write(outPath, output, { sign: true });
					}
					if (add) {
						await git.updateIndex(outPath);
					}
				} else {
					await new Promise<void>((resolve) => {
						process.stdout.write(output, () => {
							resolve();
						});
					});
				}
			};

			const cmd = visitor({ command, description, handler, builder });

			return yargs.command(cmd.command, cmd.description, cmd.builder, cmd.handler);
		},
	});
};
