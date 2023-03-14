import { fileURLToPath } from 'node:url';
import path from 'node:path';

export default {
	outDir: ({ name }) => path.join(fileURLToPath(import.meta.url), '..', '..', '..', '..', 'commands'),
	prompts: [
		{
			name: 'name',
			message: 'What is the name of the command?',
			filter: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
			transformer: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
		},
		{
			name: 'description',
			message: 'What is the command’s description?',
		},
	],
};
