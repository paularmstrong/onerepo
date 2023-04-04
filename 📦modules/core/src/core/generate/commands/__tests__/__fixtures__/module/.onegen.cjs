module.exports = {
	name: 'Modules',
	description: 'A fancy description',
	outDir: 'modules',
	prompts: [
		{
			name: 'name',
			type: 'question',
			message: 'What is the name of the workspace?',
			transformer: (name) => `@onerepo/fixture-app-${name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}`,
		},
		{
			type: 'input',
			name: 'description',
			message: 'How would you describe tacos?',
		},
	],
};
