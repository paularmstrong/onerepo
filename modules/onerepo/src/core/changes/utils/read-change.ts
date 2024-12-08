import path from 'path';
import yaml from 'js-yaml';
import { read } from '@onerepo/file';
import type { LogStep } from '@onerepo/logger';
import { stepWrapper } from '@onerepo/logger';
import { run } from '@onerepo/subprocess';
import type { ReleaseType } from './get-versionable';

export async function readChange(filepath: string, options: { step?: LogStep } = {}) {
	const normFilepath = normalizefilepath(filepath);
	return stepWrapper({ name: `Read change file ${normFilepath}`, step: options.step }, async (step) => {
		const [ref] = await run({
			name: 'Get commit SHA',
			cmd: 'git',
			args: ['log', '--diff-filter=A', '-n', '1', '--pretty=format:%H', normFilepath],
			step,
			runDry: true,
		});

		const contents = await read(filepath, 'r', { step });
		const matches = contents.match(/^---\n(.*)\n---\n+(.*)/ms);
		if (!matches) {
			step.error(`Not valid change file: "${filepath}"`);
			return null;
		}

		try {
			const data = yaml.load(matches[1]) as { type: ReleaseType };
			return { ...data, content: matches[2], ref, filepath };
		} catch {
			step.error(`Not valid change file: "${filepath}"`);
			return null;
		}
	});
}

function normalizefilepath(filepath: string) {
	if (typeof process.env.ONEREPO_ROOT === 'string') {
		return filepath.startsWith(process.env.ONEREPO_ROOT) ? path.relative(process.env.ONEREPO_ROOT, filepath) : filepath;
	}
	return filepath;
}
