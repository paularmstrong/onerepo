import inquirer from 'inquirer';
import pc from 'picocolors';
import { coerce, intersects, valid } from 'semver';
import { getLogger } from '@onerepo/logger';
import type { WithWorkspaces } from '@onerepo/builders';
import { withWorkspaces } from '@onerepo/builders';
import type { Graph, Workspace } from '@onerepo/graph';
import { write } from '@onerepo/file';
import type { LogStep } from '@onerepo/logger';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = 'add';

export const description = 'Add dependencies to Workspaces.';

type Args = {
	dedupe: boolean;
	dev?: Array<string>;
	mode: 'strict' | 'loose' | 'off';
	prod?: Array<string>;
} & WithWorkspaces;

export const builder: Builder<Args> = (yargs) =>
	withWorkspaces(yargs)
		.usage('$0 add -w <workspace-names...> --dev [devDependencies...] --prod [prodDependencies...] [options...]')
		.describe('workspaces', 'One or more Workspaces to add dependencies into')
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
		.option('mode', {
			type: 'string',
			choices: ['strict', 'loose', 'off'] as const,
			description:
				'Version selection mode. Use `strict` to use strict version numbers, `loose` to use caret (`^`) ranges, and `off` for nothing specific.',
			default: 'loose' as const,
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
		})
		.epilogue(
			`If a version is not provided with the command-line input, this command will look for currently installed versions of the requested dependencies throughout all Workspaces within the Workspace Graph. If only one version is found, it will be used, regardless of the \`--mode\` provided.

If multiple versions of the requested dependencies are found in the Workspace Graph, a prompt will be presented to choose the appropriate version.

Otherwise, the latest version will be requested from the registry.`,
		)
		.example(
			`$0 ${command} add -w my-workspace -d normalizr --mode strict`,
			'Install the latest version of `normalizr` from the registry, using a strict version number.',
		)
		.example(
			`$0 ${command} add -w my-workspace -d normalizr --mode loose`,
			'Install the latest version of `normalizr` from the registry, using a caret (`^`) version number range, enabling newer minor and patch releases to satisfy the dependency in the future.',
		)
		.example(
			`$0 ${command} add -w workspace-a workspace-b -d babel-core -p react`,
			'Install `react` as a production dependency and `babel-core` as a development dependency in both `workspace-a` and `workspace-b`.',
		);

export const handler: Handler<Args> = async function handler(argv, { graph, logger }) {
	const { dedupe, dev = [], mode, prod = [], workspaces: requestedWorkspaces } = argv;

	const workspaces = graph.getAllByName(requestedWorkspaces!);

	if (prod.length && workspaces.includes(graph.root)) {
		logger.warn('Root Workspaces may not include production-level dependencies.');
		logger.pause();
		const { confirm } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'confirm',
				message: 'Switch production dependencies to devDependencies?',
				prefix: '⚠️',
			},
		]);

		logger.unpause();

		if (!confirm) {
			logger.error('Cancelled');
			return;
		}

		dev.push(...prod);
		prod.splice(0, prod.length);
	}

	const dependents = graph.dependents(workspaces);
	const dependencies = graph.dependencies(workspaces);
	const tree = [...dependents, ...dependencies];

	const findStep = logger.createStep('Find existing dependencies');
	const devVersions = getVersions(dev, graph, tree, findStep);
	const prodVersions = getVersions(prod, graph, tree, findStep);
	await findStep.end();

	const promptStep = logger.createStep('Confirm dependency versions');
	logger.pause();

	const devInstall = await prompt(devVersions, mode, graph, promptStep);
	const prodInstall = await prompt(prodVersions, mode, graph, promptStep);

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
		} catch {
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
			valid(coerce(requested[name].requested)) &&
			!intersects(requested[name].requested!, version)
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

async function prompt(requested: Requested, mode: Args['mode'], graph: Graph, step: LogStep) {
	const choices: Record<string, string> = {};
	const questions = Object.entries(requested).map(([name, data]) => {
		const foundVersions = Object.keys(data.found);
		if (foundVersions.length === 1) {
			choices[name] = foundVersions[0];
			return false;
		}

		return {
			type: 'list',
			name,
			message: `Select the version of ${pc.bold(pc.cyan(name))} to install`,
			when: () => foundVersions.length > 1 && data.requested,
			choices: [
				...(data.requested
					? [{ name: pc.green(pc.bold(data.requested)), value: data.requested }, new inquirer.Separator()]
					: []),
				...Object.entries(data.found).map(([foundVersion, workspaces]) => ({
					name: `${pc.bold(foundVersion)} ${pc.dim('used in')} ${workspaces.map(({ ws }) => ws).join(pc.dim(', '))}`,
					value: foundVersion,
				})),
			],
		};
	});
	const responses: Record<string, string> = await inquirer.prompt(questions.filter(Boolean));

	for (const [name, version] of Object.entries(responses)) {
		choices[name] = version;
	}

	for (const [name, { requested: version, isInternal }] of Object.entries(requested)) {
		if (name in choices) {
			continue;
		}
		let toInstall = version;
		const info = await graph.packageManager.info(name, { runDry: true, step });
		if (!info) {
			throw new Error(`Unable to locate package "${name}". Please check spelling and authentication and try again.`);
		}

		const latest = info['dist-tags'].latest;
		if (!version || !valid(version)) {
			toInstall = latest;
		}
		if (toInstall && !info.versions.includes(toInstall)) {
			step.warn(`Unable to find version ${version} of "${name}". Assuming "latest", ${latest}`);
			toInstall = latest;
		}

		toInstall = isInternal
			? version!
			: /^\d/.test(toInstall!)
				? `${mode === 'loose' ? '^' : ''}${coerce(toInstall)!.version}`
				: (coerce(toInstall)?.version ?? toInstall!);

		choices[name] = toInstall;
	}

	return choices;
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
