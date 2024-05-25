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

export type ModifiedBaseOptions<ByStatus extends boolean = false> = {
	/**
	 * By default, this function will not return `deleted` and `unmerged` files unless either `allStatus` or `byStatus` is set to `true`
	 */
	allStatus?: boolean;
	/**
	 * Return modified files categorized by the {@link ModifiedByStatus | type of modification} (added, deleted, modified, etc)
	 */
	byStatus?: ByStatus;
};

export type ModifiedFromThrough<ByStatus extends boolean> = ModifiedBaseOptions<ByStatus> & {
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

export type ModifiedStaged<ByStatus extends boolean> = ModifiedBaseOptions<ByStatus> & {
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
 * This type defines the different statuses of files when running a git-diff. More information around the file statuses can be found in the official git documentation for [git-diff](https://git-scm.com/docs/git-diff#Documentation/git-diff.txt-git-diff-filesltpatterngt82308203).
 */
export type ModifiedByStatus = {
	/**
	 * Git status `A`: addition of a file
	 */
	added: Array<string>;
	/**
	 * Git status `C`: copy of a file into a new one
	 */
	copied: Array<string>;
	/**
	 * Git status `D`: deletion of a file
	 */
	deleted: Array<string>;
	/**
	 * Git status `M`: modification of the contents or mode of a file
	 */
	modified: Array<string>;
	/**
	 * Git status `R`: renaming of a file
	 */
	renamed: Array<string>;
	/**
	 * Git status `T`: change in the type of the file (regular file, symbolic link or submodule)
	 */
	fileTypeChanged: Array<string>;
	/**
	 * Git status `U`: "unknown" change type (most probably a bug, please report it)
	 */
	unmerged: Array<string>;
	/**
	 * Git status `X`: addition of a file
	 */
	unknown: Array<string>;
};

/**
 * Get a map of the currently modified files based on their status. If `from` and `through` are not provided, this will use merge-base determination to get the changes to the working tree using `git diff` and `git diff-tree`.
 *
 * By default, this function will not return `deleted` and `unmerged` files. If you wish to include files with those statuses, set the option `allStatus: true` or get a map of all files by status using `byStatus: true`.
 *
 * ```ts
 * const changesSinceMergeBase = await git.getModifiedFiles();
 * const betweenRefs = await git.getModifiedFiles({ from: 'v1.2.3', through: 'v2.0.0' });
 * ```
 *
 * Get modified files categorized by modification type:
 *
 * ```ts
 * const allChanges = await git.getModifiedFiles({ byStatus: true });
 * ```
 *
 * Will result in `allChanges` equal to an object containing arrays of strings:
 * ```ts
 * {
 * 	added: [/* ... *\/],
 * 	copied: [/* ... *\/],
 * 	modified: [/* ... *\/],
 * 	deleted: [/* ... *\/],
 * 	renamed: [/* ... *\/],
 * 	fileTypeChanged: [/* ... *\/],
 * 	unmerged: [/* ... *\/],
 * 	unknown: [/* ... *\/],
 * }
 * ```
 */
export async function getModifiedFiles<ByStatus extends boolean = false>(
	modified: ModifiedStaged<ByStatus> | ModifiedFromThrough<ByStatus> = {},
	options: Options = {},
): Promise<ByStatus extends true ? ModifiedByStatus : Array<string>> {
	const { from, staged, through, allStatus, byStatus } = modified;
	const { step } = options;
	return stepWrapper(
		{ step, name: 'Get modified files' },
		async (step): Promise<ByStatus extends true ? ModifiedByStatus : Array<string>> => {
			const base = await (from ?? getMergeBase({ step }));
			const currentSha = await (through ?? getCurrentSha({ step }));

			const isMain = base === currentSha;
			const isCleanState = await isClean({ step });
			const diffFilter = `ACMRTX${allStatus || byStatus ? 'DU' : ''}`;
			const fileNameFormat = byStatus ? '--name-status' : '--name-only';

			const uncleanArgs = ['diff', fileNameFormat, '-z', '--diff-filter', diffFilter];
			uncleanArgs.push(!staged ? base : '--cached');
			const cleanMainArgs = [
				'diff-tree',
				'-r',
				'-z',
				fileNameFormat,
				'--no-commit-id',
				'--diff-filter',
				diffFilter,
				isMain ? `${currentSha}^` : base,
				isMain ? currentSha : 'HEAD',
			];

			const [modifiedResults] = await run({
				name: 'Getting modified files',
				cmd: 'git',
				args: !isCleanState && !from && !through ? uncleanArgs : cleanMainArgs,
				runDry: true,
				step,
			});

			const results = modifiedResults
				.replace(/\\u0000$/, '')
				.split('\u0000')
				.filter(Boolean) as Array<string>;

			if (!byStatus) {
				return <ByStatus extends true ? ModifiedByStatus : Array<string>>results;
			}

			if (results.length % 2 !== 0) {
				throw new Error('Unable to parse modified files.');
			}

			const modifiedByType: ModifiedByStatus = {
				modified: [],
				added: [],
				copied: [],
				renamed: [],
				deleted: [],
				fileTypeChanged: [],
				unmerged: [],
				unknown: [],
			};

			for (let i = 0; i < results.length; i += 2) {
				modifiedByType[statusToKey[results[i]] ?? 'unknown'].push(results[i + 1]);
			}

			return <ByStatus extends true ? ModifiedByStatus : Array<string>>modifiedByType;
		},
	);
}

const statusToKey: Record<string, keyof ModifiedByStatus> = {
	A: 'added',
	C: 'copied',
	M: 'modified',
	R: 'renamed',
	D: 'deleted',
	T: 'fileTypeChanged',
	U: 'unmerged',
	X: 'unknown',
};

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
