// eslint-disable-next-line import/no-unresolved
import { defineProject as vitestDefineProject } from 'vitest/config';

// defineWorkspace provides a nice type hinting DX
export const defineProject = (
	/** @type {Required<import('vitest/config').UserProjectConfigExport>} */
	config,
) =>
	vitestDefineProject({
		...config,
		test: {
			...('test' in config ? config.test : {}),
			globals: true,
			restoreMocks: true,
			mockReset: true,
		},
	});
