/** @type import('@onerepo/graph').TaskConfig */
module.exports = {
	'post-commit': { sequential: ['echo "post-commit" "tacos"'] },
	publish: { parallel: [{ cmd: 'publish tacos', match: '../burritos/**/*' }] },
};
