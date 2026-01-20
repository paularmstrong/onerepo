import path from 'node:path';
import type { Workspace } from 'onerepo';
import { getGraph } from 'onerepo';
import type { ConfigArray } from 'typescript-eslint';
import { globSync } from 'glob';

const graph = await getGraph(process.cwd());
const configs = (await Promise.all(graph.workspaces.map((ws) => !ws.isRoot && getEslintConfig(ws)))).filter(
	(res) => !!res,
);

export default function onerepoEslint(config: ConfigArray): ConfigArray {
	const ignores = configs.reduce((memo, [ws, config]) => {
		const { ignores } = config[0] ?? {};
		delete config[0]?.ignores;
		if (ignores) {
			memo.push(...ignores.map((i) => graph.root.relative(ws.resolve(i))));
		}
		return memo;
	}, config[0]?.ignores ?? []);

	if (config[0]?.ignores) {
		config[0].ignores = ignores;
	} else {
		config.unshift({ ignores });
	}

	const out = [
		...config,
		...configs.flatMap(([ws, config]) => {
			const relativeLocation = graph.root.relative(ws.location);
			return config.reduce((memo, ruleset) => {
				if (Object.keys(ruleset).length) {
					if (ruleset.files) {
						ruleset.files.map((f) => `${relativeLocation}/${f}`);
					} else {
						ruleset.files = [`${relativeLocation}/**`];
					}
					memo.push(ruleset);
				}
				return memo;
			}, [] as ConfigArray);
		}),
	] satisfies ConfigArray;

	return out;
}

async function getEslintConfig(ws: Workspace): Promise<[Workspace, ConfigArray] | null> {
	const config = globSync('eslint.config.{js,mjs,cjs,ts,mts,cts}', { cwd: ws.location });
	if (config.length > 1) {
		throw new Error(`Too many eslint configuration files found in "${ws.name}". Please reduce to one.`);
	}

	if (!config[0]) {
		return null;
	}

	const res = (await import(path.join(ws.location, config[0]))) as ConfigArray;
	return [ws, res];
}
