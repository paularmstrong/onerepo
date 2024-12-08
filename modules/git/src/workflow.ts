/* eslint-disable no-control-regex */
import { run } from '@onerepo/subprocess';
import { exists, read, remove, write } from '@onerepo/file';
import type { Graph } from '@onerepo/graph';
import type { Logger, LogStep } from '@onerepo/logger';

const stashPrefix = 'oneRepo_';
const skipHooks = ['-c', 'core.hooksPath=/dev/null'];

const processRenames = (files: Array<string>, includeRenameFrom: boolean = true) =>
	files.reduce((flattened, file) => {
		if (/\x00/.test(file)) {
			const [to, from] = file.split(/\x00/);
			if (includeRenameFrom) {
				flattened.push(from);
			}
			flattened.push(to);
		} else {
			flattened.push(file);
		}
		return flattened;
	}, [] as Array<string>);

export class StagingWorkflow {
	#graph: Graph;
	#logger: Logger;
	#stashHash?: string;

	#mergeBackups?: {
		head: string;
		mode: string;
		message: string;
	};
	#deletedFiles: Array<string> = [];

	constructor(options: {
		/**
		 * The repository Graph
		 */
		graph: Graph;
		/**
		 * Logger instance to use for all actions
		 */
		logger: Logger;
	}) {
		const { graph, logger } = options;
		this.#graph = graph;
		this.#logger = logger;
	}

	get #mergeFiles() {
		return {
			head: this.#graph.root.resolve('.git/MERGE_HEAD'),
			mode: this.#graph.root.resolve('.git/MERGE_MODE'),
			message: this.#graph.root.resolve('.git/MERGE_MSG'),
		};
	}

	get #patchFilePath() {
		return this.#graph.root.resolve('.git/onerepo_unstaged.patch');
	}

	async #backupMergeStatus({ step }: { step: LogStep }) {
		const files = this.#mergeFiles;
		if (!(await exists(files.head, { step }))) {
			return;
		}

		const [head, mode, message] = await Promise.all([
			read(files.head, 'r', { step }).catch(() => ''),
			read(files.mode, 'r', { step }).catch(() => ''),
			read(files.message, 'r', { step }).catch(() => ''),
		]);

		this.#mergeBackups = { head, mode, message };
	}

	async #restoreBackupStatus({ step }: { step: LogStep }) {
		const files = this.#mergeFiles;
		if (!this.#mergeBackups) {
			return;
		}
		await Promise.all([
			write(files.head, this.#mergeBackups.head ?? '', { step }),
			write(files.mode, this.#mergeBackups.mode ?? '', { step }),
			write(files.message, this.#mergeBackups.message ?? '', { step }),
		]);
	}

	/**
	 * Backup any unstaged changes, whether that's full files or parts of files. This will result in the git status only including what was already in the stage. All other changes will be backed up to:
	 *
	 * 1. A patch file in the `.git/` directory
	 * 2. A git stash
	 *
	 * To restore the unstaged changes, call {@link StagingWorkflow.restoreUnstaged | `restoreUnstaged()`}.
	 */
	async saveUnstaged() {
		const step = this.#logger.createStep('Save unstaged state');

		process.on('SIGINT', async () => {
			await this.restoreUnstaged();
			process.exit(127);
		});

		const [status] = await run({
			name: 'Checking for changes',
			cmd: 'git',
			args: ['status', '-z'],
			runDry: true,
			step,
		});
		const partiallyStaged = status
			.split(/\x00(?=[ AMDRCU?!]{2} |$)/)
			.filter((line) => {
				const [index, workingTree] = line;
				return index !== ' ' && workingTree !== ' ' && index !== '?' && workingTree !== '?';
			})
			.map((line) => line.slice(3))
			.filter(Boolean);

		const files = processRenames(partiallyStaged);

		if (partiallyStaged.length) {
			await run({
				name: 'Save unstaged changes',
				cmd: 'git',
				args: [
					'diff',
					'--binary',
					'--unified=0',
					'--no-color',
					'--no-ext-diff',
					'--patch',
					'--output',
					this.#patchFilePath,
					'--',
					...files,
				],
				runDry: true,
				step,
			});
		}

		await this.#backupMergeStatus({ step });

		const [deleted] = await run({
			name: 'Get deleted files',
			cmd: 'git',
			args: ['ls-files', '--deleted', '-z'],
			runDry: true,
			step,
		});

		this.#deletedFiles = deleted
			.replace(/\\u0000$/, '')
			.split('\u0000')
			.filter(Boolean) as Array<string>;

		const [hash] = await run({
			name: 'Backup state',
			cmd: 'git',
			args: ['stash', 'create'],
			runDry: true,
			step,
		});

		if (hash) {
			this.#stashHash = hash;
			await run({
				name: 'Save state',
				cmd: 'git',
				args: ['stash', 'store', '--quiet', '--message', `${stashPrefix}${hash}`, hash],
				runDry: true,
				step,
			});

			const files = processRenames(partiallyStaged, false);
			if (files.length) {
				await run({
					name: 'Hide unstaged changes',
					cmd: 'git',
					args: [...skipHooks, 'checkout', '--force', '--', ...files],
					runDry: true,
					step,
				});
			}
		}

		await step.end();
	}

	/**
	 * Restores the unstaged changes previously backed up by {@link StagingWorkflow.saveUnstaged | `saveUnstaged()`}.
	 *
	 * This command will go through a series of attempts to ressurect upon failure, eventually throwing an error if unstaged changes cannot be reapplied.
	 */
	async restoreUnstaged() {
		const step = this.#logger.createStep('Restoring unstaged changes');

		const args = ['-v', '--whitespace=nowarn', '--recount', '--unidiff-zero', this.#patchFilePath];

		const [stashes] = await run({
			name: 'Get stashes',
			cmd: 'git',
			args: ['stash', 'list', '-z'],
			runDry: true,
			step,
		});
		const stashIndex = stashes
			.split('\u0000')
			.findIndex((msg) => msg.includes(`${stashPrefix}${this.#stashHash}`))
			.toString();

		async function applyStash() {
			if (stashIndex !== '-1') {
				await run({
					name: 'Apply stash',
					cmd: 'git',
					args: [...skipHooks, 'stash', 'apply', '--quiet', '--index', stashIndex],
					runDry: true,
					step,
					skipFailures: true,
				});
			}
		}

		if (await exists(this.#patchFilePath, { step })) {
			try {
				await run({
					name: 'Restore unstaged changes',
					cmd: 'git',
					args: [...skipHooks, 'apply', ...args],
					runDry: true,
					step,
				});
			} catch {
				try {
					await run({
						name: 'Retry restoring unstaged changes with 3way merge',
						cmd: 'git',
						args: [...skipHooks, 'apply', '--3way', ...args],
						runDry: true,
						step,
					});
				} catch {
					step.error('Unable to restore unstaged changes due to merge conflict.');
					await run({
						name: 'Reset to HEAD',
						cmd: 'git',
						args: [...skipHooks, 'reset', '--hard', 'HEAD'],
						runDry: true,
						step,
					});

					await applyStash();
					await this.#restoreBackupStatus({ step });
					await Promise.all(this.#deletedFiles.map((filepath) => remove(filepath, { step })));
				}
			}

			await remove(this.#patchFilePath, { step });
		} else {
			await applyStash();
		}

		if (stashIndex !== '-1') {
			await run({
				name: 'Clear backup stash',
				cmd: 'git',
				args: ['stash', 'drop', '--quiet', stashIndex],
				runDry: true,
				step,
				skipFailures: true,
			});
		}

		await step.end();
	}
}
