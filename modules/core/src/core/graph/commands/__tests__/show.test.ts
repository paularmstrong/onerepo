import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import { getCommand } from '@onerepo/test-cli';
import * as Show from '../show';

const { run } = getCommand(Show);

function processStdoutSpy() {
	let out = '';
	jest.spyOn(process.stdout, 'write').mockImplementation((content) => {
		out += content.toString();
		return true;
	});
	return {
		get out() {
			return out;
		},
	};
}

describe('json', () => {
	test('writes a json graph to stdout', async () => {
		const spy = processStdoutSpy();

		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('--format=json --all', { graph });

		expect(JSON.parse(spy.out)).toEqual({
			nodes: [{ id: 'fixture-root' }, { id: 'menu' }, { id: 'fixture-tacos' }, { id: 'fixture-burritos' }],
			links: [{ source: 'menu', target: 'fixture-tacos', weight: 3 }],
		});
	});

	test('writes json graph to stdout for input set', async () => {
		const spy = processStdoutSpy();

		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('--format=json -w fixture-tacos', { graph });

		expect(JSON.parse(spy.out)).toEqual({
			nodes: [{ id: 'fixture-tacos' }, { id: 'menu' }],
			links: [{ source: 'menu', target: 'fixture-tacos', weight: 3 }],
		});
	});
});

describe('mermaid', () => {
	test('writes a mermaid graph to stdout', async () => {
		const spy = processStdoutSpy();

		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('--format=mermaid --all', { graph });

		expect(spy.out.trim()).toEqual(
			`graph RL
  fixtureroot["fixture-root"]
  menu["menu"]
  fixturetacos["fixture-tacos"]
  fixtureburritos["fixture-burritos"]
  fixturetacos["fixture-tacos"] ---> menu["menu"]`
		);
	});

	test('writes mermaid graph to stdout for input set', async () => {
		const spy = processStdoutSpy();

		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('--format=mermaid -w fixture-tacos', { graph });

		expect(spy.out.trim()).toEqual(
			`graph RL
  fixturetacos["fixture-tacos"]
  menu["menu"]
  fixturetacos["fixture-tacos"] ---> menu["menu"]`
		);
	});
});
