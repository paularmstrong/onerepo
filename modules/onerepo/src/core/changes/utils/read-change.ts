import yaml from 'js-yaml';
import { read } from '@onerepo/file';
import type { LogStep } from '@onerepo/logger';
import { stepWrapper } from '@onerepo/logger';
import type { ReleaseType } from './get-versionable';

export async function readChange(filepath: string, options: { step?: LogStep } = {}) {
	return stepWrapper({ name: 'Read change file', step: options.step }, async (step) => {
		const contents = await read(filepath, 'r', { step });
		const matches = contents.match(/^---\n(.*)\n---\n+(.*)/ms);
		if (!matches) {
			step.error(`Not valid change file: "${filepath}"`);
			return null;
		}

		const data = yaml.load(matches[1]) as { type: ReleaseType };
		return { ...data, contents: matches[2] };
	});
}
