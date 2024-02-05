import {
	code,
	emphasis,
	heading,
	html,
	inlineCode,
	paragraph,
	root,
	strong,
	table,
	tableCell,
	tableRow,
	text,
} from 'mdast-builder';
import gfm from 'remark-gfm';
import remarkParser from 'remark-parse';
import stringify from 'remark-stringify';
import { unified } from 'unified';
import type { Node } from 'unist';
import type { Docs, Option, Positional } from './yargs';

const parser = unified().use(remarkParser);
const parse = parser.parse.bind(parser);

export function toMarkdown(docs: Docs, headingLevel: number = 2) {
	const ast = command(docs, headingLevel, true);
	const processor = unified().use(gfm).use(stringify, {
		bullet: '-',
		fence: '`',
		fences: true,
		incrementListMarker: false,
	});
	return processor.stringify(
		// @ts-expect-error unist v11 broke things
		root(ast),
	);
}

function command(cmd: Docs, depth: number, isInitial: boolean = false, includeBreak: boolean = false): Array<Node> {
	// False commands are undocumented
	if (cmd.description === false) {
		return [];
	}

	return [
		...(includeBreak ? [{ type: 'thematicBreak' }] : []),
		depth <= 6 ? heading(depth, inlineCode(cmd.fullCommand)) : strong(inlineCode(cmd.fullCommand)),
		...aliases(cmd),
		...description(cmd),
		...usage(cmd),
		...epilogue(cmd),
		...positionals(cmd),
		...options(cmd, isInitial),
		...examples(cmd),
		...Object.values(cmd.commands)
			.map((cmd) => command(cmd, depth + 1, false, true))
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
					const nodes = [
						inlineCode(command.fullCommand.replace(` ${command.command}`, alias === '$0' ? '' : ` ${alias}`)),
					];
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

	return parse(cmd.description)?.children ?? [];
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

function options(cmd: Docs, includeGlobal: boolean = false): Array<Node> {
	// TODO: pull out groups and advanced options separately
	const opts = Object.values(cmd.options);
	if (!opts.length) {
		if (!cmd.strictOptions) {
			return [
				paragraph(
					emphasis([
						text('The '),
						inlineCode(cmd.command),
						text(' command may accept an unknown set of option arguments.'),
					]),
				),
			];
		}
		return [];
	}

	const regularOpts = opts.filter((opt) => !opt.hidden && (includeGlobal || !opt.global));
	const advanced = opts.filter((opt) => opt.hidden && (includeGlobal || !opt.global));

	return [
		...(regularOpts.length ? optPosTable('opt', regularOpts) : []),
		...(advanced.length
			? [
					html('<details>'),
					html('<summary>Advanced options</summary>'),
					...optPosTable('opt', advanced),
					html('</details>'),
					// prettier is mixing tabs & spaces :(
					// eslint-disable-next-line
				]
			: []),
	];
}

function positionals(cmd: Docs): Array<Node> {
	const pos = Object.values(cmd.positionals);
	if (!pos.length) {
		if (!cmd.strictCommands) {
			return [
				paragraph(
					emphasis([
						text('The '),
						inlineCode(cmd.command),
						text(' command may accept an unknown set of positional arguments.'),
					]),
				),
			];
		}
		return [];
	}

	return [...optPosTable('pos', pos)];
}

function optPosTable(type: 'opt' | 'pos', options: Array<Option> | Array<Positional>) {
	const hasRequired = Object.values(options).some((opt) => opt.required);
	const columns = [
		tableCell(text(type === 'pos' ? 'Positional' : 'Option')),
		tableCell(text('Type')),
		tableCell(text('Description')),
	];
	if (hasRequired) {
		columns.push(tableCell(text('Required')));
	}
	return [
		table(
			[],
			[
				tableRow(columns),
				...Object.values(options).map((opt) => {
					const cells = [
						tableCell([
							inlineCode(
								[opt.name, ...(opt.aliases ?? [])]
									.map((o) => {
										if (type === 'pos') {
											return o;
										}
										return o ? `${o.length === 1 ? '-' : '--'}${o}` : false;
									})
									.filter(Boolean)
									.join(', '),
							),
						]),
						tableCell(
							// @ts-expect-error unist v11 broke things
							typeAndDefault(opt),
						),
						tableCell(
							// @ts-expect-error unist v11 broke things
							parse(opt.description ?? '')?.children || [],
						),
					];

					if (hasRequired) {
						cells.push(tableCell(opt.required ? text('✅') : text('')));
					}

					return tableRow(cells);
				}),
			],
		),
	];
}

function typeAndDefault(opt: Option | Positional): Array<Node> {
	const nodes = opt.choices
		? opt.choices.reduce((memo, c, i) => {
				if (i !== 0) {
					memo.push(text(', '));
				}
				memo.push(inlineCode(`"${c}"`));
				return memo;
			}, [] as Array<Node>)
		: [inlineCode(opt.type)];
	if (opt.default) {
		nodes.push(text(', default: '), inlineCode(JSON.stringify(opt.default)));
	}
	return nodes;
}

function examples(cmd: Docs): Array<Node> {
	return Object.entries(cmd.examples)
		.map(([ex, description]) => [
			paragraph(
				// @ts-expect-error unist v11 broke things
				parse(description),
			),
			code('sh', ex),
		])
		.flat() as Array<Node>;
}
