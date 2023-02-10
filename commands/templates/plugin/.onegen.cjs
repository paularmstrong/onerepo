const path = require('path');

module.exports = {
	outDir: path.join(__dirname, '..', '..', '..', 'plugins'),
	nameFormat: (name) => `@onerepo/plugin-${name}`,
	dirnameFormat: (name) => name,
};
