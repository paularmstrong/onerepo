import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { getLogger } from '@onerepo/logger';
import { makeTempDir, write } from '@onerepo/file';

export async function measure(
	resultType: boolean | 'temp' | string,
	argv: Record<string, unknown>,
): Promise<string | null> {
	if (resultType === false) {
		return null;
	}

	const logger = getLogger({ verbosity: -1 });
	const step = logger.createStep('Report metrics');

	const entries = performance.getEntriesByType('mark');
	entries.forEach((entry) => {
		if (!entry.name.startsWith('onerepo_start_')) {
			return;
		}

		const [end] = performance.getEntriesByName(entry.name.replace('_start_', '_end_'));
		if (end) {
			let detail: Record<string, unknown> = { argv };
			if (typeof entry.detail === 'string') {
				detail.description = entry.detail;
			} else if (entry.detail) {
				detail = { ...detail, ...entry.detail };
			}
			if (typeof end.detail === 'string') {
				detail.description = `${detail.description ? `${detail.description} ` : ''}${end.detail}`;
			} else if (end.detail) {
				detail = { ...detail, ...end.detail };
			}

			performance.measure(entry.name.replace('onerepo_start_', ''), {
				start: entry.startTime,
				end: end.startTime,
				detail,
			});

			performance.clearMarks(entry.name);
			performance.clearMarks(end.name);
		}
	});

	if (resultType === true) {
		return null;
	}

	const measures = performance.getEntriesByType('measure');
	let outFile: string = resultType;
	const now = Date.now();
	if (resultType === 'temp') {
		const tempDir = await makeTempDir('onerepo-perf', { step });
		outFile = path.join(tempDir, `${now}.json`);
	} else {
		outFile = outFile.startsWith('/') ? outFile : path.join(process.cwd(), outFile);
	}

	await write(outFile, JSON.stringify(measures), { step });
	await step.end();

	return outFile;
}
