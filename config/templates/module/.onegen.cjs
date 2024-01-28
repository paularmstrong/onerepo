const path = require('path');

module.exports = {
	name: 'Module',
	description: 'Create a shared Workspace in modules/',
	outDir: ({ name }) => path.join(__dirname, '..', '..', '..', 'modules', name),
	prompts: [
		{
			name: 'name',
			message: 'What is the name of the module?',
			suffix: ' @onerepo/',
			filter: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
			transformer: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
		},
	],
};
