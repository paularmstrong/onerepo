import inquirer from 'inquirer';
import pc from 'picocolors';
import semver from 'semver';
import { getLogger } from '@onerepo/logger';
import type { WithWorkspaces } from '@onerepo/builders';
import { withWorkspaces } from '@onerepo/builders';
import type { Graph, Workspace } from '@onerepo/graph';
import { write } from '@onerepo/file';
import type { LogStep } from '@onerepo/logger';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = 'add';

export const description = 'Add dependencies to workspaces.';

type Args = {
	dedupe: boolean;
	dev?: Array<string>;
	prod?: Array<string>;
} & WithWorkspaces;

export const builder: Builder<Args> = (yargs) =>
	withWorkspaces(yargs)
		.usage('$0 add -w <workspace(s)> --dev [devDependencies...] --prod [prodDependencies...] [options...]')
		.describe('workspaces', 'One or more workspaces to add dependencies into')
		.demandOption('workspaces')
		.option('dedupe', {
			type: 'boolean',
			default: true,
			description: 'Deduplicate dependencies across the repository after install is complete.',
		})
		.option('dev', {
			alias: 'd',
			type: 'array',
			string: true,
			description: 'Add dependencies for development purposes only.',
		})
		.option('prod', {
			alias: 'p',
			type: 'array',
			string: true,
			description: 'Add dependencies for production purposes.',
		})
		.middleware(async (argv: Args) => {
			const { dev, prod } = argv;
			if (!dev?.length && !prod?.length) {
				const logger = getLogger();
				const msg = new Error('Include at least one "--dev" or "--prod" dependency to install.');
				logger.error(msg);
				await logger.end();
				yargs.exit(1, msg);
			}
		});

export const handler: Handler<Args> = async function handler(argv, { getWorkspaces, graph, logger }) {
	const { dedupe, dev = [], prod = [] } = argv;

	const workspaces = await getWorkspaces();

	const dependents = graph.dependents(workspaces);
	const dependencies = graph.dependencies(workspaces);
	const tree = [...dependents, ...dependencies];

	const findStep = logger.createStep('Find existing dependencies');
	const devVersions = getVersions(dev, graph, tree, findStep);
	const prodVersions = getVersions(prod, graph, tree, findStep);
	await findStep.end();

	const promptStep = logger.createStep('Confirm dependency versions');
	logger.pause();

	const devInstall = await prompt(devVersions, graph, promptStep);
	const prodInstall = await prompt(prodVersions, graph, promptStep);

	logger.unpause();
	promptStep.debug(devInstall);
	promptStep.debug(prodInstall);
	await promptStep.end();

	const writeStep = logger.createStep('Update package.json files');
	const writes: Array<Promise<void>> = [];
	for (const ws of workspaces) {
		const pkgjson = ws.packageJson;
		pkgjson.dependencies = sortDeps({ ...ws.packageJson.dependencies, ...prodInstall });
		pkgjson.devDependencies = sortDeps({ ...ws.packageJson.devDependencies, ...devInstall });
		writes.push(write(ws.resolve('package.json'), JSON.stringify(pkgjson, null, 2), { step: writeStep }));
	}
	await Promise.all(writes);
	await writeStep.end();

	const packageManager = graph.packageManager;

	await packageManager.install();
	if (dedupe) {
		await packageManager.dedupe();
	}
};

type Requested = Record<
	string,
	{
		requested: string | undefined;
		isInternal: boolean;
		found: Record<string, Array<{ ws: string; type: 'prod' | 'dev' | 'peer' }>>;
	}
>;

function getVersions(input: Array<string>, graph: Graph, tree: Array<Workspace>, step: LogStep) {
	const requested = input.reduce((memo, inputDep) => {
		let name: string = '';
		let version: string = '';
		let isInternal = false;
		const [nameOrBlank, versionOrName, versionOrBlank] = inputDep.split('@');
		if (inputDep.startsWith('@')) {
			name = `@${versionOrName}`;
			version = versionOrBlank;
		} else {
			name = nameOrBlank;
			version = versionOrName;
		}

		try {
			const local = graph.getByName(name);
			version = local.version || 'workspace:^';
			isInternal = true;
		} catch (e) {
			// no-op
		}

		memo[name] = { requested: version ?? undefined, found: {}, isInternal };
		return memo;
	}, {} as Requested);
	const requestedNames = Object.keys(requested);

	step.debug('Looking for installed versions of:');
	step.debug(requestedNames);

	function add(name: string, version: string, ws: Workspace, type: 'prod' | 'dev' | 'peer') {
		if (
			requested[name].requested &&
			semver.valid(semver.coerce(requested[name].requested)) &&
			!semver.intersects(requested[name].requested!, version)
		) {
			step.warn(
				`Requested ${name}@${requested[name].requested} is not available because it does not intersect found version ${version}`,
			);
			requested[name].requested = undefined;
		}
		if (!(version in requested[name].found)) {
			requested[name].found[version] = [];
		}
		requested[name].found[version].push({ ws: ws.name, type });
	}

	for (const ws of tree) {
		for (const name of requestedNames) {
			if (name in ws.dependencies) {
				add(name, ws.dependencies[name], ws, 'prod');
			}
			if (name in ws.devDependencies) {
				add(name, ws.dependencies[name], ws, 'dev');
			}
			if (name in ws.peerDependencies) {
				add(name, ws.dependencies[name], ws, 'peer');
			}
		}
	}

	step.debug(requested);
	return requested;
}

async function prompt(requested: Requested, graph: Graph, step: LogStep) {
	const choices = await inquirer.prompt(
		Object.entries(requested).map(([name, data]) => ({
			type: 'list',
			name,
			message: `Select the version of ${pc.bold(pc.cyan(name))} to install`,
			when: () => Object.keys(data.found).length > 1 && data.requested,
			choices: [
				...(data.requested
					? [{ name: pc.green(pc.bold(data.requested)), value: data.requested }, new inquirer.Separator()]
					: []),
				...Object.entries(data.found).map(([foundVersion, workspaces]) => ({
					name: `${pc.bold(foundVersion)} ${pc.dim('used in')} ${workspaces.map(({ ws }) => ws).join(pc.dim(', '))}`,
					value: foundVersion,
				})),
			],
		})),
	);

	const memo: Record<string, string> = {};
	for (const [name, { requested: version, isInternal }] of Object.entries(requested)) {
		let toInstall = version;
		const info = await graph.packageManager.info(name, { runDry: true, step });
		if (!info) {
			throw new Error(`Unable to locate package "${name}". Please check spelling and authentication and try again.`);
		}

		const latest = info['dist-tags'].latest;
		if (!version || !semver.valid(version)) {
			toInstall = latest;
		}
		if (toInstall && !info.versions.includes(toInstall)) {
			step.warn(`Unable to find version ${version} of "${name}". Assuming "latest", ${latest}`);
			toInstall = latest;
		}

		toInstall = isInternal
			? version!
			: /^\d/.test(toInstall!)
				? `^${semver.coerce(toInstall)!.version}`
				: semver.coerce(toInstall)?.version ?? toInstall!;

		memo[name] = toInstall;
	}

	return {
		...memo,
		...choices,
	};
}

function sortDeps(deps: Record<string, string>) {
	return Object.keys(deps)
		.sort()
		.reduce(
			(memo, key) => {
				memo[key] = deps[key];
				return memo;
			},
			{} as Record<string, string>,
		);
}
