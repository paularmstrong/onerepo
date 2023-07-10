import { performance } from 'node:perf_hooks';

export function measure(argv: Record<string, unknown>) {
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
}
