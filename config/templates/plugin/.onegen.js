import { fileURLToPath } from 'node:url';
import path from 'node:path';

export default {
	name: 'Plugin',
	description: 'Create a publishable oneRepo plugin',
	outDir: ({ name }) => path.join(fileURLToPath(import.meta.url), '..', '..', '..', '..', 'plugins', name),
	prompts: [
		{
			name: 'name',
			message: 'What is the name of the plugin?',
			suffix: ' @onerepo/plugin-',
			filter: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
			transformer: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
		},
	],
};
