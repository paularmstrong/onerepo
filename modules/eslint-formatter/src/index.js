const gh = require('@actions/core');
const { ESLint } = require('eslint');

/**
 * @type {import('eslint').ESLint.Formatter}
 */
const formatter = {
	format: async function (results, context) {
		const eslint = new ESLint();
		const { format } = await eslint.loadFormatter('stylish');

		if (process.env.GITHUB_RUN_ID && process.env.ONEREPO_ESLINT_GITHUB_ANNOTATE === 'true') {
			results.forEach((file) => {
				file.messages.forEach((msg) => {
					const data = { file: file.filePath, startLine: msg.line, startColumn: msg.column };
					const message = `${msg.message} (${msg.ruleId})`;
					if (msg.severity === 2) {
						gh.error(message, data);
					} else if (msg.severity === 1) {
						gh.warning(message, data);
					}
				});
			});
		}

		return format(results, context);
	},
};

module.exports = formatter.format;
