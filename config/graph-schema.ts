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
	'+(plugins|modules)/*': {
		'tsconfig.json': {
			type: 'object',
			properties: {
				extends: {
					type: 'string',
					pattern: '^@onerepo\\/tsconfig\\/base\\.json$',
					errorMessage: 'All tsconfig.json files must extend `@onerepo/tsconfig/base.json`',
				},
				compilerOptions: {
					type: 'object',
					properties: {
						outDir: {
							type: 'string',
							pattern: '^\\.\\/dist\\/$',
							errorMessage: '`outDir` must be `./dist/`',
						},
					},
					required: ['outDir'],
				},
				include: {
					type: 'array',
					oneOf: [
						{
							contains: { type: 'string', enum: ['./src'] },
							errorMessage: '`./src` or `./**/*` must be included in the tsconfig',
						},
						{
							contains: { type: 'string', enum: ['./**/*'] },
							errorMessage: '`./src` or `./**/*` must be included in the tsconfig',
						},
					],
				},
			},
			required: ['extends', 'include', 'compilerOptions'],
		},
		'package.json': {
			type: 'object',
			properties: {
				files: {
					type: 'array',
					allOf: [
						{ contains: { type: 'string', enum: ['./dist/*'] }, errorMessage: '`files` array must include `./dist/*`' },
						{
							contains: { type: 'string', enum: ['./README.md'] },
							errorMessage: '`files` array must include `./README.md`',
						},
						{
							contains: { type: 'string', enum: ['./CHANGELOG.md'] },
							errorMessage: '`files` array must include `./CHANGELOG.md`',
						},
					],
					uniqueItems: true,
				},
				publishConfig: {
					type: 'object',
					properties: {
						access: {
							type: 'string',
							enum: ['public'],
							errorMessage: '`publishConfig.access` must be set to `public`',
						},
						main: {
							type: 'string',
							enum: ['./dist/index.js'],
							errorMessage: '`publishConfig.main` must be set to `./dist/index.js`',
						},
						typings: {
							type: 'string',
							enum: ['./dist/src/index.d.ts'],
							errorMessage: '`publishConfig.typings` must be set to `./dist/src/index.d.ts`',
						},
					},
					required: ['access', 'main', 'typings'],
				},
				homepage: {
					type: 'string',
					pattern: '^https:\\/\\/onerepo\\.tools',
					errorMessage: 'Homepage must be under the onerepo.tools domain',
				},
				repository: {
					type: 'object',
					properties: {
						type: { type: 'string', pattern: '^git$', errorMessage: '`repository.type` must be `git`' },
						url: {
							type: 'string',
							pattern: 'git://github.com/paularmstrong/onerepo.git',
							errorMessage: 'Use the correct repository URL.',
						},
					},
					required: ['type', 'url'],
				},
				license: {
					type: 'string',
					pattern: '^MIT$',
					errorMessage: 'License MUST be `MIT`',
				},
			},
			required: ['files', 'publishConfig', 'homepage', 'repository', 'license'],
		},
	},
} satisfies SchemaMap;
