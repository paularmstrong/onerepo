import path from 'node:path';
import type { PerformanceMeasure } from 'node:perf_hooks';
import { performance, PerformanceObserver, PerformanceMark } from 'node:perf_hooks';
import { getLogger, file } from 'onerepo';
import type { PluginObject } from 'onerepo';

/**
 * Include the `performanceWriter` plugin in your oneRepo plugin setup:
 *
 *
 * ```js title="onerepo.config.ts" {1,6}
 * import { performanceWriter } from '@onerepo/plugin-performance-writer';
 *
 * export default {
 * 	 plugins: [
 *     performanceWriter({
 *       output: '/tmp/onerepo-perf-out'
 * 		 })
 *   ],
 * };
 * ```
 */
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
 *
 * ```js title="onerepo.config.ts" {1,4}
 * import { performanceWriter } from '@onerepo/plugin-performance-writer';
 *
 * export default {
 * 	plugins: [performanceWriter()],
 * };
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

					if (startMark instanceof PerformanceMark) {
						if (typeof startMark.detail === 'string') {
							detail.description = startMark.detail;
						} else if (startMark.detail) {
							detail = { ...detail, ...startMark.detail };
						}
					}

					if (entry instanceof PerformanceMark) {
						if (typeof entry.detail === 'string') {
							detail.description = `${detail.description ? `${detail.description} ` : ''}${entry.detail}`;
						} else if (entry.detail) {
							detail = { ...detail, ...entry.detail };
						}
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
				const tempDir = await file.makeTempDir('onerepo-perf', { step });
				outFile = path.join(tempDir, `${now}.json`);
			} else {
				outFile = outFile.startsWith('/') ? outFile : path.join(process.cwd(), outFile);
			}

			await file.write(outFile, JSON.stringify(measures), { step });
			await step.end();
		},
	};
}
