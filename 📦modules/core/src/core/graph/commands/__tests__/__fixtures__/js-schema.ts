import type { GraphSchemaValidators } from '@onerepo/core';

export default {
	'**': {
		'jest.config.js': {
			type: 'object',
			properties: {
				displayName: {
					type: 'string',
				},
				clearMocks: {
					type: 'boolean',
					const: true,
				},
			},
			required: ['displayName', 'clearMocks'],
		},
	},
} satisfies GraphSchemaValidators;
