/** @type import('onerepo').Config */
export default {
	tasks: {
		'post-commit': { serial: ['echo "post-commit" "tacos"'] },
	},
};
