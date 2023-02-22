import { fileURLToPath } from 'node:url';
import path from 'node:path';

export default {
	outDir: path.join(fileURLToPath(import.meta.url), '..', '..', '..', '..', 'plugins'),
	nameFormat: (name) => `@onerepo/plugin-${name}`,
	dirnameFormat: (name) => name,
};
