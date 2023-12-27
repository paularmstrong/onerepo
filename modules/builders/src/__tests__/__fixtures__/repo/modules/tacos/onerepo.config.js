/** @type import('onerepo').Config */
module.exports = {
	tasks: {
		'post-commit': { serial: ['echo "post-commit" "tacos"'] },
	},
};
