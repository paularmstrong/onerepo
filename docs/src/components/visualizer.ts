import { curveBasis, select, zoom, zoomIdentity } from 'd3';
import { graphlib, render } from 'dagre-d3-es';
import pako from 'pako';
import { toUint8Array } from 'js-base64';

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

function getGraph(datastring: string) {
	const inflated = pako.inflate(toUint8Array(datastring), { to: 'string' });
	const { version, edges } = JSON.parse(inflated) as {
		version: string;
		edges: Record<string, Array<[string, DepKey]>>;
	};
	// eslint-disable-next-line no-console
	console.log('Using version', version);
	return {
		nodes: Object.keys(edges),
		links: Object.entries(edges).reduce(
			(memo, [key, edges]) => {
				for (const edge of edges) {
					memo.push({ source: key, target: edge[0], weight: edge[1] as DepKey });
				}
				return memo;
			},
			[] as Array<{ source: string; target: string; weight: DepKey }>,
		),
	};
}

function addEdge(source: string, target: string, weight: DepKey) {
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

function addEdges(edges: Array<{ source: string; target: string; weight: DepKey }>) {
	for (const edge of edges) {
		addEdge(edge.source, edge.target, edge.weight);
	}
}

function addNode(name: string) {
	graph.setNode(name, { label: name, shape: 'rect' });
}

function addNodes(nodes: Array<string>) {
	for (const node of nodes) {
		addNode(node);
	}
}

function renderGraph(data) {
	addNodes(data.nodes);
	addEdges(data.links);

	renderer(viz, graph);

	const bbox = viz.node().getBBox();

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

	viz
		.selectAll('.node')
		.attr('style', '')
		.on('mouseover', (event, node) => {
			const neighbors = graph.neighbors(node);
			viz
				.selectAll('.edgePath')
				.classed('edge--output', ({ w }) => w === node)
				.classed('edge--input', ({ v }) => v === node)
				.classed('edge--unrelated', ({ v, w }) => !(v === node || w === node));
			viz.selectAll('.node').classed('node--unrelated', (n) => n !== node && !neighbors.includes(n));
			viz.selectAll('.edgeLabel').classed('edgeLabel--related', ({ v, w }) => v === node || w === node);
		})
		.on('mouseout', () => {
			viz.selectAll('.edgePath').classed('edge--input edge--output edge--unrelated', false);
			viz.selectAll('.node').classed('node--unrelated', false);
			viz.selectAll('.edgeLabel').classed('edgeLabel--related', false);
		});

	group.select('rect.underlay').attr('width', bbox.width).attr('height', bbox.height).attr('fill', 'transparent');
}

const dialog = document.querySelector('dialog[data-dialog=help]')! as HTMLDialogElement;
const errorDialog = document.querySelector('dialog[data-dialog=error]')! as HTMLDialogElement;
const noContent = document.querySelector('.no-content')! as HTMLDivElement;
document.getElementById('help')?.addEventListener('click', () => {
	dialog.showModal();
});

document.getElementById('example')?.addEventListener('click', (event: MouseEvent) => {
	noContent.classList.add('sr-only');
	const graph = getGraph(decodeURIComponent((event.target! as HTMLButtonElement).dataset.graphData!));
	renderGraph(graph);
});

if (input) {
	noContent.classList.add('sr-only');
	try {
		const graph = getGraph(input);
		renderGraph(graph);
	} catch (e) {
		const url = new URL('https://github.com/paularmstrong/onerepo/issues/new');
		const params = new URLSearchParams({
			labels: 'bug,triage',
			template: 'bug-report.yaml',
			title: 'Graph visualizer error',
			command: 'n/a',
			envinfo: 'n/a',
			version: 'n/a',
			expectation: `Graph visualizer should appear using payload:
\`\`\`
${input}
\`\`\``,
			actual: `Received error:
\`\`\`
${e.toString()}
# Stack trace
${e.stack ?? 'none'}
\`\`\``,
		});
		url.search = params.toString();
		showError(
			`There was an error rendering the input graph. Try re-running <code>one graph show --open</code>. If this problem persists, please <a href="${url.toString()}">file and issue</a>.`,
		);
	}
}

function showError(text: string) {
	errorDialog.querySelector('#error-description')!.innerHTML = text;
	errorDialog.showModal();
}
