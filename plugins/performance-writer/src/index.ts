import path from 'node:path';
import type { PerformanceMeasure } from 'node:perf_hooks';
import { performance, PerformanceObserver } from 'node:perf_hooks';
import { getLogger } from '@onerepo/logger';
import type { PluginObject } from '@onerepo/core';
import { makeTempDir, write } from '@onerepo/file';

export type Options = {
	/**
	 * Whether or not to measure performance marks. Adds minimal overhead. Disable if you’d prefer to make your own measurements.
	 *
	 * - `temp`: Writes a JSON dump of the measurement entries to a temporary file. The filepath will be returned from the `run()` call of your application.
	 * - `string`: Will do the same as `'temp'`, but use this string as the filepath.
	 * @default `true`
	 */
	output?: 'temp' | string;
};

/**
 * Include the `performanceWriter` plugin in your oneRepo plugin setup:
 *
 * @example
 *
 * ```js {3,6,9-11}
 * #!/usr/bin/env node
 * import { setup } from 'onerepo';
 * import { performanceWriter } from '@onerepo/plugin-performance-writer';
 *
 * setup({
 * 	plugins: [performanceWriter()],
 * })
 * 	.then(({ run }) => run())
 * 	.then(({ performanceWriter }) => {
 * 		console.log('results written to file', performanceWriter);
 * 	});
 * ```
 */
export function performanceWriter(opts: Options = {}): PluginObject {
	const fileType = opts.output ?? 'temp';

	let observer: PerformanceObserver;
	const measures: Array<PerformanceMeasure> = [];

	return {
		startup: (argv) => {
			observer = new PerformanceObserver((list) => {
				const entries = list.getEntries();

				entries.forEach((entry) => {
					if (!entry.name.startsWith('onerepo_end_')) {
						return;
					}

					const [startMark] = performance.getEntriesByName(entry.name.replace('_end_', '_start_'));
					if (!startMark) {
						performance.clearMarks(entry.name);
						return;
					}

					let detail: Record<string, unknown> = { argv };

					if (typeof startMark.detail === 'string') {
						detail.description = startMark.detail;
					} else if (startMark.detail) {
						detail = { ...detail, ...startMark.detail };
					}

					if (typeof entry.detail === 'string') {
						detail.description = `${detail.description ? `${detail.description} ` : ''}${entry.detail}`;
					} else if (entry.detail) {
						detail = { ...detail, ...entry.detail };
					}

					measures.push(
						performance.measure(entry.name.replace('onerepo_end_', ''), {
							start: startMark.startTime,
							end: entry.startTime,
							detail,
						}),
					);

					performance.clearMarks(entry.name);
					performance.clearMarks(startMark.name);
				});
			});

			observer.observe({ entryTypes: ['mark'] });
		},

		shutdown: async () => {
			const logger = getLogger();
			const step = logger.createStep('Report metrics');
			observer.disconnect();

			const measures = performance.getEntriesByType('measure');
			let outFile: string = fileType;
			const now = Date.now();
			if (fileType === 'temp') {
				const tempDir = await makeTempDir('onerepo-perf', { step });
				outFile = path.join(tempDir, `${now}.json`);
			} else {
				outFile = outFile.startsWith('/') ? outFile : path.join(process.cwd(), outFile);
			}

			await write(outFile, JSON.stringify(measures), { step });
			await step.end();

			return {
				performanceWriter: outFile,
			};
		},
	};
}
