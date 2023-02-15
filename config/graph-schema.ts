import type { SchemaMap } from '@onerepo/plugin-graph';

export default {
	'modules/!(onerepo)': {
		'package.json': {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					pattern: '^@onerepo\\/',
					errorMessage: {
						pattern: 'Package name must be scoped under "@onerepo"',
					},
				},
			},
		},
	},
	'plugins/*': {
		'package.json': {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					pattern: '^@onerepo\\/plugin-',
					errorMessage: {
						pattern: 'Plugins must follow the name pattern "@onerepo/plugin-*"',
					},
				},
			},
		},
	},
} satisfies SchemaMap;
