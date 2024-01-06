import type { GraphSchemaValidators, graph } from 'onerepo';

export default {
	'internal/*': {
		'package.json': {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					pattern: '^@internal\\/',
					errorMessage: {
						pattern: 'Internal packages must be scoped under "@internal"',
					},
				},
			},
			required: ['name'],
		},
	},
	'modules/!(onerepo|create)/': {
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
			required: ['name'],
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
			required: ['name'],
		},
	},
	'+(plugins|modules)/*': {
		'tsconfig.json': {
			type: 'object',
			properties: {
				extends: {
					type: 'string',
					pattern: '^@internal\\/tsconfig\\/base\\.json$',
					errorMessage: 'All tsconfig.json files must extend `@internal/tsconfig/base.json`',
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
							contains: { type: 'string', enum: ['./**/*'] },
							errorMessage: '`./**/*` must be included in the tsconfig',
						},
					],
				},
			},
			required: ['extends', 'include', 'compilerOptions'],
			$required: true,
		},
		'package.json': (workspace: graph.Workspace, graph: graph.Graph) => ({
			type: 'object',
			properties: {
				files: {
					type: 'array',
					allOf: [
						{
							contains: { type: 'string', enum: ['./dist/**/*'] },
							errorMessage: '`files` array must include `./dist/**/*`',
						},
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
						type: { type: 'string', const: 'git', errorMessage: '"repository.type" must be "git"' },
						url: {
							type: 'string',
							const: 'git://github.com/paularmstrong/onerepo.git',
							errorMessage: '"repository.url" must be "git://github.com/paularmstrong/onerepo.git".',
						},
						directory: {
							type: 'string',
							const: graph.root.relative(workspace.location),
							errorMessage: `repository.directory equal "${graph.root.relative(workspace.location)}"`,
						},
					},
					required: ['type', 'url', 'directory'],
					errorMessage: {
						required: {
							directory: `repository.directory equal "${graph.root.relative(workspace.location)}"`,
						},
					},
				},
				license: {
					type: 'string',
					const: 'MIT',
					errorMessage: 'License MUST be "MIT"',
				},
				engines: {
					type: 'object',
					properties: {
						node: {
							type: 'string',
							const: '^18 || ^20',
							errorMessage: 'oneRepo only suppiorts "node": "^18 || ^20"',
						},
					},
					required: ['node'],
				},
			},
			required: ['files', 'publishConfig', 'homepage', 'repository', 'license', 'engines'],
		}),
		'jest.config.js': {
			type: 'object',
			properties: {
				default: {
					type: 'object',
					properties: {
						displayName: {
							type: 'string',
						},
						rootDir: {
							type: 'string',
						},
						clearMocks: {
							type: 'boolean',
							const: true,
						},
						resetMocks: {
							type: 'boolean',
							const: true,
						},
						restoreMocks: {
							type: 'boolean',
							const: true,
						},
					},
					required: ['displayName', 'rootDir', 'clearMocks', 'resetMocks', 'restoreMocks'],
				},
			},
			required: ['default'],
		},
	},
} satisfies GraphSchemaValidators;
