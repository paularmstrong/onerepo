// @ts-nocheck
// start-synced-imports
import burritos from 'fixture-burritos/eslint.config';
import tacos from 'fixture-tacos/eslint.config';
// end-synced-imports
//
export default [
	// start-synced-workspaces
	{ files: ['./modules/burritos/**'], extends: [...burritos] },
	{ files: ['./modules/tacos/**'], extends: [...tacos] },
	// end-synced-workspaces
];
