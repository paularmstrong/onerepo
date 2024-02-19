/**
 * Return a deep copy of a `package.json` suitabkle for publishing. Moves all non-standard `publishConfig` keys to the root of the `package.json` and deletes `devDependencies`.
 *
 * @group package.json
 */
export function getPublishablePackageJson(input: PublicPackageJson): PublicPackageJson {
	const newPackageJson = JSON.parse(JSON.stringify(input));

	delete newPackageJson.devDependencies;

	if (newPackageJson.publishConfig) {
		for (const key in newPackageJson.publishConfig) {
			if (!publishConfigKeep.includes(key)) {
				// @ts-ignore
				newPackageJson[key] = newPackageJson.publishConfig[key];
				delete newPackageJson.publishConfig[key];
			}
		}
	}

	return newPackageJson;
}

/**
 * @group package.json
 */
export type Person = {
	name?: string;
	email?: string;
	url?: string;
};

/**
 * @group package.json
 */
export type BasePackageJson = {
	/**
	 * The full name for the {@link Workspace | `Workspace`}. This will be used within the package manager and publishable registry.
	 */
	name: string;
	description?: string;
	version?: string;
	keywords?: Array<string>;
	homepage?: string;
	bugs?: { url?: string; email?: string };
	license?: string;
	author?: string | Person;
	contributors?: Array<Person | string>;
	files?: Array<string>;
	main?: string;
	bin?: string | Record<string, string>;
	exports?: Record<string, string | { types?: string; default?: string; require?: string; import?: string }>;
	scripts?: Record<string, string>;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	peerDependenciesMeta?: Record<string, { optional: boolean }>;
	bundleDependencies?: Array<string>;
	optionalDependencies?: Array<string>;
	overrides?: Record<string, string>;
	engines?: Record<string, string>;
	os?: Array<string>;
	packageManager?: string;
	/**
	 * Enable's the {@link Graph | `Graph`} to look up {@link Workspace | `Workspace`}s by shorter names or common {@link Workspace.aliases | `aliases`} used by teams. This enables much short command-line execution. See {@link Graph.getByName | `Graph.getByName`} and {@link Graph.getAllByName | `Graph.getAllByName`}.
	 */
	alias?: Array<string>;
};

/**
 * @group package.json
 */
export type PackageJson = PrivatePackageJson | PublicPackageJson;

/**
 * @group package.json
 */
export type PrivatePackageJson = {
	private: true;
	license?: 'UNLICENSED';
	workspaces?: Array<string>;
} & BasePackageJson;

/**
 * @group package.json
 */
export type PublicPackageJson = {
	private?: false;
	workspaces?: never;
	publishConfig?: PublishConfig;
} & BasePackageJson;

/**
 * The `publishConfig` should follow [NPM's guidelines](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#publishconfig), apart from the possible defined extra keys here. Anything defined here will be merged back to the root of the `package.json` at publish time.
 *
 * Use these keys to help differentiate between your repository's source-dependency entrypoints vs published module entrypoints.
 *
 * ```json collapse={2-4}
 * {
 * 	"name": "my-module",
 * 	"license": "MIT",
 * 	"type": "module",
 * 	"main": "./src/index.ts",
 * 	"publishConfig": {
 * 		"access": "public",
 * 		"main": "./dist/index.js",
 * 		"typings": "./dist/index.d.ts"
 * 	}
 * }
 * ```
 * @group package.json
 */
export type PublishConfig = {
	bin?: string | Record<string, string>;
	main?: string;
	module?: string;
	typings?: string;
	exports?: Record<string, string | { types?: string; default?: string; require?: string; import?: string }>;
	[key: (typeof publishConfigKeep)[number]]: unknown;
};

const publishConfigKeep = [
	'_auth',
	'access',
	'all',
	'allow-same-version',
	'audit',
	'audit-level',
	'auth-type',
	'before',
	'bin-links',
	'browser',
	'ca',
	'cache',
	'cafile',
	'call',
	'cidr',
	'color',
	'commit-hooks',
	'cpu',
	'depth',
	'description',
	'diff',
	'diff-dst-prefix',
	'diff-ignore-all-space',
	'diff-name-only',
	'diff-no-prefix',
	'diff-src-prefix',
	'diff-text',
	'diff-unified',
	'dry-run',
	'editor',
	'engine-strict',
	'fetch-retries',
	'fetch-retry-factor',
	'fetch-retry-maxtimeout',
	'fetch-retry-mintimeout',
	'fetch-timeout',
	'force',
	'foreground-scripts',
	'format-package-lock',
	'fund',
	'git',
	'git-tag-version',
	'global',
	'globalconfig',
	'heading',
	'https-proxy',
	'if-present',
	'ignore-scripts',
	'include',
	'include-staged',
	'include-workspace-root',
	'init-author-email',
	'init-author-name',
	'init-author-url',
	'init-license',
	'init-module',
	'init-version',
	'install-links',
	'install-strategy',
	'json',
	'legacy-peer-deps',
	'libc',
	'link',
	'local-address',
	'location',
	'lockfile-version',
	'loglevel',
	'logs-dir',
	'logs-max',
	'long',
	'maxsockets',
	'message',
	'node-options',
	'noproxy',
	'offline',
	'omit',
	'omit-lockfile-registry-resolved',
	'os',
	'otp',
	'pack-destination',
	'package',
	'package-lock',
	'package-lock-only',
	'parseable',
	'prefer-dedupe',
	'prefer-offline',
	'prefer-online',
	'prefix',
	'preid',
	'progress',
	'provenance',
	'provenance-file',
	'proxy',
	'read-only',
	'rebuild-bundle',
	'registry',
	'replace-registry-host',
	'save',
	'save-bundle',
	'save-dev',
	'save-exact',
	'save-optional',
	'save-peer',
	'save-prefix',
	'save-prod',
	'sbom-format',
	'sbom-type',
	'scope',
	'script-shell',
	'searchexclude',
	'searchlimit',
	'searchopts',
	'searchstaleness',
	'shell',
	'sign-git-commit',
	'sign-git-tag',
	'strict-peer-deps',
	'strict-ssl',
	'tag',
	'tag-version-prefix',
	'timing',
	'umask',
	'unicode',
	'update-notifier',
	'usage',
	'user-agent',
	'userconfig',
	'version',
	'versions',
	'viewer',
	'which',
	'workspace',
	'workspaces',
	'workspaces-update',
	'yes',
	'also',
	'cache-max',
	'cache-min',
	'cert',
	'dev',
	'global-style',
	'key',
	'legacy-bundling',
	'only',
	'optional',
	'production',
	'shrinkwrap',
];
