module.exports = {
	outDir: ({ name }) => `apps/${name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}`,
	prompts: [
		{
			name: 'name',
			type: 'question',
			message: 'What is the name of the workspace?',
			transformer: (name) => `@onerepo/fixture-app-${name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}`,
		},
	],
};
