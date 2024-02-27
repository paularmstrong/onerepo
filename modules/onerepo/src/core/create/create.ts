/* eslint-disable no-console */
import path from 'node:path';
import { homedir } from 'node:os';
import inquirer from 'inquirer';
import pc from 'picocolors';
import yaml from 'js-yaml';
import { exists, mkdirp, read, readJson, write, writeSafe } from '@onerepo/file';
import { run } from '@onerepo/subprocess';
import { getPackageManager, getPackageManagerName } from '@onerepo/package-manager';
import type { Builder, Handler } from '@onerepo/yargs';
import type { PackageJson } from '@onerepo/package-manager';

export const command = ['create', 'init'];

export const description = 'Sets up oneRepo in a new or existing repository';

type Argv = {
	location?: string;
	workspaces?: Array<string>;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs
		.option('location', {
			type: 'string',
			description: 'Path relative to the process working directory to initialize oneRepo',
		})
		.option('workspaces', {
			alias: 'w',
			type: 'array',
			string: true,
			description: 'List of glob locations for workspaces',
		});

export const handler: Handler<Argv> = async (argv, { logger }) => {
	const { location, workspaces: inputWorkspaces } = argv;

	console.clear();

	const infoStep = logger.createStep('Gathering information');
	const pluginSearch = await fetch(
		new URL(
			`-/v1/search?${new URLSearchParams({ text: '@onerepo/plugin-' }).toString()}`,
			'https://registry.npmjs.org',
		),
		{},
	);
	const { objects: foundPlugins } = (await pluginSearch.json()) as SearchResponse;

	const onerepo = await fetch(new URL('onerepo', 'https://registry.npmjs.org'), {});
	const version = ((await onerepo.json()) as PackageResponse)['dist-tags'].latest;
	await infoStep.end();

	logger.pause();
	console.clear();
	process.stderr.write(
		logo('Welcome to oneRepo!', '', 'There are just a couple things to answer', 'before we get started.'),
	);

	const { dir } = await inquirer.prompt([
		{
			name: 'dir',
			type: 'input',
			message: 'Where would you like to initialize oneRepo?\n  ',
			when: () => !location,
			suffix: pc.dim(` ${process.cwd()}/`),
			filter: (input) => path.join(process.cwd(), input),
		},
	]);

	logger.unpause();
	console.clear();

	const existStep = logger.createStep('Check for existing repo');
	const outdir = dir ?? path.join(process.cwd(), location || '.');
	const isExistingRepo = await exists(path.join(outdir, 'package.json'), { step: existStep });
	let pkgManager: 'npm' | 'pnpm' | 'yarn' = 'npm';
	let packageJson: PackageJson | null = null;
	if (isExistingRepo) {
		packageJson = await readJson<PackageJson>(path.join(outdir, 'package.json'), 'r', { step: existStep });
		pkgManager = getPackageManagerName(outdir, 'packageManager' in packageJson ? `${packageJson.packageManager}` : '');
	}
	let workspaces: Array<string> = packageJson?.workspaces ?? inputWorkspaces ?? [];
	logger.debug(workspaces);
	logger.debug(pkgManager);
	if (pkgManager === 'pnpm') {
		const yamlFile = path.join(outdir, 'pnpm-workspace.yaml');
		if (await exists(yamlFile, { step: existStep })) {
			const rawContents = await read(yamlFile, 'r', { step: existStep });
			const contents = yaml.load(rawContents) as { packages: Array<string> };
			workspaces = contents.packages;
		}
	}
	await existStep.end();

	logger.pause();
	console.clear();

	const prompts = await inquirer.prompt([
		{
			name: 'pkgmanager',
			type: 'list',
			message: 'Which package manager would you like to use?',
			choices: ['npm', 'pnpm', 'yarn'],
			when: () => !isExistingRepo,
		},
		{
			name: 'workspaces',
			type: 'input',
			message: 'Enter a comma-separated list of locations for workspaces:',
			default: 'apps/*,modules/*',
			when: () => !workspaces.length,
		},
		{
			type: 'checkbox',
			name: 'plugins',
			message: 'Which plugins should be included?',
			choices: foundPlugins
				.filter(({ package: { name } }) => name.startsWith('@onerepo/plugin-') && name !== '@onerepo/plugin-changesets')
				.map(({ package: { name, version } }) => ({
					value: { name, version },
					name,
				})),
		},
	]);

	logger.unpause();
	console.clear();

	pkgManager = prompts.pkgmanager ?? pkgManager;
	const manager = getPackageManager(pkgManager);
	workspaces = prompts.workspaces ? prompts.workspaces.split(',') : workspaces;
	const plugins: Array<{ name: string; version: string }> = prompts.plugins ?? [];

	const [pkgManagerVersion] = await run({
		name: `Get ${pkgManager} version`,
		cmd: pkgManager,
		args: ['--version'],
		opts: { cwd: homedir() },
		runDry: true,
	});

	logger.debug({ outdir, workspaces, plugins });

	const outPackageJson = {
		name: path.basename(outdir),
		license: 'UNLICENSED' as const,
		private: true,
		packageManager: `${pkgManager}@${pkgManagerVersion}`,
		...packageJson,
		dependencies: {
			...(packageJson?.dependencies ?? {}),
			onerepo: `^${version}`,
			...plugins.reduce(
				(memo, { name, version }) => {
					memo[name] = `^${version}`;
					return memo;
				},
				{} as Record<string, string>,
			),
		},
	} as PackageJson;

	if (pkgManager !== 'pnpm') {
		outPackageJson.workspaces = workspaces.map((ws) => (/\/\*?$/.test(ws) ? ws : `${ws}/*`));
	} else {
		await write(
			path.join(outdir, 'pnpm-workspace.yaml'),
			`packages:\n${workspaces.map((ws) => `  - ${/\/\*?$/.test(ws) ? ws : `${ws}/*`}`).join('\n')}`,
		);
	}

	await mkdirp(outdir);

	if (!packageJson) {
		await run({
			name: `Initialize ${pkgManager}`,
			cmd: pkgManager,
			args: ['init', ...(pkgManager === 'npm' ? ['-y'] : []), ...(pkgManager === 'yarn' ? ['-2'] : [])],
			opts: { cwd: outdir },
		});

		if (pkgManager === 'yarn') {
			await writeSafe(path.join(outdir, '.yarnrc.yml'), '\nnodeLinker: node-modules\n');
		}
	}

	await write(path.join(outdir, 'package.json'), JSON.stringify(outPackageJson, null, 2));

	const isTS = Boolean(plugins.find(({ name }) => name === '@onerepo/plugin-typescript'));
	await write(
		path.join(outdir, `onerepo.config.${isTS ? 'ts' : 'js'}`),
		`${isTS ? "import type { Config } from 'onerepo';" : ''}
${plugins.map(({ name }) => `import { ${pluginFn(name)} } from '${name}';`).join('\n')}

export default {
	root: true,
	plugins: [${plugins.map(({ name }) => `${pluginFn(name)}()`).join(', ')}],
}${isTS ? ' satisfies Config' : ''};
`,
	);

	await run({
		name: 'Initialize Git',
		cmd: 'git',
		args: ['init'],
		opts: {
			cwd: outdir,
		},
	});

	await manager.install(outdir);

	logger.pause();

	console.clear();

	process.stderr.write(logo('Setup complete!', '', process.cwd() !== outdir ? `  cd ${outdir}` : '', `  one --help`));
};

type SearchResponse = {
	objects: Array<{ package: { name: string; version: string } }>;
};

type PackageResponse = {
	name: string;
	'dist-tags': {
		latest: string;
	};
};

const logo = (...lines: Array<string>) => `
${pc.cyan('       -=======-:      ')}
${pc.cyan('     .*+:::::::-+*.    ')}
${pc.cyan('    -*=          +*    ')}${lines[0] ?? ''}
${pc.cyan('   .+++*+        -*:   ')}${lines[1] ?? ''}
${pc.cyan('       *+       .*+    ')}${lines[2] ?? ''}
${pc.cyan('       *+      +*=     ')}${lines[3] ?? ''}
${pc.cyan('       *+       +*.    ')}${lines[4] ?? ''}
${pc.cyan('       *****+   .*+    ')}${lines[5] ?? ''}
${pc.cyan('              ...-*+   ')}
${pc.cyan('              -====-   ')}

`;

function toCamelCase(str: string) {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, '');
}

function pluginFn(str: string) {
	return toCamelCase(str.replace(/^@onerepo\/plugin-/, ''));
}
