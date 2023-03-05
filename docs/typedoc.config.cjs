/** @type import('typedoc').TypeDocOptions */
module.exports = {
	categorizeByGroup: true,
	excludeInternal: true,
	excludePrivate: true,
	githubPages: false,
	hideGenerator: true,
	readme: 'none',
	sourceLinkTemplate: 'https://github.com/paularmstrong/onerepo/blob/main/{path}#L{line}',
	symbolsWithOwnFile: ['class', 'interface'],
	kindSortOrder: [
		'Reference',
		'Project',
		'Module',
		'Namespace',
		'Enum',
		'EnumMember',
		'Variable',
		'Function',
		'Class',
		'Interface',
		'Constructor',
		'Property',
		'TypeAlias',
		'Accessor',
		'Method',
		'ObjectLiteral',
		'Parameter',
		'TypeParameter',
		'TypeLiteral',
		'CallSignature',
		'ConstructorSignature',
		'IndexSignature',
		'GetSignature',
		'SetSignature',
	],
};
