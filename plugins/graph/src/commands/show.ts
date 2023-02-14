import pc from 'picocolors';
import cliui from 'cliui';
import type { Builder, Handler } from '@onerepo/types';
import type { SerializedGraph } from '@onerepo/graph';

export const command = 'show';

export const description = 'Show the dependency graph.';

type Args = {
	format: 'mermaid' | 'plain' | 'json';
};

export const builder: Builder<Args> = (yargs) =>
	yargs.usage('$0 show [options]').option('format', {
		type: 'string',
		description: 'Output format for inspecting the dependency graph',
		default: 'plain',
		choices: ['mermaid', 'plain', 'json'],
	} as const);

export const handler: Handler<Args> = async function handler(argv, { graph }) {
	const { format } = argv;

	switch (format) {
		case 'mermaid':
			writeMermaid(graph.serialized);
			break;
		case 'plain':
			writeStdio(graph.serialized);
			break;
		case 'json':
			process.stdout.write(JSON.stringify(graph.serialized, null, 2));
			break;
		default:
			throw new Error('Unknown format. This should not be allowed');
	}
};

function writeStdio(graph: SerializedGraph): void {
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

function writeMermaid(graph: SerializedGraph): void {
	process.stdout.write(`graph RL
${graph.links
	.map(
		({ source, target, weight }) =>
			`${target.replace(/\W+/g, '')}["${target}"] ${arrow[weight]}> ${source.replace(/\W+/g, '')}["${source}"]`
	)
	.join('\n')}
`);
}

const arrow: Record<number, string> = {
	3: '---',
	2: '-.-',
	1: '-. peer .-',
};
