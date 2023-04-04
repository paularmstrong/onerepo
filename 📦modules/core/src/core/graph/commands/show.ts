import pc from 'picocolors';
// @ts-ignore
import cliui from 'cliui';
import { builders } from '@onerepo/builders';
import type { Serialized } from 'graph-data-structure';
import type { Builder, Handler } from '@onerepo/yargs';
import type { Graph } from '@onerepo/graph';

export const command = 'show';

export const description = 'Show the dependency graph.';

type Args = {
	format: 'mermaid' | 'plain' | 'json';
} & builders.WithAffected &
	builders.WithWorkspaces;

export const builder: Builder<Args> = (yargs) =>
	builders
		.withAffected(builders.withWorkspaces(yargs))
		.usage('$0 show [options]')
		.option('format', {
			alias: 'f',
			type: 'string',
			description: 'Output format for inspecting the dependency graph',
			default: 'plain',
			choices: ['mermaid', 'plain', 'json'],
		} as const)
		.epilogue(
			`This command can generate representations of your workspace graph for use in debugging, verifying, and documentation.`
		)
		.example(
			'$0 show --format=mermaid -w <workspace> > ./out.mermaid',
			'Generate a mermaid graph to a file, isolating just the given `<workspace>` and those that are dependent on it.'
		);

export const handler: Handler<Args> = async function handler(argv, { graph, getWorkspaces, logger }) {
	const { all, format } = argv;

	let serialized: Serialized = { nodes: [], links: [] };
	if (all) {
		serialized = graph.serialized;
	} else {
		const workspaces = await getWorkspaces();
		logger.log(`Getting graph from workspaces:\n • ${workspaces.map(({ name }) => name).join('\n • ')}`);
		const isolated = graph.isolatedGraph(workspaces);
		serialized = isolated.serialize();
	}

	switch (format) {
		case 'mermaid':
			writeMermaid(serialized, graph);
			break;
		case 'plain':
			writeStdio(serialized);
			break;
		case 'json':
			process.stdout.write(JSON.stringify(serialized, null, 2));
			break;
		default:
			throw new Error('Unknown format. This should not be allowed');
	}
};

function writeStdio(graph: Serialized): void {
	const width = Math.min(160, process.stdout.columns);

	const ui = cliui({ width });
	function div(...args: Array<string | unknown>) {
		return ui.div(
			...args.map((col) => {
				const resolved = typeof col === 'string' ? { text: col } : col;
				// @ts-ignore cliui doesn't expose Column <smh>
				return { padding: [0, 1, 0, 1], ...resolved };
			})
		);
	}
	div({ text: '⎯'.repeat(width), padding: [1, 0, 1, 0] });

	type Deps = { prod: Array<string>; dev: Array<string>; peer: Array<string> };

	graph.nodes.forEach(({ id: name }) => {
		div({ text: pc.blue(pc.cyan(pc.underline(name))), padding: [0, 0, 0, 1] });
		div();
		const deps = graph.links.reduce(
			(memo, { source, target, weight }) => {
				if (source !== name) {
					return memo;
				}
				memo[depType[weight] as keyof typeof memo].push(target);
				return memo;
			},
			{ prod: [], dev: [], peer: [] } as Deps
		);

		const maxRows = Math.max(...Object.values(deps).map((d) => d.length));

		div(pc.underline('prod'), pc.underline('dev'), pc.underline('peer'));
		const columnDeps = Object.values(deps);
		for (let i = 0; i < maxRows; i += 1) {
			div(...columnDeps.map((deps) => (deps[i] ? `• ${deps[i]}` : i === 0 ? pc.dim('(none)') : '')));
		}

		div({ text: '⎯'.repeat(width), padding: [1, 0, 1, 0] });
	});

	process.stdout.write(`\n${ui.toString()}\n`);
}

const depType: Record<number, string> = {
	3: 'prod',
	2: 'dev',
	1: 'peer',
};

function writeMermaid(isolated: Serialized, graph: Graph): void {
	process.stdout.write(`graph RL
${isolated.nodes
	.map(({ id }) => {
		const ws = graph.getByName(id);
		return `  ${id.replace(/\W+/g, '')}${ws.private ? `[["${id}"]]` : `("${id}")`}`;
	})
	.join('\n')}
${isolated.links
	.map(
		({ source, target, weight }) => `  ${target.replace(/\W+/g, '')} ${arrow[weight]}> ${source.replace(/\W+/g, '')}`
	)
	.join('\n')}
`);
}

const arrow: Record<number, string> = {
	3: '---',
	2: '-.-',
	1: '-. peer .-',
};
