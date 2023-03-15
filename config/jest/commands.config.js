import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { makeConfig } from '@internal/test-config';

/** @type {import('jest').Config} */
export default makeConfig({
	displayName: 'commands',
	rootDir: pathToFileURL(path.join(fileURLToPath(import.meta.url), '../../../commands/__tests__')),
});
