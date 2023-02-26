const path = require('path');

module.exports = {
	outDir: path.join(__dirname, '..', '..', '..', 'modules'),
	nameFormat: (name) => `@onerepo/${name}`,
	dirnameFormat: (name) => name,
	prompts: [{ name: 'tacos', type: 'input', message: 'What are tacos' }],
};
