import { createHash } from 'node:crypto';
import type { LogStep } from '@onerepo/logger';
import { stepWrapper } from '@onerepo/logger';
import type { Graph } from '@onerepo/graph';

export async function getFilename(
	graph: Graph,
	contents: string,
	method: 'hash' | 'human',
	options: { step?: LogStep } = {},
) {
	return stepWrapper({ name: 'Generate filename', step: options.step }, async (step) => {
		if (method === 'human') {
			try {
				// eslint-disable-next-line import/no-extraneous-dependencies
				const { humanId } = await import('human-id');
				return humanId({ separator: '-', capitalize: false });
			} catch {
				step.warn('Please install "human-id" to use "human" readable filenames for changes.');
				step.warn(`\u0000\n> one dependencies add --workspace=${graph.root.name} --dev=human-id\n\u0000`);
			}
		}

		const md5sum = createHash('md5');
		md5sum.update(`${Date.now()} ${contents}`, 'utf8');
		return md5sum.digest('hex').substring(0, 8);
	});
}
