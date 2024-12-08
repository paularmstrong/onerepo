/**
 * Special handlers for managing complex queries and manipulation of the git repository's state.
 *
 * @module
 */

import { stepWrapper } from '@onerepo/logger';
import { run } from '@onerepo/subprocess';
import type { LogStep } from '@onerepo/logger';

export { StagingWorkflow } from './workflow';

/**
 * Generic options passed to all Git operations.
 */
export type Options = {
	/**
	 * Avoid creating a new step in output for each function. Pass a Logger Step to pipe all logs and output to that instead.
	 */
	step?: LogStep;
};

/**
 * Get the name of the current branch. Equivalent to `git rev-parse --abbrev-ref HEAD`.
 *
 * ```ts
 * const currentBranch = await git.getBranch();
 * ```
 */
export async function getBranch(options: Options = {}) {
	const { step } = options;
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
export async function getMergeBase(options: Options = {}) {
	const { step } = options;
	return stepWrapper({ step, name: 'Get merge base' }, async (step) => {
		const current = await getBranch({ step });
		const head = process.env.ONEREPO_HEAD_BRANCH;

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

			if (base) {
				return base;
			}
		} catch {
			// don't worry about it
		}

		// Less accurate, but will resolve a commit if --fork-point fails
		// See discussion on fork-point: https://git-scm.com/docs/git-merge-base#_discussion_on_fork_point_mode
		// tl;dr: git gc may lose ref to the fork-point and return an empty result
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
 * Check if the current git working state is clean.
 *
 * ```ts
 * const isClean = await git.isClean();
 * if (!isClean) {
 * 	// There are local modifications that have not yet been committed.
 * }
 * ```
 */
export async function isClean(options: Options = {}) {
	const { step } = options;
	return stepWrapper({ step, name: 'Get current changes' }, async (step) => {
		const [currentStatus] = await run({
			name: 'Checking for changes',
			cmd: 'git',
			args: ['status', '-z'],
			runDry: true,
			step,
		});

		return !currentStatus;
	});
}

export type ModifiedFromThrough = {
	/**
	 * Git ref for start (exclusive) to get list of modified files
	 */
	from?: string;
	/**
	 * Cannot include `staged` files when using from/through refs.
	 */
	staged?: false;
	/**
	 * Git ref for end (inclusive) to get list of modified files
	 */
	through?: string;
};

export type ModifiedStaged = {
	/**
	 * Disallowed when `staged: true`
	 */
	from?: never;
	/**
	 * Get staged modified files only
	 */
	staged: true;
	/**
	 * Disallowed when `staged: true`
	 */
	through?: never;
};

/**
 * Get a map of the currently modified files based on their status. If `from` and `through` are not provided, this will current merge-base determination to best get the change to the working tree using `git diff` and `git diff-tree`.
 *
 * ```ts
 * const changesSinceMergeBase = await git.getModifiedFiles();
 * const betweenRefs = await git.getModifiedFiles('v1.2.3', 'v2.0.0');
 * ```
 */
export async function getModifiedFiles(modified: ModifiedStaged | ModifiedFromThrough = {}, options: Options = {}) {
	const { from, staged, through } = modified;
	const { step } = options;
	return stepWrapper({ step, name: 'Get modified files' }, async (step) => {
		const base = await (from ?? getMergeBase({ step }));
		const currentSha = await (through ?? getCurrentSha({ step }));

		const isMain = base === currentSha;
		const isCleanState = await isClean({ step });

		const uncleanArgs = ['diff', '--name-only', '-z', '--diff-filter', 'ACMR'];
		uncleanArgs.push(!staged ? base : '--cached');
		const cleanMainArgs = [
			'diff-tree',
			'-r',
			'-z',
			'--name-only',
			'--no-commit-id',
			'--diff-filter',
			'ACMR',
			isMain ? `${currentSha}^` : base,
			isMain ? currentSha : 'HEAD',
		];

		const [modified] = await run({
			name: 'Getting modified files',
			cmd: 'git',
			args: !isCleanState && !from && !through ? uncleanArgs : cleanMainArgs,
			runDry: true,
			step,
		});

		return modified
			.replace(/\\u0000$/, '')
			.split('\u0000')
			.filter(Boolean) as Array<string>;
	});
}

/**
 * Get the current sha ref. This is equivalent to `git rev-parse HEAD`.
 *
 * ```ts
 * const sha = await git.getCurrentSha();
 * ```
 */
export async function getCurrentSha(options: Options = {}) {
	const { step } = options;
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

const sym = Symbol.for('onerepo_git_add');
function getAddStore(): Set<string> {
	// @ts-ignore Cannot type symbol as key on global
	if (!global[sym]) {
		// @ts-ignore
		global[sym] = new Set<string>();
	}
	// @ts-ignore
	return global[sym];
}

export type UpdateIndexOptions = Options & {
	/**
	 * Set whether to immediately add to the git index or defer until process shutdown
	 * @default `false`
	 */
	immediately?: boolean;
};

/**
 * Add filepaths to the git index. Equivalent to `git add [...files]`. By default, this method will track the files that need to be added to the git index. It will only add files immediately if given the `immediately` option.
 *
 * Use {@link flushUpdateIndex | `flushUpdateIndex()`} to write all tracked files the git index. This method is automatically called during the oneRepo command shutdown process, so you may not ever need to call this.
 *
 * It is best to avoid immediately adding items to the git index to avoid race conditions which can drop git into a bad state, requiring users to manually delete their `.git/index.lock` file before continuing.
 *
 * ```ts
 * await git.updateIndex(['tacos.ts']);
 * ```
 */
export async function updateIndex(paths: Array<string> | string, options: UpdateIndexOptions = {}) {
	const { immediately = false, step } = options;
	if (!immediately) {
		const store = getAddStore();
		(Array.isArray(paths) ? paths : [paths]).forEach((p) => store.add(p));
		return;
	}

	return stepWrapper({ step, name: 'Add files to git stage' }, async (step) => {
		const [out] = await run({
			name: 'Add files to git stage',
			cmd: 'git',
			args: ['add', '--', ...(Array.isArray(paths) ? paths : [paths])],
			step,
		});

		return out;
	});
}

/**
 * Write all pending files added using {@link updateIndex | `updateIndex()`} to the git index.
 *
 * ```ts
 * await git.flushUpdateIndex();
 * ```
 */
export async function flushUpdateIndex(options: Options = {}) {
	const { step } = options;
	const store = getAddStore();
	if (store.size === 0) {
		return;
	}

	await updateIndex(Array.from(getAddStore()), { immediately: true, step });
	store.clear();
	return;
}
