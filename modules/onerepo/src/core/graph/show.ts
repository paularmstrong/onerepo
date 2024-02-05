import { platform } from 'node:os';
import { deflateSync } from 'node:zlib';
import pc from 'picocolors';
import cliui from 'cliui';
import * as builders from '@onerepo/builders';
import type { Serialized } from 'graph-data-structure';
import type { Builder, Handler } from '@onerepo/yargs';
import type { Graph } from '@onerepo/graph';
import { run } from '@onerepo/subprocess';
import pkg from '../../../package.json';

export const command = 'show';

export const description =
	'Show this repository’s Workspace Graph using an online visualizer or output Graph representations to various formats.';

type Args = {
	format?: 'mermaid' | 'plain' | 'json';
	open?: boolean;
	url: string;
} & builders.WithAffected &
	builders.WithWorkspaces;

export const builder: Builder<Args> = (yargs) =>
	builders
		.withAffected(builders.withWorkspaces(yargs))
		.usage('$0 show [options...]')
		.option('format', {
			alias: 'f',
			type: 'string',
			description: 'Output format for inspecting the Workspace Graph.',
			choices: ['mermaid', 'plain', 'json'],
		} as const)
		.option('open', {
			type: 'boolean',
			description: 'Auto-open the browser for the online visualizer.',
			conflicts: ['format'],
		})
		.option('url', {
			type: 'string',
			default: 'https://onerepo.tools/visualize/',
			description:
				'Override the URL used to visualize the Graph. The Graph data will be attached the the `g` query parameter as a JSON string of the DAG, compressed using zLib deflate.',
			hidden: true,
		})
		.epilogue(
			`This command can generate representations of your Workspace Graph for use in debugging, verifying, and documentation. By default, a URL will be given to visualize your Graph online.

Pass \`--open\` to auto-open your default browser with the URL or use one of the \`--format\` options to print out various other representations.`,
		)
		.example(`$0 ${command}`, 'Print a URL to the online visualizer for the current affected Workspace graph.')
		.example(`$0 ${command} --all --open`, 'Open the online visualizer for your full Workspace graph.')
		.example(
			'$0 show --format=mermaid -w <workspaces...> > ./out.mermaid',
			'Generate a [Mermaid graph](https://mermaid.js.org/) to a file, isolating just the given `<workspaces...>` and those that are dependent on it.',
		);

export const handler: Handler<Args> = async function handler(argv, { graph, getWorkspaces, logger }) {
	const { all, format, open, url: urlBase } = argv;

	let serialized: Serialized = { nodes: [], links: [] };
	if (all) {
		serialized = graph.serialized;
	} else {
		const workspaces = await getWorkspaces();
		logger.log(() => `Getting Graph from Workspaces:\n • ${workspaces.map(({ name }) => name).join('\n • ')}`);
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
		default: {
			const edges = serialized.links.reduce(
				(memo, { source, target, weight }) => {
					if (!memo[source]) {
						memo[source] = [];
					}
					memo[source].push([target, weight]);

					return memo;
				},
				{} as Record<string, Array<[string, number]>>,
			);
			for (const node of serialized.nodes) {
				if (!edges[node.id]) {
					edges[node.id] = [];
				}
			}
			const g = Buffer.from(deflateSync(Buffer.from(JSON.stringify({ v: pkg.version, edges })))).toString('base64');
			const url = new URL(urlBase);
			logger.info(g);
			url.search = new URLSearchParams({ g }).toString();
			process.stdout.write(`\n${url.toString()}\n\n`);
			setImmediate(async () => {
				if (open) {
					await run({
						name: 'Open browser',
						cmd: platform() === 'darwin' ? 'open' : 'xdg-open',
						args: [url.toString()],
					});
				}
			});
		}
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
			}),
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
			{ prod: [], dev: [], peer: [] } as Deps,
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
		({ source, target, weight }) => `  ${target.replace(/\W+/g, '')} ${arrow[weight]}> ${source.replace(/\W+/g, '')}`,
	)
	.join('\n')}
`);
}

const arrow: Record<number, string> = {
	3: '---',
	2: '-.-',
	1: '-. peer .-',
};
