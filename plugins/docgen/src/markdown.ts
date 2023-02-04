import { code, heading, inlineCode, paragraph, root, strong, table, tableCell, tableRow, text } from 'mdast-builder';
import gfm from 'remark-gfm';
import remarkParser from 'remark-parse';
import type { Node } from 'unist';
import stringify from 'remark-stringify';
import { unified } from 'unified';
import type { Docs, Option, Positional } from './yargs';

const parser = unified().use(remarkParser);
const { parse } = parser;

export function toMarkdown(docs: Docs) {
	const ast = command(docs, 2);

	const processor = unified().use(gfm).use(stringify, {
		bullet: '-',
		fence: '`',
		fences: true,
		incrementListMarker: false,
	});

	return processor.stringify(
		// @ts-ignore root returns Parent which extends Node. works, but is technically incompatible
		root(ast)
	);
}

function command(cmd: Docs, depth: number): Array<Node> {
	// False commands are undocumented
	if (cmd.description === false) {
		return [];
	}
	return [
		depth <= 6 ? heading(depth, inlineCode(cmd.fullCommand)) : strong(inlineCode(cmd.fullCommand)),
		...aliases(cmd),
		...description(cmd),
		...usage(cmd),
		...epilogue(cmd),
		...positionals(cmd),
		...options(cmd),
		...examples(cmd),
		...Object.values(cmd.commands)
			.map((cmd) => command(cmd, depth + 1))
			.flat(),
	];
}

function aliases(command: Docs): Array<Node> {
	if (!command.aliases.length) {
		return [];
	}

	return [
		paragraph([
			text('Aliases: '),
			...command.aliases
				.map((alias, index, self) => {
					const nodes = [inlineCode(alias)];
					if (index !== self.length - 1) {
						nodes.push(text(', '));
					}
					return nodes;
				})
				.flat(),
		]),
	];
}

function description(cmd: Docs): Array<Node> {
	if (!cmd.description) {
		return [];
	}

	return [...(parse(cmd.description)?.children ?? [])];
}

function epilogue(cmd: Docs): Array<Node> {
	if (!cmd.description) {
		return [];
	}

	return cmd.epilogue.map((ep) => parse(ep)?.children ?? []).flat();
}

function usage(cmd: Docs): Array<Node> {
	if (!cmd.usage.length) {
		return [];
	}
	return [code('sh', cmd.usage.join('\n'))];
}

function options(cmd: Docs): Array<Node> {
	// TODO: pull out groups and advanced options separately
	const opts = Object.values(cmd.options);
	if (!opts.length) {
		if (!cmd.strictOptions) {
			return [
				paragraph([
					text('The '),
					inlineCode(cmd.command),
					text(' command may accept an unknown set of option arguments.'),
				]),
			];
		}
		return [paragraph([text('The '), inlineCode(cmd.command), text(' command does not accept any option arguments.')])];
	}

	return [
		table(
			[],
			[
				tableRow([
					tableCell(text('Option')),
					tableCell(text('Type')),
					tableCell(text('Description')),
					tableCell(text('Required')),
				]),
				...opts
					.sort(optionSorter)
					.map((opt) =>
						tableRow([
							tableCell(
								[
									inlineCode(`--${opt.name}`),
									...(opt.aliases || []).map((alias) => [
										text(', '),
										inlineCode(`${alias.length === 1 ? '-' : '--'}${alias}`),
									]),
								].flat()
							),
							tableCell(typeAndDefault(opt)),
							tableCell(parse(opt.description || '')?.children || []),
							tableCell(opt.required ? text('✅') : text('')),
						])
					),
			]
		),
	];
}

function positionals(cmd: Docs): Array<Node> {
	const pos = Object.values(cmd.positionals);
	if (!pos.length) {
		if (!cmd.strictCommands) {
			return [
				paragraph([
					text('The '),
					inlineCode(cmd.command),
					text(' command may accept an unknown set of positional arguments.'),
				]),
			];
		}
		return [
			paragraph([text('The '), inlineCode(cmd.command), text(' command does not accept any positional arguments.')]),
		];
	}

	return [
		table(
			[],
			[
				tableRow([
					tableCell(text('Positional')),
					tableCell(text('Type')),
					tableCell(text('Description')),
					tableCell(text('Required')),
				]),
				...pos
					.sort(optionSorter)
					.map((pos) =>
						tableRow([
							tableCell(inlineCode(`--${pos.name}`)),
							tableCell(typeAndDefault(pos)),
							tableCell(parse(pos.description || '')?.children || []),
							tableCell(pos.required ? text('✅') : text('')),
						])
					),
			]
		),
	];
}

function optionSorter(a: Option | Positional, b: Option | Positional) {
	if (a.required && !b.required) {
		return -1;
	}
	if (b.required && !a.required) {
		return 1;
	}
	return a.name?.localeCompare(b.name) ?? 0;
}

function typeAndDefault(opt: Option | Positional) {
	const nodes = [inlineCode(opt.type)];
	if (opt.default) {
		nodes.push(text(', default: '), inlineCode(JSON.stringify(opt.default)));
	}
	return nodes;
}

function examples(cmd: Docs): Array<Node> {
	return Object.entries(cmd.examples)
		.map(([ex, description]) => [paragraph(parse(description)), code('sh', ex)])
		.flat() as Array<Node>;
}
