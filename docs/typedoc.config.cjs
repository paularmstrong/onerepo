const sort = [
	'Reference',
	'Project',
	'Module',
	'Namespace',
	'Variable',
	'Class',
	'Function',
	'Constructor',
	'Property',
	'Accessor',
	'Method',
	'Parameter',
	'Interface',
	'Enum',
	'EnumMember',
	'TypeAlias',
	'ObjectLiteral',
	'TypeParameter',
	'TypeLiteral',
	'CallSignature',
	'ConstructorSignature',
	'IndexSignature',
	'GetSignature',
	'SetSignature',
];

/** @type import('typedoc').TypeDocOptions */
module.exports = {
	groupOrder: sort,
	kindSortOrder: sort,
};
