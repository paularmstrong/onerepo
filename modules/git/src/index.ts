import { stepWrapper } from '@onerepo/logger';
import type { LogStep } from '@onerepo/logger';
import { run } from '@onerepo/subprocess';

type Options = {
	step?: LogStep;
};

export async function getBranch({ step }: Options = {}) {
	return stepWrapper({ step, name: 'Get current branch' }, async (step) => {
		const [out] = await run({
			name: 'Getting current branch',
			cmd: 'git',
			args: ['rev-parse', '--abbrev-ref', 'HEAD'],
			step,
		});

		return out;
	});
}

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
				step,
			});
			return latestMergeSha.trim().split(' ')[0];
		}

		try {
			const [base] = await run({
				name: 'Get merge base',
				cmd: 'git',
				args: ['merge-base', '--fork-point', `origin/${head}`, 'HEAD'],
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
			step,
		});

		return base;
	});
}

export async function getStatus({ step }: Options = {}) {
	return stepWrapper({ step, name: 'Get current changes' }, async (step) => {
		const [currentStatus] = await run({
			name: 'Checking for changes',
			cmd: 'git',
			args: ['status', '--porcelain'],
			step,
			runDry: true,
		});

		return currentStatus;
	});
}

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
				{ all: [], added: [], deleted: [], modified: [], moved: [], uncommitted: [] } as Record<string, Array<string>>
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
	'?': 'uncommitted',
} as const;

export async function getCurrentSha({ step }: Options = {}) {
	return stepWrapper({ step, name: 'Get current SHA' }, async (step) => {
		const [out] = await run({
			name: 'Get current SHA',
			cmd: 'git',
			args: ['rev-parse', 'HEAD'],
			step,
		});

		return out;
	});
}

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
