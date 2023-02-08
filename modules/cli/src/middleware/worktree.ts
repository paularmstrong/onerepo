import path from 'node:path';
import { file, run } from '../functions';
import { logger } from '../logger';

export async function worktreeMiddleware() {
	const rel = path.relative(process.env.ONE_REPO_ROOT, process.cwd());
	if (rel.includes('..')) {
		const [out] = await run({
			name: 'Determining git-dir',
			cmd: 'git',
			args: ['rev-parse', '--git-dir'],
			opts: {
				cwd: process.cwd(),
			},
		});

		if (/\/worktrees\//.test(out)) {
			const newRoot = await file.readFile(path.join(out, 'gitdir'));
			process.env.ONE_REPO_ROOT = path.dirname(newRoot);
			logger.warn(`Reset repo root to worktree ${path.dirname(newRoot)}`);
		} else {
			logger.warn(`Current working directory is not within the repository root.`);
			logger.debug(`   Root: ${process.env.ONE_REPO_ROOT}
Current: ${process.cwd()}
 Diff: ${rel}`);
		}
	}
}
