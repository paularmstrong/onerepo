import path from 'node:path';
import { glob } from 'glob';
import { file, git, run } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = 'typedoc';

export const description = 'Generate typedoc markdown files for the toolchain.';

type Argv = {
	add: boolean;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs.usage('$0 typedoc').option('add', {
		type: 'boolean',
		description: 'Add files to the git index',
		default: false,
	});

export const handler: Handler<Argv> = async (argv, { graph, logger }) => {
	const { add, $0 } = argv;
	const docs = graph.getByLocation(__dirname);

	const [bin] = await run({
		name: 'Get bin',
		cmd: 'yarn',
		args: ['bin', 'typedoc'],
		opts: {
			cwd: docs.location,
		},
		runDry: true,
	});

	await run({
		name: 'Update TSC prebuild',
		cmd: $0,
		args: ['tsc'],
	});

	const ws = graph.getByName('onerepo');
	const tmp = await file.makeTempDir('onerepo-api');

	const outPath = 'src/content/docs/api';

	await run({
		name: 'Generate docs',
		cmd: bin,
		args: [
			'--includeVersion',
			'--plugin',
			'typedoc-plugin-markdown',
			'--useCodeBlocks',
			'true',
			'--entryFileName',
			'index.md',
			'--options',
			docs.resolve('typedoc.cjs'),
			'--categorizeByGroup',
			'--basePath',
			graph.root.location,
			'--out',
			tmp,
			ws.resolve(ws.packageJson.main!),
		],
		opts: {
			cwd: docs.location,
		},
	});

	const outFiles = await glob('**/*.md', { cwd: tmp });

	const fixFiles = logger.createStep('Fix doc URLs');
	for (const doc of outFiles) {
		const contents = await file.read(path.join(tmp, doc), 'r', { step: fixFiles });
		const out = contents
			.replace(
				/modules\/([^/]+)\/dist\/src\/(.*)\.d\.ts:?(\d+)?/g,
				'[modules/$1/src/$2.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/$1/src/$2.ts)',
			)
			.replace(/\.\.\//g, '../../')
			.replace(/index\.md(#[^)]+)?/g, '$1')
			.replace(/\(([\w-]+)\.md(#[^)]+)?/g, '($2')
			.replace(/\/([\w-]+)\.md(#[^)]+)?/g, '/$1/$2')
			.replace(/^#+ (Type parameters|Parameters)\n\n/gm, '**$1:**\n\n')
			.replace(/^#+ See\n\n/gm, '**See also:**\n')
			.replace(/^#+ (Returns|Defined in|Source|Default)\n\n/gm, '**$1:** ')
			.replace(/^\*\*([^*]+)\*\*(.*)\n\n\*\*/gm, '**$1**$2  \n**')
			.replace(/`Experimental`/g, '<span class="tag danger">Experimental</span>')
			.replace(/`Alpha`/g, '<span class="tag danger">Alpha</span>')
			.replace(/`Beta`/g, '<span class="tag warning">Beta</span>')
			.replace('[**onerepo**](/docs/api/)\n\n---\n\n', '');

		await file.writeSafe(docs.resolve(outPath, doc), out, { step: fixFiles, sign: true });
	}

	await fixFiles.end();

	if (add) {
		await git.updateIndex(docs.resolve('src/content/docs/api'));
	}
};
