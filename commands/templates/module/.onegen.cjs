const path = require('path');

module.exports = {
	outDir: path.join(__dirname, '..', '..', '..', 'modules'),
	nameFormat: (name) => `@onerepo/${name}`,
	dirnameFormat: (name) => name,
};
