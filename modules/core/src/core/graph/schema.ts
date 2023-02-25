import type { Schema } from 'ajv';

export type GraphSchemaValidators = Record<string, Record<string, Schema>>;

const defaultSchema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		main: { type: 'string' },
	},
	required: ['name'],
	if: {
		properties: {
			private: { type: 'boolean', enum: [true] },
		},
		required: ['private'],
		errorMessage: {},
	},
	then: {
		properties: {
			version: {
				not: {},
				errorMessage: {
					_: 'Private packages must not have version numbers.',
				},
			},
			typings: { type: 'string' },
		},
	},
	else: {
		properties: {
			typings: { not: {}, errorMessage: '"typings" must only be set withing the "publishConfig"' },
			publishConfig: {
				type: 'object',
				properties: {
					registry: { type: 'string' },
					main: { type: 'string' },
					module: { type: 'string' },
					typings: { type: 'string' },
					bin: { oneOf: [{ type: 'string' }, { type: 'object' }] },
				},
			},
			version: {
				type: 'string',
				// Official semver regex https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
				pattern:
					'^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$',
				errorMessage: {
					pattern: 'Version must be a valid semantic version.',
				},
			},
		},
		required: ['version', 'main'],
	},
} satisfies Schema;

export const defaultValidators: GraphSchemaValidators = {
	'**': {
		'package.json': defaultSchema,
	},
};
