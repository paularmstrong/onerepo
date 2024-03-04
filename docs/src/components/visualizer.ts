// @ts-nocheck TODO: come back to this
import { curveBasis, select, zoom, zoomIdentity } from 'd3';
import { graphlib, render } from 'dagre-d3-es';
import pako from 'pako';
import { toUint8Array } from 'js-base64';
import { Graph } from 'graph-data-structure';

const params = new URLSearchParams(window.location.search);
const input = params.get('g');

type DepKey = 3 | 2 | 1;

const graph = new graphlib.Graph({ directed: true, multigraph: true });

graph.setGraph({});
graph.graph().rankdir = 'RL';
graph.graph().ranksep = 10;
graph.graph().nodesep = 5;
graph.setDefaultEdgeLabel(() => ({}));

const group = select('svg g.group');
const viz = select('svg g.viz');

const renderer = render();

function decodeToDag(datastring: string) {
	const inflated = pako.inflate(toUint8Array(datastring), { to: 'string' });
	const { /* version, */ edges } = JSON.parse(inflated) as {
		version: string;
		edges: Record<string, Array<[string, DepKey]>>;
	};

	const dag = Graph();
	for (const [node, nodeEdges] of Object.entries(edges)) {
		dag.addNode(node);
		for (const [edge, weight] of nodeEdges) {
			dag.addEdge(node, edge, weight);
		}
	}
	return dag;
}

function renderGraph(graph: graphlib.Graph) {
	renderer(viz, graph);

	const bbox = viz.node()!.getBBox();

	const zoomBehavior = zoom();

	group.call(
		zoomBehavior.on('zoom', (zoomEvent) => {
			viz.attr('transform', zoomEvent.transform);
		}),
	);

	const parent = group.node().parentElement;
	const { clientWidth: fullWidth, clientHeight: fullHeight } = parent;
	const { width, height, x, y } = bbox;
	const midX = x + width / 2;
	const midY = y + height / 2;
	const scale = 0.95 / Math.max(width / fullWidth, height / fullHeight);
	const zoomFit = zoomIdentity.translate(fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY).scale(scale);
	zoomBehavior.transform(viz, zoomFit);
	document.querySelector('#reset-zoom')?.addEventListener('click', () => {
		zoomBehavior.transform(viz, zoomFit);
	});

	viz.selectAll('.label-container').attr('rx', 6).attr('ry', 6);

	const edgeLabels = viz.selectAll('.edgeLabel').attr('style', '');
	edgeLabels
		.select('g')
		.select(function () {
			return this.insertBefore(
				document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
				this.querySelector('text'),
			);
		})
		.attr('class', 'edge-box')
		.attr('transform', 'translate(-5, -5)')
		.attr('width', function () {
			return this.parentElement.getBBox().width + 10;
		})
		.attr('height', function () {
			return this.parentElement.getBBox().height + 10;
		});

	function reset() {
		viz.selectAll('.edgePath').classed('edge--input edge--output edge--unrelated', false);
		viz.selectAll('.node').classed('node--unrelated node--clicked', false);
		viz.selectAll('.edgeLabel').classed('edgeLabel--related', false);
	}

	viz
		.selectAll('.node')
		.attr('style', '')
		.on('mouseover click', (event, node) => {
			if (event.type !== 'click' && viz.selectAll('.node--clicked').size()) {
				return;
			}

			const neighbors = graph.neighbors(node);

			viz
				.selectAll('.edgePath')

				.classed('edge--output', ({ w }) => w === node)
				.classed('edge--input', ({ v }) => v === node)
				.classed('edge--unrelated', ({ v, w }) => !(v === node || w === node));
			viz
				.selectAll('.node')
				.classed('node--clicked', (n) => n === node && event.type === 'click')
				.classed('node--unrelated', (n) => n !== node && !neighbors.includes(n));
			viz.selectAll('.edgeLabel').classed('edgeLabel--related', ({ v, w }) => v === node || w === node);
		})
		.on('mouseout', () => {
			if (viz.selectAll('.node--clicked').size()) {
				return;
			}
			reset();
		});

	group
		.select('rect.underlay')
		.attr('width', bbox.width)
		.attr('height', bbox.height)
		.attr('fill', 'transparent')
		.on('click', () => {
			reset();
		});
}

const dialog = document.querySelector('dialog[data-dialog=help]')! as HTMLDialogElement;
const errorDialog = document.querySelector('dialog[data-dialog=error]')! as HTMLDialogElement;
const noContent = document.querySelector('.vis--no-content')! as HTMLDivElement;
document.getElementById('help')?.addEventListener('click', () => {
	dialog.showModal();
});

document.getElementById('example')?.addEventListener('click', (event: MouseEvent) => {
	noContent.classList.add('sr-only');
	const dag = decodeToDag(decodeURIComponent((event.target! as HTMLButtonElement).dataset.graphData!));
	renderGraph(getGraph(dag));
});

if (input) {
	noContent.classList.add('sr-only');
	try {
		const dag = decodeToDag(input);
		renderGraph(getGraph(dag));
	} catch (e) {
		const url = new URL('https://github.com/paularmstrong/onerepo/issues/new');
		const params = new URLSearchParams({
			labels: 'bug,triage',
			template: '02-documentation-issue.yml',
			title: 'Graph visualizer error',
			url: window.location.toString(),
			information: `Graph visualizer should appear using payload:
\`\`\`
${input}
\`\`\`

Here's the error that was thrown:

\`\`\`
${(e as Error).toString()}
# Stack trace
${(e as Error).stack ?? 'none'}
\`\`\``,
		});
		url.search = params.toString();
		showError(
			`There was an error rendering the input Graph. Try re-running <code>one graph show --open</code>. If this problem persists, please <a href="${url.toString()}">file an issue</a>.`,
		);
	}
}

function showError(text: string) {
	errorDialog.querySelector('#error-description')!.innerHTML = text;
	errorDialog.showModal();
}

function getGraph(dag: ReturnType<typeof Graph>): graphlib.Graph {
	const graph = new graphlib.Graph({ directed: true, multigraph: true });

	graph.setGraph({});
	graph.graph().rankdir = 'RL';
	graph.graph().ranksep = 1;
	graph.graph().edgeSep = 5;
	graph.graph().nodesep = 1;
	graph.setDefaultEdgeLabel(() => ({}));

	for (const node of dag.nodes()) {
		const name = node;
		graph.setNode(name, { label: name, shape: 'rect' });
		for (const target of dag.adjacent(node)) {
			const source = node;
			const weight = dag.getEdgeWeight(source, target);
			graph.setEdge(
				{ v: target, w: source },
				{
					labeloffset: -10,
					label: weight === 2 ? 'devDependency' : 'dependency',
					curve: curveBasis,
					style: weight === 3 ? undefined : `stroke-dasharray: ${weight === 2 ? '5,5' : '1,2'}`,
				},
			);
		}
	}

	return graph;
}
