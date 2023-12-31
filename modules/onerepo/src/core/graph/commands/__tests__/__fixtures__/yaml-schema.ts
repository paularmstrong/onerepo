import type { GraphSchemaValidators } from 'onerepo';

export default {
	'**': {
		'settings.{yaml,yml}': {
			type: 'object',
			properties: {
				foo: {
					type: 'string',
					const: 'baz',
				},
			},
			required: ['foo'],
		},
	},
} satisfies GraphSchemaValidators;
