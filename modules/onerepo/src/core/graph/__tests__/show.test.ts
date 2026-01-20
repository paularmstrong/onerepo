import path from 'node:path';
import * as os from 'node:os';
import * as subprocess from '@onerepo/subprocess';
import { getGraph } from '@onerepo/graph';
import { getCommand } from '@onerepo/test-cli';
import * as Show from '../show.ts';

vi.mock('node:os');
// Mock the version, since that's included in the output
vi.mock('../../../../package.json', () => ({
	default: {
		version: '0.0.0-test',
	},
}));

const { run } = await getCommand(Show);

function processStdoutSpy() {
	let out = '';
	vi.spyOn(process.stdout, 'write').mockImplementation((content) => {
		out += content.toString();
		return true;
	});
	return {
		get out() {
			return out;
		},
	};
}

describe('graph show', () => {
	describe('default', () => {
		beforeEach(() => {
			vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		});

		test('deflates using zlib', async () => {
			const spy = processStdoutSpy();
			const graph = await getGraph(path.join(__dirname, '__fixtures__', 'repo'));
			await run('--all', { graph });

			const expected =
				'https://onerepo.tools/visualize/?g=eJyrVipTslIy0DPQM9AtSS0uUdJRSk1JTy1WsqpWyk3NK1Wyio5WSsusKCktStUtSUzOL1bSMY6N1YGLFeXnlyhZRSOJQFShCCWVFhVllkBEa2sBhr4nYg%3D%3D';

			expect(spy.out.trim()).toEqual(expected);
		});

		test.each([
			['darwin', 'open'],
			['linux', 'xdg-open'],
		])('can auto-open the URL on %s using %s ', async (plat, tool) => {
			vi.spyOn(os, 'platform').mockReturnValue(plat as NodeJS.Platform);
			const graph = await getGraph(path.join(__dirname, '__fixtures__', 'repo'));
			await run('--all --open', { graph });

			const expected =
				'https://onerepo.tools/visualize/?g=eJyrVipTslIy0DPQM9AtSS0uUdJRSk1JTy1WsqpWyk3NK1Wyio5WSsusKCktStUtSUzOL1bSMY6N1YGLFeXnlyhZRSOJQFShCCWVFhVllkBEa2sBhr4nYg%3D%3D';

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: tool,
					args: [expected],
				}),
			);
		});

		test('can override the URL base', async () => {
			const spy = processStdoutSpy();
			const graph = await getGraph(path.join(__dirname, '__fixtures__', 'repo'));
			await run('--all --url=https://example.com', { graph });

			const expected =
				'https://example.com/?g=eJyrVipTslIy0DPQM9AtSS0uUdJRSk1JTy1WsqpWyk3NK1Wyio5WSsusKCktStUtSUzOL1bSMY6N1YGLFeXnlyhZRSOJQFShCCWVFhVllkBEa2sBhr4nYg%3D%3D';

			expect(spy.out.trim()).toEqual(expected);
		});
	});

	describe('json', () => {
		test('writes a json Graph to stdout', async () => {
			const spy = processStdoutSpy();

			const graph = await getGraph(path.join(__dirname, '__fixtures__', 'repo'));
			await run('--format=json --all', { graph });

			expect(JSON.parse(spy.out)).toEqual({
				nodes: [{ id: 'fixture-root' }, { id: 'menu' }, { id: 'fixture-tacos' }, { id: 'fixture-burritos' }],
				links: [{ source: 'menu', target: 'fixture-tacos', weight: 3 }],
			});
		});

		test('writes json Graph to stdout for input set', async () => {
			const spy = processStdoutSpy();

			const graph = await getGraph(path.join(__dirname, '__fixtures__', 'repo'));
			await run('--format=json -w fixture-tacos', { graph });

			expect(JSON.parse(spy.out)).toEqual({
				nodes: [{ id: 'fixture-tacos' }, { id: 'menu' }],
				links: [{ source: 'menu', target: 'fixture-tacos', weight: 3 }],
			});
		});
	});

	describe('mermaid', () => {
		test('writes a mermaid Graph to stdout', async () => {
			const spy = processStdoutSpy();

			const graph = await getGraph(path.join(__dirname, '__fixtures__', 'repo'));
			await run('--format=mermaid --all', { graph });

			expect(spy.out.trim()).toEqual(
				`graph RL
  fixtureroot[["fixture-root"]]
  menu[["menu"]]
  fixturetacos("fixture-tacos")
  fixtureburritos("fixture-burritos")
  fixturetacos ---> menu`,
			);
		});

		test('writes mermaid Graph to stdout for input set', async () => {
			const spy = processStdoutSpy();

			const graph = await getGraph(path.join(__dirname, '__fixtures__', 'repo'));
			await run('--format=mermaid -w fixture-tacos', { graph });

			expect(spy.out.trim()).toEqual(
				`graph RL
  fixturetacos("fixture-tacos")
  menu[["menu"]]
  fixturetacos ---> menu`,
			);
		});
	});
});
