import glob from 'glob';
import { file, run } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = 'typedoc';

export const description = 'Generate typedoc markdown files for the toolchain.';

export const builder: Builder = (yargs) => yargs.usage('$0 typedoc');

export const handler: Handler = async (argv, { graph, logger }) => {
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

	const ws = graph.getByName('onerepo');
	const outPath = 'src/content/core/api';

	await run({
		name: 'Generate docs',
		cmd: bin,
		args: [
			'--plugin',
			'typedoc-plugin-markdown',
			'--entryDocument',
			'index.md',
			'--hideInPageTOC',
			'--baseUrl',
			'/docs/core/api/',
			'--out',
			docs.resolve(outPath),
			ws.resolve(ws.packageJson.main!),
		],
		opts: {
			cwd: docs.location,
		},
	});

	const outFiles = glob.sync('**/*.md', { cwd: docs.resolve(outPath) });

	const fixFiles = logger.createStep('Fix doc URLs');
	for (const doc of outFiles) {
		const contents = await file.read(docs.resolve(outPath, doc), 'r', { step: fixFiles });
		let out = contents.replace(/index\.md(#[^)]+)?/g, '$1').replace(/\.md(#[^)]+)?/g, '/$1');
		out = `---
title: "API: ${doc.replace('.md', '')}"
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

${out}`;
		await file.write(docs.resolve(outPath, doc), out, { step: fixFiles });
	}

	await fixFiles.end();
};
