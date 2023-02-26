module.exports = {
	outDir: 'modules',
	nameFormat: (name) => `@onerepo/fixture-module-${name}`,
	dirnameFormat: (name) => name,
	prompts: [
		{
			type: 'input',
			name: 'description',
			message: 'How would you describe tacos?',
		},
	],
};
