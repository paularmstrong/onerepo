/**
 * This package is also canonically available from the `onerepo` package under the `git` namespace:
 *
 * ```ts {1,4}
 * import { git } from 'onerepo';
 *
 * export handler: Handler =  async () => {
 * 	await git.getBranch();
 * };
 * ```
 *
 * @module
 */

import { stepWrapper } from '@onerepo/logger';
import { run } from '@onerepo/subprocess';
import type { LogStep } from '@onerepo/logger';

/**
 * Generic options passed to all Git operations.
 */
export type Options = {
	/**
	 * Avoid creating a new step in output for each function. Pass a Logger Step to pipe all logs and output to that instead.
	 */
	step?: LogStep;
};

export type ChangeMap = {
	/**
	 * All files that have been modified. This includes deleted and uncommitted files.
	 */
	all: Array<string>;
	/**
	 * Files that have been created and newly started tracking.
	 */
	added: Array<string>;
	/**
	 * Files that have been deleted.
	 */
	deleted: Array<string>;
	/**
	 * Files that have been modified.
	 */
	modified: Array<string>;
	/**
	 * Files marked as moved.
	 */
	moved: Array<string>;
	/**
	 * Files that are not yet tracked by git.
	 */
	unknown: Array<string>;
};

/**
 * Get the name of the current branch. Equivalent to `git rev-parse --abbrev-ref HEAD`.
 *
 * ```ts
 * const currentBranch = await git.getBranch();
 * ```
 */
export async function getBranch({ step }: Options = {}) {
	return stepWrapper({ step, name: 'Get current branch' }, async (step) => {
		const [out] = await run({
			name: 'Getting current branch',
			cmd: 'git',
			args: ['rev-parse', '--abbrev-ref', 'HEAD'],
			runDry: true,
			step,
		});

		return out;
	});
}

/**
 * Determine the git ref for merging the current working branch, sha, or ref, whichever that is. This function does a bunch of internal checks to determine the where the most likely point of forking happened.
 *
 * ```ts
 * const mergeBase = await getMergeBase();
 * ```
 */
export async function getMergeBase({ step }: Options = {}) {
	return stepWrapper({ step, name: 'Get merge base' }, async (step) => {
		const current = await getBranch({ step });
		const head = process.env.ONE_REPO_HEAD_BRANCH;

		if (current === head) {
			step.log(`Currently on HEAD branch, "${head}"`);
			const [latestCommit] = await run({
				name: 'Get latest commit SHA',
				cmd: 'git',
				args: ['log', '-n', '1', `origin/${head}`, '--format=%H'],
				runDry: true,
				step,
			});

			return latestCommit;
		}

		if (!current || current === 'HEAD') {
			step.log('In detached head state');
			const [latestMergeSha] = await run({
				name: 'Get latest merge SHA',
				cmd: 'git',
				args: ['log', '-n', '1', '-m', '--format=%P'],
				runDry: true,
				step,
			});
			return latestMergeSha.trim().split(' ')[0];
		}

		try {
			const [base] = await run({
				name: 'Get merge base',
				cmd: 'git',
				args: ['merge-base', '--fork-point', `origin/${head}`, 'HEAD'],
				runDry: true,
				step,
				skipFailures: true,
			});

			return base;
		} catch (e) {
			// don't worry about it
		}

		// TODO: figure out why fork point sometimes doesn't work
		const [base] = await run({
			name: 'Get merge base',
			cmd: 'git',
			args: ['merge-base', 'HEAD', `origin/${head}`],
			runDry: true,
			step,
		});

		return base;
	});
}

/**
 * Check the current git status. Equivalent to `git status --porcelain`. If the string returned is empty, the git working state can be considered unchanged.
 *
 * ```ts
 * const status = await git.getStatus();;
 * if (!status) {
 * 	// no local changes
 * }
 * ```
 */
export async function getStatus({ step }: Options = {}) {
	return stepWrapper({ step, name: 'Get current changes' }, async (step) => {
		const [currentStatus] = await run({
			name: 'Checking for changes',
			cmd: 'git',
			args: ['status', '--porcelain'],
			runDry: true,
			step,
		});

		return currentStatus;
	});
}

/**
 * Get a map of the currently modified files based on their status. If `from` and `through` are not provided, this will current merge-base determination to best get the change to the working tree using `git diff` and `git diff-tree`.
 *
 * ```ts
 * const changesSinceMergeBase = await git.getModifiedFiles();
 * const betweenRefs = await git.getModifiedFiles('v1.2.3', 'v2.0.0');
 * ```
 */
export async function getModifiedFiles(from?: string, through?: string, { step }: Options = {}) {
	return stepWrapper({ step, name: 'Get modified files' }, async (step) => {
		const base = await (from ?? getMergeBase({ step }));
		const currentSha = await (through ?? getCurrentSha({ step }));

		const isMain = base === currentSha;

		const currentStatus = await getStatus({ step });

		const hasUncommittedChanges = Boolean(currentStatus.trim()) && !from && !through;

		const [modified] = await run({
			name: 'Getting modified files',
			cmd: 'git',
			args: hasUncommittedChanges
				? ['diff', '--name-status', '--cached', base]
				: [
						'diff-tree',
						'-r',
						'--name-status',
						'--no-commit-id',
						isMain ? `${currentSha}^` : base,
						isMain ? currentSha : 'HEAD',
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  ],
			runDry: true,
			step,
		});
		const changes = `${currentStatus}\n${modified}`;

		const changeMap = changes
			.trim()
			.split('\n')
			.reduce(
				(memo, line) => {
					const trimmed = line.trim();
					if (!trimmed) {
						return memo;
					}
					const [status, filename] = trimmed.split(/\s+/);
					const key = simplifyGitStatus[status.trim()[0] as keyof typeof simplifyGitStatus];
					if (!key) {
						throw new Error(`Caught unknown git status "${status}"`);
					}

					if (!memo[key].includes(filename)) {
						memo[key].push(filename);
					}
					if (!memo.all.includes(filename)) {
						memo.all.push(filename);
					}
					return memo;
				},
				{ all: [], added: [], deleted: [], modified: [], moved: [], unknown: [] } as ChangeMap
			);

		step.debug(`Modified files\n${JSON.stringify(changeMap, null, 2)}`);

		return changeMap;
	});
}

const simplifyGitStatus = {
	M: 'modified',
	T: 'modified',
	A: 'added',
	D: 'deleted',
	R: 'moved',
	C: 'moved',
	'?': 'unknown',
} as const;

/**
 * Get the current sha ref. This is equivalent to `git rev-parse HEAD`.
 *
 * ```ts
 * const sha = await git.getCurrentSha();
 * ```
 */
export async function getCurrentSha({ step }: Options = {}) {
	return stepWrapper({ step, name: 'Get current SHA' }, async (step) => {
		const [out] = await run({
			name: 'Get current SHA',
			cmd: 'git',
			args: ['rev-parse', 'HEAD'],
			runDry: true,
			step,
		});

		return out;
	});
}

/**
 * Add filepaths to the git index. Equivalent to `git add [...files]`.
 *
 * ```ts
 * await git.updateIndex(['tacos.ts']);
 * ```
 */
export async function updateIndex(paths: Array<string> | string, { step }: Options = {}) {
	return stepWrapper({ step, name: 'Add files to git stage' }, async () => {
		const [out] = await run({
			name: 'Add files to git stage',
			cmd: 'git',
			args: ['add', ...(Array.isArray(paths) ? paths : [paths])],
			step,
		});

		return out;
	});
}
