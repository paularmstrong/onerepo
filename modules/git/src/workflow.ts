import { run } from '@onerepo/subprocess';
import { exists, read, remove, write } from '@onerepo/file';
import type { Graph } from '@onerepo/graph';
import type { Logger, LogStep } from '@onerepo/logger';

const stashMessage = '__oneRepo_stash__';

export class StagingWorkflow {
	#graph: Graph;
	#logger: Logger;

	#mergeBackups?: {
		head: string;
		mode: string;
		message: string;
	};
	#deletedFiles: Array<string> = [];

	constructor({ graph, logger }: { graph: Graph; logger: Logger }) {
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
		const hasPartiallyStaged = status
			// eslint-disable-next-line no-control-regex
			.split(/\x00(?=[ AMDRCU?!]{2} |$)/)
			.filter((line) => {
				const [index, workingTree] = line;
				return index !== ' ' && workingTree !== ' ' && index !== '?' && workingTree !== '?';
			})
			.map((line) => line.slice(3))
			.filter(Boolean).length;

		if (hasPartiallyStaged) {
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

		await run({
			name: 'Save state',
			cmd: 'git',
			args: ['stash', 'store', '--quiet', '--message', stashMessage, hash],
			runDry: true,
			step,
		});

		await run({
			name: 'Hide unstaged changes',
			cmd: 'git',
			args: ['checkout', '--force', '.'],
			runDry: true,
			step,
		});

		await step.end();
	}

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
			.findIndex((msg) => msg.includes(stashMessage))
			.toString();

		if (await exists(this.#patchFilePath, { step })) {
			try {
				await run({
					name: 'Restore unstaged changes',
					cmd: 'git',
					args: ['apply', ...args],
					skipFailures: true,
					runDry: true,
					step,
				});
			} catch (e) {
				try {
					await run({
						name: 'Retry restoring unstaged changes with 3way merge',
						cmd: 'git',
						args: ['apply', '--3way', ...args],
						runDry: true,
						step,
					});
				} catch (e) {
					step.error('Unable to restore unstaged changes due to merge conflict.');
					await run({
						name: 'Reset to HEAD',
						cmd: 'git',
						args: ['reset', '--hard', 'HEAD'],
						runDry: true,
						step,
					});

					await this.#restoreBackupStatus({ step });

					await Promise.all(this.#deletedFiles.map((filepath) => remove(filepath, { step })));
				}
			}

			await remove(this.#patchFilePath), { step };
		}

		if (stashIndex !== '-1') {
			await run({
				name: 'Apply stash',
				cmd: 'git',
				args: ['stash', 'apply', '--quiet', '--index', stashIndex],
				runDry: true,
				step,
			});
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
