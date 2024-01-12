import mermaid from 'mermaid';
import type { graph } from 'onerepo';
import pako from 'pako';
import { toUint8Array } from 'js-base64';
// import Graph from 'graph-data-structure';

const params = new URLSearchParams(window.location.search);
const input = params.get('g');

type DepKey = 3 | 2 | 1;

const arrow: Record<number, string> = {
	3: '---',
	2: '-.-',
	1: '-. peer .-',
};

class UI {
	#container = document.querySelector('#mermaid')! as HTMLDivElement;
	#element?: HTMLPreElement;
	#serialized: graph.Serialized;
	#current: graph.Serialized;
	#deps: Record<DepKey, boolean> = {
		3: !!(document.querySelector('[name=dependencies][value="3"]') as HTMLInputElement).checked,
		2: !!(document.querySelector('[name=dependencies][value="2"]') as HTMLInputElement).checked,
		1: !!(document.querySelector('[name=dependencies][value="1"]') as HTMLInputElement).checked,
	};

	constructor(datastring: string) {
		const inflated = pako.inflate(toUint8Array(datastring), { to: 'string' });
		this.#serialized = JSON.parse(inflated);
		this.#current = this.#serialized;

		this.#container.classList.remove('hidden');

		document.querySelectorAll('[name=dependencies]').forEach((el) => {
			el.addEventListener('change', this.#handleChangeDependencies, true);
		});

		const isDarkMode = document.querySelector('[data-theme]')?.getAttribute('data-theme') !== 'light';

		mermaid.initialize({
			startOnLoad: false,
			maxEdges: 1000,
			theme: isDarkMode ? 'dark' : 'default',
			securityLevel: 'loose',
			flowchart: {
				diagramPadding: 30,
				nodeSpacing: 10,
				rankSpacing: 20,
				curve: 'basis',
			},
		});

		this.update();
	}

	destroy() {
		document.querySelectorAll('[name=dependencies]').forEach((el) => {
			el.removeEventListener('change', this.#handleChangeDependencies, true);
		});
	}

	#handleChangeDependencies = (event: Event) => {
		const { value, checked } = event.target as HTMLInputElement;
		this.#deps[parseInt(value, 10) as DepKey] = checked;
		this.update();
	};

	update() {
		const { links, nodes } = this.#serialized;
		const newLinks = links.filter(({ weight }) => this.#deps[weight]);
		this.#current = { nodes, links: newLinks };

		this.draw();
	}

	draw() {
		if (this.#element) {
			this.#container.removeChild(this.#element);
		}
		this.#element = document.createElement('pre');
		this.#container.appendChild(this.#element);
		this.#element.innerHTML = `graph RL
		${this.#current.nodes
			.map(({ id }) => {
				return `  ${packageNameToId(id)}("${id}")`;
			})
			.join('\n')}
		${this.#current.links
			.map(({ source, target, weight }) => `  ${packageNameToId(target)} ${arrow[weight]}> ${packageNameToId(source)}`)
			.join('\n')}
		`;

		mermaid.run({ nodes: [this.#element] });
	}
}

function packageNameToId(name: string) {
	return name.replace(/\W+/g, '');
}

const dialog = document.querySelector('dialog[data-dialog=help]')! as HTMLDialogElement;
const noContent = document.querySelector('.no-content')! as HTMLDivElement;
document.getElementById('help')?.addEventListener('click', () => {
	dialog.showModal();
});

document.getElementById('example')?.addEventListener('click', (event: MouseEvent) => {
	noContent.classList.add('sr-only');
	new UI((event.target! as HTMLButtonElement).dataset.graphData!);
});

if (input) {
	noContent.classList.add('sr-only');
	new UI(input);
}
