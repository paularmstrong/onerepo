 
import { defineProject as vitestDefineProject } from 'vitest/config';

// defineWorkspace provides a nice type hinting DX
export const defineProject = (
	/** @type {any} */
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
