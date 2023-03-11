import type { GraphSchemaValidators } from '@onerepo/core';

export default {
	'**': {
		'tsconfig.json': {
			type: 'object',
			properties: {
				extends: {
					type: 'string',
					const: 'foo',
					errorMessage: {
						pattern: 'Internal packages must be scoped under "@internal"',
					},
				},
			},
			required: ['extends'],
		},
	},
} satisfies GraphSchemaValidators;
