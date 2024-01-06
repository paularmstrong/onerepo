import type { GraphSchemaValidators } from 'onerepo';

export default {
	'**': {
		'tsconfig.json': {
			type: 'object',
			properties: {
				extends: {
					type: 'string',
					const: 'foo',
				},
			},
			required: ['extends'],
		},
	},
} satisfies GraphSchemaValidators;
